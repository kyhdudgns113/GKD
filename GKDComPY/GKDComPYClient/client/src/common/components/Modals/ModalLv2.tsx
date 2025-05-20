import {FC, PropsWithChildren} from 'react'
import {DivCommonProps} from '../../props'

export type ModalLv2Props = DivCommonProps & {
  onClose: () => void
}

/**
 * Modal 에서 z-index 만 50 -> 51 로 바꿨다.
 */
export const ModalLv2: FC<PropsWithChildren<ModalLv2Props>> = ({
  children,
  onClose,
  // BLANK LINE COMMENT:
  className,
  ...props
}) => {
  // style 에 스타일 직접 넣지 않는다.
  // 외부에서 style 조절하고 싶을때 마음껏 바꿀 수 있도록 한다.
  return (
    <div
      className="flex flex-col items-center justify-center fixed inset-0 z-51 bg-black bg-opacity-50"
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
