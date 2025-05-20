import type {FC} from 'react'
import {createContext, useContext} from 'react'
import {DivCommonProps} from '../common'
import {Text3XL} from '../common/components'

// prettier-ignore
type ContextType = {
   
}
// prettier-ignore
const ___Context = createContext<ContextType>({
  
})
export const use___Context = () => {
  return useContext(___Context)
}

export const ___Page: FC<DivCommonProps> = ({className, ...props}) => {
  //

  // prettier-ignore
  const value = {
    
  }
  return (
    <___Context.Provider
      value={value}
      children={
        <div className={` ${className}`} {...props}>
          <Text3XL>Context 페이지를 구성해주세요.</Text3XL>
        </div>
      }
    />
  )
}
