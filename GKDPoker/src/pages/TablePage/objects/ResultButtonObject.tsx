import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../../common'
import {useTablePageCallbacksContext, useTablePageStatesContext} from '../_context'

type ResultButtonObjectProps = DivCommonProps & {height?: string}
export const ResultButtonObject: FC<ResultButtonObjectProps> = ({height, className, ...props}) => {
  const {resultBtnText} = useTablePageStatesContext()
  const {onClickShowResult} = useTablePageCallbacksContext()

  const styleObject: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexShrink: 0,
    height: height || '80px',
    justifyContent: 'center',

    paddingBottom: 'auto',
    paddingTop: 'auto',
    width: '100%'
  }
  const styleBtn: CSSProperties = {
    borderColor: '#404844',
    borderRadius: '14px',
    borderWidth: '4px',
    fontSize: '20px',
    fontWeight: 600,
    height: '48px',
    width: '116px'
  }

  return (
    <div className={`RESULT_BUTTON_OBJECT ${className || ''}`} style={styleObject} {...props}>
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
      <button onClick={onClickShowResult(resultBtnText)} style={styleBtn}>
        {resultBtnText}
      </button>
    </div>
  )
}
