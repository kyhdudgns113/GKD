import {CSSProperties, FC, MouseEvent, useCallback} from 'react'
import {DivCommonProps, SAKURA_BORDER, SAKURA_TEXT} from '../../../common'
import {Text3XL} from '../../../common/components'
import {useTemplateStatesContext} from '../../../template/_contexts'
import {useEntireMemberCallbacksContext} from '../_contexts'

type HeadPartProps = DivCommonProps & {}

export const HeadPart: FC<HeadPartProps> = ({className, ...props}) => {
  const {commOId} = useTemplateStatesContext().comm
  const {loadData, setClub, saveArr} = useEntireMemberCallbacksContext()

  const cnBtn = `hover:bg-gkd-sakura-bg-70 bg-white`
  const styleBtn: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderRadius: '8px',
    borderWidth: '4px',

    color: SAKURA_TEXT,
    fontWeight: 700,
    marginTop: '16px',
    marginLeft: '8px',
    marginRight: '16px',

    paddingBottom: '4px',
    paddingTop: '4px',
    paddingLeft: '8px',
    paddingRight: '8px'
  }

  const onClickClub = useCallback(
    (commOId: string) => (e: MouseEvent<HTMLButtonElement>) => {
      setClub(commOId)
    },
    [setClub]
  )
  const onClickLoad = useCallback(
    (commOId: string) => (e: MouseEvent<HTMLButtonElement>) => {
      loadData(commOId)
    },
    [loadData]
  )
  const onClickSave = useCallback(
    (commOId: string) => (e: MouseEvent<HTMLButtonElement>) => {
      saveArr(commOId)
    },
    [saveArr]
  )

  return (
    <div className={`flex flex-col ${className}`} {...props}>
      {/* 타이틀 */}
      <Text3XL>클럽간 멤버이동을 테스트하는 곳입니다.</Text3XL>

      {/* 버튼 구역 */}
      <div className="flex flex-row">
        <button className={cnBtn} onClick={onClickSave(commOId)} style={styleBtn}>
          저장하기
        </button>
        <button className={cnBtn} onClick={onClickLoad(commOId)} style={styleBtn}>
          불러오기
        </button>
        <button className={cnBtn} onClick={onClickClub(commOId)} style={styleBtn}>
          클럽멤버
        </button>
      </div>
    </div>
  )
}
