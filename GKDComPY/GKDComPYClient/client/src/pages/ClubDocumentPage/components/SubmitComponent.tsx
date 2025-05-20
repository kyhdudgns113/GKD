import {CSSProperties, FC, MouseEvent, useCallback} from 'react'
import {DivCommonProps} from '../../../common'
import {useChattingPartStatesContext} from '../parts'

type SubmitComponentProps = DivCommonProps & {}
export const SubmitComponent: FC<SubmitComponentProps> = ({className, ...props}) => {
  const {setSubmit} = useChattingPartStatesContext()

  const styleDiv: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'
  }
  const styleSubmitBtn: CSSProperties = {
    backgroundColor: '#DDDDDD',
    borderColor: '#AAAAAA',
    borderRadius: '8px',
    borderWidth: '4px',

    color: '#666666',

    fontSize: '1rem',
    fontWeight: 700,
    height: '40px',
    width: '60px'
  }

  const onClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setSubmit(true)
    },
    [setSubmit]
  )

  return (
    <div className={`${className}`} style={styleDiv} {...props}>
      <button onClick={onClick} style={styleSubmitBtn}>
        전송
      </button>
    </div>
  )
}
