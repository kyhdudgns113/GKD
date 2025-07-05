import {useCallback, useEffect, useMemo, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Icon} from '@component'
import {SAKURA_BG_70, SAKURA_BORDER, SAKURA_TEXT} from '@value'

import {useDirectoryStatesContext} from '@contexts/directory/__states'
import {useDirectoryCallbacksContext} from '@contexts/directory/_callbacks'

import type {CSSProperties, DragEvent, FC} from 'react'
import type {DivCommonProps} from '@prop'

type SetRowFileObjectProps = DivCommonProps & {
  fileIdx: number
  fileOId: string
  parentDirOId: string
  tabLevel: number
}

/**
 * 1. 파일 인덱스 0인 경우: 최상단 공백(파일 올려놓는 상황에서 사용)
 *   - 파일을 올려놓는 경우: 해당 파일을 인덱스 0번째에 둔다.
 *
 * 2. 파일 아이콘 및 제목
 *   - 파일을 올려놓는 경우: 아무것도 하지 않는다.
 *
 * 3. 파일 최하단 공백: 드래그로 파일 이동시 사용
 *   - 파일을 올려놓는 경우: 해당 파일을 지금 파일의 다음 인덱스에 둔다.
 *
 * 공통
 *   - 폴더를 올려놓는 경우: 해당 폴더를 지금 파일의 부모폴더의 맨 마지막 자식폴더로 만든다.
 */
