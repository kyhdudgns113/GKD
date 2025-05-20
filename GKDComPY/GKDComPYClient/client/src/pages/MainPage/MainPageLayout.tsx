import {CSSProperties, FC, useCallback, KeyboardEvent} from 'react'
import {DivCommonProps} from '../../common'
import {CommMembersPart} from './parts'
import {ClubsPart} from './parts'
import {UsersPart} from './parts'
import {Text3XL} from '../../common/components'
import {useMainPageStatesContext} from './_contexts'
import {useTemplateStatesContext} from '../../template/_contexts'
import {ModalAddUser} from './modals/ModalAddUser'
import {ModalAddClub} from './modals/ModalAddClub'
import {ModalModifyUser} from './modals/ModalModifyUser'
import {ModalModifySelf} from './modals/ModalModifySelf'
type MainPageLayoutProps = DivCommonProps & {}

export const MainPageLayout: FC<MainPageLayoutProps> = ({className, ...props}) => {
  const {comm} = useTemplateStatesContext()
  const {isAddUserModal, isModifySelfModal, isModifyUserModal, isAddClubModal, setKeyDownESC} =
    useMainPageStatesContext()

  const styleDivMain: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  }

  const onKeyDownDivMain = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      switch (e.key) {
        case 'Escape':
          setKeyDownESC(true)
          break
      }
    },
    [setKeyDownESC]
  )

  return (
    <div onKeyDown={onKeyDownDivMain} style={styleDivMain} tabIndex={0}>
      <Text3XL className="select-none ml-8 mt-6">{comm.name} 운영진들의 공간입니다.</Text3XL>

      <div className="flex flex-row w-full ml-8 mt-6">
        <UsersPart />
        <ClubsPart className="ml-6" />
        <CommMembersPart className="ml-6" />
      </div>

      {isAddUserModal && <ModalAddUser />}
      {isModifySelfModal && <ModalModifySelf />}
      {isModifyUserModal && <ModalModifyUser />}
      {isAddClubModal && <ModalAddClub />}
    </div>
  )
}
