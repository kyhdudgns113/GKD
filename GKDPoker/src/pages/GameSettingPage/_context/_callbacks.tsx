import {ChangeEvent, createContext, FC, PropsWithChildren, useCallback, useContext} from 'react'
import {useGameSettingStatesContext} from './__states'
import {alertErrors, get, put, SaveSettingDataType} from '../../../common'

// prettier-ignore
type ContextType = {
  onBlurBB: (e: ChangeEvent<HTMLInputElement>) => void,
  onBlurRebuy: (e: ChangeEvent<HTMLInputElement>) => void,
  onBlurSB: (e: ChangeEvent<HTMLInputElement>) => void,

  onClickLoad: () => void,
  onClickSave: () => void,
}
// prettier-ignore
export const GameSettingCallbacksContext = createContext<ContextType>({
  onBlurBB: () => {},
  onBlurRebuy: () => {},
  onBlurSB: () => {},

  onClickLoad: () => {},
  onClickSave: () => {}
})

export const useGameSettingCallbacksContext = () => useContext(GameSettingCallbacksContext)

export const GameSettingCallbacks: FC<PropsWithChildren> = ({children}) => {
  // prettier-ignore
  const {
    bigBlind, setBigBlind,
    rebuy, setRebuy,
    smallBlind, setSmallBlind
  } = useGameSettingStatesContext()

  const onBlurBB = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const bigBlind = e.currentTarget.valueAsNumber

      if (rebuy <= 10 * bigBlind) {
        setRebuy(10 * bigBlind)
      }

      if (smallBlind > bigBlind) {
        setSmallBlind(bigBlind)
      }
    },
    [rebuy, setRebuy, smallBlind, setSmallBlind]
  )
  const onBlurRebuy = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const rebuy = e.currentTarget.valueAsNumber

      if (rebuy < bigBlind) {
        setBigBlind(Math.floor(rebuy / 10))
      }
      if (rebuy < smallBlind) {
        setSmallBlind(Math.floor(rebuy / 10))
      }
    },
    [bigBlind, setBigBlind, smallBlind, setSmallBlind]
  )
  const onBlurSB = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const smallBlind = e.currentTarget.valueAsNumber

      if (smallBlind > bigBlind) {
        setBigBlind(smallBlind)
      }
      if (smallBlind > rebuy) {
        setRebuy(10 * smallBlind)
      }
    },
    [bigBlind, setBigBlind, rebuy, setRebuy]
  )

  const onClickLoad = useCallback(() => {
    const url = `/poker/loadGameSetting`
    get(url, '')
      .then(res => res.json())
      .then(res => {
        const {ok, body, errObj} = res
        if (ok) {
          const {bigBlind, rebuy, smallBlind} = body.setting
          alert(`로드가 완료되었어요: (${smallBlind}, ${bigBlind}, ${rebuy})`)
          setBigBlind(bigBlind)
          setRebuy(rebuy)
          setSmallBlind(smallBlind)
        } // BLANK LINE COMMENT:
        else {
          alertErrors(url + ` ELSE`, errObj)
        }
      })
      .catch(errObj => alertErrors(url + ` CATCH`, errObj))
  }, [setBigBlind, setRebuy, setSmallBlind])
  const onClickSave = useCallback(() => {
    const url = `/poker/updateGameSetting`
    const data: SaveSettingDataType = {bigBlind, rebuy, smallBlind}

    put(url, data, '')
      .then(res => res.json())
      .then(res => {
        const {ok, errObj} = res
        if (ok) {
          alert('저장이 완료되었어요.')
        } // BLANK LINE COMMENT:
        else {
          alertErrors(url + ' ELSE', errObj)
        }
      })
      .catch(errObj => alertErrors(url + ' CATCH', errObj))
  }, [bigBlind, rebuy, smallBlind])

  // prettier-ignore
  const value = {
    onBlurBB,
    onBlurRebuy,
    onBlurSB,

    onClickLoad,
    onClickSave
  }
  return (
    <GameSettingCallbacksContext.Provider value={value}>
      {children}
    </GameSettingCallbacksContext.Provider>
  )
}
