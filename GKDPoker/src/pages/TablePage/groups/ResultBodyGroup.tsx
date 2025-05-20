import {CSSProperties, FC} from 'react'
import {DivCommonProps, USER_FOLD} from '../../../common'
import {useTablePageStatesContext} from '../_context'

type ResultBodyGroupProps = DivCommonProps & {}
export const ResultBodyGroup: FC<ResultBodyGroupProps> = ({className, ...props}) => {
  const {pokerUsersArr, seatUserIdxsArr} = useTablePageStatesContext()

  const styleGroup: CSSProperties = {
    alignItems: 'center',
    borderColor: '#404844',
    borderLeftWidth: '4px',
    borderRightWidth: '4px',
    borderBottomWidth: '4px',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    height: '240px',

    overflowY: 'scroll',
    width: 'fit-content'
  }
  const styleRow: CSSProperties = {
    alignItems: 'center',
    borderColor: '#404844',
    borderBottomWidth: '2px',
    borderTopWidth: '2px',
    display: 'flex',
    flexDirection: 'row',
    flexShrink: 0,
    height: '40px',
    width: 'fit-content'
  }
  const styleText: CSSProperties = {
    alignContent: 'center',
    borderColor: '#404844',
    fontSize: '16px',
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
  const styleResult: CSSProperties = {
    ...styleText,
    borderRightWidth: '4px',
    width: '64px'
  }
  const styleEmpty: CSSProperties = {
    ...styleText,
    borderRightWidth: '4px',
    width: '312px'
  }

  return (
    <div className={`RESULT_BODY_GROUP ${className || ''}`} style={styleGroup} {...props}>
      {seatUserIdxsArr.filter(userIdx => userIdx !== -1).length === 0 && (
        <p style={styleEmpty}>게임 참여자가 없습니다.</p>
      )}
      {seatUserIdxsArr.map((userIdx, seatIdx) => {
        if (userIdx === -1) return null

        const pokerUser = pokerUsersArr[userIdx]
        const totalBet = pokerUser.totalBet || 0
        const resultGain = pokerUser.resultGain || 0
        const backgroundColor = pokerUser.userStatus === USER_FOLD ? '#888888' : '#FFFFFF'
        return (
          <div key={seatIdx} style={{...styleRow, backgroundColor}}>
            <p style={styleName}>{pokerUser.name}</p>
            <p style={styleBet}>{totalBet}</p>
            <p style={styleGet}>{resultGain}</p>
            <p style={styleResult}>{totalBet + resultGain}</p>
          </div>
        )
      })}
    </div>
  )
}
