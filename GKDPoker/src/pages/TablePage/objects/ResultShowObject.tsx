import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../../common'
import {ResultBodyGroup, ResultTitleGroup} from '../groups'

type ResultShowObjectProps = DivCommonProps & {height?: string}
export const ResultShowObject: FC<ResultShowObjectProps> = ({height, className, ...props}) => {
  const styleObject: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    height: height || '300px',
    width: '100%'
  }
  return (
    <div className={`RESULT_SHOW_OBJECT ${className || ''}`} style={styleObject} {...props}>
      <ResultTitleGroup />
      <ResultBodyGroup />
    </div>
  )
}
