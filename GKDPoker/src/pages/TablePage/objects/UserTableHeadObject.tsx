import {FC, CSSProperties} from 'react'
import {DivCommonProps} from '../../../common'

type UserTableHeadObjectProps = DivCommonProps & {height?: string}
export const UserTableHeadObject: FC<UserTableHeadObjectProps> = ({
  className,
  height,
  ...props
}) => {
  const backgroundColor = '#404844'
  const borderRightWidth = '4px'

  const styleHead: CSSProperties = {
    alignItems: 'center',
    backgroundColor: '#CCCCCC',
    borderColor: '#404844',
    borderBottomWidth: '4px',
    borderLeftWidth: '4px',
    borderRightWidth: '4px',
    borderTopWidth: '4px',
    display: 'flex',
    flexDirection: 'row',
    flexShrink: 0,
    height: height || '40px',
    width: 'fit-content'
  }
  const styleCat: CSSProperties = {
    alignContent: 'center',
    backgroundColor: '#CCCCCC',
    borderColor: '#404844',
    fontSize: '20px',
    fontWeight: 'bold',
    height: '100%',
    textAlign: 'center'
  }

  return (
    <div className={`USER_TABLE_HEAD_OBJECT ${className || ''}`} style={styleHead} {...props}>
      <p style={{...styleCat, borderRightWidth, width: '156px'}}>이름</p>
      <p style={{...styleCat, borderRightWidth, width: '64px'}}>뱅크</p>
      <p style={{...styleCat, borderRightWidth, width: '64px'}}>빚</p>
      <p style={{...styleCat, backgroundColor, width: '15px'}}>&nbsp;</p>
    </div>
  )
}
