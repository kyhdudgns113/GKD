import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../common'
import {SideBarWithBtn} from './sidebarWithBtn'
import {useTemplateStatesContext} from './_context'
import {GameSettingPage} from '../pages/GameSettingPage'
import {UserSettingPage} from '../pages'
import {TablePage} from '../pages/TablePage'

type TemplateLayoutProps = DivCommonProps & {}
export const TemplateLayout: FC<TemplateLayoutProps> = ({className, ...props}) => {
  const {pageState} = useTemplateStatesContext()

  const styleDiv: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
    width: '100vw'
  }

  return (
    <div className={`TEMPLATE ${className || ''}`} style={styleDiv} {...props}>
      <SideBarWithBtn />
      {pageState === 'gameSetting' && <GameSettingPage />}
      {pageState === 'userSetting' && <UserSettingPage />}
      {pageState === 'gameTable' && <TablePage />}
    </div>
  )
}
