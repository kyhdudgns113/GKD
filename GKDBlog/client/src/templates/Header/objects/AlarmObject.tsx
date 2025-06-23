import type {CSSProperties, FC} from 'react'

import type {DivCommonProps} from '@prop'

type AlarmObjectProps = DivCommonProps & {}

export const AlarmObject: FC<AlarmObjectProps> = ({className, style, ...props}) => {
  const styleObject: CSSProperties = {
    ...style,

    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
    padding: '16px',
    position: style?.position || 'absolute',
    zIndex: 10
  }

  return (
    <div className={`ALARM_OBJECT ${className || ''}`} style={styleObject} {...props}>
      Header/AlarmObject
    </div>
  )
}
