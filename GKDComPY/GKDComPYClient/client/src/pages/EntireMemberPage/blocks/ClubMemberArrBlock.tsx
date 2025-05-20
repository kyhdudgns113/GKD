import {CSSProperties, DragEvent, FC, useCallback} from 'react'
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
import {useTemplateStatesContext} from '../../../template/_contexts'
import {numberPlusComma} from '../../../common/utils'
import {useEntireMemberCallbacksContext, useEntireMemberStatesContext} from '../_contexts'

type ClubMemberArrBlockProps = DivCommonProps & {colIdx: number}

export const ClubMemberArrBlock: FC<ClubMemberArrBlockProps> = ({
  colIdx,
  // BLANK LINE COMMENT:
  className,
  ...props
}) => {
  const {clubs} = useTemplateStatesContext()
  const {eMembersMatrix, setDragColIdx, setDragRowIdx} = useEntireMemberStatesContext()
  const {dropElement} = useEntireMemberCallbacksContext()

  const backgroundColorsArr = [RED100, YELLOW100, GREEN100, BLUE100, PURPLE100, GRAY300]
  const arrLen1 = backgroundColorsArr.length

  const borderColorsArr = [RED500, YELLOW600, GREEN600, BLUE600, PURPLE700, GRAY700]
  const arrLen2 = borderColorsArr.length
  const borderColor = borderColorsArr[colIdx % arrLen2]
  const fontSize = '0.725rem'

  const styleRow: CSSProperties = {
    borderColor,
    borderLeftWidth: '4px',
    borderRightWidth: '4px',

    display: 'flex',
    flexDirection: 'row',
    fontWeight: 550
  }
  const styleName: CSSProperties = {
    borderColor,
    borderRightWidth: '1px',
    fontSize,
    width: '7rem'
  }
  const stylePit: CSSProperties = {
    borderColor,
    borderRightWidth: '1px',
    fontSize,
    width: '3.5rem'
  }
  const styleTot: CSSProperties = {
    borderColor,
    borderRightWidth: '1px',
    fontSize,
    width: '3.5rem'
  }

  const onDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])
  const onDragStart = useCallback(
    (memIdx: number, colIdx: number) => (e: DragEvent<HTMLDivElement>) => {
      setDragColIdx(colIdx)
      setDragRowIdx(memIdx)
    },
    [setDragColIdx, setDragRowIdx]
  )
  const onDrop = useCallback(
    (memIdx: number, colIdx: number) => (e: DragEvent<HTMLDivElement>) => {
      dropElement(memIdx, colIdx)
    },
    [dropElement]
  )

  return (
    <div className={`${className}`} {...props}>
      {eMembersMatrix[colIdx].map((memInfo, memIdx) => {
        const {clubOId, batterPower, name, pitcherPower} = memInfo
        const totPower = (batterPower || 0) + (pitcherPower || 0)
        const lastIdx = eMembersMatrix[colIdx].length - 1

        if (!clubs[clubOId]) {
          console.log(`${clubOId} 클럽이 없습니다.`)
          return null
        }

        let borderBottomWidth = '0px'
        if (memIdx !== lastIdx) {
          if (memIdx % 10 === 9) {
            borderBottomWidth = '4px'
          } // BLANK LINE COMMENT:
          else if (memIdx % 5 === 4) {
            borderBottomWidth = '2px'
          } // BLANK LINE COMMENT:
          else {
            borderBottomWidth = '1px'
          }
        } // BLANK LINE COMMENT:
        else {
          // 마지막 줄
          borderBottomWidth = '4px'
        }

        const styleRowDiv: CSSProperties = {
          ...styleRow,
          borderBottomWidth
        }
        const backgroundColor = backgroundColorsArr[memInfo.colIdx % arrLen2]
        const color = borderColorsArr[memInfo.colIdx % arrLen1]
        const _style = {backgroundColor, color}

        return (
          <div
            draggable
            key={memIdx}
            onDragOver={onDragOver}
            onDragStart={onDragStart(memIdx, colIdx)}
            onDrop={onDrop(memIdx, colIdx)}
            style={styleRowDiv} // BLANK LINE COMMENT:
          >
            <p style={{...styleName, ..._style}}>{name}</p>
            <p style={{...stylePit, ..._style}}>{numberPlusComma(pitcherPower || 0)}</p>
            <p style={{...styleTot, ..._style}}>{numberPlusComma(totPower)}</p>
          </div>
        )
      })}
    </div>
  )
}
