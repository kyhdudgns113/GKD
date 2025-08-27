# src/contexts/file

- 하나의 파일 전체에 관련된 상태를 관리한다.

    - 주로 열려있는 파일과 관련된 정보이다.


## 외부 사용 함수(http 사용)

- loadFile

    - 인자
        - fileOId: 읽어올 파일의 OId

    - 기능
        - fileOId 파일의 콘텐츠를 포함한 전체 정보를 읽어온다.
        - file Context 의 state 인 file 에 정보를 입력한다.

    - 성공시 응답
        - file: 파일 내용을 포함한 파일의 File Type 정보
        
    - 실패시
        - 이전 페이지로 복귀한다 (nagivate(-1))