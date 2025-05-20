import {CSSProperties, FC, MouseEvent, useCallback} from 'react'
import {SAKURA_BORDER, TableHeadCommonProps} from '../../../common'
import {useClubRecordStatesContext} from '../_contexts'
import {IconBlue} from '../../../common/components'

type THeadBlockProps = TableHeadCommonProps & {}
export const THeadBlock: FC<THeadBlockProps> = ({className, ...props}) => {
  const {weeklyRecord, setSelColIdx} = useClubRecordStatesContext()

  const styleCategory: CSSProperties = {
    fontSize: '1.125rem',
    borderColor: SAKURA_BORDER, // sakura-border
    borderWidth: '2px',
    borderRightWidth: '6px'
  }
  const styleday: CSSProperties = {
    // fontSize: '1.125rem',
    borderColor: SAKURA_BORDER, // sakura-border
    borderWidth: '2px',
    borderRightWidth: '4px'
  }
  const styleHead: CSSProperties = {
    backgroundColor: 'rgba(248, 232, 224, 0.7)',
    borderColor: 'rgb(240, 184, 184)',
    color: 'rgb(248, 152, 144)',
    flexShrink: 0,
    fontWeight: 700
  }
  const styleWeek: CSSProperties = {
    borderColor: SAKURA_BORDER, // sakura-border
    borderBottomWidth: '2px',
    borderRightWidth: '4px'
  }
  const styleWeekCategory: CSSProperties = {
    borderColor: SAKURA_BORDER, // sakura-border
    borderRightWidth: '2px',
    width: '20px'
  }
  const styleWeekV: CSSProperties = {
    borderColor: SAKURA_BORDER, // sakura-border
    borderRightWidth: '4px',
    width: '20px'
  }
  // BLANK LINE COMMENT:
  const styleStar: CSSProperties = {
    borderWidth: '2px',
    borderColor: SAKURA_BORDER, // sakura-border
    width: '24px'
  }
  const styleName: CSSProperties = {
    borderWidth: '2px',
    borderColor: SAKURA_BORDER, // sakura-border
    width: '116px'
  }
  const styleBatter: CSSProperties = {
    borderWidth: '2px',
    borderColor: SAKURA_BORDER, // sakura-border
    width: '40px'
  }
  const stylePitcher: CSSProperties = {
    borderWidth: '2px',
    borderColor: SAKURA_BORDER, // sakura-border
    width: '40px'
  }
  const styleTotal: CSSProperties = {
    borderWidth: '2px',
    borderRightWidth: '6px',
    borderColor: SAKURA_BORDER, // sakura-border
    width: '40px'
  }
  const styleCond: CSSProperties = {
    borderWidth: '2px',
    borderColor: SAKURA_BORDER, // sakura-border
    width: '28px'
  }
  const styleRes: CSSProperties = {
    borderWidth: '2px',
    borderColor: SAKURA_BORDER, // sakura-border
    width: '28px'
  }
  const styleInfo: CSSProperties = {
    borderWidth: '2px',
    borderColor: SAKURA_BORDER, // sakura-border
    width: '28px'
  }

  const onClickSelCol = useCallback(
    (idx: number) => (e: MouseEvent<HTMLTableCellElement>) => {
      setSelColIdx(idx)
    },
    [setSelColIdx]
  )

  if (!weeklyRecord.colInfo.dateInfo[0]) return null
  return (
    <thead className={`${className}`} style={styleHead} {...props}>
      {/* 0행: 주간통계 및 요일 */}
      <tr className={``}>
        {/* 0행_1: 주간 통계 */}
        <td rowSpan={4} colSpan={5} style={styleWeek}>
          주간 통계
        </td>

        {/* 0행_2: 요일 */}
        <td colSpan={5} style={styleCategory}>
          요일
        </td>
        <td className="w-fit" colSpan={5} style={styleday}>
          월
        </td>
        <td className="w-fit" colSpan={5} style={styleday}>
          화
        </td>
        <td className="w-fit" colSpan={5} style={styleday}>
          수
        </td>
        <td className="w-fit" colSpan={5} style={styleday}>
          목
        </td>
        <td className="w-fit" colSpan={5} style={styleday}>
          금
        </td>
        <td className="w-fit" colSpan={5} style={styleday}>
          토
        </td>
      </tr>

      {/* 1행: 상대 클럽 */}
      <tr className={``}>
        <td colSpan={5} style={styleCategory}>
          상대클럽
        </td>
        <td colSpan={5} onClick={onClickSelCol(0)} style={styleday}>
          {weeklyRecord.colInfo.dateInfo[0].enemyName}
        </td>
        <td colSpan={5} onClick={onClickSelCol(1)} style={styleday}>
          {weeklyRecord.colInfo.dateInfo[1].enemyName}
        </td>
        <td colSpan={5} onClick={onClickSelCol(2)} style={styleday}>
          {weeklyRecord.colInfo.dateInfo[2].enemyName}
        </td>
        <td colSpan={5} onClick={onClickSelCol(3)} style={styleday}>
          {weeklyRecord.colInfo.dateInfo[3].enemyName}
        </td>
        <td colSpan={5} onClick={onClickSelCol(4)} style={styleday}>
          {weeklyRecord.colInfo.dateInfo[4].enemyName}
        </td>
        <td colSpan={5} onClick={onClickSelCol(5)} style={styleday}>
          {weeklyRecord.colInfo.dateInfo[5].enemyName}
        </td>
      </tr>

      {/* 2행: 선발 순서 */}
      <tr className={``}>
        <td colSpan={5} style={styleCategory}>
          선발순서
        </td>
        <td colSpan={5} onClick={onClickSelCol(0)} style={styleday}>
          {weeklyRecord.colInfo.dateInfo[0].pitchOrder}
        </td>
        <td colSpan={5} onClick={onClickSelCol(1)} style={styleday}>
          {weeklyRecord.colInfo.dateInfo[1].pitchOrder}
        </td>
        <td colSpan={5} onClick={onClickSelCol(2)} style={styleday}>
          {weeklyRecord.colInfo.dateInfo[2].pitchOrder}
        </td>
        <td colSpan={5} onClick={onClickSelCol(3)} style={styleday}>
          {weeklyRecord.colInfo.dateInfo[3].pitchOrder}
        </td>
        <td colSpan={5} onClick={onClickSelCol(4)} style={styleday}>
          {weeklyRecord.colInfo.dateInfo[4].pitchOrder}
        </td>
        <td colSpan={5} onClick={onClickSelCol(5)} style={styleday}>
          {weeklyRecord.colInfo.dateInfo[5].pitchOrder}
        </td>
      </tr>

      {/* 3행: 클전 오더 */}
      <tr className={``}>
        <td colSpan={5} style={styleCategory}>
          클전오더
        </td>
        <td colSpan={5} onClick={onClickSelCol(0)} style={styleday}>
          {weeklyRecord.colInfo.dateInfo[0].order}
        </td>
        <td colSpan={5} onClick={onClickSelCol(1)} style={styleday}>
          {weeklyRecord.colInfo.dateInfo[1].order}
        </td>
        <td colSpan={5} onClick={onClickSelCol(2)} style={styleday}>
          {weeklyRecord.colInfo.dateInfo[2].order}
        </td>
        <td colSpan={5} onClick={onClickSelCol(3)} style={styleday}>
          {weeklyRecord.colInfo.dateInfo[3].order}
        </td>
        <td colSpan={5} onClick={onClickSelCol(4)} style={styleday}>
          {weeklyRecord.colInfo.dateInfo[4].order}
        </td>
        <td colSpan={5} onClick={onClickSelCol(5)} style={styleday}>
          {weeklyRecord.colInfo.dateInfo[5].order}
        </td>
      </tr>

      {/* 4행: 카테고리 */}
      <tr className={`border-gkd-sakura-border`} style={{...props.style, borderBottomWidth: '6px'}}>
        <td style={styleWeekCategory}>컨</td>
        <td style={styleWeekCategory}>무</td>
        <td style={styleWeekCategory}>패</td>
        <td style={styleWeekCategory}>미</td>
        <td style={styleWeekV}>V</td>
        {/* 왕관 */}
        <td style={styleStar}>
          <IconBlue className="" iconName="star" />
        </td>
        <td style={styleName}>닉네임</td>
        <td style={styleBatter}>타자</td>
        <td style={stylePitcher}>투수</td>
        <td style={styleTotal}>총합</td>
        {/* 월 */}
        <td style={styleCond}>컨</td>
        <td style={styleRes}>1</td>
        <td style={styleRes}>2</td>
        <td style={styleRes}>3</td>
        <td style={{...styleInfo, borderRightWidth: '4px'}}>
          <IconBlue iconName="info" />
        </td>
        {/* 화 */}
        <td style={styleCond}>컨</td>
        <td style={styleRes}>1</td>
        <td style={styleRes}>2</td>
        <td style={styleRes}>3</td>
        <td style={{...styleInfo, borderRightWidth: '4px'}}>
          <IconBlue iconName="info" />
        </td>
        {/* 수 */}
        <td style={styleCond}>컨</td>
        <td style={styleRes}>1</td>
        <td style={styleRes}>2</td>
        <td style={styleRes}>3</td>
        <td style={{...styleInfo, borderRightWidth: '4px'}}>
          <IconBlue iconName="info" />
        </td>
        {/* 목 */}
        <td style={styleCond}>컨</td>
        <td style={styleRes}>1</td>
        <td style={styleRes}>2</td>
        <td style={styleRes}>3</td>
        <td style={{...styleInfo, borderRightWidth: '4px'}}>
          <IconBlue iconName="info" />
        </td>
        {/* 금 */}
        <td style={styleCond}>컨</td>
        <td style={styleRes}>1</td>
        <td style={styleRes}>2</td>
        <td style={styleRes}>3</td>
        <td style={{...styleInfo, borderRightWidth: '4px'}}>
          <IconBlue iconName="info" />
        </td>
        {/* 토 */}
        <td style={styleCond}>컨</td>
        <td style={styleRes}>1</td>
        <td style={styleRes}>2</td>
        <td style={styleRes}>3</td>
        <td style={{...styleInfo, borderRightWidth: '4px'}}>
          <IconBlue iconName="info" />
        </td>
      </tr>
    </thead>
  )
}
