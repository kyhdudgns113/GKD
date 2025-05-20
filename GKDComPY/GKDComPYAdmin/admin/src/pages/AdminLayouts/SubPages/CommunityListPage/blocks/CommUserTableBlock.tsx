import {CSSProperties, FC, MouseEvent, useCallback, useState} from 'react'
import {TableCommonProps} from '../../../../../common'
import {CommunityInfoType, UserInfoAuthType} from '../../../../../common/shareTypes'
import {useCommunityListContext} from '../CommunityListPage'
import {Icon} from '../../../../../common/components'

type CommUserTableBlockProps = TableCommonProps & {
  community: CommunityInfoType
  commUsersArr: UserInfoAuthType[]
}
export const CommUserTableBlock: FC<CommUserTableBlockProps> = ({
  community,
  commUsersArr,
  //
  className,
  ...props
}) => {
  const {setIsModalDelUser, setUserAuthVal} = useCommunityListContext()

  const [isHoverArr, setIsHoverArr] = useState<boolean[]>([])

  const cnTh =
    'border-gkd-sakura-border border-b-4 border-r-2 text-gkd-sakura-text text-2xl text-center font-bold select-none'
  const cnTBody =
    'border-gkd-sakura-border border-r-2 border-b-2 text-gkd-sakura-text text-lg select-none'

  const styleUserName: CSSProperties = {
    width: '12rem',
    textAlign: 'center'
  }
  const styleAuth: CSSProperties = {
    width: '2.2rem',
    textAlign: 'center'
  }

  const onClickAuthVal = useCallback(
    (user: UserInfoAuthType) => (e: MouseEvent<HTMLTableCellElement>) => {
      if (!user) {
        alert('유저가 없는데요?')
        return
      }

      const newAuthVal = ((user.authVal || 0) + 1) % 3
      setUserAuthVal(community.commOId, user.uOId, newAuthVal)
    },
    [community, setUserAuthVal]
  )
  const onClickDelete = useCallback(
    (clubIdx: number) => (e: MouseEvent) => {
      setIsModalDelUser(clubIdx)
    },
    [setIsModalDelUser]
  )
  const onMouseEnter = useCallback(
    (clubIdx: number) => (e: MouseEvent) => {
      setIsHoverArr(prev => {
        const newPrev = [...prev]
        newPrev[clubIdx] = true
        return newPrev
      })
    },
    []
  )
  const onMouseLeave = useCallback(
    (clubIdx: number) => (e: MouseEvent) => {
      setIsHoverArr(prev => {
        const newPrev = [...prev]
        newPrev[clubIdx] = false
        return newPrev
      })
    },
    []
  )

  return (
    <table
      className={`border-collapse border-gkd-sakura-border w-fit ${className}`}
      style={{borderWidth: '6px'}}
      {...props} // BLANK LINE COMMENT:
    >
      <thead className="w-fit">
        <tr className="w-fit">
          <td className={`${cnTh}`} style={styleUserName}>
            유저명
          </td>
          <td className={` ${cnTh}`}>급</td>
          <td className={` ${cnTh}`}>X</td>
        </tr>
      </thead>
      <tbody className="w-fit">
        {commUsersArr.map((commUser, userIdx) => {
          const uOId = commUser.uOId
          const authVal = community.users[uOId]
          return (
            <tr key={`cusr:${userIdx}`}>
              <td className={` ${cnTBody}`} style={styleUserName}>
                {commUser.id}
              </td>
              <td
                className={`cursor-pointer ${cnTBody}`}
                onClick={onClickAuthVal(commUser)}
                style={styleAuth}>
                {authVal}
              </td>
              <td
                className={`${cnTBody} ${isHoverArr[userIdx] ? 'bg-gkd-sakura-bg ' : ''}`}
                style={styleAuth} // BLANK LINE COMMENT:
              >
                {/* 이렇게 해야 가운데로 정렬이 된다. */}
                <div
                  className={`flex flex-row items-center justify-center`}
                  onClick={onClickDelete(userIdx)}
                  onMouseEnter={onMouseEnter(userIdx)}
                  onMouseLeave={onMouseLeave(userIdx)} // BLANK LINE COMMENT:
                >
                  <Icon className="cursor-pointer " iconName="block" />
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
