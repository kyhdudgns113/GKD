# src/contexts/directory

- 폴더와 폴더내의 파일 관련 state 들을 관리한다.

- 파일 전체 내용에 관련된 state 들은 file Context 에서 다룬다.

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

## _callbacks Context 의 외부에서 사용하는 http 요청 함수 설명

- addDirectory

    - 토큰 인증: 관리자 권한이 필요하다


    - 인자
        - parentDirOId: 새 폴더를 추가할 디렉토리의 OId
        - dirName: 새 폴더의 이름
    
    - 입력값 검사
        - dirName 은 1자이상, 32자 이하여야 한다.
        - dirName 은 공백만 있어선 안된다.

    - 기능
        - parentDirOId 폴더에 dirName 이름을 가진 폴더를 추가한다.

    - 성공시 응답
        - extraDirs: 갱신된 parentDirOId 폴더와 새로 만든 폴더의 정보
        - extraFileRows: 갱신된 parentDirOId 폴더의 자식파일행 정보

- addFile

    - 토큰 인증: 관리자 권한이 필요하다


    - 인자
        - dirOId: 새 파일을 추가할 디렉토리의 OId
        - fileName: 새 파일의 이름

    - 입력값 검사
        - fileName 은 공백만 있어선 안된다.
        - fileName 은 20자 이하여야 한다.

    - 기능
        - dirOId 폴더에 fileName 이름을 가진 파일을 추가한다.

    - 성공시 응답
        - extraDirs: 갱신된 dirOId 폴더의 DirectoryType 정보
        - extraFileRows: 갱신된 dirOId 폴더의 새 파일을 포함한 파일행 정보

- changeDirName

    - 토큰 인증: 관리자 권한이 필요하다.

    - 인자
        - dirName: 바꿀 이름
        - dirOId: 바꿀 폴더의 OId

    - 입력값 검사
        - dirName 은 32자 이하, 공백이 아니어야 한다.
        - 부모 폴더내에서 이름 중복이면 서버에서 에러처리 된다.

    - 기능
        - dirOId 폴더의 이름을 dirName 으로 바꾼다

    - 성공시 응답
        - extraDirs: 바뀐 폴더의 정보
        - extraFileRows: 바뀐 폴더의 자식파일행 정보

- changeFileName

    - 토큰 인증: 관리자 권한이 필요하다.

    - 인자
        - fileName: 바꿀 이름
        - fileOId: 바꿀 파일의 OId

    - 입력값 검사
        - fileName 은 20자 이하, 공백이 아니어야 한다.
        - 부모 폴더내에서 이름 중복이면 서버에서 에러처리 된다.

    - 기능
        - fileOId 폴더의 이름을 fileName 으로 바꾼다

    - 성공시 응답
        - extraDirs: 빈 Object
        - extraFileRows: 바뀐 파일의 파일행 정보

- deleteDir

    - 토큰 인증: 관리자 권한이 필요하다.

    - 인자
        - dirOId: 지울 폴더의 OId

    - 입력값 검사
        - 수행하지 않는다

    - 기능
        - dirOId 폴더를 지운다.

    - 성공시 응답
        - extraDirs: 부모 폴더의 DirectoryType 정보
        - extraFileRows: 부모 폴더의 파일행 정보
            - 어차피 fileOIdsArr 읽어올때 파일 정보를 DB 에서 읽는다.
            - 이왕 읽어오는거 갱신되었을지도 모르는 파일행 정보도 넘겨준다.

- deleteFile

    - 토큰 인증: 관리자 권한이 필요하다.

    - 인자
        - fileOId: 지울 파일의 OId

    - 입력값 검사
        - 수행하지 않는다

    - 기능
        - fileOId 파일을 지운다.

    - 성공시 응답
        - extraDirs: 부모 폴더의 DirectoryType 정보
        - extraFileRows: 부모 폴더의 파일행 정보


- loadDirectory

    - 인자
        - dirOId: 읽어올 디렉토리의 OId
        - setDirectory: 읽어온 디렉토리를 state 에 저장할 Setter 함수

    - 기능
        - dirOId 디렉토리의 DirectoryType 정보와 자식파일행 정보를 읽어온다.
        - 읽어온 directory 를 state 에 저장한다

    - 성공시 응답
        - extraDirs: dirOId 폴더의 DirectoryType 정보가 담긴 Object
        - extraFileRows: dirOId 폴더의 자식파일행 정보

- moveDirectory

    - 토큰 인증: 관리자 권한이 필요하다

    - 인자
        - parentDirOId: 새로운 부모폴더의 OId
        - moveDirOId: 움직일 폴더의 OId
        - dirIdx: 움직일 폴더의 새로운 dirIdx. parentDir 의 dirIdx 로 이동한다는 뜻

    - 입력값 검사
        - 같은 위치로 이동을 시도한다면 아무 작업도 하지 않는다.
        - 조상이 자손으로 이동을 시도한다면 아무 작업도 하지 않는다.

    - 기능
        - moveDirOId 디렉토리를 parentDirOId 폴더의 dirIdx 번째 폴더로 이동한다.

    - http 전송 데이터
        - moveDirOId: 움직일 폴더의 OId
        - oldParentDirOId:  기존 부모 폴더의 OId
        - oldParentChildArr: 기존 부모 폴더의 자식 폴더 OId 배열
        - newParentDirOId: 새로운 부모 폴더의 OId
        - newParentChildArr: 새로운 부모 폴더의 자식 폴더 OId 배열

    - 성공시 응답
        - extraDirs
            - 이동하는 폴더, 기존 부모폴더, 새로운 부모폴더 순서대로 본인과 자식의 DirectoryType 정보가 들어간다.

        - extraFileRows
            - 이동하는 폴더, 기존 부모폴더, 새로운 부모폴더 순서대로 본인과 자식폴더들의 FileRowsType 정보가 들어온다.

- moveFile

    - 토큰 인증: 관리자 권한이 필요하다

    - 인자
        - dirOId: 새로운 부모폴더의 OId
        - moveFileOId: 움직일 파일의 OId
        - fileIdx: 움직일 파일의 새로운 fileIdx. dirOId 의 fileIdx 로 이동한다는 뜻

    - 입력값 검사
        - 같은 위치로 이동을 시도한다면 아무 작업도 하지 않는다.

    - 기능
        - moveFileOId 파일을 dirOId 폴더의 fileIdx 번째 폴더로 이동한다.

    - http 전송 데이터
        - moveFileOId: 움직일 파일의 OId
        - oldParentDirOId:  기존 부모 폴더의 OId
        - oldParentChildArr: 기존 부모 폴더의 자식 파일 OId 배열
        - newParentDirOId: 새로운 부모 폴더의 OId
        - newParentChildArr: 새로운 부모 폴더의 자식 파일 OId 배열

    - 성공시 응답
        - extraDirs
            - 기존 부모폴더, 새로운 부모폴더 순서대로 본인의 DirectoryType 정보가 들어간다.

        - extraFileRows
            - 기존 부모폴더, 새로운 부모폴더 순서대로 본인의 FileRowsType 정보가 들어온다.
