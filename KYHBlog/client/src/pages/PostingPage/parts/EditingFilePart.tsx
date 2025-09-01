import {useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {useFileStatesContext} from '@context'
import {CheckDeleteObject, FileContentsObject, FileHeaderObject} from '../objects'

import '../_styles/EditingFilePart.scss'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type EditingFilePartProps = DivCommonProps

export const EditingFilePart: FC<EditingFilePartProps> = ({className, style, ...props}) => {
  const {fileOId, isDelete} = useFileStatesContext()
  const {setFileOId} = useFileStatesContext()

  const location = useLocation()

  // 초기화: fileOId
  useEffect(() => {
    const isFileOId = location.pathname.match(/\/posting\/(.+)/)
    if (isFileOId) {
      setFileOId(isFileOId[1])
    } // ::
    else {
      setFileOId('')
    }
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!fileOId) return null

  return (
    <div className={`EditingFile_Part ${className || ''}`} style={style} {...props}>
      <FileHeaderObject />
      <FileContentsObject />

      {isDelete && <CheckDeleteObject />}
    </div>
  )
}
