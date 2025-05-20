import {
  createContext,
  useContext,
  FC,
  MutableRefObject,
  useRef,
  useState,
  PropsWithChildren
} from 'react'
import {Setter} from '../../../../common'
import {ChatType} from '../../../../common/typesAndValues/shareTypes'

// prettier-ignore
type ContextType = {
  chatInput: string, setChatInput: Setter<string>,
  chatsArr: ChatType[], setChatsArr: Setter<ChatType[]>,
  chatsQueue: ChatType[], setChatsQueue: Setter<ChatType[]>,
  goToBot: boolean, setGoToBot: Setter<boolean>,
  isLoaded: boolean, setIsLoaded: Setter<boolean>,
  submit: boolean, setSubmit: Setter<boolean>,

  chatDivRef: MutableRefObject<HTMLDivElement | null> | null,
}
// prettier-ignore
export const ChattingPartStatesContext = createContext<ContextType>({
  chatInput: '', setChatInput: () => {},
  chatsArr: [], setChatsArr: () => {},
  chatsQueue: [], setChatsQueue: () => {},
  goToBot: false, setGoToBot: () => {},
  isLoaded: false, setIsLoaded: () => {},
  submit: false, setSubmit: () => {},
  chatDivRef: null,
})

export const useChattingPartStatesContext = () => useContext(ChattingPartStatesContext)

export const ChattingPartStates: FC<PropsWithChildren> = ({children}) => {
  const [chatInput, setChatInput] = useState<string>('')
  const [chatsArr, setChatsArr] = useState<ChatType[]>([])
  const [chatsQueue, setChatsQueue] = useState<ChatType[]>([])
  const [goToBot, setGoToBot] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false) // eslint-disable-line
  const [submit, setSubmit] = useState<boolean>(false)

  const chatDivRef = useRef<HTMLDivElement | null>(null)

  // prettier-ignore
  const value = {
    chatInput, setChatInput,
    chatsArr, setChatsArr,
    chatsQueue, setChatsQueue,
    goToBot, setGoToBot,
    isLoaded, setIsLoaded,
    submit, setSubmit,
    chatDivRef,
  }
  return (
    <ChattingPartStatesContext.Provider value={value}>
      {children}
    </ChattingPartStatesContext.Provider>
  )
}
