import {useCallback, useEffect, useState} from 'react'
import {useDirectoryStatesContext} from '../../../contexts/directory/__states'
import {useDirectoryCallbacksContext} from '../../../contexts/directory/_callbacks'
import {Icon, SAKURA_BG_70, SAKURA_TEXT} from '../../../common'

import {SetRowFileObject} from './SetRowFileObject'
import {CreateDirBlock, CreateFileBlock} from '../blocks'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '../../../common'

/**
 * 디렉토리 설정 페이지에서의 디렉토리 row
 * - 이 친구의 자식 요소도 나타내야함
 * - flexDirection: column 으로 해야함
 */
type SetRowDirObjectProps = DivCommonProps & {dirOId: string; tabLevel: number}

export const SetRowDirObject: FC<SetRowDirObjectProps> = ({
  dirOId,
  tabLevel,
  className,
  style,
  ...props
}) => {
  const {directories, fileRows, isDirOpenPosting, parentOIdDir, parentOIdFile} =
    useDirectoryStatesContext()
  const {getDirectoryInfo, onClickCreateDir, onClickCreateFile, onClickFixDir, toggleDirInPosting} =
    useDirectoryCallbacksContext()

  const [dirName, setDirName] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isHover, setIsHover] = useState(false)

  const styleNowDir: CSSProperties = {
    ...style,
    display: 'flex',
    flexDirection: 'column', // 자식 요소도 나타내야 하기 때문에 column 이 맞다.
    marginLeft: `${tabLevel * 8}px`,

    paddingTop: '2px',
    paddingBottom: '2px'
    // margin 때문에 width 별도로 설정 안하는게 좋다.
  }
  const styleTitleRow: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
  const styleToggler: CSSProperties = {
    color: '#000000',
    cursor: 'pointer',
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
    } // BLANK LINE COMMENT:
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
    } // BLANK LINE COMMENT:
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
    <div className={`SET_ROW_DIR_OBJECT ${className || ''}`} style={styleNowDir} {...props}>
      {/* 0. 마우스 가져다대면 배경색 변경 */}
      <style>
        {`
        .DIR_TITLE_ROW:hover {
          background-color: ${SAKURA_BG_70};
        }
        `}
      </style>

      {/* 1. 폴더 제목, 유틸 버튼 행 */}
      <div
        className={`DIR_TITLE_ROW ${dirName}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={styleTitleRow} // BLANK LINE COMMENT:
      >
        {/* 1-1. 폴더 열림/닫힘 토글 버튼 */}
        {isOpen ? (
          <Icon
            iconName="arrow_drop_down"
            onClick={toggleDirInPosting(dirOId)}
            style={styleToggler}
          />
        ) : (
          <Icon iconName="arrow_right" onClick={toggleDirInPosting(dirOId)} style={styleToggler} />
        )}

        {/* 1-2. 폴더 이름 */}
        <p>{dirName}</p>

        {/* 1-3. 폴더 유틸 버튼 */}
        {isHover && (
          <>
            <Icon
              iconName="create_new_folder"
              onClick={onClickAdd(dirOId, 'dir')}
              style={styleButtonAddDir}
            />
            <Icon
              iconName="post_add"
              onClick={onClickAdd(dirOId, 'file')}
              style={styleButtonAddFile}
            />
            <Icon
              iconName="construction"
              onClick={onClickAdd(dirOId, 'fix')}
              style={styleButtonAddFile}
            />
          </>
        )}
      </div>

      {/* 2. 자식 디렉토리 목록 */}
      {isOpen &&
        directories[dirOId].subDirOIdsArr.map(subDirOId => (
          <SetRowDirObject key={subDirOId} dirOId={subDirOId} tabLevel={tabLevel + 1} />
        ))}

      {/* 3. 폴더 생성 블록 */}
      {isOpen && parentOIdDir === dirOId && (
        <CreateDirBlock parentDirOId={dirOId} tabLevel={tabLevel + 1} />
      )}

      {/* 4. 자식 파일 목록 */}
      {isOpen &&
        directories[dirOId].fileOIdsArr.map(fileOId => (
          <SetRowFileObject key={fileOId} fileOId={fileOId} tabLevel={tabLevel + 1} />
        ))}

      {/* 5. 파일 생성 블록 */}
      {isOpen && parentOIdFile === dirOId && (
        <CreateFileBlock parentDirOId={dirOId} tabLevel={tabLevel + 1} />
      )}
    </div>
  )
}
