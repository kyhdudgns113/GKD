import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../../common'

type ResultTitleGroupProps = DivCommonProps & {}
export const ResultTitleGroup: FC<ResultTitleGroupProps> = ({className, ...props}) => {
  const styleGroup: CSSProperties = {
    alignItems: 'center',
    backgroundColor: '#CCCCCC',
    borderColor: '#404844',
    borderWidth: '4px',
    display: 'flex',
    flexDirection: 'row',
    flexShrink: 0,
    height: '40px',
    width: 'fit-content'
  }
  const styleText: CSSProperties = {
    alignContent: 'center',
    borderColor: '#404844',
    fontSize: '18px',
    fontWeight: 600,

    height: '100%',
    textAlign: 'center'
  }
  const styleName: CSSProperties = {
    ...styleText,
    borderRightWidth: '4px',
    width: '120px'
  }
  const styleBet: CSSProperties = {
    ...styleText,
    borderRightWidth: '4px',
    width: '64px'
  }
  const styleGet: CSSProperties = {
    ...styleText,
    borderRightWidth: '4px',
    width: '64px'
  }
  const styleTotal: CSSProperties = {
    ...styleText,
    borderRightWidth: '4px',
    width: '64px'
  }
  const styleEmpty: CSSProperties = {
    ...styleText,
    backgroundColor: '#404844',
    width: '15px'
  }
  return (
    <div className={`RESULT_TITLE_GROUP ${className || ''}`} style={styleGroup} {...props}>
      <p style={styleName}>이름</p>
      <p style={styleBet}>베팅</p>
      <p style={styleGet}>획득</p>
      <p style={styleTotal}>총계</p>
      <p style={styleEmpty} />
    </div>
  )
}
