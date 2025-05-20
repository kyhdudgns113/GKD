import {ChangeEvent, CSSProperties, FC, MouseEvent, useCallback, useEffect, useState} from 'react'
import {DivCommonProps} from '../../../common'
import {Button, Input, Modal, Text3XL, Text5XL} from '../../../common/components'
import {useClubRecordStatesContext, useClubRecordCallbacksContext} from '../_contexts'
import {SwitchButton} from '../../../common/components/Buttons/SwitchButton'

type ModalSetColumnPartProps = DivCommonProps & {}
export const ModalSetColumnPart: FC<ModalSetColumnPartProps> = ({className, ...props}) => {
  const {selColIdx, weeklyRecord, setSelColIdx} = useClubRecordStatesContext()
  const {submitTHead} = useClubRecordCallbacksContext()
  const {keyDownEnter, keyDownESC, setKeyDownEnter, setKeyDownESC} = useClubRecordStatesContext()

  const [enemyName, setEnemyName] = useState<string>('')
  const [pitchOrder, setPitchOrder] = useState<number | null>(null)
  const [gameOrder, setGameOrder] = useState<string>('')

  const yoIl = ['월', '화', '수', '목', '금', '토']

  const styleBlock: CSSProperties = {
    width: '550px',
    height: '450px'
  }
  const styleInput: CSSProperties = {
    width: '16rem',
    borderRadius: '8px',
    fontSize: '1.5rem',
    paddingTop: '4px',
    paddingBottom: '4px',
    paddingLeft: '8px'
  }
  const styleOrder: CSSProperties = {
    fontSize: '1.25rem',
    padding: '6px'
  }

  const onChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEnemyName(e.target.value)
  }, [])
  const onChangeGameOrder = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setGameOrder(e.target.value)
  }, [])

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setSelColIdx(null)
    },
    [setSelColIdx]
  )
  const onClickOrder = useCallback(
    (order: number) => (e: MouseEvent<HTMLButtonElement>) => {
      setPitchOrder(order)
    },
    []
  )
  const onClickSubmit = useCallback(
    (dateIdx: number, enemyName: string, pitchOrder: number | null, order: string) =>
      (e: MouseEvent<HTMLButtonElement>) => {
        submitTHead(dateIdx, enemyName, pitchOrder, order)
        setSelColIdx(null)
      },
    [setSelColIdx, submitTHead]
  )

  // Init values
  useEffect(() => {
    if (weeklyRecord && selColIdx !== null) {
      setEnemyName(weeklyRecord.colInfo.dateInfo[selColIdx].enemyName)
      setPitchOrder(weeklyRecord.colInfo.dateInfo[selColIdx].pitchOrder)
      setGameOrder(weeklyRecord.colInfo.dateInfo[selColIdx].order)
    }
  }, [selColIdx, weeklyRecord])
  // Key Down: Enter: Submit
  useEffect(() => {
    if (keyDownEnter) {
      setKeyDownEnter(false)
      submitTHead(selColIdx || 0, enemyName, pitchOrder, gameOrder)
      setSelColIdx(null)
    }
  }, [
    enemyName,
    gameOrder,
    keyDownEnter,
    selColIdx,
    pitchOrder,
    onClickSubmit,
    setKeyDownEnter,
    setSelColIdx,
    submitTHead
  ])
  // Key Down: ESC: Cancel
  useEffect(() => {
    if (keyDownESC) {
      setKeyDownESC(false)
      setSelColIdx(null)
    }
  }, [keyDownESC, setKeyDownESC, setSelColIdx])

  if (selColIdx === null) return null
  return (
    <Modal onClose={() => {}} style={styleBlock}>
      <Text5XL className="mt-4">{yoIl[selColIdx]}</Text5XL>
      {/* 상대클럽 */}
      <div className="flex flex-row items-center mt-8 justify-between">
        <Text3XL className="mr-16">상대클럽</Text3XL>
        <Input maxLength={12} onChange={onChangeName} style={styleInput} value={enemyName} />
      </div>
      {/* 선발순서 */}
      <div className="flex flex-row items-center mt-8">
        <Text3XL className="mr-2">선발순서</Text3XL>
        <SwitchButton
          className="ml-2"
          onClick={onClickOrder(123)}
          onOff={pitchOrder === 123}
          style={styleOrder}>
          123
        </SwitchButton>
        <SwitchButton
          className="ml-2"
          onClick={onClickOrder(234)}
          onOff={pitchOrder === 234}
          style={styleOrder}>
          234
        </SwitchButton>
        <SwitchButton
          className="ml-2"
          onClick={onClickOrder(345)}
          onOff={pitchOrder === 345}
          style={styleOrder}>
          345
        </SwitchButton>
        <SwitchButton
          className="ml-2"
          onClick={onClickOrder(451)}
          onOff={pitchOrder === 451}
          style={styleOrder}>
          451
        </SwitchButton>
        <SwitchButton
          className="ml-2"
          onClick={onClickOrder(512)}
          onOff={pitchOrder === 512}
          style={styleOrder}>
          512
        </SwitchButton>
      </div>
      {/* 클전오더 */}
      <div className="flex flex-row items-center mt-8 justify-between">
        <Text3XL className="mr-16">클전오더</Text3XL>
        <Input maxLength={12} onChange={onChangeGameOrder} style={styleInput} value={gameOrder} />
      </div>
      {/* 버튼 */}
      <div className="flex flex-row items-center mt-12 justify-between w-3/5">
        <Button onClick={onClickSubmit(selColIdx, enemyName, pitchOrder, gameOrder)}>Submit</Button>
        <Button onClick={onClickCancel}>Cancel</Button>
      </div>
    </Modal>
  )
}
