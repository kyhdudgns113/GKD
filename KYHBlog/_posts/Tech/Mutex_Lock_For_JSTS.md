<div class="block_white">

## **개요**

- JavaScript / TypeScript 용 Mutex Lock 구현 상세

- 커스터마이징 가능한 코드를 위해 직접 구현

</div>

<div class="block_blue_transparent">

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

</div>

<div class="block_white">

## **개선 아이디어**

<div class="block_red">

### **1. Mutex Lock 이 비동기로 작동하도록 변경**

- while 문 대신의 비동기로 동작하게 하여 타 요청에서 Lock 을 해제할 수 있개 해줌.

- async-await 문법을 사용할 수 있도록 하여 비동기식 스타일로 코드 관리 가능

<br />

#### **Before**

- ``` ts
  while (true) {
    if (myReadyNumber === LOCK.nowNumber) {
      // Do something

      LOCK.nowNumber += 1
    }
  }
  ```

#### **After**

- ``` ts
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

</div>

<div class="block_orange">

### **2. 락을 걸 변수 대신에 Key 값을 사용**

- 변수 대신에 특정 Key 에 대해 Mutex Lock 을 걸도록 구현

- 유지보수 및 사용 편의성 증가 목적

<br />

#### **Before**

- ``` ts
  private readyNumber: number
  private nowNumber: number
  ```

#### **After**

- ``` ts
  private lockInfo: {[key: string]: {readyNumber: number; nowNumber: number}}
  ```
    
</div>

<div class="block_yellow">

### **3. 획득한 Mutex Lock 을 직접 반환하도록 구현**

#### **문제**

- 락을 획득하고 작업을 수행한 이후에는 직접 락을 반환하도록 구현

- **본인이 획득한 락만 반환할 수 있어야 함**

- 획득도 안한 락을 반환하면 안됨.

<br />

#### **해결**

- 락 획득시 본인의 대기표를 발급받음

- 락 반납시 본인이 받은 대기표를 제출

<br />

#### **Mutex Lock Class 코드 일부**

- 간소화 버전이라 에러검출 부분이 포함되어 있지 않다.

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

  async releaseLock(ticket: string) {
    const {readyNumber, key} = this.decodeTicket(ticket)
    if (this.lockInfo[key].nowNumber === readyNumber) {
      this.lockInfo[key].nowNumber += 1
    }
  }
  ```

<br />

#### **실제 사용 예시 코드**

- ```ts
  async usingLockFunction() {
    let ticket: string = ''

    try {
      // 티켓을 발급받는다.
      ticket = await this.lockService.readyLock('User')

      // DO SOMETHING
    } catch (err) {

      throw err
      
    } finally {

      if (ticket) {
        // 발급받은 티켓을 반환한다.
        await this.lockService.releaseLock(ticket)
      }
    }
  }
  ```

</div>

<div class="block_green">

### **4. 장기 대기 문제**

- 락 획득 이후 불의의 사고로 락 반납을 못하고 있는 경우 대처 필요

- 락 획득시 Timeout 을 걸어서 일정 시간이 지나면 자동 반납이 되도록 구현

<br />

#### **Timeout 설정 이후 예상 문제**

- 자동반납된 티켓을 다시 반납하는 상황

    + 반납한 티켓의 대기번호와 현재 순번을 비교해서 같을때만 대기번호를 늘리면 해결됨

- 작업이 단순히 오래 걸렸을 뿐인데 자동반납이 되는 경우

    + 데코레이터 같은걸 설정해서 프로세스를 종료시켜야 하나...?

    + 이렇게 구현을 한다고 해도 DB 작업등을 강제종료는 못시키는등 한계는 존재함

    + 해결을 위한 코스트가 지나치게 클 것으로 예상

    + 어쩔 수 없는 오류로 두는게 맞다고 판단함.

</div>

</div>