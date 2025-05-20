import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../../common'
import {ResultButtonObject, ResultShowObject} from '../objects'

type ResultPartProps = DivCommonProps & {}
export const ResultPart: FC<ResultPartProps> = ({className, ...props}) => {
  const stylePart: CSSProperties = {
    alignItems: 'center',
    borderColor: '#404844',
    borderRadius: '32px',
    borderWidth: '6px',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    height: '440px',
    marginTop: '48px',
    width: '540px'
  }
  return (
    <div className={`RESULT_PART ${className || ''}`} style={stylePart} {...props}>
      <ResultButtonObject height="80px" />
      <ResultShowObject height="300px" />
    </div>
  )
}
