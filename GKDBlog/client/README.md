# 채팅

## 채팅방 목록

- 다음 데이터들의 행으로 구성한다

  1. chatRoomOId

  2. chatRoomName

- 안 읽은 메시지는 contexts/user 에서 유저정보로 받아온다.

  - 유저의 채팅방마다 안 읽은 메시지 개수를 알아야 한다.

  - "유저" 의 "채팅방" 마다 숫자가 들어있는게 좋다.

======

# 파일(문서) 및 폴더(디렉토리)

## 파일(File)

- 게시글을 파일이라 부른다.

- 문서(Document) 라는 단어와 완전히 같은 의미를 가진다.

  - Document 라는 단어를 JS/TS 에서 쓰기가 불편해서 File 이라는 단어를 선택함.

- 폴더 안에 존재한다.

- 구성

  - contentsArr: 파일 내용(content)을 배열형태로 저장한 것
    - type: 'string' | 'image' : 문자열인지, 이미지인지 저장
    - value: 'string' 이면 문자열, 'image' 면 이미지 URL
  - fileOId: 파일의 MongoDB 에서의 string 화 된 ObjectId
  - name: 파일(문서) 의 이름
  - parentDirOId: 부모 폴더(디렉토리) 의 string 화 된 ObjectId

- 저장방식

  - 해당 파일을 열었을때 파일의 "구성" 데이터들을 http 로 요청한다.
  - 파일 목록을 나타내는 방식은 "파일 행" 에서 설명한다.

## 파일행(FileRow)

- 파일의 목록을 나타내기 위한 데이터 타입

  - 폴더의 자식 파일들의 "모든 정보" 를 다 불러오면 불필요하게 오버헤드가 커진다.

  - 자식파일의 "최소한의 정보" 만 불러오고, 파일을 열 때 자세한 내용들을 불러오게 하는게 좋다.

- 구성

  - fileOId: file 의 string 화 된 ObjectId
  - name: file 의 이름
  - parentDirOId: file 을 담고있는 폴더의 string 화 된 ObjectId

- 저장방식

  - 딕셔너리(dictionary) 형태로 저장한다.

    - fileRows[fileOId] 로 fileRow 형태의 데이터를 가져올 수 있다.

  - 해당 파일의 부모폴더를 열거나 할 때 해당 파일의 fileRow 정보를 불러온다

    - 이후 fileRows 에 저장한다.

## 폴더(Folder)

- 파일이나 폴더를 담는 것

- 디렉토리(Directory) 라는 단어와 완전히 같은 의미를 가진다.

  - 파일이 File 이라는 단어를 써서 Folder 라는 단어가 눈에 안 들어와서 영어로는 directory 라 적음.
  - 한글로는 "디렉토리" 가 4글자로 길어서 "폴더" 라는 단어를 씀

- 구성

  - dirName: 디렉토리의 이름
  - dirOId: 디렉토리의 MongoDB 에서의 string 화 된 ObjectId
  - fileOIdsArr: 현재 폴더의 파일들의 string 화 된 ObjectId 배열
  - parentDirOId: 현재 폴더의 부모폴더의 string 화 된 ObjectId
    - 루트 디렉토리는 임의의 이름을 가진다.
  - subDirOIdsArr: 자식 폴더들의 string 화 된 ObjectId 의 배열

- 루트 디렉토리(rootDirectory, rootDir)

  - 모든 게시글이나 그 부모 폴더들은 루트 디렉토리에서 시작하여 자식폴더의 폴더...이런식으로 구성된다.

- 저장방식

  - 홈페이지 로드시 루트 디렉토리와 그 "자식"들의 정보를 서버에 http 로 요청한다.

    - 손자 폴더의 정보는 아직 불러오지 않는다.

    - 자식 파일들의 정보는 파일행(fileRow) 데이터 형태의 딕셔너리로 받아온다. (하단에 섦명)

## 서버에서 파일/폴더 정보 불러오는 방식

- 파일, 폴더와 관련된 http 요청마다 다음 형태의 데이터를 서버에서 전송한다

  - extraDirs
    - dirOIdsArr: 폴더 정보를 갱신할 폴더들의 dirOId 들의 배열
    - directories
      - key 와 value 형태로 이루어진 딕셔너리
      - key: 정보를 갱신할 폴더의 dirOId. dirOIdsArr 에 담겨있음.
      - value: 해당 key 를 가진 폴더의 "폴더" 구성 데이터
  - extraFileRows
    - fileOIdsArr: "파일행" 정보를 갱신할 파일들의 fileOId 들의 배열
    - fileRows
      - key 와 value 형태로 이루어진 딕셔너리
      - key: 정보를 갱신할 파일의 fileOId
      - value: 해당 key 를 가진 파일의 "파일행" 구성 데이터

- 상단의 데이터가 들어오면 다음을 수행한다.

  1. extraDirs, extraFileRows 에 있는 배열에서 key 값을 구한다.
  2. 각 key 에 대하여 클라이언트에 저장된 데이터들에 대해 다음을 수행한다.
     2.1. clientDirectories[key] = directories[key]
     2.2. clientFileRows[key] = fileRows[key]

- clientDirectories, clientFileRows 는 클라이언트에서 실제로 directories, fileRows 라는 이름으로 선언된다.

  - contexts/directory 에서 관리한다

======
