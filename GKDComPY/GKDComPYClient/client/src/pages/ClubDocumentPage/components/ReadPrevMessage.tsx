import {CSSProperties, FC, MouseEvent, useCallback} from 'react'
import {DivCommonProps} from '../../../common'
import {useTemplateStatesContext} from '../../../template/_contexts'
import {useChattingPartCallbacksContext, useChattingPartStatesContext} from '../parts'

type ReadPrevMessageProps = DivCommonProps & {}
export const ReadPrevMessage: FC<ReadPrevMessageProps> = ({className, ...props}) => {
  const {clubsArr, selectedClubIdx: clubIdx} = useTemplateStatesContext()
  const {chatsArr} = useChattingPartStatesContext()
  const {readPrevMessage} = useChattingPartCallbacksContext()

  const cnHover = 'hover:border-gray-600' // hover 는 이 코드에서 못 설정한다
  const styleBlock: CSSProperties = {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',

    borderColor: 'transparent',
    borderRadius: '6px',
    borderWidth: '4px',

    cursor: 'pointer',
    fontSize: '1.125rem',
    fontWeight: 600,
    height: 'fit-content',

    padding: '4px',
    position: 'absolute',

    textAlign: 'center',
    userSelect: 'none',
    width: '95%',
    zIndex: 20
  }

  const onClickLoadPrev = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (clubsArr.length > 0 && clubIdx !== null) {
        const {clubOId} = clubsArr[clubIdx]
        readPrevMessage(clubOId, chatsArr[0].chatIdx)
      }
    },
    [chatsArr, clubIdx, clubsArr, readPrevMessage]
  )

  return (
    <div
      className={`${cnHover} ${className}`}
      onClick={onClickLoadPrev}
      style={styleBlock}
      {...props} // BLANK LINE COMMENT:
    >
      이전 메시지 불러오기
    </div>
  )
}
