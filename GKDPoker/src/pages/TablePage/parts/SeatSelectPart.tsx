import {CSSProperties, FC, MouseEvent, useCallback} from 'react'
import {DivCommonProps} from '../../../common'
import {UserTableBodyObject, UserTableHeadObject, UserNameAndExitObject} from '../objects'

type SeatSelectPartProps = DivCommonProps & {}
export const SeatSelectPart: FC<SeatSelectPartProps> = ({className, ...props}) => {
  const stylePart: CSSProperties = {
    alignItems: 'center',
    borderColor: '#404844',
    borderRadius: '32px',
    borderWidth: '6px',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    height: '440px',
    marginTop: '48px',
    width: '540px'
  }

  const onClickPart = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }, [])

  return (
    <div
      className={`SEAT_SELECT_PART ${className || ''}`}
      onClick={onClickPart}
      style={stylePart}
      {...props} // BLANK LINE COMMENT:
    >
      <UserNameAndExitObject height="60px" />
      <UserTableHeadObject height="40px" />
      <UserTableBodyObject height="300px" />
      {/* 하단 공백은 element 따로 안 만든다. */}
    </div>
  )
}
