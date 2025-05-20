import {ChangeEvent, CSSProperties, FC, FormEvent, MouseEvent, useCallback, useState} from 'react'
import {DivCommonProps, SAKURA_TEXT} from '../../../common'
import {Icon, IconFilled, InputCell, TextXL} from '../../../common/components'
import {
  SetMemberPosDataType,
  SetMemberPowerDataType
} from '../../../common/typesAndValues/httpDataTypes'
import {putWithJwt} from '../../../common/server'
import {alertErrors, writeJwtFromServer} from '../../../common/utils'
import {MemberInfoType} from '../../../common/typesAndValues/shareTypes'
import {Crown} from '../../../common/components/FontAwesome'
import {useClubMemberStatesContext} from '../_contexts'
import {useClubContext} from '../../../contexts'

type MemberListBlockProps = DivCommonProps & {}
export const MemberListBlock: FC<MemberListBlockProps> = ({className, ...props}) => {
  const {membersArr, memberSortBy, setMembersArr, setMembers, setMemberSortBy} = useClubContext()
  const {setMemOId} = useClubMemberStatesContext()

  const [isChanged, setIsChanged] = useState<boolean>(false)

  const fontSize = '1rem'
  const height = '1.375rem'

  const cnBdCt = 'border-b-4 border-gkd-sakura-border '
  const cnBdRow = 'border-b-2 border-gkd-sakura-border '

  const styleInputDiv: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    height,
    justifyContent: 'center'
  }
  const styleCrownHead: CSSProperties = {
    width: '1.875rem',
    textAlign: 'center'
  }
  const styleNameHead: CSSProperties = {
    color: SAKURA_TEXT,
    textAlign: 'center',
    width: '10rem'
  }
  const stylePowerHead: CSSProperties = {
    width: '4.5rem',
    textAlign: 'center'
  }
  const styleInfoHead: CSSProperties = {
    width: '2rem',
    textAlign: 'center',
    verticalAlign: 'middle'
  }

  const onBlurPower = useCallback(
    (memIdx: number) => (e: FormEvent<HTMLInputElement>) => {
      if (isChanged) {
        const {memOId, name, batterPower, pitcherPower} = membersArr[memIdx]
        const url = `/client/club/member/setMemPower`
        const data: SetMemberPowerDataType = {memOId, name, batterPower, pitcherPower}
        putWithJwt(url, data)
          .then(res => res.json())
          .then(res => {
            const {ok, body, errObj, jwtFromServer} = res
            if (ok) {
              setMembers(body.members)
              writeJwtFromServer(jwtFromServer)
            } // BLANK LINE COMMENT:
            else {
              alertErrors(`${url} ELSE`, errObj)
            }
          })
          .catch(errObj => alertErrors(`${url} CATCH`, errObj))
      }
      setIsChanged(false)
    },
    [isChanged, membersArr, setMembers]
  )
  const onChangeBat = useCallback(
    (memIdx: number) => (e: ChangeEvent<HTMLInputElement>) => {
      setIsChanged(true)
      setMembersArr(prev => {
        const newPrev = [...prev]
        newPrev[memIdx].batterPower = Number(e.target.value)
        return newPrev
      })
    },
    [setMembersArr]
  )
  const onChangeName = useCallback(
    (memIdx: number) => (e: ChangeEvent<HTMLInputElement>) => {
      setIsChanged(true)
      setMembersArr(prev => {
        const newPrev = [...prev]
        newPrev[memIdx].name = e.target.value
        return newPrev
      })
    },
    [setMembersArr]
  )
  const onChangePitch = useCallback(
    (memIdx: number) => (e: ChangeEvent<HTMLInputElement>) => {
      setIsChanged(true)
      setMembersArr(prev => {
        const newPrev = [...prev]
        newPrev[memIdx].pitcherPower = Number(e.target.value)
        return newPrev
      })
    },
    [setMembersArr]
  )
  const onClickMemPos = useCallback(
    (memInfo: MemberInfoType) => (e: MouseEvent<HTMLTableCellElement>) => {
      const {memOId, position} = memInfo
      const data: SetMemberPosDataType = {memOId, position: (position + 1) % 3}
      const url = `/client/club/setMemPos`
      putWithJwt(url, data)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setMembers(body.members)
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(`${url} ELSE`, errObj)
          }
        })
        .catch(errObj => alertErrors(`${url} CATCH`, errObj))
    },
    [setMembers]
  )
  const onClickMemInfo = useCallback(
    (memInfo: MemberInfoType) => (e: MouseEvent<HTMLTableCellElement>) => {
      e.stopPropagation()
      setMemOId(memInfo.memOId)
    },
    [setMemOId]
  )
  const onClickSortName = useCallback(
    (memberSortBy: string) => () => {
      if (memberSortBy === 'name') {
        setMemberSortBy('nameReverse')
      } // BLANK LINE COMMENT:
      else {
        setMemberSortBy('name')
      }
    },
    [setMemberSortBy]
  )
  const onClickSortBatter = useCallback(
    (memberSortBy: string) => () => {
      if (memberSortBy === 'batterPower') {
        setMemberSortBy('batterPowerReverse')
      } // BLANK LINE COMMENT:
      else {
        setMemberSortBy('batterPower')
      }
    },
    [setMemberSortBy]
  )
  const onClickSortPitcher = useCallback(
    (memberSortBy: string) => () => {
      if (memberSortBy === 'pitcherPower') {
        setMemberSortBy('pitcherPowerReverse')
      } // BLANK LINE COMMENT:
      else {
        setMemberSortBy('pitcherPower')
      }
    },
    [setMemberSortBy]
  )
  const onClickSortTotal = useCallback(
    (memberSortBy: string) => () => {
      if (memberSortBy === 'total') {
        setMemberSortBy('totalReverse')
      } // BLANK LINE COMMENT:
      else {
        setMemberSortBy('total')
      }
    },
    [setMemberSortBy]
  )

  return (
    <div
      className={`flex flex-col border-gkd-sakura-border rounded-xl mb-8 ${className}`}
      onClick={e => e.stopPropagation()}
      style={{borderWidth: '6px'}}
      {...props} // BLANK LINE COMMENT:
    >
      <table className="border-collapse border-spacing-0">
        {/* 테이블 헤드 */}
        <thead>
          <tr className="select-none cursor-pointer">
            <td className={`border-r-2 hover:bg-gkd-sakura-bg ${cnBdCt}`} style={styleCrownHead}>
              G
            </td>
            <td className={`border-r-2 hover:bg-gkd-sakura-bg ${cnBdCt}`}>
              <TextXL onClick={onClickSortName(memberSortBy)} style={styleNameHead}>
                닉네임
              </TextXL>
            </td>
            <td className={`border-r-2 hover:bg-gkd-sakura-bg ${cnBdCt}`}>
              <TextXL onClick={onClickSortBatter(memberSortBy)} style={stylePowerHead}>
                타자
              </TextXL>
            </td>
            <td className={`border-r-2 hover:bg-gkd-sakura-bg ${cnBdCt}`}>
              <TextXL onClick={onClickSortPitcher(memberSortBy)} style={stylePowerHead}>
                투수
              </TextXL>
            </td>
            <td className={`hover:bg-gkd-sakura-bg ${cnBdCt}`}>
              <TextXL onClick={onClickSortTotal(memberSortBy)} style={styleInfoHead}>
                ?
              </TextXL>
            </td>
          </tr>
        </thead>

        {/* 테이블 바디 */}
        <tbody>
          {/* 클라 */}
          <tr className="border-b-4 border-gkd-sakura-border">
            <td className={`border-r-2 border-gkd-sakura-border`} style={styleCrownHead}>
              <p style={{fontSize}}>X</p>
            </td>
            {/* 클라 닉네임 */}
            <td className={`border-r-2 border-gkd-sakura-border`}>
              <div style={styleInputDiv}>
                <p className="bg-white" style={{...styleNameHead, fontSize, fontWeight: 700}}>
                  클럽 라인업
                </p>
              </div>
            </td>
            {/* 클라 타자 */}
            <td className={`border-r-2 text-xl border-gkd-sakura-border`}>
              <div style={styleInputDiv}>
                <InputCell
                  className="bg-white"
                  style={{...stylePowerHead, fontSize, fontWeight: 700}}
                  value="12345"
                />
              </div>
            </td>
            {/* 클라 투수 */}
            <td className={`border-r-2 text-xl border-gkd-sakura-border`}>
              <div style={styleInputDiv}>
                <InputCell
                  className="bg-white"
                  style={{...stylePowerHead, fontSize, fontWeight: 700}}
                  value="12345"
                />
              </div>
            </td>
            {/* 클라 아이콘 */}
            <td className=" hover:bg-gkd-sakura-bg">
              <Icon
                className="select-none cursor-pointer hover:bg-gkd-sakura-bg"
                iconName="info"
                style={styleInfoHead}
              />
            </td>
          </tr>

          {/* 멤버 */}
          {membersArr.map((member, memIdx) => {
            const cnBd =
              memIdx !== membersArr.length - 1
                ? memIdx % 10 === 9
                  ? 'border-b-4 border-blue-400 '
                  : memIdx % 5 === 4
                  ? 'border-b-4 border-green-400 '
                  : ''
                : ''
            const pitPower = member.pitcherPower || 0
            const cnBg =
              pitPower >= 8600
                ? ' bg-purple-100 '
                : pitPower >= 8300
                ? ' bg-yellow-100 '
                : pitPower >= 8000
                ? ' bg-green-100 '
                : pitPower >= 7500
                ? ' bg-gkd-sakura-bg '
                : pitPower >= 7000
                ? ' bg-blue-100 '
                : ' bg-white '
            return (
              <tr className={`${cnBd}`} key={`memb:${memIdx}`}>
                {/* 직위 */}
                <td
                  className={`cursor-pointer border-r-2 ${cnBdRow}`}
                  onClick={onClickMemPos(member)} // BLANK LINE COMMENT:
                >
                  <div style={styleInputDiv}>
                    {member.position === 2 ? (
                      <Crown className="text-yellow-400" />
                    ) : member.position === 1 ? (
                      <Crown className="text-gray-400" />
                    ) : (
                      ''
                    )}
                  </div>
                </td>
                {/* 닉네임 */}
                <td className={`border-r-2 font-bold ${cnBdRow}`}>
                  <div style={styleInputDiv}>
                    <InputCell
                      className="bg-white"
                      onBlur={onBlurPower(memIdx)}
                      onChange={onChangeName(memIdx)}
                      style={{...styleNameHead, fontSize}}
                      value={member.name || ''}
                    />
                  </div>
                </td>
                {/* 타자력 */}
                <td className={`border-r-2 font-bold ${cnBdRow}`}>
                  <div style={styleInputDiv}>
                    <InputCell
                      className={`${cnBg}`}
                      onBlur={onBlurPower(memIdx)}
                      onChange={onChangeBat(memIdx)}
                      style={{...stylePowerHead, fontSize}}
                      type="number"
                      value={member.batterPower || 0}
                    />
                  </div>
                </td>
                {/* 투수력 */}
                <td className={`border-r-2 font-bold ${cnBdRow}`}>
                  <div style={styleInputDiv}>
                    <InputCell
                      className={`${cnBg} `}
                      onBlur={onBlurPower(memIdx)}
                      onChange={onChangePitch(memIdx)}
                      style={{...stylePowerHead, fontSize}}
                      type="number"
                      value={pitPower}
                    />
                  </div>
                </td>
                {/* 아이콘 */}
                <td
                  className={`hover:bg-gkd-sakura-bg ${cnBdRow}`}
                  onClick={onClickMemInfo(member)} // BLANK LINE COMMENT:
                >
                  <div style={styleInputDiv}>
                    {member.memberComment ? (
                      <IconFilled
                        className="select-none cursor-pointer"
                        iconName="info"
                        style={{...styleInfoHead, fontSize: '1.375rem'}}
                      />
                    ) : (
                      <Icon
                        className="select-none cursor-pointer"
                        iconName="info"
                        style={{...styleInfoHead, fontSize: '1.375rem'}}
                      />
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
