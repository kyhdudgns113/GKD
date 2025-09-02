import {useCallback, useMemo} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {useDirectoryStatesContext, useFileStatesContext} from '@context'
import {FileInfoGroup} from '../groups'

import '../_styles/DirectoryViewPart.scss'

import type {CSSProperties, FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

type FileRowObjectProps = DivCommonProps & {fileOId: string}

export const FileRowObject: FC<FileRowObjectProps> = ({fileOId, className, style, ...props}) => {
  const {fileRows} = useDirectoryStatesContext()
  const {fileOId: openFileOId} = useFileStatesContext()

  const location = useLocation()
  const navigate = useNavigate()

  const styleGroup: CSSProperties = useMemo(() => {
    const afterMain = location.pathname.split('/main/')[1]?.split('/')[0] || ''

    const isReadingState = afterMain === 'reading'
    const isThisFile = openFileOId === fileOId

    const backgroundColor = isReadingState && isThisFile ? '#FFcccc' : 'transparent'
    const fontWeight = isReadingState && isThisFile ? 'bold' : 'normal'

    const elem: CSSProperties = {
      ...style,
      backgroundColor,
      fontWeight
    }
    return elem
  }, [fileOId, location, openFileOId]) // eslint-disable-line react-hooks/exhaustive-deps

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
      style={styleGroup}
      {...props} // ::
    >
      <FileInfoGroup fileName={fileRows[fileOId].fileName} />
    </div>
  )
}
