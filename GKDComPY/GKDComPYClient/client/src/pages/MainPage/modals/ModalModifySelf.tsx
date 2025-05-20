import {CSSProperties, FC, KeyboardEvent, MouseEvent, useCallback, useEffect, useState} from 'react'
import {DivCommonProps} from '../../../common'
import {Button, Input, Modal, Text3XL, Text5XL, TextXL} from '../../../common/components'
import {useMainPageStatesContext} from '../_contexts'
import {useTemplateStatesContext, useTemplateCallbacksContext} from '../../../template/_contexts'
type ModalModifySelfProps = DivCommonProps & {
  //
}
export const ModalModifySelf: FC<ModalModifySelfProps> = ({className, ...props}) => {
  const {users} = useTemplateStatesContext()
  const {modifySelf} = useTemplateCallbacksContext()
  const {isModifySelfModal: uOId, setIsModifySelfModal} = useMainPageStatesContext()
  const {keyDownESC, setKeyDownESC} = useMainPageStatesContext()

  const [idVal, setIdVal] = useState<string>('')
  const [prevName, setPrevName] = useState<string>('')
  const [prevPwVal, setPrevPwVal] = useState<string>('')
  const [pw1Val, setPw1Val] = useState<string>('')
  const [pw2Val, setPw2Val] = useState<string>('')

  const styleBlock: CSSProperties = {
    width: '500px',
    height: 'fit',

    paddingTop: '20px',
    paddingBottom: '20px'
  }
  const styleName: CSSProperties = {
    width: '150px',

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
      setIsModifySelfModal('')
    },
    [setIsModifySelfModal]
  )

  const onClickSubmit = useCallback(
    (uOId: string, id: string, prevPw: string, pw1: string, pw2: string) =>
      /**
       * 공란이면 안 바꾼다는 의미이다
       */
      (e: MouseEvent<HTMLButtonElement> | null) => {
        if (!id && !pw1) {
          alert('바꿀 정보가 없네요?')
          return
        }
        if (pw1 && (!prevPw || !pw2)) {
          alert('기존 비번과 새 비번2는 공란이어서 안됩니다.')
          return
        }
        if (pw1 && pw1 !== pw2) {
          alert('새 비번2 이 틀렸어요.')
          return
        }

        const url = `/client/main/modifySelf`
        modifySelf(url, uOId, id, prevPw, pw1)
        setIsModifySelfModal('')
      },
    [modifySelf, setIsModifySelfModal]
  )
  const onKeyDownModal = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'enter' || e.key === 'Enter') {
        onClickSubmit(uOId, idVal, prevPwVal, pw1Val, pw2Val)(null)
      } // BLANK LINE COMMENT:
      else if (e.key === 'esc' || e.key === 'ESC' || e.key === 'Escape') {
        setIsModifySelfModal('')
      }
    },
    [uOId, idVal, prevPwVal, pw1Val, pw2Val, onClickSubmit, setIsModifySelfModal]
  )

  // Set Previous Name
  useEffect(() => {
    setPrevName(users[uOId].id)
  }, [uOId, users])
  // Key Down : ESC
  useEffect(() => {
    if (keyDownESC) {
      setIsModifySelfModal('')
      setKeyDownESC(false)
    }
  }, [keyDownESC, setIsModifySelfModal, setKeyDownESC])

  return (
    <Modal onClose={() => {}} onKeyDown={onKeyDownModal} style={styleBlock}>
      <Text5XL>{prevName}</Text5XL>
      <TextXL className="mt-2">공란이면 안 바뀝니다.</TextXL>

      <div className="flex flex-row mt-8">
        <Text3XL style={styleName}>새 이름</Text3XL>
        <Input onChange={e => setIdVal(e.currentTarget.value)} style={styleInput} value={idVal} />
      </div>

      <div className="flex flex-row mt-8">
        <Text3XL style={styleName}>기존 비번</Text3XL>
        <Input
          onChange={e => setPrevPwVal(e.currentTarget.value)}
          style={styleInput}
          type="password"
          value={prevPwVal}
        />
      </div>

      <div className="flex flex-row mt-8">
        <Text3XL style={styleName}>새 비번 1</Text3XL>
        <Input
          onChange={e => setPw1Val(e.currentTarget.value)}
          style={styleInput}
          type="password"
          value={pw1Val}
        />
      </div>

      <div className="flex flex-row mt-8">
        <Text3XL style={styleName}>새 비번 2</Text3XL>
        <Input
          onChange={e => setPw2Val(e.currentTarget.value)}
          style={styleInput}
          type="password"
          value={pw2Val}
        />
      </div>

      <div className="flex flex-row mt-12">
        <Button onClick={onClickSubmit(uOId, idVal, prevPwVal, pw1Val, pw2Val)}>Submit</Button>
        <Button className="ml-12" onClick={onClickCancel}>
          Cancel
        </Button>
      </div>
    </Modal>
  )
}
