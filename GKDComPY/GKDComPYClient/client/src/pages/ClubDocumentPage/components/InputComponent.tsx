import {ChangeEvent, FC, KeyboardEvent, useCallback} from 'react'
import {TextareaCommonProps} from '../../../common'
import {useChattingPartStatesContext} from '../parts'

type InputComponentProps = TextareaCommonProps & {}
export const InputComponent: FC<InputComponentProps> = ({className, ...props}) => {
  const {chatInput, setChatInput, setSubmit} = useChattingPartStatesContext()

  // NOTE: style 은 InputGroup 에서 넣어준다.
  // NOTE: 높이값을 구해줘야 하기 때문이다.

  const onChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setChatInput(e.target.value)
    },
    [setChatInput]
  )
  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (!e.shiftKey && e.key === 'Enter') {
        e.preventDefault()
        setSubmit(true)
      } // BLANK LINE COMMENT:
      else if (e.key === 'Enter') {
        // DO NOTHING:
        // 그냥 개행만 되게끔 한다.
      }
    },
    [setSubmit]
  )

  return (
    <textarea
      className={`${className} `}
      onChange={onChange}
      onKeyDown={onKeyDown}
      value={chatInput}
      {...props} // BLANK LINE COMMENT:
    />
  )
}
