import {CSSProperties, FC, MouseEvent, useCallback, useState} from 'react'
import {DivCommonProps} from '../../../../../common'
import {Button, Input, Modal, Text3XL, Text5XL} from '../../../../../common/components'
import {useCommunityListContext} from '../CommunityListPage'

type ModalAddClubToCommProps = DivCommonProps & {
  //
}
export const ModalAddClubToComm: FC<ModalAddClubToCommProps> = ({className, ...props}) => {
  const {isModalAddClub: commOId, addClub, setIsModalAddClub} = useCommunityListContext()

  const [nameVal, setNameVal] = useState<string>('')

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

  const onClickSubmit = useCallback(
    (commOId: string, nameVal: string) => async (e: MouseEvent<HTMLButtonElement>) => {
      const isSuccess = await addClub(commOId, nameVal)
      if (isSuccess) {
        setIsModalAddClub('')
      } // BLANK LINE COMMENT:
      else {
        // DO NOTHING:
        // 에러 메시지는 저기 catch 할때 나온다.
      }
    },
    [addClub, setIsModalAddClub]
  )
  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setIsModalAddClub('')
    },
    [setIsModalAddClub]
  )

  return (
    <Modal className={` ${className}`} onClose={() => setIsModalAddClub('')} {...props}>
      <div className={`flex flex-col items-center`} style={styleBlock}>
        <Text5XL>클럽 추가</Text5XL>
        <div className={`ROW_ID mt-10 ${cnDiv}`}>
          <Text3XL style={styleCategory}>클럽명</Text3XL>
          <Input
            onChange={e => setNameVal(e.currentTarget.value)}
            style={styleInput}
            value={nameVal}
          />
        </div>
        <div className="flex flex-row w-2/3 justify-between mt-8">
          <Button onClick={onClickSubmit(commOId, nameVal)}>Submit</Button>
          <Button onClick={onClickCancel}>Cancel</Button>
        </div>
      </div>
    </Modal>
  )
}
