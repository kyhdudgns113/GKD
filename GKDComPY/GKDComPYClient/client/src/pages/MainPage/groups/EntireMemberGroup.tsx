import {CSSProperties, FC} from 'react'
import {DivCommonProps, SAKURA_BORDER} from '../../../common'
import {useCommMembersContext} from '../parts'
import {EntireBodyBlock, EntireHeadBlock} from '../blocks'

type EntireMemberGroupProps = DivCommonProps & {}
export const EntireMemberGroup: FC<EntireMemberGroupProps> = ({className, ...props}) => {
  const {commMembersArr} = useCommMembersContext()

  const styleDiv: CSSProperties = {
    ...props.style,
    borderColor: SAKURA_BORDER,
    borderRadius: '12px',
    borderWidth: '6px'
  }
  const styleTable: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderCollapse: 'collapse',
    borderSpacing: '0px 0px', // border-spacing-0
    color: '#F89890',
    height: '100%',
    textAlign: 'center'
  }

  if (!commMembersArr || commMembersArr.length === 0) return null
  return (
    <div className={`w-fit ${className}`} style={styleDiv} {...props}>
      <table style={styleTable}>
        <EntireHeadBlock />
        <EntireBodyBlock />
      </table>
    </div>
  )
}
