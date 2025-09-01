import {createContext, useContext, useEffect} from 'react'
import {useFileCallbacksContext} from './_callbacks'
import {useFileStatesContext} from './__states'

import type {FC, PropsWithChildren} from 'react'
import {NULL_FILE} from '@nullValue'

// prettier-ignore
type ContextType = {}
// prettier-ignore
export const FileEffectsContext = createContext<ContextType>({})

export const useFileEffectsContext = () => useContext(FileEffectsContext)

export const FileEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  const {commentOId_reply, file, fileOId, setCommentReplyArr, setContent, setFile, setFileName, setReplyContent} = useFileStatesContext()
  const {loadComments, loadFile} = useFileCallbacksContext()

  // 초기화: file 및 commentArr
  useEffect(() => {
    if (fileOId) {
      loadFile(fileOId)
      loadComments(fileOId)
    } // ::
    else {
      setFile(NULL_FILE)
      setCommentReplyArr([])
    }
  }, [fileOId]) // eslint-disable-line react-hooks/exhaustive-deps

  // 초기화: file 다른걸로 변경시
  useEffect(() => {
    if (fileOId) {
      const {fileName, content} = file
      setFileName(fileName)
      setContent(content)
    } // ::
    else {
      setFile(NULL_FILE)
    }

    setReplyContent('')
  }, [file, fileOId]) // eslint-disable-line react-hooks/exhaustive-deps

  //초기화: replyContent(선택 댓글, 대댓글, 파일 바뀔때)
  useEffect(() => {
    setReplyContent('')
  }, [commentOId_reply, fileOId]) // eslint-disable-line react-hooks/exhaustive-deps

  return <FileEffectsContext.Provider value={{}}>{children}</FileEffectsContext.Provider>
}
