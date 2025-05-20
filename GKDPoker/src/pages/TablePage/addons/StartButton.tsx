import {CSSProperties, FC, MouseEvent, useCallback} from 'react'
import {DivCommonProps} from '../../../common'
import {useTablePageCallbacksContext} from '../_context/_callbacks'

type StartButtonProps = DivCommonProps & {}
export const StartButton: FC<StartButtonProps> = ({className, ...props}) => {
  const {startGame} = useTablePageCallbacksContext()

  const styleDiv: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: '64px',
    width: '100%'
  }
  const styleButton: CSSProperties = {
    borderColor: '#404844',
    borderRadius: '12px',
    borderWidth: '6px',

    fontSize: '24px',
    fontWeight: 700,
    padding: '10px 20px'
  }

  const onClickStart = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      startGame()
    },
    [startGame]
  )

  return (
    <div className={`START_BUTTON ${className || ''}`} style={styleDiv} {...props}>
      <style>
        {`
          button {
            background-color: #A0A8A4;
          }
          button:hover {
            background-color: #D0D8D4;
          }
        `}
      </style>
      <button onClick={onClickStart} style={styleButton}>
        시작
      </button>
    </div>
  )
}
