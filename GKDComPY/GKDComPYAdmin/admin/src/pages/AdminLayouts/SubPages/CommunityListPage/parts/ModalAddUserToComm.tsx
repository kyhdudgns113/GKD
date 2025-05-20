import {CSSProperties, FC, MouseEvent, useCallback, useState} from 'react'
import {DivCommonProps} from '../../../../../common'
import {Button, Input, Modal, Text3XL, Text5XL} from '../../../../../common/components'
import {useCommunityListContext} from '../CommunityListPage'

type ModalAddUserToCommProps = DivCommonProps & {}
export const ModalAddUserToComm: FC<ModalAddUserToCommProps> = ({className, ...props}) => {
  const {isModalAddUser: commOId, addUserToComm, setIsModalAddUser} = useCommunityListContext()

  const [idVal, setIdVal] = useState<string>('')
  const [pwVal, setPwVal] = useState<string>('')

  const cnDiv = 'flex flex-row items-center'
  const styleBlock: CSSProperties = {
    width: '500px',
    height: 'auto',

    paddingTop: '20px',
    paddingBottom: '20px'
  }
  const styleCategory: CSSProperties = {
    width: '6.5rem',
    textAlign: 'center',
    userSelect: 'none'
  }
  const styleInput: CSSProperties = {
    width: '18rem',
    borderRadius: '8px',
    fontSize: '1.5rem',

    marginLeft: '8px',

    paddingLeft: '4px',
    paddingRight: '4px',
    paddingTop: '2px',
    paddingBottom: '2px'
  }

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setIsModalAddUser('')
    },
    [setIsModalAddUser]
  )
  const onClickSubmit = useCallback(
    (id: string, password: string, commOId: string) => async (e: MouseEvent<HTMLButtonElement>) => {
      const isSuccess = await addUserToComm(id, password, commOId)
      if (isSuccess) {
        setIsModalAddUser('')
      } // BLANK LINE COMMENT:
      else {
        // DO NOTHING:
      }
    },
    [addUserToComm, setIsModalAddUser]
  )

  return (
    <Modal
      className={` ${className}`}
      onClose={() => {}}
      style={styleBlock}
      {...props} //
    >
      <Text5XL className="select-none">유저 추가</Text5XL>

      <div className={`ROW_ID mt-10 ${cnDiv}`}>
        <Text3XL style={styleCategory}>유저명</Text3XL>
        <Input onChange={e => setIdVal(e.currentTarget.value)} style={styleInput} value={idVal} />
      </div>

      <div className={`ROW_PW mt-6 ${cnDiv}`}>
        <Text3XL style={styleCategory}>PW</Text3XL>
        <Input onChange={e => setPwVal(e.currentTarget.value)} style={styleInput} value={pwVal} />
      </div>

      <div className="flex flex-row w-2/3 justify-between mt-8">
        <Button onClick={onClickSubmit(idVal, pwVal, commOId)}>Submit</Button>
        <Button onClick={onClickCancel}>Cancel</Button>
      </div>
    </Modal>
  )
}
