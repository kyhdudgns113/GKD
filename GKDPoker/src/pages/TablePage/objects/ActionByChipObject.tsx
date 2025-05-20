import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../../common'
import {PokerChip} from '../../../common/components/Icons'
import {useTablePageCallbacksContext, useTablePageStatesContext} from '../_context'

type ActionByChipObjectProps = DivCommonProps & {height?: string}
export const ActionByChipObject: FC<ActionByChipObjectProps> = ({height, className, ...props}) => {
  const {seatIdx} = useTablePageStatesContext()
  const {betSizeInc} = useTablePageCallbacksContext()

  const styleObject: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    height: height || '380px',

    paddingLeft: '12px',
    paddingRight: '12px',
    paddingTop: '20px',
    width: '100%'
  }
  const styleRow: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    height: '135px',

    justifyContent: 'space-between',
    width: '360px'
  }

  return (
    <div className={`ACTION_BY_CHIP_OBJECT ${className || ''}`} style={styleObject} {...props}>
      <div className="CHIP_ROW_1" style={styleRow}>
        <PokerChip color="#FF0000" hvColor="#FFB8B8" onClick={betSizeInc(seatIdx, 1)} />
        <PokerChip color="#0000FF" hvColor="#B8B8FF" onClick={betSizeInc(seatIdx, 5)} />
        <PokerChip color="#00DD00" hvColor="#B8FFB8" onClick={betSizeInc(seatIdx, 10)} />
      </div>
      <div className="CHIP_ROW_2" style={styleRow}>
        <PokerChip color="#FFBB00" hvColor="#FFE8B8" onClick={betSizeInc(seatIdx, 50)} />
        <PokerChip color="#FF00FF" hvColor="#FFB8FF" onClick={betSizeInc(seatIdx, 100)} />
        <PokerChip color="#000000" hvColor="#B8B8B8" onClick={betSizeInc(seatIdx, 500)} />
      </div>
    </div>
  )
}
