import {CSSProperties, FC, useCallback} from 'react'
import {DivCommonProps} from '../../../common'
import {useUserSettingCallbacksContext, useUserSettingStatesContext} from '../_context'

type BodyGroupProps = DivCommonProps & {}
export const BodyGroup: FC<BodyGroupProps> = ({className, ...props}) => {
  const {pokerUsersArr} = useUserSettingStatesContext()
  const {decBankrollWithDebts, incBankrollWithDebts} = useUserSettingCallbacksContext()
  const {onClickDelete} = useUserSettingCallbacksContext()

  const styleGroup: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    height: '282px',
    overflowY: 'scroll',
    textAlign: 'center',
    width: '100%'
  }
  const stylePadding: CSSProperties = {
    backgroundColor: '#404844',
    borderColor: '#404844',
    borderBottomWidth: '4px',
    height: '16px',
    width: '100%'
  }
  const styleRow: CSSProperties = {
    alignItems: 'center',
    borderColor: '#404844',
    borderBottomWidth: '4px',
    display: 'flex',
    flexDirection: 'row',
    flexShrink: 0,
    height: '36px',
    width: '100%'
  }
  const styleText: CSSProperties = {
    alignContent: 'center',
    borderColor: '#404844',
    fontSize: '18px',
    fontWeight: 700,
    height: '100%'
  }
  const styleName: CSSProperties = {
    ...styleText,
    borderRightWidth: '4px',
    width: '120px'
  }
  const styleChips: CSSProperties = {
    ...styleText,
    borderRightWidth: '4px',
    width: '58px'
  }
  const styleDelete: CSSProperties = {
    ...styleText,
    width: '48px'
  }

  const onClickMinus = useCallback(
    (userIdx: number, pUOId: string) => () => {
      decBankrollWithDebts(userIdx, pUOId)
    },
    [decBankrollWithDebts]
  )
  const onClickPlus = useCallback(
    (userIdx: number, pUOId: string) => () => {
      incBankrollWithDebts(userIdx, pUOId)
    },
    [incBankrollWithDebts]
  )

  const onClickDel = useCallback(
    (pUOId: string) => () => {
      onClickDelete(pUOId)
    },
    [onClickDelete]
  )
  return (
    <div className={`BODY_GROUP ${className || ''}`} style={styleGroup} {...props}>
      <style>
        {`
          .BTN_TEXT {
            cursor: pointer;
          }
          .BTN_TEXT:hover {
            background-color: #E0E8E4;
          }
        `}
      </style>
      <div style={stylePadding} />
      {pokerUsersArr.map((pokerUser, userIdx) => {
        const {pUOId} = pokerUser
        return (
          <div key={userIdx} style={styleRow}>
            <p style={styleName}>{pokerUser.name}</p>
            <p style={styleChips}>{pokerUser.bankroll + (pokerUser.chips || 0)}</p>
            <p style={styleChips}>{pokerUser.debts}</p>
            <p className="BTN_TEXT " onClick={onClickPlus(userIdx, pUOId)} style={styleChips}>
              +
            </p>
            <p className="BTN_TEXT " onClick={onClickMinus(userIdx, pUOId)} style={styleChips}>
              -
            </p>
            <p className="BTN_TEXT " onClick={onClickDel(pUOId)} style={styleDelete}>
              X
            </p>
          </div>
        )
      })}
      <div style={{...stylePadding, marginBottom: '0px', marginTop: 'auto'}} />
    </div>
  )
}
