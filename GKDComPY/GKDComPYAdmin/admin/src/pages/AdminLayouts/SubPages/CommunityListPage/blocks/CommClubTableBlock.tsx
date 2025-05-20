import {CSSProperties, FC, MouseEvent, useCallback, useEffect, useState} from 'react'
import {TableCommonProps} from '../../../../../common'
import {useCommunityListContext} from '../CommunityListPage'
import {Icon} from '../../../../../common/components'

type CommClubTableBlockProps = TableCommonProps & {
  //
}
export const CommClubTableBlock: FC<CommClubTableBlockProps> = ({className, ...props}) => {
  const {clubsArr, setIsModalDelClub} = useCommunityListContext()

  const [isHoverArr, setIsHoverArr] = useState<boolean[]>([])

  const cnTh = 'border-gkd-sakura-border border-b-4 border-r-2 text-gkd-sakura-text text-2xl text-center font-bold select-none'
  const cnTBody = 'border-gkd-sakura-border border-r-2 border-b-2 text-gkd-sakura-text text-lg select-none'

  const styleUserName: CSSProperties = {
    width: '12rem',
    textAlign: 'center'
  }
  const styleAuth: CSSProperties = {
      width: '2.2rem'
    }

  const onClick = useCallback(
    (clubIdx: number) => (e: MouseEvent) => {
      setIsModalDelClub(clubIdx)
    },
    [setIsModalDelClub]
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

  // Init hoverArr
  useEffect(() => {
    setIsHoverArr(Array(clubsArr.length).fill(false))
  }, [clubsArr])

  return (
    <table
      className={`border-collapse border-gkd-sakura-border w-fit ${className}`}
      style={{borderWidth: '6px'}}
      {...props} // BLANK LINE COMMENT:
    >
      <thead className="w-fit">
        <tr className="w-fit">
          <td className={`${cnTh}`} style={styleUserName}>
            클럽명
          </td>
          <td className={` ${cnTh}`} style={{}}>
            X
          </td>
        </tr>
      </thead>
      <tbody className="w-fit">
        {clubsArr.map((club, clubIdx) => {
          const {name} = club

          return (
            <tr key={`cusr:${clubIdx}`}>
              <td className={` ${cnTBody}`} style={styleUserName}>
                {name}
              </td>
              <td
                className={`${cnTBody} ${isHoverArr[clubIdx] ? 'bg-gkd-sakura-bg ' : ''}`}
                style={styleAuth} // BLANK LINE COMMENT:
              >
                {/* 이렇게 해야 가운데로 정렬이 된다. */}
                <div
                  className={`flex flex-row items-center justify-center`}
                  onClick={onClick(clubIdx)}
                  onMouseEnter={onMouseEnter(clubIdx)}
                  onMouseLeave={onMouseLeave(clubIdx)} // BLANK LINE COMMENT:
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
