import {useCallback, useEffect, useState} from 'react'
import {Icon} from '@component'
import {useDirectoryStatesContext} from '@contexts/directory/__states'
import {useNavigate} from 'react-router-dom'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'
import {SAKURA_BG_50} from '@value'

type RowFileBlockProps = DivCommonProps & {
  fileOId: string
  tabCnt: number
}

export const RowFileBlock: FC<RowFileBlockProps> = ({fileOId, tabCnt, className, style, ...props}) => {
  const {fileRows} = useDirectoryStatesContext()

  const [fileName, setFileName] = useState<string>('--')

  const navigate = useNavigate()

  const styleRowBlock: CSSProperties = {
    ...style,
    display: 'flex',
    flexDirection: 'row',
    marginLeft: `${tabCnt * 8}px`
  }
  const styleIcon: CSSProperties = {
    fontSize: '22px',
    marginLeft: '4px',
    marginRight: '4px'
  }
  const styleName: CSSProperties = {
    cursor: 'pointer',
    fontSize: '16px',
    marginLeft: '4px'
  }

  const onClickFile = useCallback(
    (fileOId: string) => () => {
      if (fileRows[fileOId]) {
        navigate(`/reading/${fileOId}`)
      }
    },
    [fileRows, navigate]
  )

  // Set file name
  useEffect(() => {
    if (!fileRows[fileOId]) {
      setFileName('로딩중...')
    } // ::
    else {
      setFileName(fileRows[fileOId].name)
    }
  }, [fileOId, fileRows])

  return (
    <div
      className={`ROW_FILE_BLOCK file:${fileOId} ${className || ''}`}
      style={styleRowBlock}
      {...props} // ::
    >
      {/* 0. 폴더에 마우스 가져다 대면 색 변경(hover) */}
      <style>
        {`
          .ROW_FILE_BLOCK:hover {
            background-color: ${SAKURA_BG_50};
          }
        `}
      </style>

      {/* 1. 파일 아이콘 */}
      <Icon iconName="file_present" style={styleIcon} />

      {/* 2. 파일 이름 */}
      <p onClick={onClickFile(fileOId)} style={styleName}>
        {fileName}
      </p>
    </div>
  )
}
