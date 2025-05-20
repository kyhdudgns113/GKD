import {createContext, FC, PropsWithChildren, useContext, useState} from 'react'
import {Setter} from '../../common'

// prettier-ignore
type ContextType = {
  seatUserIdxsArr: number[], setSeatUserIdxsArr: Setter<number[]>
}
// prettier-ignore
export const TemplateTableStatesContext = createContext<ContextType>({
  seatUserIdxsArr: [], setSeatUserIdxsArr: () => {}
})

export const useTemplateTableStatesContext = () => useContext(TemplateTableStatesContext)

export const TemplateTableStates: FC<PropsWithChildren> = ({children}) => {
  const [seatUserIdxsArr, setSeatUserIdxsArr] = useState<number[]>([
    -1, -1, -1, -1, -1, -1, -1, -1, -1
  ])

  // prettier-ignore
  const value = {
    seatUserIdxsArr, setSeatUserIdxsArr
  }
  return (
    <TemplateTableStatesContext.Provider value={value}>
      {children}
    </TemplateTableStatesContext.Provider>
  )
}
