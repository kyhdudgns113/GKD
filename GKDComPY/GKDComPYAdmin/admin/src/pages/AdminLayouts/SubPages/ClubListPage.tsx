import type {FC} from 'react'
import {createContext, useContext, useEffect} from 'react'
import {DivCommonProps} from '../../../common'
import {useAdminContext} from '../AdminLayout'
import {Text3XL} from '../../../common/components'

// prettier-ignore
type ContextType = {
   
}
// prettier-ignore
const ClubListContext = createContext<ContextType>({
  
})
export const useClubListContext = () => {
  return useContext(ClubListContext)
}
export const ClubListPage: FC<DivCommonProps> = ({className, ...props}) => {
  const {setWhichList} = useAdminContext()

  useEffect(() => {
    setWhichList('club')
  }, [setWhichList])

  // prettier-ignore
  const value = {
    
  }
  return (
    <ClubListContext.Provider
      value={value}
      children={
        <div className={` ${className}`} {...props}>
          <Text3XL>ClubList 페이지를 구성해주세요.</Text3XL>
        </div>
      }
    />
  )
}
