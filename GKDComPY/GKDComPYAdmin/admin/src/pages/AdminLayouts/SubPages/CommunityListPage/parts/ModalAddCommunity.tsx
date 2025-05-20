import {ChangeEvent, CSSProperties, FC, MouseEvent, useCallback, useState} from 'react'
import {DivCommonProps} from '../../../../../common'
import {Button, Input, Modal, Text3XL, Text5XL} from '../../../../../common/components'
import {useCommunityListContext} from '../CommunityListPage'

type ModalAddCommunityProps = DivCommonProps & {
  //
}
export const ModalAddCommunity: FC<ModalAddCommunityProps> = ({className, ...props}) => {
  const {setIsModalAddComm, addCommunity} = useCommunityListContext()

  const [idVal, setIdVal] = useState<string>('')

  const styleBlocks: CSSProperties = {
    width: '500px',
    height: '330px'
  }
  const styleName: CSSProperties = {
    width: '7rem',
    userSelect: 'none',
    textAlign: 'center'
  }
  const styleInput: CSSProperties = {
    borderRadius: '0.5rem',
    fontSize: '1.125rem',

    paddingLeft: '6px',
    paddingRight: '6px',
    paddingTop: '3px',
    paddingBottom: '3px',

    width: '15rem'
  }

  const onChangeInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setIdVal(e.currentTarget.value)
  }, [])

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setIsModalAddComm(false)
    },
    [setIsModalAddComm]
  )
  const onClickSubmit = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      addCommunity(idVal)
      setIsModalAddComm(false)
    },
    [idVal, addCommunity, setIsModalAddComm]
  )

  return (
    <Modal onClose={() => {}} style={styleBlocks} {...props}>
      <Text5XL className="select-none mt-8">New Community</Text5XL>

      <div className="ROW_NAME flex flex-row mt-16">
        <Text3XL className="" style={styleName}>
          Name
        </Text3XL>
        <Input style={styleInput} value={idVal} onChange={onChangeInput} />
      </div>

      <div className="ROW_BTN flex flex-row mt-16 w-2/3 justify-between">
        <Button onClick={onClickSubmit}>Submit</Button>
        <Button onClick={onClickCancel}>Cancel</Button>
      </div>
    </Modal>
  )
}
