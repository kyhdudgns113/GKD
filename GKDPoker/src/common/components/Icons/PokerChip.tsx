import {CSSProperties, FC} from 'react'
import {SpanCommonProps} from '../../typesAndValues'
import {Icon} from './Icon'

type PokerChipProps = SpanCommonProps & {
  hvColor?: string
  color: string
  style?: CSSProperties
}

export const PokerChip: FC<PokerChipProps> = ({hvColor, color, style, className, ...props}) => {
  const styleIcon: CSSProperties = {
    ...style,
    borderColor: 'transparent',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color,
    fontSize: '90px'
  }

  return (
    <Icon
      iconName="poker_chip"
      className={className}
      onMouseEnter={e => {
        const eTarget = e.currentTarget as HTMLElement
        eTarget.style.backgroundColor = hvColor || 'transparent'
      }}
      onMouseLeave={e => {
        const eTarget = e.currentTarget as HTMLElement
        eTarget.style.backgroundColor = ''
      }}
      style={styleIcon}
      {...props}
    />
  )
}
