import {CSSProperties, FC, MouseEvent, useCallback, useState} from 'react'
import {SpanCommonProps} from '../../../../../common'
import {useCommunityListContext} from '../CommunityListPage'
import {Icon, IconFilled} from '../../../../../common/components'

type CommAddClubBlockProps = SpanCommonProps & {}
export const CommAddClubBlock: FC<CommAddClubBlockProps> = ({className, ...props}) => {
  const {commOId, setIsModalAddClub} = useCommunityListContext()

  const [isHover, setIsHover] = useState<boolean>(false)

  const cnIcon =
    'select-none cursor-pointer text-4xl content-center border-gkd-sakura-border border-4 rounded-xl'

  const styleIcons: CSSProperties = {
    width: '3rem',
    height: '3rem'
  }

  const onClickOpenModalAddClub = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      setIsModalAddClub(commOId)
    },
    [commOId, setIsModalAddClub]
  )

  return (
    <div
      className="w-fit text-center align-middle ml-2"
      onMouseEnter={e => setIsHover(true)}
      onMouseLeave={e => setIsHover(false)} //
    >
      {isHover ? (
        <IconFilled
          className={`${className} ${cnIcon} bg-gkd-sakura-bg`}
          iconName={'group_add'}
          onClick={onClickOpenModalAddClub}
          style={styleIcons}
          {...props}
        />
      ) : (
        <Icon
          className={`${className} ${cnIcon}`}
          iconName={'group_add'}
          style={styleIcons}
          {...props}
        />
      )}
    </div>
  )
}
