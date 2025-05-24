import {useDirectoryStatesContext} from '../../../contexts/directory/__states'
import {Icon, SAKURA_BORDER, SAKURA_TEXT} from '../../../common'
import {useDirectoryCallbacksContext} from '../../../contexts/directory/_callbacks'
import {SetRowDirPart, SetRowFilePart} from './parts'
import {CreateDirBlock, CreateFileBlock} from './blocks'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '../../../common'
export type SetDirectoryPageLayoutProps = DivCommonProps & {}

/**
 * 디렉토리 설정 "페이지" "레이아웃"
 */
export const SetDirectoryPageLayout: FC<SetDirectoryPageLayoutProps> = ({
  className,
  style,
  ...props
}) => {
  const {rootDir, parentOIdDir, parentOIdFile} = useDirectoryStatesContext()
  const {onClickCreateDir, onClickCreateFile} = useDirectoryCallbacksContext()

  const stylePage: CSSProperties = {
    ...style,
    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',

    width: '1700px'
  }
  const styleDirBlock: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderRadius: '16px',
    borderWidth: '4px',
    display: 'flex',
    flexDirection: 'column',
    height: '500px',

    paddingLeft: '8px',
    paddingTop: '4px',
    userSelect: 'none',
    width: '240px'
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
    <div className={`SET_DIRECTORY_PAGE ${className || ''}`} style={stylePage} {...props}>
      <div className="SET_DIR_BLOCK " style={styleDirBlock}>
        {/* 폴더, 파일 생성 버튼 */}
        <div style={styleIconWrapper}>
          <Icon
            iconName="create_new_folder"
            onClick={onClickCreateDir(rootDir.dirOId)}
            style={styleIcon}
          />
          <Icon iconName="post_add" onClick={onClickCreateFile(rootDir.dirOId)} style={styleIcon} />
        </div>

        {/* 폴더 목록 */}
        {rootDir.subDirOIdsArr.map(dirOId => (
          <SetRowDirPart key={dirOId} dirOId={dirOId} tabLevel={0} />
        ))}

        {/* 폴더 생성 블록 */}
        {parentOIdDir === rootDir.dirOId && (
          <CreateDirBlock parentDirOId={rootDir.dirOId} tabLevel={0} />
        )}

        {/* 파일 목록 */}
        {rootDir.fileOIdsArr.map(fileOId => (
          <SetRowFilePart key={fileOId} fileOId={fileOId} tabLevel={0} />
        ))}

        {/* 파일 생성 블록 */}
        {parentOIdFile === rootDir.dirOId && (
          <CreateFileBlock parentDirOId={rootDir.dirOId} tabLevel={0} />
        )}
      </div>
    </div>
  )
}
