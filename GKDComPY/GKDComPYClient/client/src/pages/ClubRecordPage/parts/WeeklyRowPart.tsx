import {CSSProperties, FC} from 'react'
import {DivCommonProps, SAKURA_BORDER} from '../../../common'
import {AddNextWeekBlock, AddPrevWeekBlock} from '../blocks'
import {Text2XL} from '../../../common/components'
import {WeeklyRowGroup} from '../groups'
import {useClubContext} from '../../../contexts'

type WeeklyRowPartProps = DivCommonProps & {}
export const WeeklyRowPart: FC<WeeklyRowPartProps> = ({className, ...props}) => {
  const {weekRowsArr} = useClubContext()

  const styleDiv: CSSProperties = {
    alignItems: 'center',
    borderColor: SAKURA_BORDER,
    borderWidth: '2px',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    height: '100%',
    paddingTop: '24px',
    paddingBottom: '24px',
    width: '180px'
  }
  const styleTitle: CSSProperties = {
    borderBottomWidth: '4px',
    borderColor: SAKURA_BORDER,
    marginBottom: '16px',
    paddingBottom: '8px'
  }

  return (
    <div className={`${className}`} style={styleDiv} {...props}>
      {/* 타이틀 */}
      <Text2XL style={styleTitle}>주차별 기록</Text2XL>

      {/* 다음 주차 추가 */}
      <AddNextWeekBlock />

      {/* 현재 주차의 배열 */}
      <WeeklyRowGroup />

      {/* 이전 주차 추가 */}
      {weekRowsArr.length > 0 && <AddPrevWeekBlock />}
    </div>
  )
}
