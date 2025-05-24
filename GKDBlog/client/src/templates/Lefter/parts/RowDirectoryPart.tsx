import {useEffect, useState} from 'react'
import {Icon, SAKURA_BG_50} from '../../../common'
import {useDirectoryStatesContext} from '../../../contexts/directory/__states'
import {useDirectoryCallbacksContext} from '../../../contexts/directory/_callbacks'

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
  const {directories, isDirOpen} = useDirectoryStatesContext()
  const {toggleDirInLefter} = useDirectoryCallbacksContext()

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const styleRow: CSSProperties = {
    ...style,
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

  // Set isDirOpen
  useEffect(() => {
    setIsOpen(isDirOpen[dirOId] || false)
  }, [isDirOpen, dirOId])

  return (
    <div
      className={`ROW_DIRECTORY_PART dir:${dirOId} ${className || ''}`}
      onClick={toggleDirInLefter(dirOId)}
      style={styleRow}
      {...props} // BLANK LINE COMMENT:
    >
      {/* 폴더에 마우스 가져다 대면 색 변경(hover) */}
      <style>
        {`
          .ROW_DIRECTORY_PART:hover {
            background-color: ${SAKURA_BG_50};
          }
        `}
      </style>

      {/* 폴더 열렸는지 표시하는 아이콘 */}
      {isOpen ? (
        <Icon iconName="arrow_drop_down" style={styleIcon} />
      ) : (
        <Icon iconName="arrow_right" style={styleIcon} />
      )}

      {/* 폴더 이름 */}
      <p>{directories[dirOId]?.dirName || '이름에러'}</p>
    </div>
  )
}
