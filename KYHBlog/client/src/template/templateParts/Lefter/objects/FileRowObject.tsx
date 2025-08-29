import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {useDirectoryStatesContext} from '@context'
import {FileInfoGroup} from '../groups'

import '../_styles/DirectoryViewPart.scss'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

type FileRowObjectProps = DivCommonProps & {fileOId: string}

export const FileRowObject: FC<FileRowObjectProps> = ({fileOId, className, style, ...props}) => {
  const {fileRows} = useDirectoryStatesContext()

  const navigate = useNavigate()

  const onClickRow = useCallback(
    (fileOId: string) => (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      e.preventDefault()

      navigate(`/main/reading/${fileOId}`)
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div
      className={`FileRow_Object _object ${className || ''}`}
      onClick={onClickRow(fileOId)}
      style={style}
      {...props} // ::
    >
      <FileInfoGroup fileName={fileRows[fileOId].fileName} />
    </div>
  )
}
