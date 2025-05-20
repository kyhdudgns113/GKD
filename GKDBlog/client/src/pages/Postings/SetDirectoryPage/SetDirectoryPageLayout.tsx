import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '../../../common'

export type SetDirectoryPageLayoutProps = DivCommonProps & {}

export const SetDirectoryPageLayout: FC<SetDirectoryPageLayoutProps> = ({
  className,
  style,
  ...props
}) => {
  const stylePage: CSSProperties = {
    ...style,
    display: 'flex',
    flexDirection: 'column'
  }
  return (
    <div className={`SET_DIRECTORY_PAGE ${className || ''}`} style={stylePage} {...props}>
      <p>SetDirectoryPageLayout</p>
    </div>
  )
}
