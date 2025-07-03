import {CSSProperties, FC} from 'react'
import {SAKURA_BORDER, TableHeadCommonProps} from '../../../../../common'

type LogTableHeadProps = TableHeadCommonProps & {}
export const LogTableHead: FC<LogTableHeadProps> = ({className, ...props}) => {
  // BLANK LINE COMMENT:

  const borderColor = SAKURA_BORDER

  // thead 에 줄이 너무 길어지는것을 방지한다.
  const styleRow: CSSProperties = {
    borderColor,
    borderBottomWidth: '4px',
    fontSize: '1.125rem',
    lineHeight: '1.625rem',
    fontWeight: 700,
    textAlign: 'center'
  }
  const styleDate: CSSProperties = {
    borderColor,
    borderRightWidth: '2px',
    width: '60px'
  }
  const styleTime: CSSProperties = {
    borderColor,
    borderRightWidth: '2px',
    width: '64px'
  }
  const styleUser: CSSProperties = {
    borderColor,
    borderRightWidth: '2px',
    width: '6rem'
  }
  const styleLog: CSSProperties = {
    borderColor,
    borderRightWidth: '2px',
    width: '12rem'
  }
  const styleState: CSSProperties = {
    borderColor,
    borderRightWidth: '2px',
    width: '3rem'
  }
  const styleGkd: CSSProperties = {
    borderColor,
    borderRightWidth: '2px',
    width: '3rem'
  }

  return (
    <thead className={`${className}`} {...props}>
      <tr style={styleRow}>
        <td style={styleDate}>날짜</td>
        <td style={styleTime}>시간</td>
        <td style={styleUser}>유저</td>
        <td style={styleLog}>내용</td>
        <td style={styleState}>상태</td>
        <td style={styleGkd}>GKD</td>
      </tr>
    </thead>
  )
}
