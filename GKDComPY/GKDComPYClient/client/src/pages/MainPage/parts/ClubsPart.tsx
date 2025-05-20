import {CSSProperties, FC, MouseEvent, useCallback, useState} from 'react'
import {DivCommonProps, SAKURA_BORDER, SAKURA_TEXT} from '../../../common'
import {Icon, IconFilled} from '../../../common/components'
import {useMainPageStatesContext} from '../_contexts'
import {useNavigate} from 'react-router-dom'
import {useAuthContext} from '../../../contexts'
import {useTemplateStatesContext} from '../../../template/_contexts'

type ClubsPartProps = DivCommonProps & {
  //
}
export const ClubsPart: FC<ClubsPartProps> = ({className, ...props}) => {
  const {uOId} = useAuthContext()
  const {comm, clubsArr} = useTemplateStatesContext()
  const {setIsAddClubModal} = useMainPageStatesContext()

  const [isHover, setIsHover] = useState<boolean>(false)

  const navigate = useNavigate()

  const styleDiv: CSSProperties = {
    ...props.style,

    borderColor: SAKURA_BORDER,
    borderRadius: '12px',
    borderWidth: '6px',
    display: 'flex',

    height: 'fit-content',
    width: '180px'
  }
  const styleIcon: CSSProperties = {
    cursor: 'pointer',
    fontSize: '1.75rem',
    lineHeight: '2rem',
    userSelect: 'none'
  }
  const styleOutBtn: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderTopWidth: '2px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',

    padding: '4px',
    width: '100%'
  }
  const styleRowClub: CSSProperties = {
    alignItems: 'center',
    borderColor: SAKURA_BORDER,
    borderTopWidth: '2px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    height: '1.875rem',
    paddingBottom: '4px',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    userSelect: 'none'
  }
  const styleClubName: CSSProperties = {
    color: SAKURA_TEXT,
    fontSize: '1rem',
    fontWeight: 800,
    lineHeight: '1.5rem'
  }
  const styleTitle: CSSProperties = {
    borderBottomWidth: '2px',
    borderColor: SAKURA_BORDER,
    color: SAKURA_TEXT,
    fontSize: '1.5rem',
    fontWeight: 800,
    lineHeight: '2rem',
    paddingBottom: '8px',
    paddingTop: '8px',
    textAlign: 'center',
    userSelect: 'none'
  }

  const mouseHover = useCallback(
    (hoverVal: boolean) => (e: MouseEvent<HTMLDivElement>) => {
      setIsHover(hoverVal)
    },
    []
  )
  const onClickAddClub = useCallback(
    (uOId: string, commOId: string) => (e: MouseEvent<HTMLDivElement>) => {
      // 후보군 클럽까지 3개가 디폴트다.

      /* 이제 최대 클럽수 확인은 서버에서 한다 */
      // if (clubsArr.length >= 4) {
      //   talkToGKD()
      //   return
      // }
      if (comm.users[uOId] !== 2) {
        alert('권한이 없습니다.')
        return
      }

      setIsAddClubModal(commOId)
    },
    [comm, setIsAddClubModal]
  )
  const onClickClubName = useCallback(
    (clubIdx: number) => (e: MouseEvent<HTMLDivElement>) => {
      navigate(`/client/club/member/${clubIdx}`)
    },
    [navigate]
  )

  return (
    <div className={`flex-col ${className}`} style={styleDiv} {...props}>
      {/* 타이틀 */}
      <p style={styleTitle}>클럽 목록</p>

      {/* 클럽 목록 */}
      {clubsArr.map((club, clubIdx) => {
        if (clubIdx === 0) return null
        return (
          <div
            className="hover:bg-gkd-sakura-bg"
            key={`cl:${clubIdx}`}
            onClick={onClickClubName(clubIdx)}
            style={styleRowClub} // BLANK LINE COMMENT:
          >
            <p style={styleClubName}>{club.name}</p>
          </div>
        )
      })}

      {/* 클럽 추가 버튼 */}
      {comm.users[uOId] === 2 && (
        <div style={styleOutBtn}>
          <div
            className="w-fit h-fit"
            onClick={onClickAddClub(uOId, comm.commOId)}
            onMouseEnter={mouseHover(true)}
            onMouseLeave={mouseHover(false)} // BLANK LINE COMMENT:
          >
            {isHover ? (
              <IconFilled iconName="add_box" style={styleIcon} />
            ) : (
              <Icon iconName="add_box" style={styleIcon} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
