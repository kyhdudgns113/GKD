import {CSSProperties, FC, KeyboardEvent, MouseEvent, useCallback, useEffect, useState} from 'react'
import {DivCommonProps} from '../../../common'
import {Button, Input, Modal, Text3XL, Text5XL} from '../../../common/components'
import {useMainPageStatesContext} from '../_contexts'
import {useTemplateStatesContext, useTemplateCallbacksContext} from '../../../template/_contexts'
type ModalAddClubProps = DivCommonProps & {
  //
}
export const ModalAddClub: FC<ModalAddClubProps> = ({className, ...props}) => {
  const {comm} = useTemplateStatesContext()
  const {addClub} = useTemplateCallbacksContext()
  const {keyDownESC, setIsAddClubModal, setKeyDownESC} = useMainPageStatesContext()

  const [nameVal, setNameVal] = useState<string>('')

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
      setIsAddClubModal('')
    },
    [setIsAddClubModal]
  )
  const onClickSubmit = useCallback(
    (name: string) => (e: MouseEvent<HTMLButtonElement> | null) => {
      const commOId = comm.commOId
      if (!name) {
        alert('공란이 있어요 ㅠㅠ')
        return
      }
      const url = name === '탈퇴' ? '/client/main/addBanClub' : '/client/main/addClub'
      addClub(url, commOId, name)
      setIsAddClubModal('')
    },
    [comm, addClub, setIsAddClubModal]
  )
  const onKeyDownModal = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'enter' || e.key === 'Enter') {
        onClickSubmit(nameVal)(null)
      } // BLANK LINE COMMENT:
      else if (e.key === 'esc' || e.key === 'ESC' || e.key === 'Escape') {
        setIsAddClubModal('')
      }
    },
    [nameVal, onClickSubmit, setIsAddClubModal]
  )
  // KeyDown : ESC
  useEffect(() => {
    if (keyDownESC) {
      setIsAddClubModal('')
      setKeyDownESC(false)
    }
  }, [keyDownESC, setIsAddClubModal, setKeyDownESC])

  return (
    <Modal
      onClose={() => {}}
      className={` ${className}`}
      onKeyDown={onKeyDownModal}
      style={styleBlock}
      {...props} // BLANK LINE COMMENT:
    >
      <Text5XL>클럽 추가</Text5XL>

      <div className="flex flex-row mt-12">
        <Text3XL style={styleName}>이름</Text3XL>
        <Input
          onChange={e => setNameVal(e.currentTarget.value)}
          style={styleInput}
          value={nameVal}
        />
      </div>

      <div className="flex flex-row mt-8 ">
        <Button onClick={onClickSubmit(nameVal)}>Submit</Button>
        <Button className="ml-12" onClick={onClickCancel}>
          Cancel
        </Button>
      </div>
    </Modal>
  )
}
