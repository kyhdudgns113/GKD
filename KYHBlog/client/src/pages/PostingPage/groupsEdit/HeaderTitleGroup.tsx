import {useCallback, useEffect} from 'react'
import {Input} from '@component'
import {useFileStatesContext} from '@context'

import type {ChangeEvent, FC} from 'react'
import type {DivCommonProps} from '@prop'

type HeaderTitleGroupProps = DivCommonProps

export const HeaderTitleGroup: FC<HeaderTitleGroupProps> = ({className, style, ...props}) => {
  const {file, fileName, setFileName} = useFileStatesContext()

  const onChangeName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setFileName(e.currentTarget.value)
    },
    [setFileName]
  )

  // 초기화: fileName
  useEffect(() => {
    setFileName(file.fileName)
  }, [file, setFileName])

  return (
    <div className={`HeaderTitle_Group ${className || ''}`} style={style} {...props}>
      <Input value={fileName} onChange={onChangeName} />
    </div>
  )
}
