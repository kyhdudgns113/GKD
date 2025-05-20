import {CSSProperties, FC} from 'react'
import {DivCommonProps} from '../../../common'

type RecordCommentProps = DivCommonProps & {comment: string}

export const RecordComment: FC<RecordCommentProps> = ({comment, className, ...props}) => {
  const styleDiv: CSSProperties = {
    ...props.style,

    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: '6px',
    borderWidth: '4px',
    boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.5)',

    display: 'flex',
    flexDirection: 'column',

    height: 'fit-content',

    left: '100%',
    minHeight: '50px',
    padding: '8px',
    position: 'absolute',
    top: -6,

    width: '200px',
    zIndex: 10
  }

  return (
    <div className={` ${className}`}>
      <div style={styleDiv} {...props}>
        <p>{comment}</p>
      </div>
    </div>
  )
}
