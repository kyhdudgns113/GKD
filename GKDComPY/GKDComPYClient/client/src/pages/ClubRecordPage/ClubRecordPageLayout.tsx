import {CSSProperties, KeyboardEvent} from 'react'
import {useCallback} from 'react'
import {DivCommonProps} from '../../common'
import {
  WeeklyRowPart,
  RecordTablePart,
  ModalSetColumnPart,
  ModalSetCommentPart,
  ModalRecordingPart,
  ModalDeleteWeek,
  ModalSetMemberRowPart,
  ModalAddMemberRowPart,
  ModalSetWeekCommentPart
} from './parts'
import {useClubRecordStatesContext} from './_contexts'

type ClubRecordPageLayoutProps = DivCommonProps & {}
export const ClubRecordPageLayout = ({className, ...props}: ClubRecordPageLayoutProps) => {
  const {
    selColIdx,
    selCommentIdx,
    selDate,
    selDelWeek,
    selModName,
    selName,
    selCommentWOId,
    selWeekOId,
    weekOId,

    setKeyDownEnter,
    setKeyDownESC
  } = useClubRecordStatesContext()

  const styleDivMain: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    width: '100%'
  }

  const onKeyDownDivMain = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      switch (e.key) {
        case 'Escape':
          setKeyDownESC(true)
          break
        case 'Enter':
          if (!e.shiftKey) {
            setKeyDownEnter(true)
          }
          break
      }
    },
    [setKeyDownEnter, setKeyDownESC]
  )

  return (
    <div
      className={`ClubRecordPage ${className || ''}`}
      onKeyDown={onKeyDownDivMain}
      style={styleDivMain}
      tabIndex={0}
      {...props} // BLANK LINE COMMENT:
    >
      <WeeklyRowPart />
      {weekOId && <RecordTablePart />}

      {selColIdx !== null && <ModalSetColumnPart />}
      {selCommentIdx !== null && <ModalSetCommentPart dayIdx={selCommentIdx} />}
      {selDate && selName && <ModalRecordingPart />}
      {selDelWeek !== null && <ModalDeleteWeek />}
      {selModName && <ModalSetMemberRowPart />}
      {selWeekOId && <ModalAddMemberRowPart />}
      {selCommentWOId && <ModalSetWeekCommentPart />}
    </div>
  )
}
