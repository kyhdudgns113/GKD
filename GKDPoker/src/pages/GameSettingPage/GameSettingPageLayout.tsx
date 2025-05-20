import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../common'
import {ButtonRowPart, FirstRowPart, TitlePart} from './parts'

type GameSettingLayoutProps = DivCommonProps & {}
export const GameSettingLayout: FC<GameSettingLayoutProps> = ({className, ...props}) => {
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
        <FirstRowPart />
        <ButtonRowPart />
      </div>
    </div>
  )
}
