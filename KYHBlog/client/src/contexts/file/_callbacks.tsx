import {createContext, useCallback, useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import {get} from '@server'
import {useFileStatesContext} from './__states'

import * as U from '@util'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {
  loadFile: (fileOId: string) => void
}
// prettier-ignore
export const FileCallbacksContext = createContext<ContextType>({
  loadFile: () => {}
})

export const useFileCallbacksContext = () => useContext(FileCallbacksContext)

export const FileCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {setFile} = useFileStatesContext()

  const navigate = useNavigate()

  const loadFile = useCallback(
    (fileOId: string) => {
      const url = `/client/file/loadFile/${fileOId}`
      const NULL_JWT = ''

      get(url, NULL_JWT)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message} = res

          if (ok) {
            setFile(body.file)
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
            navigate(-1)
          }
        })
        .catch(errObj => {
          U.alertErrors(url, errObj)
          navigate(-1)
        })
    },
    [navigate, setFile]
  )

  // prettier-ignore
  const value: ContextType = {
    loadFile
  }
  return <FileCallbacksContext.Provider value={value}>{children}</FileCallbacksContext.Provider>
}
