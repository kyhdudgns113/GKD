import {CSSProperties, FC, useCallback, useState} from 'react'
import {
  BLUE100,
  BLUE600,
  DivCommonProps,
  GRAY300,
  GRAY700,
  GREEN100,
  GREEN600,
  PURPLE100,
  PURPLE700,
  RED100,
  RED500,
  YELLOW100,
  YELLOW600
} from '../../../common'
import {useEntireMemberCallbacksContext} from '../_contexts'
type TableTitlesProps = DivCommonProps & {
  colIdx: number // 색깔 정하기 위해 배치
}

export const TableTitles: FC<TableTitlesProps> = ({
  colIdx,
  // BLANK LINE COMMENT:
  className,
  ...props
}) => {
  const {sortColumnArr} = useEntireMemberCallbacksContext()

  const [sortBy, setSortBy] = useState<string>('')

  const backgroundColorsArr = [RED100, YELLOW100, GREEN100, BLUE100, PURPLE100, GRAY300]
  const arrLen1 = backgroundColorsArr.length
  const backgroundColor = backgroundColorsArr[colIdx % arrLen1]

  const borderColorsArr = [RED500, YELLOW600, GREEN600, BLUE600, PURPLE700, GRAY700]
  const arrLen2 = borderColorsArr.length
  const borderColor = borderColorsArr[colIdx % arrLen2]

  const styleDiv: CSSProperties = {
    backgroundColor,
    borderColor,
    borderWidth: '4px',

    color: borderColor,
    display: 'flex',
    fontWeight: 700
  }
  const styleName: CSSProperties = {
    backgroundColor,
    borderColor,
    borderRightWidth: '1px',
    width: '7rem'
  }
  const stylePit: CSSProperties = {
    backgroundColor,
    borderColor,
    borderRightWidth: '1px',
    width: '3.5rem'
  }
  const styleTot: CSSProperties = {
    backgroundColor,
    borderColor,
    borderRightWidth: '1px',
    width: '3.5rem'
  }

  const onClickSortName = useCallback(() => {
    if (sortBy === 'name') {
      setSortBy('nameReverse')
      sortColumnArr(colIdx, 'nameReverse')
    } // BLANK LINE COMMENT:
    else {
      setSortBy('name')
      sortColumnArr(colIdx, 'name')
    }
  }, [sortBy, sortColumnArr, colIdx])
  const onClickSortPit = useCallback(() => {
    if (sortBy === 'pitcherPower') {
      setSortBy('pitcherPowerReverse')
      sortColumnArr(colIdx, 'pitcherPowerReverse')
    } // BLANK LINE COMMENT:
    else {
      setSortBy('pitcherPower')
      sortColumnArr(colIdx, 'pitcherPower')
    }
  }, [sortBy, sortColumnArr, colIdx])
  const onClickSortTot = useCallback(() => {
    if (sortBy === 'totalPower') {
      setSortBy('totalPowerReverse')
      sortColumnArr(colIdx, 'totalPowerReverse')
    } // BLANK LINE COMMENT:
    else {
      setSortBy('totalPower')
      sortColumnArr(colIdx, 'totalPower')
    }
  }, [sortBy, sortColumnArr, colIdx])

  return (
    <div className={`flex-row ${className}`} style={styleDiv} {...props}>
      <p style={styleName} onClick={onClickSortName}>
        이름
      </p>
      <p style={stylePit} onClick={onClickSortPit}>
        투
      </p>
      <p style={styleTot} onClick={onClickSortTot}>
        총
      </p>
    </div>
  )
}
