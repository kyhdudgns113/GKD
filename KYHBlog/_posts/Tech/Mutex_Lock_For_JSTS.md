## **실시간 작업중...**

## **개요**

- JavaScript / TypeScript 용 Mutex Lock 구현 상세

- 커스터마이징 가능한 코드를 위해 직접 구현

## **초기 버전**

### **간소화한 초기 버전의 코드**

``` ts
  private static readyNumber: number = 0 // 발급하는 대기번호
  private static nowNumber: number = 0 // 현재 순서인 대기번호

  async functionUsingLock() {
    const myReadyNumber = LOCK.readyNumber
    LOCK.readyNumber += 1

    while(true) {
      if (myReadyNumber === LOCK.nowNumber) {
        // Do something

        LOCK.nowNumber += 1
      }
    }
  }
```

### **문제점**

- Node 는 Single Thread 로 작동한다.

- while 문에 한 번 진입하면 다른 요청들을 수행하지 않는다.

- 다른 요청에서 락을 해제해줘야 while 문을 탈출하는데 그러지 못하게 된다.

## **개선 아이디어**

### **1. Mutex Lock 이 비동기로 작동하도록 변경**

- while 문 대신의 비동기로 동작하게 하여 타 요청에서 Lock 을 해제할 수 있개 해줌.

- async-await 문법을 사용할 수 있도록 하여 비동기식 스타일로 코드 관리 가능

- #### **Before**

    + ``` ts
        while (true) {
          if (myReadyNumber === LOCK.nowNumber) {
            // Do something

            LOCK.nowNumber += 1
          }
        }
    ```

- #### **After**

    + ``` ts
      const intervalId = setInterval(() => {
        if (myReadyNumber > LOCK.nowNumber) {
          // 순번이 오지 않은 경우: 아무것도 안한다.
        }
        else if (myReadyNumber === nowNumber) {
          clearInterval(intervalId)
          resolve(true)
        }
        else { // 순번이 지나간 경우
          clearInterval(intervalId)
          reject(false)
        }
      }, 100)
    ```

### **2. 락을 걸 변수 대신에 Key 값을 사용**

- 변수 대신에 특정 Key 에 대해 Mutex Lock 을 걸도록 구현

- 유지보수 및 사용 편의성 증가 목적

- #### **Before**

    + ``` ts
        private readyNumber: number
        private nowNumber: number
    ```

- #### **After**

    + ``` ts
        private lockInfo: {[key: string]: {readyNumber: number; nowNumber: number}}
    ```
    
### **3. 획득한 Mutex Lock 을 직접 반환하도록 구현**

#### 문제

- 락을 획득하고 작업을 수행한 이후에는 직접 락을 반환하도록 구현

- **본인이 획득한 락만 반환할 수 있어야 함**

- 획득도 안한 락을 반환하면 안됨.

#### 해결

- 락 획득시 본인의 대기표를 발급받음

- 락 반납시 본인이 받은 대기표를 제출

#### Mutex Lock Class 코드 일부

- ``` ts
    async readyLock(key: string) {
      // 새로운 유저의 대기번호
      const thisReadyNumber = this.lockInfo[key].readyNumber 

      // 대기번호 증가
      this.lockInfo[key].readyNumber += 1 

      // key 와 번호를 이용하여 대기표를 만든다.
      const ticket = this.createTicket(key, thisReadyNumber)

      return new Promise<string>((resolve, reject) => {
        const intervalId = setInterval(() => {
          if (thisReadyNumber > nowNumber) {
            // 아무것도 안함
          }
          else if (thisReadyNumber === nowNumber) {
            clearInterval(intervalId)

            // 성공시 대기표를 반환하도록 한다.
            resolve(ticket)
          }
          else {
            // 순번이 지나간 경우이다.
            clearInterval(intervalId)

            // 이 때도 일단은 대기표를 반환한다.
            reject(ticket)
          }
        }, 100)
      })


    }
```