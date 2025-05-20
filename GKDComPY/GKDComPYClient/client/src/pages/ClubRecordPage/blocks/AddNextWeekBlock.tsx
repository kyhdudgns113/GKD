import {CSSProperties, FC, MouseEvent, useCallback, useMemo, useState} from 'react'
import {DivCommonProps, SAKURA_BG, SAKURA_BORDER, SAKURA_TEXT} from '../../../common'
import {useTemplateStatesContext} from '../../../template/_contexts'
import {useClubContext} from '../../../contexts'

type AddNextWeekBlockProps = DivCommonProps & {}
export const AddNextWeekBlock: FC<AddNextWeekBlockProps> = ({className, ...props}) => {
  const {clubsArr, selectedClubIdx: clubIdx} = useTemplateStatesContext()
  const {addNextWeek} = useClubContext()

  const [isHovered, setIsHovered] = useState<boolean>(false)

  const styleBtn: CSSProperties = useMemo(() => {
    const elem: CSSProperties = {
      backgroundColor: isHovered ? SAKURA_BG : '#FFFFFF',
      borderColor: SAKURA_BORDER,
      borderWidth: '4px',
      borderRadius: '8px',
      color: SAKURA_TEXT,
      cursor: 'pointer',
      fontWeight: 800,
      padding: '4px',
      userSelect: 'none'
    }
    return elem
  }, [isHovered])

  const onClickAddNextWeek = useCallback(
    (clubOId: string) => (e: MouseEvent<HTMLDivElement>) => {
      addNextWeek(clubOId)
    },
    [addNextWeek]
  )

  return (
    <div
      className={`flex flex-col justify-center items-center w-fit mt-4 ${className}`}
      onClick={onClickAddNextWeek(clubsArr[clubIdx || 0]?.clubOId || '')}
      onMouseEnter={e => setIsHovered(true)}
      onMouseLeave={e => setIsHovered(false)}
      {...props} // BLANK LINE COMMENT:
    >
      <button style={styleBtn}>새것 추가</button>
    </div>
  )
}
