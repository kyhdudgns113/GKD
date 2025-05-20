import {CSSProperties, FC, KeyboardEvent, MouseEvent, useCallback, useEffect, useState} from 'react'
import {DivCommonProps} from '../../../common'
import {
  Button,
  DeleteIcon,
  Input,
  Modal,
  Text3XL,
  Text5XL,
  TextXL
} from '../../../common/components'
import {useMainPageStatesContext} from '../_contexts'
import {useTemplateStatesContext, useTemplateCallbacksContext} from '../../../template/_contexts'
import {talkToGKD} from '../../../common/utils'

type ModalModifyUserProps = DivCommonProps & {
  //
}
export const ModalModifyUser: FC<ModalModifyUserProps> = ({className, ...props}) => {
  const {users} = useTemplateStatesContext()
  const {modifyUser} = useTemplateCallbacksContext()
  const {isModifyUserModal: targetUOId, setIsModifyUserModal} = useMainPageStatesContext()
  const {keyDownESC, setKeyDownESC} = useMainPageStatesContext()

  const [idVal, setIdVal] = useState<string>('')
  const [prevName, setPrevName] = useState<string>('')
  const [pwVal, setPwVal] = useState<string>('')

  const styleBlock: CSSProperties = {
    width: '480px',
    height: 'fit',

    paddingTop: '20px',
    paddingBottom: '20px'
  }
  const styleName: CSSProperties = {
    width: '110px',

    textAlign: 'center',
    alignContent: 'center'
  }
  const styleInput: CSSProperties = {
    width: '280px',

    borderRadius: '6px',
    fontSize: '1.5rem',
    lineHeight: '2rem',
    marginLeft: '8px',
    padding: '4px'
  }

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setIsModifyUserModal('')
    },
    [setIsModifyUserModal]
  )
  const onClickDelete = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    talkToGKD()
  }, [])
  /**
   * 공란이면 안 바꾼다는 의미이다
   */
  const onClickSubmit = useCallback(
    (uOId: string, id: string, password: string) => (e: MouseEvent<HTMLButtonElement> | null) => {
      if (!id && !password) {
        setIsModifyUserModal('')
        return
      }

      const url = `/client/main/modifyUser`
      modifyUser(url, uOId, id, password)

      setIsModifyUserModal('')
    },
    [modifyUser, setIsModifyUserModal]
  )
  const onKeyDownModal = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'enter' || e.key === 'Enter') {
        onClickSubmit(targetUOId, idVal, pwVal)(null)
      } // BLANK LINE COMMENT:
      else if (e.key === 'esc' || e.key === 'ESC' || e.key === 'Escape') {
        setIsModifyUserModal('')
      }
    },
    [targetUOId, idVal, pwVal, onClickSubmit, setIsModifyUserModal]
  )

  // Init prevName
  useEffect(() => {
    setPrevName(users[targetUOId].id)
  }, [targetUOId, users])
  // Key Down : ESC
  useEffect(() => {
    if (keyDownESC) {
      setIsModifyUserModal('')
      setKeyDownESC(false)
    }
  }, [keyDownESC, setIsModifyUserModal, setKeyDownESC])

  return (
    <Modal onClose={() => {}} onKeyDown={onKeyDownModal} style={styleBlock}>
      <div className="relative flex w-full justify-center items-center">
        <Text5XL>{prevName}</Text5XL>
      </div>
      <TextXL className="select-none mt-4">공란이면 안 바뀝니다.</TextXL>

      <div className="flex flex-row mt-8">
        <Text3XL className="select-none" style={styleName}>
          새 이름
        </Text3XL>
        <Input onChange={e => setIdVal(e.currentTarget.value)} style={styleInput} value={idVal} />
      </div>

      <div className="flex flex-row mt-8">
        <Text3XL className="select-none" style={styleName}>
          새 비번
        </Text3XL>
        <Input
          onChange={e => setPwVal(e.currentTarget.value)}
          placeholder="안 가려져요"
          style={styleInput}
          value={pwVal}
        />
      </div>

      <div className="flex flex-row mt-12 justify-between" style={{width: '90%'}}>
        <Button className="select-none" onClick={onClickSubmit(targetUOId, idVal, pwVal)}>
          Submit
        </Button>
        <Button
          className="select-none flex flex-row justify-center items-center"
          onClick={onClickDelete}>
          <DeleteIcon />
        </Button>
        <Button className="select-none" onClick={onClickCancel}>
          Cancel
        </Button>
      </div>
    </Modal>
  )
}
