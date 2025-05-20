import {CSSProperties, FC, useEffect, useRef} from 'react'
import {SAKURA_BORDER, Setter, TableHeadCommonProps} from '../../../common'

type RecordHeadBlockProps = TableHeadCommonProps & {setWidth: Setter<number>}

export const RecordHeadBlock: FC<RecordHeadBlockProps> = ({setWidth, className, ...props}) => {
  const mentRef = useRef<HTMLTableCellElement>(null)

  const styleCategory: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderBottomWidth: '4px',
    color: '#F89890',
    textAlign: 'center'
  }
  const styleCDate: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderRightWidth: '2px',
    width: '4rem'
  }
  const styleCCond: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderRightWidth: '2px',
    width: '1.8rem'
  }
  const styleTitle: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderBottomWidth: '4px',
    color: '#F89890',
    fontSize: '1.5rem',
    fontWeight: 700,
    height: '44px',
    lineHeight: '2rem',
    padding: '4px',
    textAlign: 'center',
    width: '100%'
  }

  // Set Comment's width
  useEffect(() => {
    if (mentRef && mentRef.current) {
      setWidth(mentRef.current.clientWidth)
    }
  }, [mentRef, setWidth])

  return (
    <thead className={`${className}`} {...props}>
      <tr style={styleTitle}>
        <td colSpan={7}>최근 8주 기록</td>
      </tr>
      <tr style={styleCategory}>
        <td style={styleCDate}>날짜</td>
        <td style={styleCCond}>컨</td>
        <td style={styleCCond}>1</td>
        <td style={styleCCond}>2</td>
        <td style={styleCCond}>3</td>
        <td style={styleCCond} ref={mentRef}>
          ?
        </td>
        <td>클럽</td>
      </tr>
    </thead>
  )
}
