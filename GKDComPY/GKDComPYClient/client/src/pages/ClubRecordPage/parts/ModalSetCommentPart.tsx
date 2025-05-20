import {ChangeEvent, CSSProperties, FC, MouseEvent, useCallback, useEffect, useState} from 'react'
import {DivCommonProps} from '../../../common'
import {Button, Modal, Text3XL, Textarea} from '../../../common/components'
import {useClubRecordStatesContext, useClubRecordCallbacksContext} from '../_contexts'

type ModalSetCommentPartProps = DivCommonProps & {
  dayIdx: number
}
/**
 * 일간 코멘트 수정 모달
 */
export const ModalSetCommentPart: FC<ModalSetCommentPartProps> = ({
  dayIdx,
  className,
  ...props
}) => {
  const {weeklyRecord, setSelCommentIdx} = useClubRecordStatesContext()
  const {submitComments} = useClubRecordCallbacksContext()
  const {keyDownEnter, keyDownESC, setKeyDownEnter, setKeyDownESC} = useClubRecordStatesContext()

  const [comments, setComments] = useState<string>('')

  const styleBlock: CSSProperties = {
    width: '400px',
    height: '420px'
  }
  const styleComment: CSSProperties = {
    backgroundColor: 'white',
    marginTop: '16px',
    width: '250px',
    height: '200px'
  }

  const dayInfo = weeklyRecord?.colInfo.dateInfo[dayIdx] || null

  const onChangeComment = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setComments(e.target.value)
  }, [])

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setSelCommentIdx(null)
    },
    [setSelCommentIdx]
  )
  const onClickSubmit = useCallback(
    (dayIdx: number, comments: string) => (e: MouseEvent<HTMLButtonElement>) => {
      submitComments(dayIdx, comments)
      setSelCommentIdx(null)
    },
    [setSelCommentIdx, submitComments]
  )

  // Init comment
  useEffect(() => {
    if (weeklyRecord && weeklyRecord.colInfo) {
      setComments(weeklyRecord.colInfo.dateInfo[dayIdx].comments)
    }
  }, [dayIdx, weeklyRecord])
  // Key Down: Enter: Submit
  useEffect(() => {
    if (keyDownEnter) {
      setKeyDownEnter(false)
      submitComments(dayIdx, comments)
      setSelCommentIdx(null)
    }
  }, [comments, dayIdx, keyDownEnter, setKeyDownEnter, setSelCommentIdx, submitComments])
  // Key Down: ESC: Cancel
  useEffect(() => {
    if (keyDownESC) {
      setKeyDownESC(false)
      setSelCommentIdx(null)
    }
  }, [keyDownESC, setKeyDownESC, setSelCommentIdx])

  return (
    <Modal
      className={`${className}`}
      onClose={() => {}}
      style={styleBlock}
      {...props} // BLANK LINE COMMENT:
    >
      <Text3XL className="mt-2">{dayInfo.date}</Text3XL>
      <Text3XL className="mt-2">코멘트</Text3XL>
      <Textarea maxLength={40} onChange={onChangeComment} style={styleComment} value={comments} />
      <div className="flex flex-row justify-between w-4/5 mt-6">
        <Button onClick={onClickSubmit(dayIdx, comments)}>Submit</Button>
        <Button onClick={onClickCancel}>Cancel</Button>
      </div>
    </Modal>
  )
}
