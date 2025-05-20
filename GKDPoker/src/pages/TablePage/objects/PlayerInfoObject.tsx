import {CSSProperties, FC, useEffect, useState} from 'react'
import {DivCommonProps} from '../../../common'
import {Card} from '../addons'
import {useTablePageStatesContext} from '../_context'

type PlayerInfoObjectProps = DivCommonProps & {height?: string}
export const PlayerInfoObject: FC<PlayerInfoObjectProps> = ({height, className, ...props}) => {
  const {pokerUsersArr, seatIdx, seatUserIdxsArr} = useTablePageStatesContext()

  const [userChips, setUserChips] = useState<string>('')
  const [userName, setUserName] = useState<string>('')

  const styleObject: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    height: height || '380px',
    paddingTop: '48px',
    width: '100%'
  }
  const styleRow: CSSProperties = {
    backgroundColor: '#CCCCCC',
    borderColor: '#404844',
    borderLeftWidth: '4px',
    borderRightWidth: '4px',
    borderTopWidth: '4px',
    display: 'flex',
    flexDirection: 'row',
    fontSize: '24px',
    fontWeight: 700,
    width: '240px'
  }
  const styleTitle: CSSProperties = {
    borderColor: '#404844',
    borderRightWidth: '4px',
    textAlign: 'center',
    width: '90px'
  }
  const styleValue: CSSProperties = {
    textAlign: 'center',
    width: '150px'
  }
  const styleCardRow: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
    marginTop: '24px'
  }

  // Set userChips, userName
  useEffect(() => {
    if (seatIdx === -1) {
      setUserName('seatIdx=-1')
      setUserChips('seatIdx=-1')
    } // BLANK LINE COMMENT:
    else {
      const userIdx = seatUserIdxsArr[seatIdx]
      if (userIdx === -1) {
        setUserName(`${seatIdx}:userIdx=-1`)
        setUserChips(`${seatIdx}:userIdx=-1`)
      } // BLANK LINE COMMENT:
      else {
        const user = pokerUsersArr[userIdx]
        setUserName(user.name)
        setUserChips((user.chips || 0).toString())
      }
    }
  }, [seatIdx, seatUserIdxsArr, pokerUsersArr])

  return (
    <div className={`PLAYER_INFO_OBJECT ${className || ''}`} style={styleObject} {...props}>
      <div className="ROW_NAME " style={styleRow}>
        <p style={styleTitle}>Name</p>
        <p style={styleValue}>{userName}</p>
      </div>
      <div className="ROW_CHIPS " style={{...styleRow, borderBottomWidth: '4px'}}>
        <p style={styleTitle}>Chips</p>
        <p style={styleValue}>{userChips}</p>
      </div>
      <div style={styleCardRow}>
        <Card cardIdx={2 * seatIdx} isShow={true} isBig={true} />
        <Card cardIdx={2 * seatIdx + 1} isShow={true} isBig={true} />
      </div>
    </div>
  )
}
