import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type LogsPartProps = DivCommonProps & {}

export const LogsPart: FC<LogsPartProps> = ({className, style, ...props}) => {
  return (
    <div className={`LogsPart _admin_part ${className || ''}`} style={style} {...props}>
      <p className="_part_title">Logs</p>
    </div>
  )
}
