import {CSSProperties, FC, KeyboardEvent, MouseEvent, useCallback, useEffect, useState} from 'react'
import {DivCommonProps} from '../../../common'
import {Button, Input, Modal, Text3XL, Text5XL} from '../../../common/components'
import {useMainPageStatesContext} from '../_contexts'
import {useTemplateStatesContext, useTemplateCallbacksContext} from '../../../template/_contexts'

type ModalAddUserProps = DivCommonProps & {
  //
}
export const ModalAddUser: FC<ModalAddUserProps> = ({className, ...props}) => {
  const {comm} = useTemplateStatesContext()
  const {addUser} = useTemplateCallbacksContext()
  const {keyDownESC, setIsAddUserModal, setKeyDownESC} = useMainPageStatesContext()

  const [idVal, setIdVal] = useState<string>('')
  const [pwVal, setPwVal] = useState<string>('')

  const styleBlock: CSSProperties = {
    width: '450px',
    height: 'fit',

    paddingTop: '20px',
    paddingBottom: '20px'
  }
  const styleName: CSSProperties = {
    width: '80px',

    textAlign: 'center',
    alignContent: 'center'
  }
  const styleInput: CSSProperties = {
    width: '240px',

    borderRadius: '6px',
    fontSize: '1.5rem',
    lineHeight: '2rem',
    marginLeft: '8px',
    padding: '4px'
  }

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setIsAddUserModal('')
    },
    [setIsAddUserModal]
  )
  const onClickSubmit = useCallback(
    (e: MouseEvent<HTMLButtonElement> | null) => {
      const url = '/client/main/addUser'
      const commOId = comm.commOId
      if (!idVal || !pwVal) {
        alert('공란이 있어요 ㅠㅠ')
        return
      }
      addUser(url, commOId, idVal, pwVal)
      setIsAddUserModal('')
    },
    [comm, idVal, pwVal, addUser, setIsAddUserModal]
  )
  const onKeyDownModal = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'enter' || e.key === 'Enter') {
        onClickSubmit(null)
      } // BLANK LINE COMMENT:
      else if (e.key === 'esc' || e.key === 'ESC' || e.key === 'Escape') {
        setIsAddUserModal('')
      }
    },
    [onClickSubmit, setIsAddUserModal]
  )

  // Key Down : ESC
  useEffect(() => {
    if (keyDownESC) {
      setIsAddUserModal('')
      setKeyDownESC(false)
    }
  }, [keyDownESC, setIsAddUserModal, setKeyDownESC])

  return (
    <Modal
      className={` ${className}`}
      onClose={() => {}}
      onKeyDown={onKeyDownModal}
      style={styleBlock}
      {...props} // BLANK LINE COMMENT:
    >
      {/* 타이틀 */}
      <Text5XL>운영진 추가</Text5XL>

      {/* 입력 : 이름 */}
      <div className="flex flex-row mt-12">
        <Text3XL style={styleName}>이름</Text3XL>
        <Input onChange={e => setIdVal(e.currentTarget.value)} style={styleInput} value={idVal} />
      </div>

      {/* 입력 : 비번 */}
      <div className="flex flex-row mt-8">
        <Text3XL style={styleName}>비번</Text3XL>
        <Input
          onChange={e => setPwVal(e.currentTarget.value)}
          placeholder="안 가려져요"
          style={styleInput}
          value={pwVal}
        />
      </div>

      {/* 버튼 */}
      <div className="flex flex-row mt-8">
        <Button onClick={onClickSubmit}>Submit</Button>
        <Button className="ml-12" onClick={onClickCancel}>
          Cancel
        </Button>
      </div>
    </Modal>
  )
}
