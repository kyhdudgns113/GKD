import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../../common'
import {HeadGroup} from '../groups'
import {BodyGroup} from '../groups/BodyGroup'

type UserListPartProps = DivCommonProps & {}
export const UserListPart: FC<UserListPartProps> = ({className, ...props}) => {
  const styleDiv: CSSProperties = {
    backgroundColor: '#CCCCCC',
    borderColor: '#404844',
    borderRadius: '8px',
    borderWidth: '4px',

    display: 'flex',
    flexDirection: 'column',

    height: '330px',
    marginTop: '32px',
    width: '430px'
  }

  return (
    <div className={`USER_LIST_PART ${className || ''}`} style={styleDiv} {...props}>
      <HeadGroup />
      <BodyGroup />
    </div>
  )
}
