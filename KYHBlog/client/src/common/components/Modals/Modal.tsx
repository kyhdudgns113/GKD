import type {CSSProperties, FC, PropsWithChildren} from 'react'
import type {DivCommonProps} from '../../typesAndValues'

export type ModalProps = DivCommonProps & {
  onClose: () => void
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  children,
  onClose,
  // ::
  className,
  ...props
}) => {
  const styleZindex: CSSProperties = {
    zIndex: 100
  }
  const styleSize: CSSProperties = {
    height: 'fit-content',
    width: 'fit-content'
  }
  return (
    <div
      className="MODAL flex flex-col items-center justify-center fixed inset-0 bg-black bg-opacity-50"
      onClick={e => {
        e.stopPropagation()
        onClose()
      }}
      style={styleZindex}
    >
      <div
        autoFocus
        className={`flex flex-col items-center bg-white border-8 border-gkd-sakura-border rounded-3xl ${className}`}
        onClick={e => e.stopPropagation()}
        style={styleSize}
        tabIndex={0}
        {...props} // ::
      >
        {children}
      </div>
    </div>
  )
}
