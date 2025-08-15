# src/contexts/auth

- AuthContext

    - 다음 state 들을 관리한다.

        - 회원가입, 로그인시 주고받는 데이터

        - 유저의 개인정보 (ID, 이름 등)

        - 유저의 권한값

    - 다음은 관리하지 않는다.

        - 유저의 상태(status)

            - 안 읽은 메시지

            - 미확인 알람

        - Auth 관련 모달의 상태

            - ModalContext 에서 관리한다.
