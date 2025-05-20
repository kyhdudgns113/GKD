import {createContext, FC, PropsWithChildren, useCallback, useContext} from 'react'
import {useUserSettingStatesContext} from './__states'
import {
  AddPokerUserDataType,
  alertErrors,
  del,
  post,
  put,
  SavePokerUserArrDataType
} from '../../../common'
import {useTemplateCallbacksContext} from '../../../template/_context'

// prettier-ignore
type ContextType = {
  decBankrollWithDebts: (userIdx: number, pUOId: string) => void,
  incBankrollWithDebts: (userIdx: number, pUOId: string) => void,

  onClickAdd: (name: string) => void,
  onClickDelete: (pUOId: string) => void,
  onClickLoad: () => void,
  onClickSave: () => void,
}
// prettier-ignore
export const UserSettingCallbacksContext = createContext<ContextType>({
  decBankrollWithDebts: () => {},
  incBankrollWithDebts: () => {},

  onClickAdd: () => {},
  onClickDelete: () => {},
  onClickLoad: () => {},
  onClickSave: () => {}
})

export const useUserSettingCallbacksContext = () => useContext(UserSettingCallbacksContext)

export const UserSettingCallbacks: FC<PropsWithChildren> = ({children}) => {
  const {onClickLoad} = useTemplateCallbacksContext()

  // prettier-ignore
  const {
    setPokerUsers, 
    pokerUsersArr, setPokerUsersArr
  } = useUserSettingStatesContext()

  const decBankrollWithDebts = useCallback(
    (userIdx: number, pUOId: string) => {
      setPokerUsers(prev => {
        const newPrev = {...prev}
        const {bankroll, debts} = newPrev[pUOId]
        const delta = Math.min(100, bankroll, debts)
        newPrev[pUOId].bankroll -= delta
        newPrev[pUOId].debts -= delta
        return newPrev
      })
      setPokerUsersArr(prev => {
        const newPrev = [...prev]
        const {bankroll, debts} = newPrev[userIdx]
        const delta = Math.min(100, bankroll, debts)
        newPrev[userIdx].bankroll -= delta
        newPrev[userIdx].debts -= delta
        return newPrev
      })
    },
    [setPokerUsers, setPokerUsersArr]
  )
  const incBankrollWithDebts = useCallback(
    (userIdx: number, pUOId: string) => {
      setPokerUsers(prev => {
        const newPrev = {...prev}
        newPrev[pUOId].bankroll += 100
        newPrev[pUOId].debts += 100
        return newPrev
      })
      setPokerUsersArr(prev => {
        const newPrev = [...prev]
        newPrev[userIdx].bankroll += 100
        newPrev[userIdx].debts += 100
        return newPrev
      })
    },
    [setPokerUsers, setPokerUsersArr]
  )

  const onClickAdd = useCallback(
    (name: string) => {
      const url = '/poker/addPokerUser'
      const data: AddPokerUserDataType = {name}
      post(url, data, '')
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj} = res
          if (ok) {
            setPokerUsers(body.pokerUsers)
            setPokerUsersArr(body.pokerUsersArr)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(url + ' ELSE', errObj)
          }
        })
        .catch(errObj => alertErrors(url + ' CATCH', errObj))
    },
    [setPokerUsers, setPokerUsersArr]
  )
  const onClickDelete = useCallback(
    (pUOId: string) => {
      const url = `/poker/deletePokerUser/${pUOId}`
      del(url, '')
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj} = res
          if (ok) {
            setPokerUsers(body.pokerUsers)
            setPokerUsersArr(body.pokerUsersArr)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(url + ' ELSE', errObj)
          }
        })
        .catch(errObj => alertErrors(url + ' CATCH', errObj))
    },
    [setPokerUsers, setPokerUsersArr]
  )
  const onClickSave = useCallback(() => {
    const _pokerUsersArr = [...pokerUsersArr]
    _pokerUsersArr.forEach(user => {
      user.bankroll += user.chips || 0
      user.chips = 0
    })
    const url = `/poker/savePokerUsersArr`
    const data: SavePokerUserArrDataType = {pokerUsersArr: _pokerUsersArr}
    put(url, data, '')
      .then(res => res.json())
      .then(res => {
        const {ok, errObj} = res
        if (ok) {
          alert(`유저정보 ${pokerUsersArr.length}개가 저장되었어요`)
        } // BLANK LINE COMMENT:
        else {
          alertErrors(url + ` ELSE`, errObj)
        }
      })
      .catch(errObj => alertErrors(url + ` ELSE`, errObj))
  }, [pokerUsersArr])

  // prettier-ignore
  const value = {
    decBankrollWithDebts,
    incBankrollWithDebts,

    onClickAdd,
    onClickDelete,
    onClickLoad,
    onClickSave
  }
  return (
    <UserSettingCallbacksContext.Provider value={value}>
      {children}
    </UserSettingCallbacksContext.Provider>
  )
}
