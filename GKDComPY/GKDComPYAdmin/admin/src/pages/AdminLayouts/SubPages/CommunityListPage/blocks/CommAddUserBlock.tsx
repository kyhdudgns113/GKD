import {CSSProperties, FC, MouseEvent, useCallback, useState} from 'react'
import {SpanCommonProps} from '../../../../../common'
import {Icon, IconFilled} from '../../../../../common/components'
import {useCommunityListContext} from '../CommunityListPage'

type CommAddUserBlockProps = SpanCommonProps & {
  commOId: string
}
export const CommAddUserBlock: FC<CommAddUserBlockProps> = ({
  commOId,
  //
  className,
  ...props
}) => {
  const {setIsModalAddUser} = useCommunityListContext()

  const [isHover, setIsHover] = useState<boolean>(false)

  const cnIcon = 'select-none cursor-pointer text-4xl content-center border-gkd-sakura-border border-4 rounded-xl'
  const styleIcons: CSSProperties = {
    width: '3rem',
    height: '3rem'
  }

  const onClickOpenModalAddUser = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      setIsModalAddUser(commOId)
    },
    [commOId, setIsModalAddUser]
  )

  return (
    <div
      className="w-fit text-center align-middle"
      onMouseEnter={e => setIsHover(true)}
      onMouseLeave={e => setIsHover(false)} //
    >
      {isHover ? (
        <IconFilled
          className={`${className} ${cnIcon} bg-gkd-sakura-bg`}
          iconName={'person_add'}
          onClick={onClickOpenModalAddUser}
          style={styleIcons}
          {...props}
        />
      ) : (
        <Icon
          className={`${className} ${cnIcon}`}
          iconName={'person_add'}
          style={styleIcons}
          {...props}
        />
      )}
    </div>
  )
}
