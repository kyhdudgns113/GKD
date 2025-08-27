import {createContext, useCallback, useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import {get, putWithJwt} from '@server'
import {useDirectoryStatesContext} from '@context'
import {useFileStatesContext} from './__states'

import * as HTTP from '@httpType'
import * as U from '@util'
import * as ST from '@shareType'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {
  editFile: (fileOId: string, fileName: string, content: string) => void,
  loadFile: (fileOId: string) => void,
}
// prettier-ignore
export const FileCallbacksContext = createContext<ContextType>({
  editFile: () => {},
  loadFile: () => {}
})

export const useFileCallbacksContext = () => useContext(FileCallbacksContext)

export const FileCallbacksProvider: FC<PropsWithChildren> = ({children}) => {
  const {setDirectories, setFileRows} = useDirectoryStatesContext()
  const {setFile} = useFileStatesContext()

  const navigate = useNavigate()

  // AREA1: 공통 함수로도 쓰이는곳

  const setExtraDirs = useCallback(
    (extraDirs: ST.ExtraDirObjectType) => {
      /**
       * extraDirs 에 있는 정보를 이용하여 해당 directory 만 변경함
       */
      setDirectories(prev => {
        const newDirectories = {...prev}
        extraDirs.dirOIdsArr.forEach(dirOId => {
          newDirectories[dirOId] = extraDirs.directories[dirOId]
        })
        return newDirectories
      })
    },
    [setDirectories]
  )

  const setExtraFileRows = useCallback(
    (extraFileRows: ST.ExtraFileRowObjectType) => {
      /**
       * extraFileRows 에 있는 정보를 이용하여 해당 fileRow 만 변경함
       */
      setFileRows(prev => {
        const newFileRows = {...prev}
        extraFileRows.fileOIdsArr.forEach(fileOId => {
          newFileRows[fileOId] = extraFileRows.fileRows[fileOId]
        })
        return newFileRows
      })
    },
    [setFileRows]
  )

  // AREA2: 외부 사용 함수: http 요청

  const editFile = useCallback(
    (fileOId: string, fileName: string, content: string) => {
      const url = `/client/file/editFile`
      const data: HTTP.EditFileType = {fileOId, fileName, content}

      putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, statusCode, gkdErrMsg, message, jwtFromServer} = res

          if (ok) {
            const {extraDirs, extraFileRows} = body
            setExtraDirs(extraDirs)
            setExtraFileRows(extraFileRows)
            U.writeJwtFromServer(jwtFromServer)
            alert(`파일 수정이 완료되었습니다`)
          } // ::
          else {
            U.alertErrMsg(url, statusCode, gkdErrMsg, message)
          }
        })
        .catch(errObj => {
          U.alertErrors(url, errObj)
        })
    },
    [setExtraDirs, setExtraFileRows]
  )

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
    editFile,
    loadFile
  }
  return <FileCallbacksContext.Provider value={value}>{children}</FileCallbacksContext.Provider>
}
