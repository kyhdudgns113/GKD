import {ChangeEvent, CSSProperties, FC, useCallback} from 'react'
import {DivCommonProps, Input} from '../../../common'
import {useGameSettingCallbacksContext, useGameSettingStatesContext} from '../_context'

type SetSBGroupProps = DivCommonProps & {}
export const SetSBGroup: FC<SetSBGroupProps> = ({className, ...props}) => {
  const {smallBlind, setSmallBlind} = useGameSettingStatesContext()
  const {onBlurSB} = useGameSettingCallbacksContext()

  const styleDiv: CSSProperties = {
    alignItems: 'center',
    backgroundColor: '#CCCCCC',
    borderColor: '#404844',
    borderRadius: '16px',
    borderWidth: '4px',
    display: 'flex',
    flexDirection: 'column',
    width: '100px'
  }
  const styleText: CSSProperties = {
    borderColor: '#404844',
    borderBottomWidth: '4px',
    color: '#202422',
    fontSize: '24px',
    fontWeight: 700,
    paddingBottom: '4px',
    paddingTop: '4px',
    textAlign: 'center',
    width: '100%'
  }
  const styleInput: CSSProperties = {
    backgroundColor: 'transparent',
    fontSize: '24px',
    fontWeight: 700,
    outline: 'none',
    paddingBottom: '16px',
    paddingTop: '16px',
    textAlign: 'center',
    width: '100%'
  }

  const onBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onBlurSB(e)
    },
    [onBlurSB]
  )
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newVal = e.currentTarget.valueAsNumber
      setSmallBlind(newVal)
    },
    [setSmallBlind]
  )

  return (
    <div className={`SET_BB_GROUP ${className || ''}`} style={styleDiv} {...props}>
      <p style={styleText}>SB</p>
      <Input
        onBlur={onBlur}
        onChange={onChange}
        style={styleInput}
        type="number"
        value={smallBlind}
      />
    </div>
  )
}
