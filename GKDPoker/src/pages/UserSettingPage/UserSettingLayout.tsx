import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../common'
import {ButtonRowPart, InputRowPart, TitlePart, UserListPart} from './parts'

type UserSettingLayoutProps = DivCommonProps & {}
export const UserSettingLayout: FC<UserSettingLayoutProps> = ({className, ...props}) => {
  const styleDiv: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',

    userSelect: 'none',
    width: '100%'
  }
  const styleBlock: CSSProperties = {
    alignItems: 'center',
    borderColor: '#404844',
    borderRadius: '32px',
    borderWidth: '6px',
    display: 'flex',
    flexDirection: 'column',
    height: '630px',
    width: '540px'
  }

  return (
    <div className={`PAGE_GAME_SETTING ${className || ''}`} style={styleDiv} {...props}>
      <div className="SETTING_BLOCK " style={styleBlock}>
        <TitlePart />
        <InputRowPart />
        <UserListPart />
        <ButtonRowPart />
      </div>
    </div>
  )
}
