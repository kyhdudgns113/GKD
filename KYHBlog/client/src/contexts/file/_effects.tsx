import {createContext, useContext, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {useDirectoryCallbacksContext} from '@context'
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
  const {loadRootDirectory} = useDirectoryCallbacksContext()
  const {commentOId_reply, file, fileOId, setCommentReplyArr, setContent, setFile, setFileName, setReplyContent, setStringArr} =
    useFileStatesContext()
  const {loadComments, loadFile, loadNoticeFile} = useFileCallbacksContext()

  const location = useLocation()

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

  // 초기화: replyContent(선택 댓글, 대댓글, 파일 바뀔때)
  useEffect(() => {
    setReplyContent('')
  }, [commentOId_reply, fileOId]) // eslint-disable-line react-hooks/exhaustive-deps

  // 초기화: stringArr: file 바뀔때
  useEffect(() => {
    setStringArr(
      file.content?.split('\n').map(str => {
        if (!str) {
          return ''
        } // ::
        else if (str === '  ') {
          // return '  ' // 아무일도 일어나지 않음
          // return '' // 아무일도 일어나지 않음
          // return '&nbsp;' // 3줄 띄어짐
          // return '<span />' // 3줄 띄어짐
          // return '<p />' // 이후 리스트 이상하게 적용됨
          // return '   ' // 아무일도 안 일어남
          // return '\n' // 아무일도 안 일어남
          // return '\n\n' // 마크다운 밀림
          // return '  \n' // 아무일도 일어나지 않음?
          // return '  <br />' // 4칸 띄어짐
          // return '<br />' // 4칸 띄어짐
          // return ' ' // 아무일 X
          // return '<></>' // 이런것들 싹 다 그대로 출력됨.
          // return '<div />' // 마크다운 에러남
          // return '<b></b>' // 3줄 띄어짐
          return '  ' // 그냥 이거 쓰지 말자
        } // ::
        else if (str === '<br />') {
          return '  <br />'
        }
        return str
      })
    )
  }, [file]) // eslint-disable-line react-hooks/exhaustive-deps

  // 초기화: 공지파일 로딩
  useEffect(() => {
    // 주소창 /main 뒤에 아무것도 없으면 공지파일 로드
    if (!location.pathname.split('/main')[1]) {
      loadNoticeFile()
      loadRootDirectory()
    }
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  return <FileEffectsContext.Provider value={{}}>{children}</FileEffectsContext.Provider>
}
