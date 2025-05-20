import {ChangeEvent, CSSProperties, FC, MouseEvent, useCallback, useEffect, useState} from 'react'
import {DivCommonProps, SAKURA_BORDER} from '../../../common'
import {Button, Modal, Text5XL, Textarea} from '../../../common/components'
import {MemberInfoType} from '../../../common/typesAndValues/shareTypes'
import {ClubRowBlock, InputRowBlock} from '../blocks'
import {useCommMembersContext} from '../parts'
import {RecentRecordGroup} from '../groups'
import {useMainPageStatesContext} from '../_contexts'

type ModalSetEntireMemberProps = DivCommonProps & {}
export const ModalSetEntireMember: FC<ModalSetEntireMemberProps> = ({className, ...props}) => {
  const {keyDownESC, setKeyDownESC} = useMainPageStatesContext()
  const {commMembers, isEMemberModal: memOId} = useCommMembersContext()
  const {setIsEMemberModal, setMemberInfo} = useCommMembersContext()

  const [batterPower, setBatterPower] = useState<number | null>(null)
  const [clubOId, setClubOId] = useState<string | null>(null)
  const [comment, setComment] = useState<string>('')
  const [member, setMember] = useState<MemberInfoType | null>(null)
  const [name, setName] = useState<string>('')
  const [pitcherPower, setPitcherPower] = useState<number | null>(null)

  const styleButtonRow: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '20px',
    width: '50%'
  }
  const styleDiv: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '550px',
    width: '750px'
  }
  const styleDivInputs: CSSProperties = {
    display: 'flex',
    flexDirection: 'column'
  }
  const styleDivRow: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '16px',
    width: '90%'
  }
  const styleRecords: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderWidth: '4px',
    height: '100%',
    width: '350px'
  }
  const styleTextArea: CSSProperties = {
    borderLeftWidth: '4px',
    borderRightWidth: '4px',
    borderTopWidth: '0px',
    borderBottomWidth: '4px',
    fontSize: '1.125rem',
    height: '13rem',
    lineHeight: '1.625rem',
    width: '100%'
  }

  const onChangeB = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setBatterPower(e.currentTarget.valueAsNumber)
  }, [])
  const onChangeClubOId = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setClubOId(e.currentTarget.value)
  }, [])
  const onChangeComment = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.currentTarget.value)
  }, [])
  const onChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value)
  }, [])
  const onChangeP = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPitcherPower(e.currentTarget.valueAsNumber)
  }, [])

  const onClickSubmit = useCallback(
    (member: MemberInfoType) => (e: MouseEvent<HTMLButtonElement>) => {
      // 이름 안바꿨으면 전달하지 않는다.
      setMemberInfo(
        member.memOId,
        member.name === name ? '' : name,
        batterPower,
        pitcherPower,
        clubOId,
        comment
      )
      setIsEMemberModal('')
    },
    [batterPower, clubOId, comment, name, pitcherPower, setIsEMemberModal, setMemberInfo]
  )
  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setIsEMemberModal('')
    },
    [setIsEMemberModal]
  )

  // Init values
  useEffect(() => {
    setMember(null)
    setBatterPower(null)
    setClubOId(null)
    setComment('')
    setName('')
    setPitcherPower(null)
  }, [])
  // Set values
  useEffect(() => {
    if (commMembers && memOId) {
      const member = commMembers[memOId]
      setMember(member)
      setBatterPower(member.batterPower)
      setClubOId(member.clubOId)
      setComment(member.memberComment)
      setName(member.name)
      setPitcherPower(member.pitcherPower)
    } // BLANK LINE COMMENT:
    else {
      setMember(null)
      setBatterPower(null)
      setClubOId(null)
      setComment('')
      setName('')
      setPitcherPower(null)
    }
  }, [commMembers, memOId])
  // Key Down : ESC
  useEffect(() => {
    if (keyDownESC) {
      setIsEMemberModal('')
      setKeyDownESC(false)
    }
  }, [keyDownESC, setIsEMemberModal, setKeyDownESC])

  if (!commMembers || !member) return null
  return (
    <Modal onClose={() => {}}>
      <div style={styleDiv} {...props}>
        <Text5XL className="mt-2 mb-4">멤버 정보 변경</Text5XL>

        {/* 몸통: 멤버 정보 + 최근 기록 */}
        <div style={styleDivRow}>
          {/* 멤버 정보 */}
          <div style={styleDivInputs}>
            <InputRowBlock onChange={onChangeName} type="text" value={name} title={'이름'} />
            <InputRowBlock onChange={onChangeB} type="number" value={batterPower} title={'타자'} />
            <InputRowBlock onChange={onChangeP} type="number" value={pitcherPower} title={'투수'} />
            <ClubRowBlock onChangeSelect={onChangeClubOId} clubOId={clubOId} />
            <Textarea onChange={onChangeComment} style={styleTextArea} value={comment} />
          </div>

          {/* 최근 기록 */}
          <RecentRecordGroup member={member} style={styleRecords} />
        </div>

        <div style={styleButtonRow}>
          <Button onClick={onClickSubmit(member)}>Submit</Button>
          <Button onClick={onClickCancel}>Cancel</Button>
        </div>
      </div>
    </Modal>
  )
}
