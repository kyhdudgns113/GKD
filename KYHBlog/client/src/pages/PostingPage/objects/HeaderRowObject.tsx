import {useCallback} from 'react'
import {useDirectoryCallbacksContext, useDirectoryStatesContext} from '@context'
import {AddDirButton, AddFileButton, RefreshButton} from '../buttons'

import '../_styles/HeaderRowObject.scss'

import type {CSSProperties, DragEvent, FC} from 'react'
import type {DivCommonProps} from '@prop'

type HeaderRowObjectProps = DivCommonProps & {}

export const HeaderRowObject: FC<HeaderRowObjectProps> = ({className, style, ...props}) => {
  const {rootDirOId} = useDirectoryStatesContext()
  const {unselectMoveDirFile} = useDirectoryCallbacksContext()

  const styleObject: CSSProperties = {
    ...style,

    display: 'flex',
    flexDirection: 'row'
  }

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      /**
       * ManagaDirectoryPart 에서 onDrop 을 쓰는데, 여기서는 그게 적용되면 안된다
       */
      e.stopPropagation()

      unselectMoveDirFile()
    },
    [unselectMoveDirFile]
  )

  return (
    <div
      className={`HeaderRow_Object ${className || ''}`}
      onDrop={onDrop}
      style={styleObject}
      {...props} // ::
    >
      <AddDirButton dirOId={rootDirOId} style={{marginLeft: 'auto'}} />
      <AddFileButton dirOId={rootDirOId} />
      <RefreshButton />
    </div>
  )
}
