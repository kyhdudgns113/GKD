## Controller

- **하늘이 무너져도** 이렇게 짠다.

  ```typescript
  // MD 문법때문에 function 키워드 붙였다.
  // 실제로는 class 안에 있기 때문에 function 키워드 안붙인다.
  async function functionName(@Headers() headers: any, data: DATATYPE) {
    /* GKDoubleJWT 는 Guard 에서 headers 에 jwt 정보를 붙여서 서비스에 넘겨준다. */
    const {jwtFromServer, jwtPayload} = headers
    /*
     * data:
     *  - 사용자 설정 http 데이터_타입
     *  - post 나 put 으로 클라이언트가 넘겨주는 데이터
     *  - url 로 오는 데이터일 수도 있다.
     *  - <<< 중요한건 "data" 딸랑 이 4글자만 넘겨준다. >>>
     *  - data 의 타입 설정을 잘 해주고 클라이언트, 서버가 이를 잘 공유하자.
     * jwtPayload:
     *   - 권한 확인을 위해 넘겨준다.
     *   - 가드에서 안하는 이유는 에러 상황 대처가 유연하지 못해서이다.
     */
    const {ok, body, errObj} = await this.서비스.함수(jwtPayload, data)
    return {ok, body, errObj, jwtFromServer}
  }
  ```

## Controller's Service

- **가급적** 이것과 유사한 형식으로 짠다.

  - 가드에서 하려니, 권한췍도 췍인데, 후속 대처가 너무 어렵다.

  ```typescript
  // MD 문법때문에 function 키워드 붙였다.
  // 실제로는 class 안에 있기 때문에 function 키워드 안붙인다.
  async function userFunction(jwtPayload, data: DATATYPE) {
    try {
      // 변수명 강제하는 느낌으로 좌측을 이렇게 한다.
      const {userInfoArray} = await this.dbService.함수(jwtPayload, id, password)
      /**********************************************
       *  데이터 처리하는 코드를 넣을 수도 있다.
       *  가급적 dbService 에서 연산을 안하게 만들자.
       ***********************************************/
      return {
        ok: true,
        body: {userInfoArray}, // 중괄호 안에다가 넣어주는게 핵심이다.
        errObj: {}
      }
    } catch (errObj) {
      return {
        ok: false,
        body: {},
        errObj: errObj // errObj 로 줄이는것을 더 권장함. 이건 예시라서
      }
    }
  }
  ```

  - 클라이언트가 수신할때 body 대신에 뭐가 들어올지 고민하게 하지 말자.
  - body 안에 뭐가 들어오는지만 알게 하자. 그것도 변수명도 지정해주면서.

## Database's Service

- 서로 다른 Model 들의 DB 서비스들을 총괄하여 관리하는 서비스.
- 외부의 다른 서비스가 복수의 Model DB 서비스들을 이용하는것을 막는다.
  - (예시) Admin 에서 채팅방을 만들기 위해 채팅방DB 와 유저DB 에 직접 접근 하는것을 막는다.

## Each DB's Service

- Create, Read, Update, Delete 이름으로 쓴다.
  - DB 데이터 접근에 Set, Add 이런걸 쓰는건 반역이다.
  - 성공하면 반역 of 반역이다.

### Read 메소드

- 인자값의 종류마다 짠다.
  - 인자를 (id: string | null, sail: string | null) 이딴식으로 짜지 않는다.
    - id 가 null 인 경우 요구사항이 다음과 같이 다를 수 있다.
      - (기본) DB 검색조건에 id 를 넣지 않는다.
      - (특수 예시) id 가 잘못 들어왔으므로 throw 한다.
      - (특수 예시) admin 계정으로 간주하고 처리한다.
    - 그런데 인자를 저따구로 받아서 Read 메소드를 하나로 퉁치면 서로 다른 요구를 처리하지 못해 난리난다.
- 리턴값의 종류마다 짠다.
  - 리턴값의 종류 예시
    - 배열
    - {[\ObjectId]: 데이터 타입 A}
    - {[\ObjectId]: 데이터 타입 A 중 일부}
    - 기타 등등
  - 배열로 통일한 뒤, 다른곳에서 처리를 하게 하면 코드 중복이 심해진다.
  - 처리하는 코드가 필요하면 어차피 최소 한 번은 짠다
  - 따라서 각 Model DB 에서 짜두는 편이 낫다.
