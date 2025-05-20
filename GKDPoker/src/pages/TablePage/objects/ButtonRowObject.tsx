import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../../common'
import {useTablePageCallbacksContext, useTablePageStatesContext} from '../_context'

type ButtonRowObjectProps = DivCommonProps & {height?: string}
export const ButtonRowObject: FC<ButtonRowObjectProps> = ({height, className, ...props}) => {
  const {betSize, seatIdx} = useTablePageStatesContext()
  const {onClickAction, onClickFold} = useTablePageCallbacksContext()

  const styleObject: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexShrink: 0,
    height: height || '60px',
    justifyContent: 'space-between',

    paddingTop: '16px',
    width: '50%'
  }
  const styleBtn: CSSProperties = {
    borderColor: '#404844',
    borderRadius: '14px',
    borderWidth: '4px',
    fontSize: '20px',
    fontWeight: 600,
    height: '44px',

    width: '96px'
  }
  return (
    <div className={`BUTTON_ROW_OBJECT ${className || ''}`} style={styleObject} {...props}>
      <style>
        {`
          button {
            background-color: #FFFFFF;
          }
          button:hover {
            background-color: #CCCCCC;
          }
        `}
      </style>
      <button className="BTN_ACTION" onClick={onClickAction(seatIdx, betSize)} style={styleBtn}>
        Action
      </button>
      <button onClick={onClickFold(seatIdx)} style={styleBtn}>
        Fold
      </button>
    </div>
  )
}
