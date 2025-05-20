import {CSSProperties, FC} from 'react'
import {DivCommonProps, Icon, Input} from '../../../common'
import {useTablePageStatesContext, useTablePageCallbacksContext} from '../_context'

type BetSizeObjectProps = DivCommonProps & {height?: string}
export const BetSizeObject: FC<BetSizeObjectProps> = ({height, className, ...props}) => {
  const {actionIdx, betSize, seatIdx} = useTablePageStatesContext()
  const {betSizeDec, betSizeInc, onBlurBetSize, onChangeBetSize} = useTablePageCallbacksContext()

  const styleObject: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexShrink: 0,
    height: height || '50px',
    justifyContent: 'center',
    paddingTop: '8px',
    width: '100%'
  }
  const styleBtn: CSSProperties = {
    alignContent: 'center',
    borderColor: '#404844',
    borderRadius: '22px',
    borderWidth: '3px',
    cursor: 'pointer',

    height: '40px',
    marginLeft: '16px',
    marginRight: '16px',
    textAlign: 'center',
    width: '40px'
  }
  const styleAllMin: CSSProperties = {
    ...styleBtn,
    fontSize: '14px',
    fontWeight: 600
  }
  const styleInput: CSSProperties = {
    borderColor: '#404844',
    borderRadius: '6px',
    borderWidth: '3px',
    fontSize: '24px',
    fontWeight: 600,
    marginLeft: '24px',
    marginRight: '24px',
    textAlign: 'center',
    width: '80px'
  }
  const styleIncDec: CSSProperties = {
    ...styleBtn,
    fontSize: '24px',
    fontWeight: 600
  }

  return (
    <div className={`BET_SIZE_OBJECT ${className || ''}`} style={styleObject} {...props}>
      <style>
        {`
          .BTN {
            background-color: #FFFFFF;
          }
          .BTN:hover {
            background-color: #CCCCCC;
          }
          
          `}
      </style>
      <p className="BTN ALL" onClick={betSizeInc(seatIdx, 999999999)} style={styleAllMin}>
        ALL
      </p>
      <Icon
        className="BTN INC"
        iconName="add"
        onClick={betSizeInc(seatIdx, 1)}
        style={styleIncDec}
      />
      <Input
        className="INPUT_BET_SIZE "
        disabled={actionIdx !== 0}
        onBlur={onBlurBetSize(seatIdx)}
        onChange={onChangeBetSize}
        style={styleInput}
        type="number"
        value={betSize}
      />
      <Icon
        className="BTN DEC"
        iconName="remove"
        style={styleIncDec}
        onClick={betSizeDec(seatIdx, 1)}
      />
      <p className="BTN MIN" onClick={betSizeDec(seatIdx, 999999999)} style={styleAllMin}>
        MIN
      </p>
    </div>
  )
}
