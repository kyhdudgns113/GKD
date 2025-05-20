import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../../common'
import {InputComponent, SubmitComponent} from '../components'

type InputGroupProps = DivCommonProps & {}
export const InputGroup: FC<InputGroupProps> = ({className, ...props}) => {
  const widthSubmitPx = 300

  const styleInput: CSSProperties = {
    backgroundColor: '#F3F4F6',
    outlineColor: '#CCCCCC',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',
    resize: 'none',

    width: `${window.innerWidth - widthSubmitPx}px`,
    height: '100%'
  }
  const styleSubmit: CSSProperties = {
    paddingLeft: '8px',
    width: `${widthSubmitPx}px`
  }

  return (
    <div className={`flex flex-row ${className}`} {...props}>
      <InputComponent style={styleInput} />
      <SubmitComponent style={styleSubmit} />
    </div>
  )
}
