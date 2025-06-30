import {widthPage} from '@value'

import {IntroPostSP} from './subpage'

import type {DivCommonProps} from '@prop'
import type {CSSProperties, FC} from 'react'
import {MarginHeightBlock} from '@components/MarginBlocks'

type DefaultPageLayoutProps = DivCommonProps & {}

export const DefaultPageLayout: FC<DefaultPageLayoutProps> = ({className, style, ...props}) => {
  const stylePage: CSSProperties = {
    ...style,

    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',

    width: widthPage
  }

  return (
    <div className={`DEFAULT_PAGE_LAYOUT ${className || ''}`} style={stylePage} {...props}>
      <MarginHeightBlock height="48px" />
      <IntroPostSP />
    </div>
  )
}
