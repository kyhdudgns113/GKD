import {FC, PropsWithChildren} from 'react'
import {InputCommonProps} from '../../../common'
import {Input} from '../../../common/components'

export type InputRowProps = InputCommonProps & {
  classNameDiv?: string
  classNameP?: string
  errorMessage: string
  type: string
  value: string
}

export const InputRow: FC<PropsWithChildren<InputRowProps>> = ({
  //
  children,
  className: _className,
  classNameDiv,
  classNameP,
  errorMessage,
  type,
  value,
  ...props
}) => {
  return (
    <div className="flex flex-col items-center mt-8">
      <div className={'flex flex-row items-center ' + classNameDiv}>
        <p className={'text-gkd-sakura-text text-3xl font-bold text-center w-24 ' + classNameP}>
          {children}
        </p>
        <Input
          className={' w-96 h-12 pl-2 rounded-xl ' + _className}
          type={type}
          value={value}
          {...props}
        />
      </div>
      <div className="flex flex-row items-center ">
        <div className="w-12"></div>
        <p className="text-red-500 h-4">{errorMessage}</p>
      </div>
    </div>
  )
}
