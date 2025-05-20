import {CSSProperties, FC, MouseEvent, useCallback, useEffect, useState} from 'react'
import {DivCommonProps} from '../../../common'
import {Button, InputCell, Modal, Text3XL, Text5XL} from '../../../common/components'
import {AddMemberDataType} from '../../../common/typesAndValues/httpDataTypes'
import {useTemplateStatesContext} from '../../../template/_contexts'
import {postWithJwt} from '../../../common/server'
import {alertErrors, writeJwtFromServer} from '../../../common/utils'
import {useClubMemberStatesContext} from '../_contexts'
import {useClubContext} from '../../../contexts'

type ModalAddMemberPartProps = DivCommonProps & {}
export const ModalAddMemberPart: FC<ModalAddMemberPartProps> = ({className, ...props}) => {
  const {comm} = useTemplateStatesContext()
  const {isAddMemModal: clubOId, setMembers, setIsAddMemModal} = useClubContext()
  const {keyDownESC, setKeyDownESC} = useClubMemberStatesContext()

  const [batVal, setBatVal] = useState<number>(0)
  const [nameVal, setNameVal] = useState<string>('')
  const [pitchVal, setPitchVal] = useState<number>(0)

  const cnBdCt = 'border-gkd-sakura-border '
  const styleBlock: CSSProperties = {
    backgroundColor: '#FFFFFF',
    paddingBottom: '20px',
    width: '550px'
  }
  const styleName: CSSProperties = {
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    width: '12rem'
  }
  const stylePower: CSSProperties = {
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    width: '6.5rem'
  }

  const onClickSubmit = useCallback(
    (clubOId: string, name: string, batterPower: number, pitcherPower: number) =>
      (e: MouseEvent<HTMLButtonElement>) => {
        const url = `/client/club/addMemberReq`
        const data: AddMemberDataType = {
          name: name,
          commOId: comm.commOId,
          clubOId,
          batterPower,
          pitcherPower
        }
        postWithJwt(url, data)
          .then(res => res.json())
          .then(res => {
            const {ok, body, errObj, jwtFromServer} = res
            if (ok) {
              const {members, legacyMembersArr} = body
              writeJwtFromServer(jwtFromServer)

              if (members !== null) {
                setMembers(body.members)
                setIsAddMemModal('')
              } // BLANK LINE COMMENT:
              else {
                alert(`
                  Legacy Member는 아직 구현이 안되었는데?! ${legacyMembersArr}\n
                  모달에서 처리해주세요 ><
                  `)
              }
            } // BLANK LINE COMMENT:
            else {
              alertErrors(`${url} ELSE`, errObj)
            }
          })
          .catch(errObj => alertErrors(`${url} CATCH`, errObj))
      },
    [comm, setIsAddMemModal, setMembers]
  )

  // Key Down : ESC
  useEffect(() => {
    if (keyDownESC) {
      setIsAddMemModal('')
      setKeyDownESC(false)
    }
  }, [keyDownESC, setIsAddMemModal, setKeyDownESC])

  return (
    <Modal
      className={` ${className}`}
      onClose={() => {}}
      style={styleBlock}
      {...props} // BLANK LINE COMMENT:
    >
      <Text5XL className="select-none mt-4">멤버 추가</Text5XL>

      {/* 멤버 데이터 입력부분 */}
      <div className="border-4 border-gkd-sakura-border mt-8">
        {/* 카테고리 */}
        <div className="flex flex-row select-none">
          <Text3XL className={`border-r-2 border-b-4 py-1 ${cnBdCt}`} style={styleName}>
            닉네임
          </Text3XL>
          <Text3XL className={`border-r-2 border-b-4 py-1 ${cnBdCt}`} style={stylePower}>
            타자
          </Text3XL>
          <Text3XL className={`border-b-4 py-1 ${cnBdCt}`} style={stylePower}>
            투수
          </Text3XL>
        </div>

        {/* 입력 */}
        <div className="flex flex-row">
          <InputCell
            className={`border-r-2 text-xl py-1 ${cnBdCt}`}
            onChange={e => setNameVal(e.currentTarget.value)}
            style={styleName}
            value={nameVal}
          />
          <InputCell
            className={`border-r-2 text-xl py-1 ${cnBdCt}`}
            onChange={e => setBatVal(parseInt(e.currentTarget.value))}
            style={stylePower}
            type="number"
            value={batVal}
          />
          <InputCell
            className={`text-xl py-1 ${cnBdCt}`}
            onChange={e => setPitchVal(parseInt(e.currentTarget.value))}
            style={stylePower}
            type="number"
            value={pitchVal}
          />
        </div>
      </div>

      <div className="flex flex-row justify-between w-2/3 mt-6">
        <Button onClick={onClickSubmit(clubOId, nameVal, batVal, pitchVal)}>Submit</Button>
        <Button onClick={e => setIsAddMemModal('')}>Cancel</Button>
      </div>
    </Modal>
  )
}
