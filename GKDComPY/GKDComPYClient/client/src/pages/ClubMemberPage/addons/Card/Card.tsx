import {ChangeEvent, CSSProperties, FC, useCallback, useEffect, useState} from 'react'
import {DivCommonProps, positionValue} from '../../../../common'
import {MemberInfoType} from '../../../../common/typesAndValues/shareTypes'
import {CardSkill} from './CardSkill'
import {useClubMemberCallbacksContext} from '../../_contexts'

type CardProps = DivCommonProps & {
  member: MemberInfoType
  posIdx: number
}
export const Card: FC<CardProps> = ({member, posIdx, className, ...props}) => {
  const {setCardInfo} = useClubMemberCallbacksContext()

  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [name, setName] = useState<string>('')

  const styleCard: CSSProperties = {
    width: '120px',
    height: '200px',

    borderWidth: '2px',
    borderColor: 'black',
    borderCollapse: 'collapse',
    borderRadius: '12px',

    boxShadow: '3px 3px 4px rgba(0, 0, 0, 0.5)'
  }
  const stylePos: CSSProperties = {
    height: '24px'
  }
  const styleName: CSSProperties = {
    width: '100%',
    height: '66px',

    backgroundColor: 'white',
    color: 'black',
    outline: 'none',
    textAlign: 'center',
    verticalAlign: 'center',
    borderTopWidth: '2px',
    borderBottomWidth: '2px',
    borderColor: 'black'
  }

  const card = member.deck[posIdx]

  const onBlurName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (isChanged) {
        setIsChanged(false)
        setCardInfo(member.memOId, posIdx, e.target.value, card.skillIdxs, card.skillLevels)
      }
    },
    [card, isChanged, member, posIdx, setCardInfo]
  )
  const onChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    setIsChanged(true)
  }, [])

  // Init card value
  useEffect(() => {
    setName(card.name || '')
  }, [card])

  return (
    <div className={`flex flex-col items-center ${className}`} style={styleCard} {...props}>
      <p style={stylePos}>{positionValue(posIdx)}</p>
      <input
        maxLength={6}
        onBlur={onBlurName}
        onChange={onChangeName}
        style={styleName}
        value={name}
      />
      <div style={{height: '3px'}} />
      <CardSkill card={card} elemIdx={0} member={member} posIdx={posIdx} />
      <CardSkill card={card} elemIdx={1} member={member} posIdx={posIdx} />
      <CardSkill card={card} elemIdx={2} member={member} posIdx={posIdx} />
    </div>
  )
}
