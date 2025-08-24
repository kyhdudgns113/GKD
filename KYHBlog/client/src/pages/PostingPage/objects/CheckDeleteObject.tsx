import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {useDirectoryCallbacksContext, useFileStatesContext} from '@context'

import type {FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'

type CheckDeleteObjectProps = DivCommonProps

export const CheckDeleteObject: FC<CheckDeleteObjectProps> = ({className, style, ...props}) => {
  const {deleteFile} = useDirectoryCallbacksContext()
  const {fileOId, setIsDelete} = useFileStatesContext()

  const navigate = useNavigate()

  const onClickDelete = useCallback(
    (fileOId: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      deleteFile(fileOId)
      navigate('/main/posting')
    },
    [deleteFile, navigate]
  )

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      setIsDelete(false)
    },
    [setIsDelete]
  )

  return (
    <div className={`CheckDelete_Object ${className || ''}`} style={style} {...props}>
      <p style={{fontSize: '22px', fontWeight: '700'}}>삭제하나요?</p>

      <div className="btn_row" style={{display: 'flex', flexDirection: 'row', gap: '8px', marginTop: '16px'}}>
        <button onClick={onClickDelete(fileOId)}>삭제</button>
        <button onClick={onClickCancel}>취소</button>
      </div>
    </div>
  )
}
