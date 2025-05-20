import {FC, PropsWithChildren} from 'react'
import {DivCommonProps} from '../../props'

export type ModalProps = DivCommonProps & {
  onClose: () => void
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  children,
  onClose,
  // BLANK LINE COMMENT:
  className,
  ...props
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center fixed inset-0 z-50 bg-black bg-opacity-50"
      onClick={e => {
        e.stopPropagation()
        onClose()
      }}>
      <div
        autoFocus
        className={`flex flex-col items-center bg-white border-8 border-gkd-sakura-border rounded-3xl ${className}`}
        onClick={e => e.stopPropagation()}
        tabIndex={0}
        {...props} // BLANK LINE COMMENT:
      >
        {children}
      </div>
    </div>
  )
}
