import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../../../common/props'
import {ChattingPartCallbacks} from './_callbacks'
import {ChattingPartEffects} from './_effects'
import {ChattingPartStates} from './__states'
import {SAKURA_BORDER} from '../../../../common/typesAndValues/values'
import {ChatsGroup} from '../../groups/ChatsGroup'
import {InputGroup} from '../../groups/InputGroup'

type ChattingPartProps = DivCommonProps & {}
const ChattingPart: FC<ChattingPartProps> = ({className, style, ...props}) => {
  const heightInputsPx = 150

  const styleDiv: CSSProperties = {
    ...style,

    borderColor: SAKURA_BORDER,
    borderWidth: '6px',
    borderRadius: '12px',
    boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    width: '450px',
    height: '90%'
  }
  const styleChats: CSSProperties = {
    width: '100%',
    height: `${window.innerHeight - heightInputsPx}px`,

    backgroundColor: '#F8E8E0',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',

    overflowY: 'scroll',

    padding: '8px',
    position: 'sticky'
  }
  const styleInputs: CSSProperties = {
    boxShadow: `0px -2px 6px rgba(0, 0, 0, 0.1)`,
    display: 'flex',
    flexDirection: 'row',
    height: `${heightInputsPx}px`,
    padding: '8px',

    width: '100%'
  }

  return (
    <ChattingPartStates>
      <ChattingPartCallbacks>
        <ChattingPartEffects>
          <div className={`CHATTING-PART ${className || ''}`} style={styleDiv} {...props}>
            <ChatsGroup style={styleChats} />
            <InputGroup style={styleInputs} />
          </div>
        </ChattingPartEffects>
      </ChattingPartCallbacks>
    </ChattingPartStates>
  )
}

export {ChattingPart}
