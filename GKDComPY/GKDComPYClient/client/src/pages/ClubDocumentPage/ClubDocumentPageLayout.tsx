import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../common'
import {AlphaPart} from './parts'
import {DocumentAlphaPart} from './parts'
import {ChattingPart} from './parts'

type ClubDocumentPageLayoutProps = DivCommonProps & {}

export const ClubDocumentPageLayout: FC<ClubDocumentPageLayoutProps> = ({className, ...props}) => {
  const styleLayout: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    height: '100%'
  }
  return (
    <div className={`DOC_PAGE_LAYOUT ${className || ''}`} style={styleLayout} {...props}>
      <AlphaPart />
      <DocumentAlphaPart className="my-6" />
      {/* <DocumentPart className="my-6" /> */}
      <ChattingPart className="my-6 ml-10" />
    </div>
  )
}
