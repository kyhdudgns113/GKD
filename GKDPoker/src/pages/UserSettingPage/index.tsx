import {FC} from 'react'
import {DivCommonProps} from '../../common'
import {UserSettingCallbacks, UserSettingEffects, UserSettingStates} from './_context'
import {UserSettingLayout} from './UserSettingLayout'

type UserSettingPageProps = DivCommonProps & {}
export const UserSettingPage: FC<UserSettingPageProps> = ({className, ...props}) => {
  return (
    <UserSettingStates>
      <UserSettingCallbacks>
        <UserSettingEffects>
          <UserSettingLayout className={className} {...props} />
        </UserSettingEffects>
      </UserSettingCallbacks>
    </UserSettingStates>
  )
}
