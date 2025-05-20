import {CSSProperties, FC, useCallback, useEffect, useState} from 'react'
import {DivCommonProps, STATE_INIT} from '../../common'
import {useTemplateStatesContext} from '../_context'

type UserSettingRowProps = DivCommonProps & {}
export const UserSettingRow: FC<UserSettingRowProps> = ({className, ...props}) => {
  const {gameState, setPageState} = useTemplateStatesContext()

  const [isHover, setIsHover] = useState<boolean>(false)

  const styleRow: CSSProperties = {
    backgroundColor: isHover ? '#DDDDDD' : 'transparent',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',

    marginBottom: '16px',
    paddingBottom: '8px',
    paddingLeft: '16px',
    paddingTop: '8px'
  }

  const onClick = useCallback(() => {
    if (gameState === STATE_INIT) {
      setPageState('userSetting')
    }
  }, [gameState, setPageState])
  const onMouseEnter = useCallback(() => {
    setIsHover(true)
  }, [])
  const onMouseLeave = useCallback(() => {
    setIsHover(false)
  }, [])

  // Init states
  useEffect(() => {
    setIsHover(false)
  }, [])

  return (
    <div
      className={`ROW_SETTING ${className || ''}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={styleRow}
      {...props} // BLANK LINE COMMENT:
    >
      <p>유저 설정</p>
    </div>
  )
}
