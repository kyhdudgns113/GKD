import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../../common'
import {ButtonPotAGroup, ButtonPotBGroup, ButtonRaiseGroup} from '../groups'
type ActionBySizeObjectProps = DivCommonProps & {height?: string}
export const ActionBySizeObject: FC<ActionBySizeObjectProps> = ({height, className, ...props}) => {
  const styleObject: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    flexShrink: 0,
    height: height || '380px',
    justifyContent: 'space-between',

    paddingLeft: '12px',
    paddingRight: '12px',
    paddingTop: '48px',
    width: '100%'
  }

  return (
    <div className={`ACTION_BY_SIZE_OBJECT ${className || ''}`} style={styleObject} {...props}>
      <ButtonRaiseGroup width="156px" />
      <ButtonPotAGroup width="156px" />
      <ButtonPotBGroup width="156px" />
    </div>
  )
}
