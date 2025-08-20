# src/contexts/directory

- 폴더와 파일 관련 state 들을 관리한다.

## 용어

- 디렉토리(폴더)
    - 게시글(파일)이나 폴더를 저장하는 용도
    - 공식 명칭은 디렉토리, 하지만 글자수등의 이유로 폴더라는 명칭을 혼용한다.

- 파일
    - 게시글을 파일이라 부른다.
    - 생성, 읽기, 수정할때만 파일 정보를 불러온다.
    - 파일 목록을 표시할때는 파일행 정보를 사용한다.

- 파일행
    - 파일 목록을 표시할때 사용한다.
    - 최소한의 파일정보만을 포함한다.
        - 부모 폴더 OId
        - 파일 이름
        - 파일 OId
        - 파일 상태(숨김, 공지글)

## 통신 규칙

- 디렉토리(폴더) 정보는 ExtraDirObjectType 타입으로만 받아온다.

    - ExtraDirObjectType.dirOIdsArr: string[]
        - 정보를 수정할 디렉토리들의 OId 의 배열
        
    - ExtraDirObjectType.directories: {[dirOId: string]: DirectoryType}
        - 정보를 수정할 디렉토리 정보들의 dictionary

- 파일행의 정보는 ExtraFileRowObjectType 타입으로만 받아온다.

    - ExtraFileRowObjectType.fileOIdsArr: string[]
        - 행 정보를 수정할 파일들의 OId 의 배열

    - ExtraFileRowObjectType.fileRows: {[fileOId: string]: FileRowType}
        - 정보를 수정할 파일행들의 dictionary

- 폴더 1개의 정보를 받아올때, 자식폴더들의 정보는 받아오지 않는다.

    - extraDirs 에는 가급적 해당 폴더의 정보만 받아온다.

    - 자식 폴더의 정보를 받아버리면 자식의 자식폴더의 정보를 언제 받을지 애매해진다.
    
    - 일관된 통신을 위해서 해당 폴더의 정보만 읽어온다.