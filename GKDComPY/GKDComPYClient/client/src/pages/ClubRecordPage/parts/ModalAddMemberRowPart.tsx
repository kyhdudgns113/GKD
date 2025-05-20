import {ChangeEvent, CSSProperties, FC, MouseEvent, useCallback, useEffect, useState} from 'react'
import {DivCommonProps} from '../../../common'
import {Button, Input, Modal, Text3XL, Text5XL, TextSM} from '../../../common/components'
import {useClubRecordStatesContext, useClubRecordCallbacksContext} from '../_contexts'
import {SwitchButton} from '../../../common/components/Buttons/SwitchButton'

type ModalAddMemberRowPartProps = DivCommonProps & {}
export const ModalAddMemberRowPart: FC<ModalAddMemberRowPartProps> = ({className, ...props}) => {
  const {selWeekOId: weekOId, weeklyRecord, setSelWeekOId} = useClubRecordStatesContext()
  const {keyDownEnter, keyDownESC, setKeyDownEnter, setKeyDownESC} = useClubRecordStatesContext()
  const {submitAddMember} = useClubRecordCallbacksContext()

  const [position, setPosition] = useState<number>(0)
  const [name, setName] = useState<string>('')
  const [batterPower, setBatterPower] = useState<number>(0)
  const [pitcherPower, setPitcherPower] = useState<number>(0)

  const styleBlock: CSSProperties = {
    width: '450px',
    height: '550px'
  }
  const styleInput: CSSProperties = {
    borderRadius: '8px',
    fontSize: '1.5rem',
    marginLeft: '8px',

    paddingLeft: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',
    width: '14rem'
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
      setSelWeekOId('')
    },
    [setSelWeekOId]
  )
  const onClickSetPosition = useCallback(
    (val: number) => (e: MouseEvent<HTMLSpanElement> | MouseEvent<HTMLImageElement>) => {
      setPosition(val)
    },
    []
  )
  const onClickSubmit = useCallback(
    (weekOId: string, position: number, name: string, batterPower: number, pitcherPower: number) =>
      (e: MouseEvent<HTMLButtonElement>) => {
        if (!name || !batterPower || !pitcherPower) {
          alert('빈공간을 채워주세요')
          return
        }
        for (let memInfo of weeklyRecord.rowInfo.membersInfo) {
          if (memInfo.name === name) {
            alert('이름이 중복됩니다 ㅠㅠ')
            return
          }
        }
        submitAddMember(weekOId, position, name, batterPower, pitcherPower)
        setSelWeekOId('')
      },
    [weeklyRecord, setSelWeekOId, submitAddMember]
  )

  // Key Down: Enter: Submit
  useEffect(() => {
    if (keyDownEnter) {
      setKeyDownEnter(false)
      setSelWeekOId('')
      onClickSubmit(weekOId, position, name, batterPower, pitcherPower)
    }
  }, [
    batterPower,
    keyDownEnter,
    pitcherPower,
    position,
    name,
    weekOId,
    onClickSubmit,
    setKeyDownEnter,
    setSelWeekOId
  ])
  // Key Down: ESC: Cancel
  useEffect(() => {
    if (keyDownESC) {
      setKeyDownESC(false)
      setSelWeekOId('')
    }
  }, [keyDownESC, setKeyDownESC, setSelWeekOId])

  return (
    <Modal onClose={() => {}} style={styleBlock}>
      <Text5XL className="mt-8">멤버 추가 </Text5XL>
      <TextSM className="mt-1">{'멤버 & 라인업에는 반영되지 않습니다.'}</TextSM>
      <div className="flex flex-row mt-8 items-center">
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
      <div className="flex flex-row items-center mt-4">
        <Text3XL>닉네임</Text3XL>
        <Input maxLength={10} onChange={onChangeName} style={styleInput} value={name} />
      </div>
      <div className="flex flex-row items-center mt-8">
        <Text3XL>타자력</Text3XL>
        <Input
          maxLength={5}
          onChange={onChangeBatter}
          style={styleInput}
          type="number"
          value={batterPower}
        />
      </div>
      <div className="flex flex-row items-center mt-8">
        <Text3XL>투수력</Text3XL>
        <Input
          maxLength={5}
          style={styleInput}
          onChange={onChangePitcher}
          type="number"
          value={pitcherPower}
        />
      </div>
      <div className="flex flex-row mt-12 w-3/4 justify-between">
        <Button onClick={onClickSubmit(weekOId, position, name, batterPower, pitcherPower)}>
          Submit
        </Button>
        <Button onClick={onClickCancel}>Cancel</Button>
      </div>
    </Modal>
  )
}
