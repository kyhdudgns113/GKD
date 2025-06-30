import {createContext, useContext, useState} from 'react'

import {NULL_FILE} from '@nullValue'

import type {FC, PropsWithChildren} from 'react'

import type {Setter} from '@commons/typesAndValues'
import type {FileType} from '@shareType'

// prettier-ignore
type ContextType = {
  file: FileType, setFile: Setter<FileType>
}
// prettier-ignore
export const DefaultPageStatesContext = createContext<ContextType>({
  file: NULL_FILE, setFile: () => {}
})

export const useDefaultPageStatesContext = () => useContext(DefaultPageStatesContext)

export const DefaultPageStatesProvider: FC<PropsWithChildren> = ({children}) => {
  const [file, setFile] = useState<FileType>(NULL_FILE)

  // prettier-ignore
  const value: ContextType = {
    file, setFile
  }

  return <DefaultPageStatesContext.Provider value={value}>{children}</DefaultPageStatesContext.Provider>
}
