import {FC, PropsWithChildren} from 'react'
import {ButtonCommonProps} from '../../props'

type SwitchButtonProps = ButtonCommonProps & {
  onOff: boolean
}

export const SwitchButton: FC<PropsWithChildren<SwitchButtonProps>> = ({
  onOff,
  //
  className: _className,
  children,
  ...props
}) => {
  const cnBg = onOff
    ? 'bg-gkd-sakura-bg text-gkd-sakura-darker-text'
    : 'bg-white text-gkd-sakura-text'
  return (
    <button
      className={
        'select-none cursor-pointer ' +
        'p-2 ' +
        'border-4 border-gkd-sakura-border rounded-2xl ' +
        ` ${cnBg} ` +
        'text-2xl font-bold ' +
        _className
      }
      {...props}>
      {children}
    </button>
  )
}
