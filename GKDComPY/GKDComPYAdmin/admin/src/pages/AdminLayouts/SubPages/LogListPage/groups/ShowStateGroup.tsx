import {CSSProperties, FC} from 'react'
import {DivCommonProps, SAKURA_BORDER} from '../../../../../common'

type ShowStateGroupProps = DivCommonProps & {
  gkdStatus: any
}
export const ShowStateGroup: FC<ShowStateGroupProps> = ({gkdStatus, className, ...props}) => {
  const styleDiv: CSSProperties = {
    backgroundColor: '#FFFFFF',
    borderColor: SAKURA_BORDER,
    borderWidth: '6px',
    borderRadius: '12px',

    minHeight: '100px',
    left: '120%',
    position: 'absolute',

    textAlign: 'left',
    top: -6,
    width: '300px',
    zIndex: 10
  }
  const styleText: CSSProperties = {
    borderColor: 'transparent',
    borderRadius: '12px',

    paddingLeft: '4px',
    paddingTop: '2px',
    paddingBottom: '2px'
  }

  return (
    <div className={`${className}`} style={styleDiv} {...props}>
      {Object.keys(gkdStatus).map(key => (
        <p key={`p${key}`} style={styleText}>{`${key}: ${gkdStatus[key]}`}</p>
      ))}
    </div>
  )
}
