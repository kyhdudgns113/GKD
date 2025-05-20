import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../../common'

type HeadGroupProps = DivCommonProps & {}
export const HeadGroup: FC<HeadGroupProps> = ({className, ...props}) => {
  const styleHead: CSSProperties = {
    alignItems: 'center',
    borderColor: '#404844',
    borderBottomWidth: '4px',
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    height: '48px',
    width: '100%'
  }
  const styleText: CSSProperties = {
    alignContent: 'center',
    borderColor: '#404844',
    fontSize: '18px',
    fontWeight: 700,
    height: '100%'
  }
  const styleName: CSSProperties = {
    ...styleText,
    borderRightWidth: '4px',
    width: '120px'
  }
  const styleChips: CSSProperties = {
    ...styleText,
    borderRightWidth: '4px',
    width: '58px'
  }
  const styleDelete: CSSProperties = {
    ...styleText,
    width: '48px'
  }
  return (
    <div className={`HEAD_GROUP ${className || ''}`} style={styleHead} {...props}>
      <p style={styleName}>이름</p>
      <p style={styleChips}>칩</p>
      <p style={styleChips}>빚</p>
      <p style={styleChips}>+100</p>
      <p style={styleChips}>-100</p>
      <p style={styleDelete}>X</p>
    </div>
  )
}
