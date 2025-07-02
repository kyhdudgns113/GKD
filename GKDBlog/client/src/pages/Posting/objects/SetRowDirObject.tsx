import {useCallback, useEffect, useMemo, useState} from 'react'
import {useDirectoryStatesContext} from '@contexts/directory/__states'
import {useDirectoryCallbacksContext} from '@contexts/directory/_callbacks'
import {Icon} from '@component'
import {SAKURA_BG_70, SAKURA_TEXT} from '@value'

import {SetRowFileObject} from './SetRowFileObject'
import {CreateDirBlock, CreateFileBlock} from '../blocks'

import type {CSSProperties, DragEvent, FC} from 'react'
import type {DivCommonProps} from '@prop'

/**
 * 디렉토리 설정 페이지에서의 디렉토리 row
 * - 이 친구의 자식 요소도 나타내야함
 * - flexDirection: column 으로 해야함
 */
type SetRowDirObjectProps = DivCommonProps & {
  dirIdx: number
  dirOId: string
  tabLevel: number
  parentDirOId: string
}

export const SetRowDirObject: FC<SetRowDirObjectProps> = ({
  dirIdx, // 부모 디렉토리의 몇 번째 자식 디렉토리인가
  dirOId,
  parentDirOId,
  tabLevel,
  // ::
  className,
  style,
  ...props
}) => {
  const {directories, fileRows, isDirOpenPosting, moveDirOId, moveFileOId, parentOIdDir, parentOIdFile} = useDirectoryStatesContext()

  const {
    getDirectoryInfo,
    moveDirectory,
    moveFile,
    onClickCreateDir,
    onClickCreateFile,
    onClickFixDir,
    onDragEndDirFile,
    selectMoveDir,
    toggleDirInPosting
  } = useDirectoryCallbacksContext()

  const [dirName, setDirName] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isHover, setIsHover] = useState(false)
  const [isHoverBot, setIsHoverBot] = useState(false)
  const [isHoverTop, setIsHoverTop] = useState(false)

  const styleNowDir: CSSProperties = {
    ...style,
    display: 'flex',
    flexDirection: 'column', // 자식 요소도 나타내야 하기 때문에 column 이 맞다.
    marginLeft: `${tabLevel * 8}px`

    // margin 때문에 width 별도로 설정 안하는게 좋다.
  }
  const styleTitleRow: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    }
    if (isHover) {
      style.backgroundColor = SAKURA_BG_70
    }
    return style
  }, [isHover])
  const styleToggler: CSSProperties = {
    color: '#000000',
    fontSize: '28px'
  }
  const styleButtonBase: CSSProperties = {
    color: SAKURA_TEXT,
    cursor: 'pointer',
    fontSize: '22px'
  }
  const styleButtonAddDir: CSSProperties = {
    ...styleButtonBase,
    marginLeft: 'auto',
    marginRight: '4px'
  }
  const styleButtonAddFile: CSSProperties = {
    ...styleButtonBase,
    marginRight: '4px'
  }
  const styleBottomHover: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      height: '8px'
    }
    if (isHoverBot) {
      style.backgroundColor = SAKURA_TEXT
    }
    return style
  }, [isHoverBot])
  const styleTopHover: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      height: '8px'
    }
    if (isHoverTop) {
      style.backgroundColor = SAKURA_TEXT
    }
    return style
  }, [isHoverTop])

  const onClickAdd = useCallback(
    (dirOId: string, type: 'dir' | 'file' | 'fix') => () => {
      // 1. 일단 폴더를 열림 상태로 만든다.
      toggleDirInPosting(dirOId, true)()

      // 2. type 에 따라 함수를 실행한다.
      switch (type) {
        case 'dir':
          onClickCreateDir(dirOId)()
          break
        case 'file':
          onClickCreateFile(dirOId)()
          break
        case 'fix':
          onClickFixDir(dirOId)()
          break
        default:
          alert(`/posting/setDirectory/onClickAdd: ${type} 에러`)
      }
    },
    [onClickCreateDir, onClickCreateFile, onClickFixDir, toggleDirInPosting]
  )
  const onDragEndRow = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation()
      onDragEndDirFile()
    },
    [onDragEndDirFile]
  )
  const onDragEnterRow = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setIsHover(true)
  }, [])
  const onDragLeaveRow = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setIsHover(false)
  }, [])
  const onDragStartRow = useCallback(
    (dirOId: string) => (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation()
      selectMoveDir(dirOId)
    },
    [selectMoveDir]
  )
  const onDropRow = useCallback(
    (dirOId: string) => (e: DragEvent<HTMLDivElement>) => {
      // 에러 검출은 하단 함수에서 한다.

      if (moveDirOId) {
        e.stopPropagation()
        moveDirectory(moveDirOId, dirOId, null)
      } // ::
      else if (moveFileOId) {
        e.stopPropagation()
        moveFile(moveFileOId, dirOId, null)
      } // ::
      else {
        // DO NOTHING:
        return
      }
    },
    [moveDirOId, moveFileOId, moveDirectory, moveFile]
  )

  const onDragEnterBottom = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation()
      // 폴더를 옮길때 + 파일을 옮기는 중이지만 현재 폴더가 열려있을때
      if (moveDirOId || isOpen) {
        setIsHoverBot(true)
      }
    },
    [isOpen, moveDirOId]
  )
  const onDragLeaveBottom = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setIsHoverBot(false)
  }, [])
  const onDropBottom = useCallback(
    (dirIdx: number) => (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setIsHoverBot(false)

      if (moveDirOId) {
        moveDirectory(moveDirOId, parentDirOId, dirIdx + 1)
      } // ::
      else if (moveFileOId && isOpen) {
        moveFile(moveFileOId, dirOId, null)
      }
    },
    [dirOId, isOpen, moveDirOId, moveFileOId, parentDirOId, moveDirectory, moveFile]
  )

  const onDragEnterTop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation()

      // 폴더를 옮길때만 활성화 시킨다.
      if (moveDirOId) {
        setIsHoverTop(true)
      }
    },
    [moveDirOId]
  )
  const onDragLeaveTop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setIsHoverTop(false)
  }, [])
  const onDropTop = useCallback(
    (parentDirOId: string) => (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setIsHoverTop(false)

      if (moveDirOId) {
        moveDirectory(moveDirOId, parentDirOId, 0)
      } // ::
      else if (moveFileOId) {
        // DO NOTHING:
        // 첫 자식폴더의 맨 위에 파일 올려놓는 상황이다.
        // 여기서 파일 이동을 하면 뭔가 이상하다.
        // moveFile(moveFileOId, dirOId, 0)
      }
    },
    [moveDirOId, moveFileOId, moveDirectory]
  )

  const onMouseEnter = useCallback(() => {
    setIsHover(true)
  }, [])
  const onMouseLeave = useCallback(() => {
    setIsHover(false)
  }, [])

  // Load directory if not loaded
  useEffect(() => {
    if (!directories[dirOId]) {
      getDirectoryInfo(dirOId)
    } // ::
    else {
      // 폴더 내부 파일중 하나라도 로드 안된거 있으면 로드한다.
      const directory = directories[dirOId]
      const fileOIdsArr = directory.fileOIdsArr
      const arrLen = fileOIdsArr.length
      for (let i = 0; i < arrLen; i++) {
        const fileOId = fileOIdsArr[i]
        if (!fileRows[fileOId]) {
          getDirectoryInfo(dirOId)
          return
        }
      }
    }
  }, [directories, dirOId, fileRows, getDirectoryInfo])

  // Set directory name
  useEffect(() => {
    if (directories[dirOId]) {
      setDirName(directories[dirOId].dirName)
    } // ::
    else {
      setDirName('--에러--')
    }
  }, [directories, dirOId])

  // 폴더가 열렸는지 여부 설정
  useEffect(() => {
    setIsOpen(isDirOpenPosting[dirOId])
  }, [isDirOpenPosting, dirOId])

  // 디렉토리 정보 없으면 렌더링 안함
  if (!directories[dirOId]) {
    return null
  }

  return (
    <div
      className={`SET_ROW_DIR_OBJECT ${className || ''}`}
      draggable={true}
      onDragEnd={onDragEndRow}
      onDragEnter={onDragEnterRow}
      onDragLeave={onDragLeaveRow}
      onDragOver={e => e.preventDefault()}
      onDragStart={onDragStartRow(dirOId)}
      onDrop={onDropRow(dirOId)}
      style={styleNowDir}
      {...props} // ::
    >
      {/* 0. 상단공백: 드래그로 파일, 폴더 이동시 사용 */}
      {dirIdx === 0 && (
        <div
          draggable={true}
          onDragEnter={onDragEnterTop}
          onDragOver={e => e.preventDefault()}
          onDragLeave={onDragLeaveTop}
          onDrop={onDropTop(parentDirOId)}
          style={styleTopHover}
        />
      )}

      {/* 1. 폴더 제목, 유틸 버튼 행 */}
      <div
        className={`DIR_TITLE_ROW ${dirName}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={styleTitleRow} // ::
      >
        {/* 1-1. 폴더 열림/닫힘 토글 버튼 */}
        {isOpen && <Icon iconName="arrow_drop_down" onClick={toggleDirInPosting(dirOId)} style={styleToggler} />}
        {!isOpen && <Icon iconName="arrow_right" onClick={toggleDirInPosting(dirOId)} style={styleToggler} />}

        {/* 1-2. 폴더 이름 */}
        <p onClick={toggleDirInPosting(dirOId)}>{dirName}</p>

        {/* 1-3. 폴더 유틸 버튼: 폴더생성, 파일생성, 폴더수정 */}
        {isHover && (
          <>
            <Icon iconName="create_new_folder" onClick={onClickAdd(dirOId, 'dir')} style={styleButtonAddDir} />
            <Icon iconName="post_add" onClick={onClickAdd(dirOId, 'file')} style={styleButtonAddFile} />
            <Icon iconName="construction" onClick={onClickAdd(dirOId, 'fix')} style={styleButtonAddFile} />
          </>
        )}
      </div>

      {/* 2. 자식 디렉토리 목록 */}
      {isOpen &&
        directories[dirOId].subDirOIdsArr.map((subDirOId, _dirIdx) => (
          <SetRowDirObject key={subDirOId} dirIdx={_dirIdx} dirOId={subDirOId} parentDirOId={dirOId} tabLevel={tabLevel + 1} />
        ))}

      {/* 3. 폴더 생성 블록 */}
      {isOpen && parentOIdDir === dirOId && <CreateDirBlock parentDirOId={dirOId} tabLevel={tabLevel + 1} />}

      {/* 4. 자식 파일 목록 */}
      {isOpen &&
        directories[dirOId].fileOIdsArr.map((fileOId, _fileIdx) => (
          <SetRowFileObject key={fileOId} fileIdx={_fileIdx} fileOId={fileOId} parentDirOId={dirOId} tabLevel={tabLevel + 1} />
        ))}

      {/* 5. 파일 생성 블록 */}
      {isOpen && parentOIdFile === dirOId && <CreateFileBlock parentDirOId={dirOId} tabLevel={tabLevel + 1} />}

      {/* 6. 하단공백: 드래그로 폴더 이동시 사용 */}
      <div
        draggable={true}
        onDragEnter={onDragEnterBottom}
        onDragOver={e => e.preventDefault()}
        onDragLeave={onDragLeaveBottom}
        onDrop={onDropBottom(dirIdx)}
        style={styleBottomHover}
      />
    </div>
  )
}
