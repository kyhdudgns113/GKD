import {ChangeEvent, CSSProperties, FC, MouseEvent, useCallback, useEffect, useState} from 'react'
import {DivCommonProps} from '../../../common'
import {Button, Modal, Text3XL, Textarea} from '../../../common/components'
import {useClubRecordStatesContext, useClubRecordCallbacksContext} from '../_contexts'

type ModalSetWeekCommentPartProps = DivCommonProps & {}
export const ModalSetWeekCommentPart: FC<ModalSetWeekCommentPartProps> = ({
  className,
  ...props
}) => {
  const {weeklyRecord, setSelCommentWOId} = useClubRecordStatesContext()
  const {setWeekComment} = useClubRecordCallbacksContext()
  const {keyDownEnter, keyDownESC, setKeyDownEnter, setKeyDownESC} = useClubRecordStatesContext()

  const [comments, setComments] = useState<string>('')

  const styleBlock: CSSProperties = {
    width: '400px',
    height: '320px'
  }
  const styleComment: CSSProperties = {
    backgroundColor: 'white',
    marginTop: '16px',
    width: '250px',
    height: '100px'
  }

  const onChangeComment = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setComments(e.target.value)
  }, [])
  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setSelCommentWOId('')
    },
    [setSelCommentWOId]
  )
  const onClickSubmit = useCallback(
    (weekOId: string, comment: string) => (e: MouseEvent<HTMLButtonElement>) => {
      setWeekComment(weekOId, comment)
      setSelCommentWOId('')
    },
    [setSelCommentWOId, setWeekComment]
  )

  // Init comment
  useEffect(() => {
    if (weeklyRecord) {
      setComments(weeklyRecord.comment)
    }
  }, [weeklyRecord])
  // Key Down: Enter: Submit
  useEffect(() => {
    if (keyDownEnter) {
      setKeyDownEnter(false)
      setWeekComment(weeklyRecord.weekOId, comments)
      setSelCommentWOId('')
    }
  }, [comments, keyDownEnter, weeklyRecord, setKeyDownEnter, setSelCommentWOId, setWeekComment])
  // Key Down: ESC: Cancel
  useEffect(() => {
    if (keyDownESC) {
      setKeyDownESC(false)
      setSelCommentWOId('')
    }
  }, [keyDownESC, setKeyDownESC, setSelCommentWOId])

  return (
    <Modal
      className={`${className}`}
      onClose={() => {}}
      style={styleBlock}
      {...props} // BLANK LINE COMMENT:
    >
      <Text3XL className="mt-2">{`${weeklyRecord.start} ~ ${weeklyRecord.end}`}</Text3XL>
      <Text3XL className="mt-2">주간 코멘트</Text3XL>
      <Textarea maxLength={40} onChange={onChangeComment} style={styleComment} value={comments} />
      <div className="flex flex-row justify-between w-4/5 mt-6">
        <Button onClick={onClickSubmit(weeklyRecord.weekOId, comments)}>Submit</Button>
        <Button onClick={onClickCancel}>Cancel</Button>
      </div>
    </Modal>
  )
}
