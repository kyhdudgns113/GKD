import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../../common'
import {useGameSettingCallbacksContext} from '../_context'

type ButtonRowPartProps = DivCommonProps & {}

export const ButtonRowPart: FC<ButtonRowPartProps> = ({className, ...props}) => {
  const {onClickLoad, onClickSave} = useGameSettingCallbacksContext()

  const styleRow: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '24px',
    marginTop: 'auto',
    width: '250px'
  }
  const styleBtn: CSSProperties = {
    borderColor: '#404844',
    borderRadius: '16px',
    borderWidth: '4px',

    fontSize: '20px',
    fontWeight: 700,

    height: '60px',
    width: '100px'
  }

  return (
    <div className={`BUTTON_ROW ${className || ''}`} style={styleRow} {...props}>
      <style>
        {`
          button:hover {
            background-color: #D0D8D4;
          }
          button {
            background-color: #C0C8C4;
          }
        `}
      </style>
      <button onClick={onClickSave} style={styleBtn}>
        저장
      </button>
      <button onClick={onClickLoad} style={styleBtn}>
        로드
      </button>
    </div>
  )
}