export const SetRowFileObject: FC<SetRowFileObjectProps> = ({fileIdx, fileOId, parentDirOId, tabLevel, className, style, ...props}) => {
  const {fileRows, moveDirOId, moveFileOId, setMoveFileOId} = useDirectoryStatesContext()
  const {moveDirectory, moveFile, onDragEndDirFile} = useDirectoryCallbacksContext()

  const [fileName, setFileName] = useState<string>('--')
  const [isHover, setIsHover] = useState(false)
  const [isHoverBottom, setIsHoverBottom] = useState(false)
  const [isHoverTop, setIsHoverTop] = useState(false)

  const navigate = useNavigate()

  const styleRow: CSSProperties = {
    ...style,

    display: 'flex',
    flexDirection: 'column',

    justifyContent: 'center',

    marginLeft: `${tabLevel * 8}px`
  }
  const styleRowTop: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      width: '100%',
      height: '6px'
    }
    if (isHoverTop) {
      style.backgroundColor = SAKURA_BG_70
    }
    return style
  }, [isHoverTop])
  const styleIconTitle: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      display: 'flex',
      flexDirection: 'row'
    }
    if (isHover) {
      style.backgroundColor = SAKURA_BG_70
    }
    return style
  }, [isHover])
  const styleIcon: CSSProperties = {
    fontSize: '22px',
    marginLeft: '4px',
    marginRight: '4px'
  }
  const styleRowBottom: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      width: '100%',
      height: '6px'
    }
    if (isHoverBottom) {
      style.backgroundColor = SAKURA_BG_70
    }
    return style
  }, [isHoverBottom])
  const styleHidden: CSSProperties = {
    alignContent: 'center',
    backgroundColor: '#CCCCCC',

    borderRadius: '8px',
    borderColor: '#888888',
    borderWidth: '1px',

    color: '#888888',
    fontSize: '12px',
    fontWeight: 800,

    marginLeft: 'auto',
    marginRight: '4px',

    paddingLeft: '4px',
    paddingRight: '4px'
  }
  const styleIntro: CSSProperties = {
    alignContent: 'center',
    backgroundColor: SAKURA_BG_70,

    borderRadius: '8px',
    borderColor: SAKURA_BORDER,
    borderWidth: '1px',

    color: SAKURA_TEXT,
    fontSize: '12px',
    fontWeight: 800,

    marginLeft: 'auto',
    marginRight: '4px',

    paddingLeft: '4px',
    paddingRight: '4px'
  }

  const onClickFile = useCallback(
    (fileOId: string) => () => {
      navigate(`/posting/${fileOId}`)
    },
    [navigate]
  )

  const onDragEnterRowTop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setIsHoverTop(true)
  }, [])
  const onDragLeaveRowTop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setIsHoverTop(false)
  }, [])
  const onDragOverRowTop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])
  const onDropRowTop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setIsHoverTop(false)

      if (moveDirOId) {
        e.preventDefault()
        moveDirectory(moveDirOId, parentDirOId, null)
      } // ::
      else if (moveFileOId) {
        e.preventDefault()
        moveFile(moveFileOId, parentDirOId, 0)
      }
    },
    [moveDirOId, moveFileOId, parentDirOId, moveDirectory, moveFile]
  )

  const onDragEndFile = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation()
      onDragEndDirFile()
    },
    [onDragEndDirFile]
  )
  const onDragEnterFile = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setIsHover(true)
  }, [])
  const onDragLeaveFile = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setIsHover(false)
  }, [])
  const onDragOverFile = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])
  const onDragStartFile = useCallback(
    (fileOId: string) => (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setMoveFileOId(fileOId)
    },
    [setMoveFileOId]
  )
  const onDropFile = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      /**
       * 파일을 올려놓을땐 아무것도 하면 안된다.
       *   - 드래그한 파일을 위로둘지 아래로 둘지 애매하다
       * 폴더를 올려놓을때만 이 파일의 부모폴더의 맨 나중 자식폴더로 바꾼다.
       */
      e.stopPropagation()
      setIsHoverTop(false)
      setIsHoverBottom(false)
      setIsHover(false)

      if (moveDirOId) {
        e.preventDefault()
        moveDirectory(moveDirOId, parentDirOId, null)
      } // ::
      else {
        // DO NOTHING:
        // 드래그한 파일을 이 파일위에 올려놓아봐야 둘곳이 애매하다.
        // 따라서 아무것도 하지 않는다.
      }
    },
    [moveDirOId, parentDirOId, moveDirectory]
  )

  const onDragEnterRowBottom = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setIsHoverBottom(true)
  }, [])
  const onDragLeaveRowBottom = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setIsHoverBottom(false)
  }, [])
  const onDragOverRowBottom = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])
  const onDropRowBottom = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setIsHoverBottom(false)

      if (moveDirOId) {
        e.preventDefault()
        moveDirectory(moveDirOId, parentDirOId, null)
      } // ::
      else if (moveFileOId) {
        e.preventDefault()
        moveFile(moveFileOId, parentDirOId, fileIdx + 1)
      }
    },
    [fileIdx, moveDirOId, moveFileOId, parentDirOId, moveDirectory, moveFile]
  )

  // Set file name
  useEffect(() => {
    if (!fileRows[fileOId]) {
      setFileName('로딩중...-')
    } // ::
    else {
      setFileName(fileRows[fileOId].name)
    }
  }, [fileOId, fileRows])

  return (
    <div
      className={`SET_ROW_FILE_OBJECT ${fileIdx} ${className || ''}`}
      style={styleRow}
      {...props} // ::
    >
      {/* 0. 스타일 */}
      <style>
        {`
          .FILE_ICON_AND_TITLE:hover {
            border-color: ${SAKURA_BORDER};
            border-radius: 8px;
            border-width: 2px;
          }
        `}
      </style>

      {/* 1. 파일 인덱스 0 인 경우: 최상단 공백(파일 올려놓는 상황에서 사용) */}
      {fileIdx === 0 && (
        <div
          onDragEnter={onDragEnterRowTop}
          onDragLeave={onDragLeaveRowTop}
          onDragOver={onDragOverRowTop}
          onDrop={onDropRowTop}
          style={styleRowTop} // ::
        />
      )}

      {/* 2. 파일 아이콘 및 제목 */}
      <div
        className="FILE_ICON_AND_TITLE "
        draggable={true}
        onClick={onClickFile(fileOId)}
        onDragEnd={onDragEndFile}
        onDragStart={onDragStartFile(fileOId)}
        onDragEnter={onDragEnterFile}
        onDragLeave={onDragLeaveFile}
        onDragOver={onDragOverFile}
        onDrop={onDropFile}
        style={styleIconTitle} // ::
      >
        <Icon iconName="file_present" style={styleIcon} />
        <p>{fileName}</p>

        {fileRows[fileOId]?.isHidden && <div style={styleHidden}>숨김</div>}
        {fileRows[fileOId]?.isIntroPost && <div style={styleIntro}>공지</div>}
      </div>

      {/* 3. 파일 최하단 공백: 드래그로 파일 이동시 사용 */}
      <div
        onDragEnter={onDragEnterRowBottom}
        onDragLeave={onDragLeaveRowBottom}
        onDragOver={onDragOverRowBottom}
        onDrop={onDropRowBottom}
        style={styleRowBottom} // ::
      />
    </div>
  )
}
