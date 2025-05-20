import {CSSProperties, FC, useCallback, useState} from 'react'
import {DivCommonProps} from '../../../common'
import {useTablePageCallbacksContext, useTablePageStatesContext} from '../_context'

type ButtonPotBGroupProps = DivCommonProps & {width?: string}
export const ButtonPotBGroup: FC<ButtonPotBGroupProps> = ({width, className, ...props}) => {
  const {seatIdx} = useTablePageStatesContext()
  const {betSizePotSize} = useTablePageCallbacksContext()

  const [isHover, setIsHover] = useState(false)

  const styleGroup: CSSProperties = {
    alignItems: 'center',
    backgroundColor: isHover ? '#E8E8E8' : '#FFFFFF',
    borderColor: '#404844',
    borderRadius: '12px',
    boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.4)',

    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    fontSize: '24px',
    fontWeight: 700,
    height: '190px',

    paddingTop: '4px',

    width: width || '100px'
  }
  const styleTitle: CSSProperties = {
    fontSize: '24px',
    fontWeight: 700,
    height: '50px',
    paddingTop: '6px'
  }
  const styleRow: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexShrink: 0,
    height: '62px',
    justifyContent: 'space-between',
    paddingTop: '8px',
    width: '124px'
  }
  const styleBtn: CSSProperties = {
    borderColor: '#808884',
    borderRadius: '12px',
    borderWidth: '4px',
    fontSize: '15px',
    fontWeight: 600,
    height: '48px',
    width: '55px'
  }
  const onMouseEnter = useCallback(() => {
    setIsHover(true)
  }, [])
  const onMouseLeave = useCallback(() => {
    setIsHover(false)
  }, [])
  return (
    <div
      className={`BUTTON_RAISE_GROUP ${className || ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={styleGroup}
      {...props} // BLANK LINE COMMENT:
    >
      <style>
        {`
          .button {
            background-color: #FFFFFF;
          }
          .button:hover {
            background-color: #CCCCCC;
          }
        `}
      </style>
      <p style={styleTitle}>Pot Over</p>
      <div style={styleRow}>
        <button onClick={betSizePotSize(seatIdx, 1.5)} style={styleBtn}>
          x 1.5
        </button>
        <button onClick={betSizePotSize(seatIdx, 2)} style={styleBtn}>
          x 2
        </button>
      </div>
      <div style={styleRow}>
        <button onClick={betSizePotSize(seatIdx, 2.5)} style={styleBtn}>
          x 2.5
        </button>
        <button onClick={betSizePotSize(seatIdx, 3)} style={styleBtn}>
          x 3
        </button>
      </div>
    </div>
  )
}
