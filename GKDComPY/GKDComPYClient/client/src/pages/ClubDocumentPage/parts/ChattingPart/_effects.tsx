import {FC, PropsWithChildren, useContext, useEffect} from 'react'
import {createContext} from 'react'
import {useChattingPartStatesContext} from './__states'
import {useTemplateStatesContext} from '../../../../template/_contexts'
import {useAuthContext, useSocketContext} from '../../../../contexts'
import {alertErrors, writeJwtFromServer} from '../../../../common/utils'
import {getWithJwt} from '../../../../common/server'
import {ChatType} from '../../../../common/typesAndValues/shareTypes'
import {ClubChatType} from '../../../../common/typesAndValues/socketTypes'
// prettier-ignore
type ContextType = {}
// prettier-ignore
export const ChattingPartEffectsContext = createContext<ContextType>({})

export const useChattingPartEffectsContext = () => useContext(ChattingPartEffectsContext)

export const ChattingPartEffects: FC<PropsWithChildren> = ({children}) => {
  const {id, uOId} = useAuthContext()
  const {emitChatSocket, initChatSocket, onChatSocket, resetChatSocket} = useSocketContext()
  const {clubsArr, selectedClubIdx: clubIdx, setClubsArr} = useTemplateStatesContext()

  // prettier-ignore
  const  {
    chatInput, setChatInput,
    chatsArr, setChatsArr,
    chatsQueue, setChatsQueue,
    goToBot, setGoToBot,
    isLoaded, setIsLoaded,
    submit, setSubmit,
    chatDivRef,
  } = useChattingPartStatesContext()

  // 이걸 해야 회의록 클릭시 새로운 채팅을 읽어온다.
  useEffect(() => {
    setIsLoaded(false)
  }, [clubIdx, setIsLoaded])
  // Get chatsArr
  useEffect(() => {
    if (clubsArr.length > 0 && clubIdx !== null && !isLoaded) {
      /**
       * 클럽에 아직 채팅방이 없을 수 있다 \
       * 따라서 chatRoomOId 가 아닌 clubOId 를 넘겨준다
       */
      const {clubOId} = clubsArr[clubIdx]
      const url = `/client/chat/getChatsArr/${clubOId}/-1`
      getWithJwt(url)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setChatsArr(body.chatsArr)
            setClubsArr(body.clubsArr)
            writeJwtFromServer(jwtFromServer)
            setIsLoaded(true)
            setGoToBot(true)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(`${url} ELSE`, errObj)
          }
        })
        .catch(errObj => alertErrors(`${url} CATCH`, errObj))
    }
  }, [clubIdx, clubsArr, isLoaded, setChatsArr, setClubsArr, setGoToBot, setIsLoaded])
  // Init chatSocket
  useEffect(() => {
    /**
     * 여기서 on 설정하면 안된다 \
     * - chatSocket 이 있을때만 on 이 설정된다 \
     * - init 에서 setter 가 아직 실행되지 않았다 \
     * - 그래서 on 이 설정이 안된다 \
     * - setter 가 실행되고 on 이 실행되기전에 reset 이 실행된다 \
     * - 그러면 다시 chatSocket 이 null 이 된다 \
     * - chatSocket 이 null 이 되었기 때문에 이 useEffect 가 실행된다 \
     * - 무한루프가 된다
     */
    if (clubsArr.length > 0 && clubIdx && uOId) {
      const {chatRoomOId} = clubsArr[clubIdx]
      initChatSocket(uOId, chatRoomOId)
    }
    return () => {
      resetChatSocket()
    }
  }, [clubIdx, clubsArr, uOId, initChatSocket, resetChatSocket])
  // Set socket on listener
  useEffect(() => {
    onChatSocket('club chat', (payload: ChatType) => {
      setChatsQueue(prev => [...prev, payload])
    })
    // return () => {
    //   offChatSocket('club chat')
    // }
  }, [onChatSocket, setChatsQueue])
  // Move chat from Queue to arr
  useEffect(() => {
    if (chatDivRef?.current !== null && isLoaded && chatsQueue.length > 0) {
      setChatsArr(prev => [...prev, ...chatsQueue])
      setChatsQueue([])

      const {clientHeight, scrollTop, scrollHeight} = chatDivRef!.current
      if (scrollTop + clientHeight >= scrollHeight) {
        setGoToBot(true)
      }
    }
  }, [chatDivRef, chatsQueue, isLoaded, setChatsArr, setChatsQueue, setGoToBot])
  // Send chat message
  useEffect(() => {
    if (clubsArr.length && clubIdx && uOId) {
      const {clubOId, chatRoomOId} = clubsArr[clubIdx]
      if (isLoaded && chatInput && submit) {
        const ev = 'club chat'
        const payload: ClubChatType = {id, uOId, clubOId, chatRoomOId, chatInput}
        emitChatSocket(ev, payload)
        setSubmit(false)
        setChatInput('')
      }
    }
  }, [
    chatInput,
    clubIdx,
    clubsArr,
    id,
    isLoaded,
    submit,
    uOId,
    emitChatSocket,
    setChatInput,
    setSubmit
  ])
  // Set chat scroll bottom
  useEffect(() => {
    if (chatDivRef?.current && goToBot) {
      const {scrollTop, clientHeight, scrollHeight} = chatDivRef.current

      if (scrollTop + clientHeight < scrollHeight) {
        setGoToBot(false)
        chatDivRef.current.scrollTop = scrollHeight
      }
    }
  }, [chatDivRef, chatsArr, goToBot, setGoToBot])
  // prettier-ignore
  const value = {}
  return (
    <ChattingPartEffectsContext.Provider value={value}>
      {children}
    </ChattingPartEffectsContext.Provider>
  )
}
