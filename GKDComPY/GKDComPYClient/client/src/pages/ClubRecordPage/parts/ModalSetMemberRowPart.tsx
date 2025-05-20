import {ChangeEvent, CSSProperties, FC, MouseEvent, useCallback, useEffect, useState} from 'react'
import {DivCommonProps} from '../../../common'
import {useClubRecordStatesContext, useClubRecordCallbacksContext} from '../_contexts'
import {Button, Input, Modal, Text3XL, Text5XL, TextSM} from '../../../common/components'
import {SwitchButton} from '../../../common/components/Buttons/SwitchButton'

type ModalSetMemberRowPartProps = DivCommonProps & {}
export const ModalSetMemberRowPart: FC<ModalSetMemberRowPartProps> = ({className, ...props}) => {
  const {selModName, weeklyRecord, setSelModName} = useClubRecordStatesContext()
  const {keyDownEnter, keyDownESC, setKeyDownEnter, setKeyDownESC} = useClubRecordStatesContext()
  const {deleteMember, submitSetMember} = useClubRecordCallbacksContext()

  const [position, setPosition] = useState<number>(0)
  // 초기에는 대전기록 멤버는 memOId 가 없었다.
  // 그래서 null 도 포함하게 했다.
  const [memOId, setMemOId] = useState<string | null>(null)
  const [name, setName] = useState<string>('')
  const [batterPower, setBatterPower] = useState<number>(0)
  const [pitcherPower, setPitcherPower] = useState<number>(0)

  const styleBlock: CSSProperties = {
    width: '550px',
    height: '550px'
  }
  const styleInput: CSSProperties = {
    width: '14rem',
    borderRadius: '8px',
    fontSize: '1.5rem',
    marginLeft: '8px',
    paddingLeft: '8px',
    paddingTop: '4px',
    paddingBottom: '4px'
  }

  const onChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }, [])
  const onChangeBatter = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setBatterPower(Number(e.target.value))
  }, [])
  const onChangePitcher = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPitcherPower(Number(e.target.value))
  }, [])

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setSelModName('')
    },
    [setSelModName]
  )
  const onClickDelete = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      deleteMember(selModName)
      setSelModName('')
    },
    [selModName, deleteMember, setSelModName]
  )
  const onClickSetPosition = useCallback(
    (val: number) => (e: MouseEvent<HTMLSpanElement> | MouseEvent<HTMLImageElement>) => {
      setPosition(val)
    },
    []
  )
  const onClickSubmit = useCallback(
    (
        prevName: string,
        position: number,
        name: string,
        batterPower: number,
        pitcherPower: number,
        memOId: string | null
      ) =>
      (e: MouseEvent<HTMLButtonElement>) => {
        if (!name || !batterPower || !pitcherPower) {
          alert('빈 값들이 있어요 ㅠㅠ')
          return
        }
        submitSetMember(prevName, position, name, batterPower, pitcherPower, memOId)
        setSelModName('')
      },
    [setSelModName, submitSetMember]
  )

  // Init data
  useEffect(() => {
    if (weeklyRecord && selModName) {
      const memInfo = weeklyRecord.rowInfo.membersInfo.filter(
        _memInfo => _memInfo.name === selModName
      )[0]
      if (memInfo) {
        setPosition(memInfo.position)
        setName(memInfo.name)
        setBatterPower(memInfo.batterPower || 0)
        setPitcherPower(memInfo.pitcherPower || 0)
        setMemOId(memInfo.memOId)
      }
    }
  }, [selModName, weeklyRecord])
  // Key Down: Enter: Submit
  useEffect(() => {
    if (keyDownEnter) {
      setKeyDownEnter(false)
      if (!name || !batterPower || !pitcherPower) {
        alert('빈 값들이 있어요 ㅠㅠ')
        return
      }
      submitSetMember(selModName, position, name, batterPower, pitcherPower, memOId)
      setSelModName('')
    }
  }, [
    batterPower,
    keyDownEnter,
    memOId,
    name,
    pitcherPower,
    position,
    selModName,
    setKeyDownEnter,
    setSelModName,
    submitSetMember
  ])
  // Key Down: ESC: Cancel
  useEffect(() => {
    if (keyDownESC) {
      setKeyDownESC(false)
      setSelModName('')
    }
  }, [keyDownESC, setKeyDownESC, setSelModName])

  if (!selModName) return null
  return (
    <Modal onClose={() => {}} style={styleBlock}>
      <Text5XL className="mt-4">멤버 수정</Text5XL>
      <TextSM className="mt-1">{'멤버 & 라인업에는 반영되지 않습니다.'}</TextSM>
      <div className="SET_POS flex flex-row mt-6 items-center">
        <Text3XL className="text-center" style={{width: '6rem'}}>
          직책
        </Text3XL>
        <div className="flex flex-row justify-between ml-2" style={{width: '14rem'}}>
          <SwitchButton
            onClick={onClickSetPosition(0)}
            onOff={position === 0}
            style={{fontSize: '1rem'}} // BLANK LINE COMMENT:
          >
            구성원
          </SwitchButton>
          <SwitchButton
            onClick={onClickSetPosition(1)}
            onOff={position === 1}
            style={{fontSize: '1rem'}} // BLANK LINE COMMENT:
          >
            운영진
          </SwitchButton>
          <SwitchButton
            onClick={onClickSetPosition(2)}
            onOff={position === 2}
            style={{fontSize: '1rem'}} // BLANK LINE COMMENT:
          >
            클럽장
          </SwitchButton>
        </div>
      </div>
      <div className="SET_NAME flex flex-row items-center mt-8">
        <Text3XL>닉네임</Text3XL>
        <Input maxLength={10} onChange={onChangeName} style={styleInput} value={name} />
      </div>
      <div className="SET_BAT flex flex-row items-center mt-8">
        <Text3XL>타자력</Text3XL>
        <Input
          maxLength={5}
          onChange={onChangeBatter}
          style={styleInput}
          type="number"
          value={batterPower}
        />
      </div>
      <div className="SET_PITCH flex flex-row items-center mt-8">
        <Text3XL>투수력</Text3XL>
        <Input
          maxLength={5}
          style={styleInput}
          onChange={onChangePitcher}
          type="number"
          value={pitcherPower}
        />
      </div>
      <div className="BUTTONS flex flex-row mt-12 w-3/4 justify-between">
        <Button
          onClick={onClickSubmit(selModName, position, name, batterPower, pitcherPower, memOId)}>
          Submit
        </Button>
        <Button onClick={onClickDelete}>Delete</Button>
        <Button onClick={onClickCancel}>Cancel</Button>
      </div>
    </Modal>
  )
}
