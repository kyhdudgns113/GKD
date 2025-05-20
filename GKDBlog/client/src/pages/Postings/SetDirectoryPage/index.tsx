import {SetDirectoryPageLayout} from './SetDirectoryPageLayout'
import type {FC} from 'react'
import type {SetDirectoryPageLayoutProps} from './SetDirectoryPageLayout'

/**
 * 특별한 이유 없이 import 구문 이쁘게 하려고 만든파일
 */
export const SetDirectoryPage: FC<SetDirectoryPageLayoutProps> = ({className, ...props}) => {
  return <SetDirectoryPageLayout className={className} {...props} />
}
