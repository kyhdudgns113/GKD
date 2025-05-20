import {CSSProperties, FC, useCallback} from 'react'
import {TableBodyCommonProps} from '../../../common'
import {DailyRecordType} from '../../../common/typesAndValues/shareTypes'
import {RecordRowAddon} from '../addons'

type RecordBodyBlockProps = TableBodyCommonProps & {
  mentWidth: number
  recordsArr: DailyRecordType[]
}

export const RecordBodyBlock: FC<RecordBodyBlockProps> = ({
  mentWidth,
  recordsArr,
  // BLANK LINE COMMENT:
  className,
  ...props
}) => {
  const NullObject = useCallback(() => {
    const styleTemp: CSSProperties = {
      height: '100px',
      textAlign: 'center',
      alignContent: 'center'
    }

    return (
      <tr style={styleTemp}>
        <td colSpan={7}>최근 기록이 없습니다.</td>
      </tr>
    )
  }, [])

  return (
    <tbody className={`${className}`} {...props}>
      {recordsArr.length === 0
        ? NullObject()
        : recordsArr.map((record, idx) => {
            return <RecordRowAddon key={`key${idx}`} record={record} mentWidth={mentWidth} />
          })}
    </tbody>
  )
}
