import {CSSProperties, FC, useCallback, useEffect, useState} from 'react'
import {DivCommonProps} from '../../common'
import {useTemplateStatesContext} from '../_context'

type TableRowProps = DivCommonProps & {}
export const TableRow: FC<TableRowProps> = ({className, ...props}) => {
  const {setPageState} = useTemplateStatesContext()

  const [isHover, setIsHover] = useState<boolean>(false)

  const styleRow: CSSProperties = {
    backgroundColor: isHover ? '#DDDDDD' : 'transparent',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',

    marginBottom: '16px',
    paddingBottom: '8px',
    paddingLeft: '16px',
    paddingTop: '8px'
  }

  const onClick = useCallback(() => {
    setPageState('gameTable')
  }, [setPageState])
  const onMouseEnter = useCallback(() => {
    setIsHover(true)
  }, [])
  const onMouseLeave = useCallback(() => {
    setIsHover(false)
  }, [])

  // Init states
  useEffect(() => {
    setIsHover(false)
  }, [])
  return (
    <div
      className={`ROW_TABLE ${className || ''}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={styleRow}
      {...props} // BLANK LINE COMMENT:
    >
      <p>게임 테이블</p>
    </div>
  )
}
