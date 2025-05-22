import {useEffect} from 'react'
import {useDirectoryStatesContext} from '../../../../contexts/directory/__states'
import {useDirectoryCallbacksContext} from '../../../../contexts/directory/_callbacks'
import {SetRowFilePart} from './SetRowFilePart'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '../../../../common'

/**
 * 디렉토리 설정 페이지에서의 디렉토리 row
 */
type SetRowDirPartProps = DivCommonProps & {dirOId: string; tabLevel: number}

export const SetRowDirPart: FC<SetRowDirPartProps> = ({
  dirOId,
  tabLevel,
  className,
  style,
  ...props
}) => {
  const {directories} = useDirectoryStatesContext()
  const {getDirectoryInfo} = useDirectoryCallbacksContext()

  const styleRow: CSSProperties = {
    ...style,
    marginLeft: `${tabLevel * 8}px`
  }

  // Load directory if not loaded
  useEffect(() => {
    if (!directories[dirOId]) {
      getDirectoryInfo(dirOId)
    }
  }, [directories, dirOId, getDirectoryInfo])

  // 디렉토리 정보 없으면 렌더링 안함
  if (!directories[dirOId]) {
    return null
  }

  return (
    <div className={`SET_ROW_DIR_PART ${className || ''}`} style={styleRow} {...props}>
      <p>{directories[dirOId].dirName || '없음'}</p>

      {directories[dirOId].subDirOIdsArr.map(subDirOId => (
        <SetRowDirPart key={subDirOId} dirOId={subDirOId} tabLevel={tabLevel + 1} />
      ))}

      {directories[dirOId].fileOIdsArr.map(fileOId => (
        <SetRowFilePart key={fileOId} fileOId={fileOId} tabLevel={tabLevel + 1} />
      ))}
    </div>
  )
}
