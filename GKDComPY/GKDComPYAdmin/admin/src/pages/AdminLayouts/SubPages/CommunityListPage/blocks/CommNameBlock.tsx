import {ChangeEvent, CSSProperties, FC, FocusEvent, useCallback, useEffect, useState} from 'react'
import {DivCommonProps} from '../../../../../common'
import {Input, Text3XL} from '../../../../../common/components'
import {CommunityInfoType} from '../../../../../common/shareTypes'
import {useCommunityListContext} from '../CommunityListPage'

type CommNameBlockProps = DivCommonProps & {
  community: CommunityInfoType
}
export const CommNameBlock: FC<CommNameBlockProps> = ({
  community,
  // BLANK LINE COMMENT:
  className,
  ...props
}) => {
  const {commOId, comms, changeCommunityName} = useCommunityListContext()

  const [isNameChanged, setIsNameChanged] = useState<boolean>(false)
  const [nameVal, setNameVal] = useState<string>('')

  const cnInputName = 'text-xl ml-4 rounded-xl'
  const styleInputName: CSSProperties = {
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',

    width: '12rem'
  }

  const onBlurName = useCallback(
    (isNameChanged: boolean, community: CommunityInfoType) => (e: FocusEvent<HTMLInputElement>) => {
      if (!e.currentTarget.value || e.currentTarget.value === community.name) {
        setNameVal(community.name)
        setIsNameChanged(false)
        return
      }

      if (isNameChanged) {
        changeCommunityName(community.commOId, e.currentTarget.value)
      }

      setIsNameChanged(false)
    },
    [changeCommunityName]
  )
  const onChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNameVal(e.currentTarget.value)
    setIsNameChanged(true)
  }, [])

  // Set community & nameVal
  useEffect(() => {
    if (comms[commOId]) {
      setNameVal(comms[commOId].name)
    } // BLANK LINE COMMENT:
    else {
      setNameVal('')
    }
  }, [commOId, comms])

  return (
    <div className={`flex flex-row ${className}`} {...props}>
      <Text3XL className="select-none">공동체명 </Text3XL>
      <Input
        className={`${cnInputName}`}
        onBlur={onBlurName(isNameChanged, community)}
        onChange={onChangeName}
        style={styleInputName}
        value={nameVal}
      />
    </div>
  )
}
