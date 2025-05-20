import {CSSProperties, FC, MouseEvent, useCallback, useEffect} from 'react'
import {DivCommonProps} from '../../../common'
import {Button, Modal, Text3XL} from '../../../common/components'
import {useNavigate} from 'react-router-dom'
import {useClubRecordStatesContext, useClubRecordCallbacksContext} from '../_contexts'

type ModalDeleteWeekProps = DivCommonProps & {}
export const ModalDeleteWeek: FC<ModalDeleteWeekProps> = ({className, ...props}) => {
  const {selDelWeek: weekOId, setSelDelWeek} = useClubRecordStatesContext()
  const {keyDownEnter, keyDownESC, setKeyDownEnter, setKeyDownESC} = useClubRecordStatesContext()
  const {deleteRowWeek} = useClubRecordCallbacksContext()

  const navigate = useNavigate()

  const styleBlock: CSSProperties = {
    width: '450px',
    height: '200px'
  }

  const onClickYes = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      deleteRowWeek(weekOId || '')
      setSelDelWeek(null)
      navigate('/')
    },
    [weekOId, deleteRowWeek, navigate, setSelDelWeek]
  )
  const onClickNo = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setSelDelWeek(null)
    },
    [setSelDelWeek]
  )

  // Key Down: Enter: Delete
  useEffect(() => {
    if (keyDownEnter) {
      setKeyDownEnter(false)
      deleteRowWeek(weekOId || '')
      setSelDelWeek(null)
      navigate('/')
    }
  }, [keyDownEnter, weekOId, deleteRowWeek, navigate, setKeyDownEnter, setSelDelWeek])
  // Key Down: ESC: Cancel
  useEffect(() => {
    if (keyDownESC) {
      setKeyDownESC(false)
      setSelDelWeek('')
    }
  }, [keyDownESC, setKeyDownESC, setSelDelWeek])

  return (
    <Modal
      className={`${className}`}
      onClose={() => {}}
      style={styleBlock}
      {...props} // BLANK LINE COMMENT:
    >
      <Text3XL className="mt-4">정말로 삭제하시겠습니까?</Text3XL>
      <Text3XL>데이터는 복구되지 않습니다</Text3XL>
      <div className="flex flex-row w-4/5 justify-between mt-8">
        <Button onClick={onClickYes}>Yes</Button>
        <Button onClick={onClickNo}>No</Button>
      </div>
    </Modal>
  )
}
