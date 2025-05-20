import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../../common'
import {SetBBGroup, SetRebuyGroup, SetSBGroup} from '../groups'

type FirstRowPartProps = DivCommonProps & {}
export const FirstRowPart: FC<FirstRowPartProps> = ({className, ...props}) => {
  const styleRow: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '48px',
    width: '350px'
  }
  return (
    <div className={`FIRST_ROW ${className || ''}`} style={styleRow} {...props}>
      <SetSBGroup />
      <SetBBGroup />
      <SetRebuyGroup />
    </div>
  )
}
