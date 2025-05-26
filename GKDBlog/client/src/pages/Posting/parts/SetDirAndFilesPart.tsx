import {useDirectoryStatesContext} from '../../../contexts/directory/__states'
import {Icon, SAKURA_BORDER, SAKURA_TEXT} from '../../../common'
import {useDirectoryCallbacksContext} from '../../../contexts/directory/_callbacks'
import {SetRowDirObject, SetRowFileObject} from '../objects'
import {CreateDirBlock, CreateFileBlock} from '../blocks'
import {useAuthStatesContext} from '../../../contexts/auth/__states'
import {AUTH_ADMIN} from '../../../common/secret'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '../../../common'
type SetDirAndFilesPartProps = DivCommonProps & {width?: string}
/**
 * 디렉토리 설정 "페이지" "레이아웃"
 */
export const SetDirAndFilesPart: FC<SetDirAndFilesPartProps> = ({
  width,
  className,
  style,
  ...props
}) => {
  const {userAuth} = useAuthStatesContext()
  const {rootDir, parentOIdDir, parentOIdFile} = useDirectoryStatesContext()
  const {onClickCreateDir, onClickCreateFile} = useDirectoryCallbacksContext()

  const stylePreDiv: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',
    width: '100%'
  }
  const stylePart: CSSProperties = {
    ...style,
    borderColor: SAKURA_BORDER,
    borderRadius: '16px',
    borderWidth: '4px',
    display: 'flex',
    flexDirection: 'column',
    height: '500px',

    paddingLeft: '8px',
    paddingTop: '4px',
    userSelect: 'none',
    width: width || '240px'
  }
  const styleMarginBlock: CSSProperties = {
    height: '48px'
  }
  const styleIconWrapper: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    userSelect: 'none',
    width: '100%'
  }
  const styleIcon: CSSProperties = {
    color: SAKURA_TEXT,
    cursor: 'pointer',
    fontSize: '24px',
    marginRight: '8px'
  }

  return (
    <div style={stylePreDiv}>
      {/* 0. Lefter 의 버튼행 때문에 필요한 공백 */}
      {userAuth >= AUTH_ADMIN && <div style={styleMarginBlock} />}

      <div className={`SET_DIR_AND_FILES_PART ${className || ''}`} style={stylePart} {...props}>
        {/* 1. 폴더, 파일 생성 버튼 */}
        <div style={styleIconWrapper}>
          <Icon
            iconName="create_new_folder"
            onClick={onClickCreateDir(rootDir.dirOId)}
            style={styleIcon}
          />
          <Icon iconName="post_add" onClick={onClickCreateFile(rootDir.dirOId)} style={styleIcon} />
        </div>

        {/* 2. 폴더 목록 */}
        {rootDir.subDirOIdsArr.map(dirOId => (
          <SetRowDirObject key={dirOId} dirOId={dirOId} tabLevel={0} />
        ))}

        {/* 3. 폴더 생성 블록 */}
        {parentOIdDir === rootDir.dirOId && (
          <CreateDirBlock parentDirOId={rootDir.dirOId} tabLevel={0} />
        )}

        {/* 4. 파일 목록 */}
        {rootDir.fileOIdsArr.map(fileOId => (
          <SetRowFileObject key={fileOId} fileOId={fileOId} tabLevel={0} />
        ))}

        {/* 5. 파일 생성 블록 */}
        {parentOIdFile === rootDir.dirOId && (
          <CreateFileBlock parentDirOId={rootDir.dirOId} tabLevel={0} />
        )}
      </div>
    </div>
  )
}
