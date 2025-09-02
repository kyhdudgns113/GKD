import {useCallback} from 'react'
import {useFileCallbacksContext, useFileStatesContext} from '@context'
import {FILE_NORMAL, FILE_NOTICE} from '@secret'

import type {FC, MouseEvent} from 'react'
import type {ButtonCommonProps} from '@prop'
import type {FileType} from '@commons/typesAndValues'

type NoticeFileButtonProps = ButtonCommonProps

export const NoticeFileButton: FC<NoticeFileButtonProps> = ({className, style, ...props}) => {
  const {file} = useFileStatesContext()
  const {editFileStatus} = useFileCallbacksContext()

  const isNotice = file.fileStatus === FILE_NOTICE

  const onClickNotice = useCallback(
    (file: FileType) => (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      let newFileStatus = FILE_NORMAL

      if (file.fileStatus !== FILE_NOTICE) {
        newFileStatus = FILE_NOTICE
      }

      editFileStatus(file.fileOId, newFileStatus) // ::
        .then(isSuccess => {
          if (isSuccess) {
            if (newFileStatus === FILE_NOTICE) {
              alert('공지 설정이 완료되었습니다')
            } // ::
            else {
              alert('공지 해제가 완료되었습니다')
            }
          }
        })
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <button
      className={`NoticeFileButton ${isNotice ? '_isNoticeFile' : ''} ${className || ''}`}
      onClick={onClickNotice(file)}
      style={style}
      {...props} // ::
    >
      공지
    </button>
  )
}
