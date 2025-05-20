import {FC, MouseEvent, useCallback} from 'react'
import {DivCommonProps} from '../../../common'
import {useNavigate} from 'react-router-dom'
import {useAdminContext} from '../AdminLayout'
import {IconFilled, Text3XL} from '../../../common/components'

export type CommunityListRowProps = DivCommonProps & {
  //
}
export const CommunityListRow: FC<CommunityListRowProps> = ({className, ...props}) => {
  const {whichList} = useAdminContext()

  const navigate = useNavigate()

  const onClickNavigate = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      navigate('/admin/communityList')
    },
    [navigate]
  )

  return (
    <div
      className={`cursor-pointer flex flex-row hover:bg-gkd-sakura-bg-70 pt-1 pb-2 ${className}`}
      onClick={onClickNavigate}
      {...props}>
      <Text3XL className="ml-4">Community</Text3XL>
      {whichList === 'community' && (
        <IconFilled className="text-3xl ml-auto mr-2" iconName="verified" />
      )}
    </div>
  )
}
