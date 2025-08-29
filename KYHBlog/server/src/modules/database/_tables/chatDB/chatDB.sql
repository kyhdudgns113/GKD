CREATE TABLE `chatroom` (
  chatRoomOId CHAR(24) PRIMARY KEY,

  numMessages INT DEFAULT 0,
)

CREATE TABLE `chatRoomRouter` (
  chatRoomOId CHAR(24) NOT NULL,

  targetUserOId CHAR(24) NOT NULL,
  unreadMessageCount INT DEFAULT 0,
  userOId CHAR(24) NOT NULL,

  -- 유저의 대상 유저와의 채팅방은 하나여야 한다.
  CONSTRAINT chatRoomRouter_pk PRIMARY KEY (userOId, targetUserOId),

  -- 유저의 채팅방과 연결된 대상유저는 하나여야 한다.
  CONSTRAINT unique_user_room UNIQUE (userOId, chatRoomOId),

  -- 대상 유저의 채팅방과 연결된 유저는 하나여야 한다.
  CONSTRAINT unique_target_room UNIQUE (targetUserOId, chatRoomOId),

  CONSTRAINT fk_chatRoomOId 
    FOREIGN KEY (chatRoomOId) 
    REFERENCES chatroom(chatRoomOId)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  -- 유저가 삭제되어도 채팅방은 남아있어야 한다.
  CONSTRAINT fk_userOId 
    FOREIGN KEY (userOId) 
    REFERENCES user(userOId)

  -- 대상 유저가 삭제되어도 채팅방은 남아있어야 한다.
  CONSTRAINT fk_targetUserOId 
    FOREIGN KEY (targetUserOId) 
    REFERENCES user(userOId)
)

CREATE TABLE `chat` (
  chatRoomOId CHAR(24) NOT NULL,
  chatIdx INT NOT NULL,

  content TEXT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  userOId CHAR(24) NOT NULL,
  userName VARCHAR(64) NOT NULL,

  CONSTRAINT chat_pk PRIMARY KEY (chatRoomOId, chatIdx),

  CONSTRAINT fk_chatRoomOId 
    FOREIGN KEY (chatRoomOId) 
    REFERENCES chatroom(chatRoomOId)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  -- 유저가 삭제되어도 채팅은 남아있어야 한다.
  CONSTRAINT fk_userOId 
    FOREIGN KEY (userOId) 
    REFERENCES user(userOId)

  -- 유저가 삭제되어도 채팅은 남아있어야 한다.
  CONSTRAINT fk_userName 
    FOREIGN KEY (userName) 
    REFERENCES user(userName)
)