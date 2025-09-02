import {useCallback} from 'react'
import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'
import {useFileCallbacksContext, useFileStatesContext} from '@contexts/file'
import {FILE_HIDDEN, FILE_NORMAL} from '@secret'
import type {FileType} from '@commons/typesAndValues'

type HideFileButtonProps = ButtonCommonProps

export const HideFileButton: FC<HideFileButtonProps> = ({className, style, ...props}) => {
  const {file} = useFileStatesContext()
  const {editFileStatus} = useFileCallbacksContext()

  const isHidden = file.fileStatus === FILE_HIDDEN

  const onClickHide = useCallback(
    (file: FileType) => (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      let newFileStatus = FILE_NORMAL

      if (file.fileStatus !== FILE_HIDDEN) {
        newFileStatus = FILE_HIDDEN
      }

      editFileStatus(file.fileOId, newFileStatus) // ::
        .then(isSuccess => {
          if (isSuccess) {
            if (newFileStatus === FILE_HIDDEN) {
              alert('숨김 설정이 완료되었습니다')
            } // ::
            else {
              alert('숨김 해제가 완료되었습니다')
            }
          }
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`HideFileButton ${isHidden ? '_isHiddenFile' : ''} ${className || ''}`}
      onClick={onClickHide(file)}
      style={style}
      {...props} // ::
    >
      숨김
    </button>
  )
}
