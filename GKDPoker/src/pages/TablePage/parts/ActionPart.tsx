import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../../common'
import {
  BetSizeObject,
  ButtonRowObject,
  PlayerInfoObject,
  ToggleObject,
  ActionBySizeObject,
  ActionByChipObject
} from '../objects'
import {useTablePageStatesContext} from '../_context'

type ActionPartProps = DivCommonProps & {}
export const ActionPart: FC<ActionPartProps> = ({className, ...props}) => {
  const {actionIdx} = useTablePageStatesContext()

  const stylePart: CSSProperties = {
    alignItems: 'center',
    borderColor: '#404844',
    borderRadius: '32px',
    borderWidth: '6px',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    height: 'fit-content',
    marginTop: '32px',
    width: '540px'
  }
  return (
    <div className={`ACTION_PART ${className || ''}`} style={stylePart} {...props}>
      <BetSizeObject height="60px" />
      <ButtonRowObject height="60px" />
      {actionIdx === 0 ? <PlayerInfoObject height="300px" /> : null}
      {actionIdx === 1 ? <ActionBySizeObject height="300px" /> : null}
      {actionIdx === 2 ? <ActionByChipObject height="300px" /> : null}
      <ToggleObject height="60px" />
    </div>
  )
}
