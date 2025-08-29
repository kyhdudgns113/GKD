# src/contexts/file

- 하나의 파일 전체에 관련된 상태를 관리한다.

    - 주로 열려있는 파일과 관련된 정보이다.


## 외부 사용 함수(http 사용)

- editFile

    - 인자
        - fileOId: 수정할 파일의 OId
        - fileName: 파일의 새 이름
        - content: 파일의 수정된 내용

    - 기능
        - fileOId 파일의 이름을 fileName 으로 갱신한다.
        - fileOId 파일의 내용을 content 로 갱신한다.

    - 성공시 응답
        - extraDirs: 현재는 빈 Object 가 온다.
        - extraFileRows: 수정된 파일의 파일행 정보

    - 실패시
        - 에러 메시지만 띄운다.

- loadFile

    - 인자
        - fileOId: 읽어올 파일의 OId

    - 기능
        - fileOId 파일의 콘텐츠를 포함한 전체 정보를 읽어온다.
        - file Context 의 state 인 file 에 정보를 입력한다.

    - 성공시 응답
        - file: 파일 내용을 포함한 파일의 File Type 정보
        - user: 파일 작성자 유저 정보
            - 파일 작성때와 현재의 유저정보가 다를 수 있다.
            - 유저가 삭제되었다면 NULL_USER 를 받는다.
        
    - 실패시
        - 이전 페이지로 복귀한다 (nagivate(-1))