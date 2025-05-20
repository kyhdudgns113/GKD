import {CSSProperties, FC, useCallback, useState} from 'react'
import {DivCommonProps, Icon} from '../../common'
import {GameSettingRow, UserSettingRow, TableRow} from '../rowGroup'

type SidebarProps = DivCommonProps & {}
export const SideBarWithBtn: FC<SidebarProps> = ({className, ...props}) => {
  const [isShow, setIsShow] = useState<boolean>(true)

  const styleSidebar: CSSProperties = {
    display: 'flex',

    flexDirection: 'row',
    height: '100%',
    position: 'fixed',
    zIndex: 10
  }
  const styleRowGroup: CSSProperties = {
    backgroundColor: '#CCCCCC',
    display: 'flex',
    flexDirection: 'column',
    height: '90%',
    marginBottom: 'auto',
    marginTop: 'auto',

    paddingTop: '32px',
    userSelect: 'none',
    width: '160px'
  }
  const styleBtn: CSSProperties = {
    alignItems: 'center',
    backgroundColor: '#CCCCCC',
    borderColor: '#404844',
    borderRadius: '24px',
    borderWidth: '4px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    height: '48px',

    left: '100%',
    marginLeft: '20px',
    justifyContent: 'center',

    position: 'absolute',
    top: '88%',
    userSelect: 'none',
    width: '48px'
  }

  const onClickBtn = useCallback(() => {
    setIsShow(prev => !prev)
  }, [])

  return (
    <div className={`SIDE_BAR_WITH_BTN ${className || ''}`} style={styleSidebar} {...props}>
      {isShow && (
        <div className="SIDE_BAR " style={styleRowGroup}>
          <GameSettingRow />
          <UserSettingRow />
          <TableRow />
        </div>
      )}

      <Icon iconName="add" onClick={onClickBtn} style={styleBtn} />
    </div>
  )
}
