import {CSSProperties, FC, MouseEvent, useCallback, useEffect, useState} from 'react'
import {DivCommonProps} from '../../../../../common'
import {useCommunityListContext} from '../CommunityListPage'
import {CommunityInfoType} from '../../../../../common/shareTypes'
import {Icon} from '../../../../../common/components'

type CommunityListPartProps = DivCommonProps & {
  //
}
export const CommunityListPart: FC<CommunityListPartProps> = ({className, ...props}) => {
  const {comms, setCommOId, setIsModalAddComm} = useCommunityListContext()

  const [commArr, setCommArr] = useState<CommunityInfoType[]>([])

  const cnTable = 'table-auto border-gkd-sakura-border '
  const cnTD =
    'border-gkd-sakura-border border-2 hover:bg-gkd-sakura-bg select-none cursor-pointer p-1'

  const cnTH = 'border-gkd-sakura-border text-2xl border-x-2 border-y-4 py-1 px-2'

  const styleTable: CSSProperties = {
    borderWidth: '6px',
    borderCollapse: 'collapse',
    tableLayout: 'auto'
  }
  const styleName: CSSProperties = {
    width: '10rem',
    textAlign: 'center'
  }

  const onClickOpenModal = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      setIsModalAddComm(true)
    },
    [setIsModalAddComm]
  )
  const onClickEntirePartDiv = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      setCommOId('')
    },
    [setCommOId]
  )
  const onClickTableCell = useCallback(
    (commInfo: CommunityInfoType) => (e: MouseEvent<HTMLTableCellElement>) => {
      e.stopPropagation()
      setCommOId(commInfo.commOId)
    },
    [setCommOId]
  )

  // 공동체 이름순으로 정렬
  useEffect(() => {
    const newArr = Object.keys(comms).map(commOId => comms[commOId])
    newArr.sort((com1, com2) => com1.name.localeCompare(com2.name))
    setCommArr(newArr)
  }, [comms])

  return (
    <div
      className={`flex flex-col text-gkd-sakura-text ${className}`}
      onClick={onClickEntirePartDiv}
      {...props} //
    >
      <Icon
        className="mt-6 ml-8 text-4xl select-none cursor-pointer w-fit"
        iconName="communities"
        onClick={onClickOpenModal}
      />
      <table className={`mt-4 ml-8 ${cnTable}`} style={styleTable}>
        <thead className="select-none">
          <tr>
            <th className={`${cnTH}`} style={styleName}>
              공동체 이름
            </th>
          </tr>
        </thead>
        <tbody>
          {commArr.map((commInfo, comIdx) => (
            <tr key={`commInfo:${comIdx}`}>
              <td className={`${cnTD}`} onClick={onClickTableCell(commInfo)} style={styleName}>
                {commInfo.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
