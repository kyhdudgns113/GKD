import {CSSProperties, FC, MouseEvent, useCallback} from 'react'
import {DivCommonProps} from '../../../common'
import {MemberInfoType} from '../../../common/typesAndValues/shareTypes'
import {useTemplateStatesContext} from '../../../template/_contexts'
import {useClubMemberCallbacksContext} from '../_contexts'

type MoveClubsProps = DivCommonProps & {
  member: MemberInfoType
  onClose: () => void
}
export const MoveClubs: FC<MoveClubsProps> = ({member, onClose, className, ...props}) => {
  const {banClubOId, clubsArr, selectedClubIdx} = useTemplateStatesContext()
  const {changeClub} = useClubMemberCallbacksContext()

  const cnIcon = 'material-symbols-outlined fill'

  const styleMove: CSSProperties = {
    ...props.style,

    width: '200px',
    height: 'fit-content',

    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: '6px',
    borderWidth: '4px',
    boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.5)',

    display: 'flex',
    flexDirection: 'column',
    padding: '8px',
    position: 'absolute',
    top: -6,
    zIndex: 10
  }
  const styleRow: CSSProperties = {
    alignItems: 'center',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'row',
    marginTop: '8px',
    userSelect: 'none'
  }
  const styleTitle: CSSProperties = {
    fontSize: '1.5rem',
    lineHeight: '2rem',
    textAlign: 'center',
    userSelect: 'none',
    width: '100%'
  }
  const styleDot: CSSProperties = {
    alignContent: 'center',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    marginLeft: '4px',
    textAlign: 'center'
  }
  const styleArrow: CSSProperties = {
    alignContent: 'center',
    cursor: 'pointer',
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
    marginLeft: 'auto',
    marginRight: '6px',
    textAlign: 'center'
  }

  const onClickSend = useCallback(
    (member: MemberInfoType, clubOId: string) => (e: MouseEvent<HTMLSpanElement>) => {
      changeClub(member.memOId, clubOId)
      onClose()
    },
    [changeClub, onClose]
  )

  // 가장 바깥쪽 div 없애면 위치가 이상해진다. 왜그러지
  // 이거 호출할때 ml-4 만 주던데...
  return (
    <div className={` ${className}`} onClick={e => e.stopPropagation()}>
      <div onClick={e => e.stopPropagation()} style={styleMove}>
        {/* 타이틀 */}
        <p style={styleTitle}>클럽 이동</p>

        {/* 이동 가능한 클럽 목록 */}
        {clubsArr.map((club, clubIdx) => {
          if (clubIdx === selectedClubIdx) return null
          return (
            <div className="hover:bg-gray-300" style={styleRow}>
              {/* 아이콘 : 점 */}
              <span className={`${cnIcon}`} style={styleDot}>
                fiber_manual_record
              </span>

              {/* 클럽 이름 */}
              <p style={{marginLeft: '4px'}}>{club.name}</p>

              {/* 아이콘 비행기 : 이동시키기 */}
              <span
                className={`${cnIcon}`}
                onClick={onClickSend(member, club.clubOId)}
                style={styleArrow} // BLANK LINE COMMENT:
              >
                send
              </span>
            </div>
          )
        })}

        {/* 탈퇴 멤버 클럽으로*/}
        {banClubOId && (
          <div className="hover:bg-gray-300" style={styleRow}>
            {/* 아이콘 : 점 */}
            <span className={`${cnIcon}`} style={styleDot}>
              fiber_manual_record
            </span>

            {/* 클럽 이름 */}
            <p style={{marginLeft: '4px'}}>탈퇴</p>

            {/* 아이콘 비행기 : 이동시키기 */}
            <span
              className={`${cnIcon}`}
              onClick={onClickSend(member, banClubOId)}
              style={styleArrow} // BLANK LINE COMMENT:
            >
              send
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
