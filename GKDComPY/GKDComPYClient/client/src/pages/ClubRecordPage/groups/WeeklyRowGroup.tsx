import {CSSProperties, FC, MouseEvent, useCallback, useEffect, useState} from 'react'
import {DivCommonProps, SAKURA_BORDER, SAKURA_TEXT} from '../../../common'
import {WeeklyRecordType} from '../../../common/typesAndValues/shareTypes'
import {useClubContext} from '../../../contexts'
import {useClubRecordStatesContext} from '../_contexts'

type WeeklyRowGroupProps = DivCommonProps & {}
export const WeeklyRowGroup: FC<WeeklyRowGroupProps> = ({className, ...props}) => {
  const {weekRowsArr} = useClubContext()
  const {setWeekOId} = useClubRecordStatesContext()

  const [realArr, setRealArr] = useState<WeeklyRecordType[]>([])

  const styleDiv: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderWidth: '4px',
    marginTop: '12px',
    marginBottom: '12px',
    paddingTop: '12px',
    paddingBottom: '12px'
  }
  const styleInnerDiv: CSSProperties = {
    maxHeight: '500px',
    overflowY: 'auto',
    paddingLeft: '16px',
    paddingRight: '16px'
  }
  const styleDivRow: CSSProperties = {
    alignItems: 'center',
    borderColor: 'transparent',
    borderWidth: '2px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: '1px',
    paddingLeft: '4px',
    paddingRight: '4px',
    userSelect: 'none',
    width: '100%'
  }
  const styleText: CSSProperties = {
    color: SAKURA_TEXT,
    fontSize: '1.125rem',
    fontWeight: 700,
    lineHeight: '1.375rem'
  }

  const onClickSetWeekOId = useCallback(
    (weekRow: WeeklyRecordType) => (e: MouseEvent<HTMLDivElement>) => {
      setWeekOId(weekRow.weekOId)
    },
    [setWeekOId]
  )

  // Reverse weekRowsArr
  useEffect(() => {
    if (weekRowsArr) {
      const newArr = [...weekRowsArr]
      newArr.reverse()
      setRealArr(newArr)
    }
  }, [weekRowsArr])

  if (realArr.length === 0) return null

  return (
    <div className={`${className}`} style={styleDiv} {...props}>
      <div style={styleInnerDiv}>
        {realArr.map((weekRow, weekIdx) => {
          return (
            <div
              className="hover:bg-gkd-sakura-bg hover:border-gkd-sakura-border"
              key={`wRow:${weekIdx}`}
              onClick={onClickSetWeekOId(weekRow)}
              style={styleDivRow} // BLANK LINE COMMENT:
            >
              <p style={styleText}>{weekRow.start}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
