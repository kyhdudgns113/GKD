import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../../common'

type AlphaPartProps = DivCommonProps & {}
/**
 * 24.11.29 기준 Document 왼쪽의 빈 공간이다.
 * 나중에 어떻게든 쓸것 같아서 만들어놨다.
 */
export const AlphaPart: FC<AlphaPartProps> = ({className, ...props}) => {
  const styleAlpha: CSSProperties = {
    width: '120px',
    height: '100%'
  }

  return <div className={`${className}`} style={styleAlpha} {...props} />
}
