import {FC} from 'react'
import {TableBodyCommonProps} from '../../../common'
import {EntireBodyRowAddon} from '../addons'
import {useCommMembersContext} from '../parts'

type EntireBodyBlockProps = TableBodyCommonProps & {}

export const EntireBodyBlock: FC<EntireBodyBlockProps> = ({className, ...props}) => {
  const {commMembersArr} = useCommMembersContext()

  return (
    <tbody className={className} {...props}>
      {commMembersArr.map((member, memIdx) => (
        <EntireBodyRowAddon key={`yes${memIdx}`} member={member} memIdx={memIdx} />
      ))}
    </tbody>
  )
}
