import {Icon} from '@component'

import '../_styles/DirectoryViewPart.scss'

import type {FC} from 'react'
import type {DivCommonProps} from '@prop'
import type {Setter} from '@type'

type DirInfoGroupProps = DivCommonProps & {dirName: string; isOpen: boolean; setIsOpen: Setter<boolean>}

export const DirInfoGroup: FC<DirInfoGroupProps> = ({dirName, isOpen, setIsOpen, className, style, ...props}) => {
  return (
    <div
      className={`DirInfo_Group _info_group ${className || ''}`}
      onClick={() => setIsOpen(prev => !prev)}
      style={style}
      {...props} // ::
    >
      {isOpen && <Icon iconName="arrow_drop_down" style={{width: '24px', height: '24px'}} />}
      {!isOpen && <Icon iconName="arrow_right" style={{width: '24px', height: '24px'}} />}

      <p className="_dir_name">{dirName}</p>
    </div>
  )
}
