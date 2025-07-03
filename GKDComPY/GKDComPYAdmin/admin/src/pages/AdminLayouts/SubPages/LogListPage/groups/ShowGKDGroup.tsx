import {CSSProperties, FC} from 'react'
import {DivCommonProps, SAKURA_BORDER} from '../../../../../common'

type ShowGKDGroupProps = DivCommonProps & {
  gkd: any
}
export const ShowGKDGroup: FC<ShowGKDGroupProps> = ({gkd, className, ...props}) => {
  const styleDiv: CSSProperties = {
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
      {Object.keys(gkd).map(key => (
        <p key={`p${key}`} style={styleText}>{`${key}: ${gkd[key]}`}</p>
      ))}
    </div>
  )
}
