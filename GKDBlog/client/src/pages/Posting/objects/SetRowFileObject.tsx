import {useCallback, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Icon} from '@component'
import {SAKURA_BG_70} from '@value'

import {useDirectoryStatesContext} from '@contexts/directory/__states'
import {useDirectoryCallbacksContext} from '@contexts/directory/_callbacks'

import type {CSSProperties, DragEvent, FC} from 'react'
import type {DivCommonProps} from '@prop'

type SetRowFileObjectProps = DivCommonProps & {
  fileIdx: number
  fileOId: string
  tabLevel: number
}

export const SetRowFileObject: FC<SetRowFileObjectProps> = ({
  fileIdx,
  fileOId,
  tabLevel,
  className,
  style,
  ...props
}) => {
  const {fileRows, setMoveFileOId} = useDirectoryStatesContext()
  const {onDragEndDirFile} = useDirectoryCallbacksContext()

  const [fileName, setFileName] = useState<string>('--')

  const navigate = useNavigate()

  const styleRow: CSSProperties = {
    ...style,
    display: 'flex',
    flexDirection: 'row',
    marginLeft: `${tabLevel * 8}px`
  }
  const styleIcon: CSSProperties = {
    fontSize: '22px',
    marginLeft: '4px',
    marginRight: '4px'
  }

  const onClickFile = useCallback(
    (fileOId: string) => () => {
      navigate(`/posting/${fileOId}`)
    },
    [navigate]
  )

  const onDragEndFile = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation()
      onDragEndDirFile()
    },
    [onDragEndDirFile]
  )
  const onDragOverFile = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])
  const onDragStartFile = useCallback(
    (fileOId: string) => (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setMoveFileOId(fileOId)
    },
    [setMoveFileOId]
  )

  // Set file name
  useEffect(() => {
    if (!fileRows[fileOId]) {
      setFileName('로딩중...-')
    } // BLANK LINE COMMENT:
    else {
      setFileName(fileRows[fileOId].name)
    }
  }, [fileOId, fileRows])

  return (
    <div
      className={`SET_ROW_FILE_OBJECT ${fileIdx} ${className || ''}`}
      draggable={true}
      onClick={onClickFile(fileOId)}
      onDragEnd={onDragEndFile}
      onDragStart={onDragStartFile(fileOId)}
      onDragOver={onDragOverFile}
      style={styleRow}
      {...props} // BLANK LINE COMMENT:
    >
      <style>
        {`
        .SET_ROW_FILE_OBJECT:hover {
          background-color: ${SAKURA_BG_70};
        }
        `}
      </style>
      <Icon iconName="file_present" style={styleIcon} />
      <p>{fileName}</p>
    </div>
  )
}
