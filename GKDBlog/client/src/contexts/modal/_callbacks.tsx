import {createContext, useCallback, useContext, type FC, type PropsWithChildren} from 'react'
import {useModalStatesContext} from './__states'
import {MODAL_NAMES_ARR} from '../../common/typesAndValues/values'
// prettier-ignore
type ContextType = {
  closeModal: () => void,
  openModal: (modalName: string) => void,
}
// prettier-ignore
export const ModalCallbacksContext = createContext<ContextType>({
  closeModal: () => {},
  openModal: () => {},
})

export const useModalCallbacksContext = () => useContext(ModalCallbacksContext)

export const ModalCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {setModalName} = useModalStatesContext()

  /**
   * 모달을 닫는 함수
   */
  const closeModal = useCallback(() => {
    setModalName('')
  }, [setModalName])

  /**
   * 모달을 여는 함수
   * @param modalName 모달 이름. MODAL_NAMES_ARR 안에 모달 이름이 있어야 정상작동.
   */
  const openModal = useCallback(
    (modalName: string) => {
      if (!MODAL_NAMES_ARR.includes(modalName)) {
        alert(`openModal 함수에 전달된 모달 이름이 유효하지 않습니다. modalName: ${modalName}`)
        return
      }
      setModalName(modalName)
    },
    [setModalName]
  )

  // prettier-ignore
  const value: ContextType = {
    closeModal,
    openModal,
  }
  return <ModalCallbacksContext.Provider value={value}>{children}</ModalCallbacksContext.Provider>
}
