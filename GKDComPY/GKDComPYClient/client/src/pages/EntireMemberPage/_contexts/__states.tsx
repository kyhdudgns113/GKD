import {createContext, useContext, useState} from 'react'
import {EMemberType} from '../../../common/typesAndValues/shareTypes'
import {Setter} from '../../../common'

// prettier-ignore
type ContextType = {
  dragColIdx: number | null, setDragColIdx: Setter<number | null>,
  dragRowIdx: number | null, setDragRowIdx: Setter<number | null>,
  eMembersMatrix: EMemberType[][], setEMembersMatrix: Setter<EMemberType[][]>,
}
// prettier-ignore
export const EntireMemberStatesContext = createContext<ContextType>({
  dragColIdx: null, setDragColIdx: () => {},
  dragRowIdx: null, setDragRowIdx: () => {},
  eMembersMatrix: [], setEMembersMatrix: () => {},
})

export const useEntireMemberStatesContext = () => useContext(EntireMemberStatesContext)

export function EntireMemberStates({children}: {children: React.ReactNode}) {
  const [eMembersMatrix, setEMembersMatrix] = useState<EMemberType[][]>([])
  const [dragColIdx, setDragColIdx] = useState<number | null>(null)
  const [dragRowIdx, setDragRowIdx] = useState<number | null>(null)

  // prettier-ignore
  const value = {
    dragColIdx, setDragColIdx,
    dragRowIdx, setDragRowIdx,
    eMembersMatrix, setEMembersMatrix,
  }
  return (
    <EntireMemberStatesContext.Provider value={value}>
      {children}
    </EntireMemberStatesContext.Provider>
  )
}
