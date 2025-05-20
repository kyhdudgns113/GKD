import {ChangeEvent, CSSProperties, FC, useCallback, useEffect, useState} from 'react'
import {CardInfoType, MemberInfoType} from '../../../../common/typesAndValues/shareTypes'
import {
  batterSkillEntire,
  batterSkillHero,
  batterSkillLegend,
  batterSkillPlatinum,
  pitcherSkillEntire,
  SelectCommonProps
} from '../../../../common'
import {useClubMemberCallbacksContext} from '../../_contexts'

type CardSkillProps = SelectCommonProps & {
  member: MemberInfoType
  card: CardInfoType
  elemIdx: number
  posIdx: number
}
export const CardSkill: FC<CardSkillProps> = ({
  member,
  card,
  elemIdx,
  posIdx,
  //
  className,
  ...props
}) => {
  const {setCardInfo} = useClubMemberCallbacksContext()

  const [cnBg, setCnBg] = useState<string>(' ')
  const [skillIdx, setSkillIdx] = useState<number>(elemIdx)
  const [skillLevel, setSkillLevel] = useState<number>(0)

  const otherIdx1 = (elemIdx + 1) % 3
  const otherIdx2 = (elemIdx + 2) % 3

  const skillNames = posIdx < 11 ? pitcherSkillEntire : batterSkillEntire

  const styleBorder: CSSProperties = {
    width: '102px',
    borderWidth: '2px',
    borderRadius: '3px',
    marginTop: '4px'
  }
  const styleName: CSSProperties = {
    borderRightWidth: '2px',
    color: 'black',
    width: '80px',
    paddingLeft: '4px'
  }
  const styleLevel: CSSProperties = {
    backgroundColor: 'white',
    color: 'black',
    width: '20px'
  }

  const onChangeSelectSkill = useCallback(
    (member: MemberInfoType, posIdx: number, card: CardInfoType, elemIdx: number) =>
      (e: ChangeEvent<HTMLSelectElement>) => {
        const newSkillIdx = Number(e.currentTarget.value)
        setSkillIdx(newSkillIdx)
        setSkillLevel(0)
        const newSkillIdxs = card.skillIdxs
        newSkillIdxs[elemIdx] = newSkillIdx
        const newSkillLevels = card.skillLevels
        newSkillLevels[elemIdx] = 0

        setCardInfo(member.memOId, posIdx, card.name || '', newSkillIdxs, newSkillLevels)
      },
    [setCardInfo]
  )
  const onChangeSelectLevel = useCallback(
    (member: MemberInfoType, posIdx: number, card: CardInfoType, elemIdx: number) =>
      (e: ChangeEvent<HTMLSelectElement>) => {
        const newSkillLevel = Number(e.currentTarget.value)
        setSkillLevel(newSkillLevel)
        const newSkillLevels = card.skillLevels
        newSkillLevels[elemIdx] = newSkillLevel
        setCardInfo(member.memOId, posIdx, card.name || '', card.skillIdxs, newSkillLevels)
      },
    [setCardInfo]
  )

  // Set cnBg
  useEffect(() => {
    setCnBg(
      skillIdx < batterSkillLegend.length
        ? ' bg-purple-400 '
        : skillIdx < batterSkillLegend.length + batterSkillPlatinum.length
        ? ' bg-yellow-400 '
        : skillIdx < batterSkillLegend.length + batterSkillPlatinum.length + batterSkillHero.length
        ? ' bg-green-400 '
        : ' bg-white '
    )
  }, [skillIdx, elemIdx])

  // Set skill index
  useEffect(() => {
    setSkillIdx(card?.skillIdxs[elemIdx] ?? elemIdx)
  }, [card, elemIdx])

  // Set skill levels
  useEffect(() => {
    setSkillLevel(card?.skillLevels[elemIdx] ?? 0)
  }, [card, elemIdx])

  return (
    <div className={`flex flex-row border-gray-800 ${className}`} style={styleBorder}>
      <select
        className={`outline-none border-gray-800 appearance-none ${cnBg}`}
        onChange={onChangeSelectSkill(member, posIdx, card, elemIdx)}
        style={styleName}
        value={skillIdx}
        {...props} // BLANK LINE COMMENT:
      >
        {skillNames.map((skillName, idx) => {
          const cnBg =
            idx < batterSkillLegend.length
              ? 'bg-purple-400'
              : idx < batterSkillLegend.length + batterSkillPlatinum.length
              ? 'bg-yellow-400'
              : idx < batterSkillLegend.length + batterSkillPlatinum.length + batterSkillHero.length
              ? 'bg-green-400'
              : ' bg-white '
          if (
            idx === (card?.skillIdxs[otherIdx1] || otherIdx1) ||
            idx === (card?.skillIdxs[otherIdx2] || otherIdx2)
          ) {
            return null
          } // BLANK LINE COMMENT:
          else {
            return (
              <option className={cnBg} value={idx}>
                {skillName}
              </option>
            )
          }
        })}
      </select>
      <select
        className={`outline-none appearance-none border-gray-800`}
        onChange={onChangeSelectLevel(member, posIdx, card, elemIdx)}
        style={styleLevel}
        value={skillLevel} //
      >
        {Array(6)
          .fill(null)
          .map((_, _idx) => {
            let sLevel = 'X'
            switch (_idx) {
              case 0:
                sLevel = 'E'
                break
              case 1:
                sLevel = 'D'
                break
              case 2:
                sLevel = 'C'
                break
              case 3:
                sLevel = 'B'
                break
              case 4:
                sLevel = 'A'
                break
              case 5:
                sLevel = 'S'
                break
            }

            if (_idx === 5 && skillIdx >= batterSkillLegend.length + batterSkillPlatinum.length) {
              return null
            } // BLANK LINE COMMENT:
            else {
              return (
                <option className="text-center" key={`sLevel${elemIdx}_${_idx}`} value={_idx}>
                  {sLevel}
                </option>
              )
            }
          })}
      </select>
    </div>
  )
}
