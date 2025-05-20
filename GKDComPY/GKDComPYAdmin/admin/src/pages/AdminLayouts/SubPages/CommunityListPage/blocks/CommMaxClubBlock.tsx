import {ChangeEvent, CSSProperties, FC, useCallback, useEffect, useState} from 'react'
import {DivCommonProps} from '../../../../../common'
import {CommunityInfoType} from '../../../../../common/shareTypes'
import {Input, TextXL} from '../../../../../common/components'
import {useCommunityListContext} from '../CommunityListPage'

type CommMaxClubBlockProps = DivCommonProps & {
  community: CommunityInfoType
}

export const CommMaxClubBlock: FC<CommMaxClubBlockProps> = ({community, className, ...props}) => {
  const {setCommMaxClubs} = useCommunityListContext()

  const [inputVal, setInputVal] = useState<number>(0)

  const styleInput: CSSProperties = {
      borderRadius: '8px',
      marginLeft: '8px',
      paddingLeft: '4px',
      width: '5rem'
    }

  const onBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const maxClubs = e.currentTarget.valueAsNumber || 0
      if (maxClubs !== community.maxUsers) {
        setCommMaxClubs(community.commOId, maxClubs)
      }
    },
    [community, setCommMaxClubs]
  )

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.currentTarget.valueAsNumber || 0)
  }, [])

  // Init InputVal
  useEffect(() => {
    setInputVal(community.maxClubs)
  }, [community])

  return (
    <div className={`flex flex-row ${className}`}>
      <TextXL>최대 클럽 수 </TextXL>
      <Input
        onBlur={onBlur}
        onChange={onChange}
        style={styleInput}
        type="number"
        value={inputVal}
      />
    </div>
  )
}
