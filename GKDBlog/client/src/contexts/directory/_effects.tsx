import {createContext, useContext, useEffect} from 'react'
import {get} from '@server'
import {alertErrors} from '@util'

import {useDirectoryStatesContext} from './__states'
import {useDirectoryCallbacksContext} from './_callbacks'

import type {FC, PropsWithChildren} from 'react'

// prettier-ignore
type ContextType = {

}
// prettier-ignore
export const DirectoryEffectsContext = createContext<ContextType>({
  
})

export const useDirectoryEffectsContext = () => useContext(DirectoryEffectsContext)
/**
 * Directory Context 에서 호출할 useEffect 들을 모아둠
 */
export const DirectoryEffectsProvider: FC<PropsWithChildren> = ({children}) => {
  const {setRootDirOId, setIsDirOpen, setIsDirOpenPosting, setParentOIdDir, setParentOIdFile} =
    useDirectoryStatesContext()
  const {setExtraDirs, setExtraFileRows} = useDirectoryCallbacksContext()

  // Load root directory
  useEffect(() => {
    const url = `/client/posting/getRootDirOId`
    const jwt = ''
    get(url, jwt)
      .then(res => res.json())
      .then(res => {
        const {ok, body, errObj} = res
        if (ok) {
          setExtraDirs(body.extraDirs)
          setExtraFileRows(body.extraFileRows)
          setRootDirOId(body.rootDirOId)
        } // ::
        else {
          alertErrors(url + ' ELSE', errObj)
        }
      })
      .catch(err => {
        alertErrors(url + ' CATCH', err)
      })
  }, [setExtraDirs, setExtraFileRows, setRootDirOId])

  // Init parentOIds
  useEffect(() => {
    setParentOIdDir('')
    setParentOIdFile('')
  }, [setParentOIdDir, setParentOIdFile])

  // Auto init isDirOpen & isDirOpenPosting
  useEffect(() => {
    setIsDirOpen({})
    setIsDirOpenPosting({})
  }, [setIsDirOpen, setIsDirOpenPosting])

  return <DirectoryEffectsContext.Provider value={{}}>{children}</DirectoryEffectsContext.Provider>
}
