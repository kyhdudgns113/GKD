import {FC, PropsWithChildren} from 'react'
import {ButtonCommonProps} from '../../props'

export type ButtonProps = ButtonCommonProps & {
  //
}

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  //
  className: _className,
  children,
  ...props
}) => {
  // 외부에서 CSS 직접 넣어줄 필요도 있다.
  // 여기서는 클래스로 선언한다.
  return (
    <button
      className={
        'select-none cursor-pointer ' +
        'p-2 w-32 ' +
        'border-4 border-gkd-sakura-border rounded-2xl ' +
        'bg-gkd-sakura-bg hover:bg-gkd-sakura-hover-button ' +
        'text-gkd-sakura-text hover:text-gkd-sakura-bg text-2xl font-bold ' +
        _className
      }
      {...props}>
      {children}
    </button>
  )
}
