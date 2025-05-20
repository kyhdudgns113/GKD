import {ChangeEvent, CSSProperties, FC, useCallback, useState} from 'react'
import {DivCommonProps, Icon, Input} from '../../../common'
import {useUserSettingCallbacksContext} from '../_context'

type InputRowPartProps = DivCommonProps & {}
export const InputRowPart: FC<InputRowPartProps> = ({className, ...props}) => {
  const {onClickAdd} = useUserSettingCallbacksContext()

  const [name, setName] = useState<string>('')

  const styleRow: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',

    justifyContent: 'center',
    marginTop: '24px',
    width: '100%'
  }
  const styleInput: CSSProperties = {
    borderColor: '#404844',
    borderRadius: '12px',
    borderWidth: '4px',

    fontSize: '24px',
    fontWeight: 700,

    paddingBottom: '6px',
    paddingLeft: '12px',
    paddingRight: '12px',
    paddingTop: '6px',

    width: '240px'
  }
  const styleBtn: CSSProperties = {
    alignItems: 'center',
    backgroundColor: '#CCCCCC',
    borderColor: '#404844',
    borderRadius: '24px',
    borderWidth: '4px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    height: '48px',

    marginLeft: '20px',
    justifyContent: 'center',

    userSelect: 'none',
    width: '48px'
  }

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value)
  }, [])
  const onClickAddBtn = useCallback(
    (name: string) => () => {
      if (!name) {
        alert('이름이 빈값임')
        return
      }
      if (name.length > 10) {
        alert(`이름의 최대길이는 10`)
        return
      }
      onClickAdd(name)
    },
    [onClickAdd]
  )

  return (
    <div className={`ROW_INPUT ${className || ''}`} style={styleRow} {...props}>
      <Input onChange={onChange} style={styleInput} value={name} />
      <Icon iconName="add" onClick={onClickAddBtn(name)} style={styleBtn} />
    </div>
  )
}
