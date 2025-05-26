import {useEffect, useState} from 'react'
import {Icon, SAKURA_BG_50} from '../../../common'
import {useDirectoryStatesContext} from '../../../contexts/directory/__states'
import {useDirectoryCallbacksContext} from '../../../contexts/directory/_callbacks'
import {RowFilePart} from './RowFilePart'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '../../../common'
type RowDirectoryPartProps = DivCommonProps & {dirOId: string; tabCnt: number}

export const RowDirectoryPart: FC<RowDirectoryPartProps> = ({
  dirOId,
  tabCnt,
  className,
  style,
  ...props
}) => {
  const {directories, fileRows, isDirOpen} = useDirectoryStatesContext()
  const {toggleDirInLefter, getDirectoryInfo} = useDirectoryCallbacksContext()

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const styleRowPart: CSSProperties = {
    ...style,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  }
  const styleTitleArea: CSSProperties = {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    fontSize: '16px',
    marginLeft: `${tabCnt * 8}px`
  }
  const styleIcon: CSSProperties = {
    cursor: 'pointer',
    fontSize: '28px',
    marginRight: '4px'
  }

  // Automatically set isDirOpen
  useEffect(() => {
    setIsOpen(isDirOpen[dirOId] || false)
  }, [isDirOpen, dirOId])

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

  return (
    <div
      className={`ROW_DIRECTORY_PART dir:${dirOId} ${className || ''}`}
      style={styleRowPart}
      {...props} // BLANK LINE COMMENT:
    >
      {/* 0. 폴더에 마우스 가져다 대면 색 변경(hover) */}
      <style>
        {`
          .TITLE_AREA:hover {
            background-color: ${SAKURA_BG_50};
          }
        `}
      </style>

      {/* 1. 폴더 이름 밑 아이콘 영역 */}
      <div className={`TITLE_AREA `} onClick={toggleDirInLefter(dirOId)} style={styleTitleArea}>
        {/* 1-1. 폴더 열렸는지 표시하는 아이콘 */}
        {isOpen ? (
          <Icon iconName="arrow_drop_down" style={styleIcon} />
        ) : (
          <Icon iconName="arrow_right" style={styleIcon} />
        )}

        {/* 1-2. 폴더 이름 */}
        <p>{directories[dirOId]?.dirName || '이름에러'}</p>
      </div>

      {/* 2. 폴더 내부의 자식폴더의 목록 */}
      {isOpen && directories[dirOId]?.subDirOIdsArr.length > 0 && (
        <div className="SUB_DIR_LIST">
          {directories[dirOId]?.subDirOIdsArr.map(subDirOId => (
            <RowDirectoryPart key={subDirOId} dirOId={subDirOId} tabCnt={tabCnt + 1} />
          ))}
        </div>
      )}

      {/* 3. 폴더 내부의 파일의 목록 */}
      {isOpen && directories[dirOId]?.fileOIdsArr.length > 0 && (
        <div className="FILE_LIST">
          {directories[dirOId]?.fileOIdsArr.map(fileOId => (
            <RowFilePart key={fileOId} fileOId={fileOId} tabCnt={tabCnt + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
