import {CSSProperties, FC} from 'react'
import {DivCommonProps, Icon} from '../../../common'
import {useTablePageCallbacksContext, useTablePageStatesContext} from '../_context'

type ToggleObjectProps = DivCommonProps & {height?: string}
export const ToggleObject: FC<ToggleObjectProps> = ({height, className, ...props}) => {
  const {actionIdx} = useTablePageStatesContext()
  const {shiftActionIdx} = useTablePageCallbacksContext()

  const styleObject: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexShrink: 0,
    height: height || '50px',
    justifyContent: 'space-between',
    marginTop: 'auto',
    marginBottom: '0px',
    width: '60%'
  }
  const styleIdxRow: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: '4px'
  }
  const styleBtn: CSSProperties = {
    alignItems: 'center',
    borderColor: '#404844',
    borderRadius: '20px',
    borderWidth: '4px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '30px',
    height: '40px',
    justifyContent: 'center',
    width: '40px'
  }

  return (
    <div className={`TOGGLE_OBJECT ${className || ''}`} style={styleObject} {...props}>
      <style>
        {`
          .BTN_BACK:hover {
            background-color: #808884;
          }
          .BTN_FORWARD:hover {
            background-color: #808884;
          }
        `}
      </style>
      <Icon
        className="BTN_BACK"
        iconName="arrow_back"
        onClick={shiftActionIdx(-1)}
        style={styleBtn}
      />

      <div className="IDX_ROW" style={styleIdxRow}>
        {actionIdx === 0 ? (
          <Icon iconName="radio_button_checked" />
        ) : (
          <Icon iconName="radio_button_unchecked" />
        )}
        {actionIdx === 1 ? (
          <Icon iconName="radio_button_checked" />
        ) : (
          <Icon iconName="radio_button_unchecked" />
        )}
        {actionIdx === 2 ? (
          <Icon iconName="radio_button_checked" />
        ) : (
          <Icon iconName="radio_button_unchecked" />
        )}
      </div>

      <Icon
        className="BTN_FORWARD"
        iconName="arrow_forward"
        onClick={shiftActionIdx(1)}
        style={styleBtn}
      />
    </div>
  )
}
