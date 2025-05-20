import {CSSProperties, FC, MouseEvent, useCallback, useState} from 'react'
import {DivCommonProps} from '../../../../../common'
import {useUserListContext} from '../UserListPage'
import {Button, Input, Modal, Text3XL, Text5XL} from '../../../../../common/components'

type ModalAddUserProps = DivCommonProps & {}
export const ModalAddUser: FC<ModalAddUserProps> = ({className, ...props}) => {
  const {setIsModalAddUser, addUser} = useUserListContext()

  const [idVal, setIdVal] = useState<string>('')
  const [pwVal, setPwVal] = useState<string>('')

  const categoryStyle: CSSProperties = {
    width: '6rem',

    textAlign: 'center',
    userSelect: 'none',
    verticalAlign: 'middle'
  }
  const divCN = 'flex flex-row items-center justify-center'
  const inputCN = 'focus:bg-gkd-sakura-bg'
  const inputStyle: CSSProperties = {
    width: '300px',

    borderRadius: '0.75rem',
    fontSize: '1.5rem',
    fontWeight: '700',
    paddingLeft: '8px',
    paddingTop: '4px',
    paddingBottom: '4px'
  }
  const modalBlockStyle: CSSProperties = {
    width: '480px',
    height: '460px'
  }

  /**
   * 여기서는 default 유저로써 관리자 행세를 하는 유저만 만든다 \
   * 진짜 관리자 권한이 있지는 않다
   */
  const onClickAddUser = useCallback(
    (id: string, pw: string) => (e: MouseEvent<HTMLButtonElement>) => {
      const commOId = 'admin'
      addUser(id, pw, commOId)
      setIsModalAddUser(false)
    },
    [setIsModalAddUser, addUser]
  )
  const onClickCloseModal = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setIsModalAddUser(false)
    },
    [setIsModalAddUser]
  )

  return (
    <Modal onClose={() => {}} style={modalBlockStyle} {...props}>
      <Text5XL className="mt-8 select-none">New User</Text5XL>
      <div className={`ROW_ID mt-10 ${divCN}`}>
        <Text3XL style={categoryStyle}>ID</Text3XL>
        <Input
          className={inputCN}
          onChange={e => setIdVal(e.currentTarget.value)}
          style={inputStyle}
          value={idVal}
        />
      </div>
      <div className={`ROW_PW mt-6 ${divCN}`}>
        <Text3XL style={categoryStyle}>PW</Text3XL>
        <Input
          className={inputCN}
          onChange={e => setPwVal(e.currentTarget.value)}
          style={inputStyle}
          value={pwVal}
        />
      </div>
      <div className={`ROW_BTN justify-between mt-14 ${divCN}`}>
        <Button onClick={onClickAddUser(idVal, pwVal)}>Submit</Button>
        <Button className="ml-20" onClick={onClickCloseModal}>
          Cancel
        </Button>
      </div>
    </Modal>
  )
}
