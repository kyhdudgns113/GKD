import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {Icon, SAKURA_BG_70, SAKURA_BORDER, SAKURA_TEXT} from '../../common'
import {useAuthStatesContext} from '../../contexts/auth/__states'
import {useDirectoryStatesContext} from '../../contexts/directory/__states'
import {RowDirectoryPart, RowFilePart} from './parts'

import type {CSSProperties, FC, MouseEvent} from 'react'
import type {DivCommonProps} from '../../common'

type LefterProps = DivCommonProps & {}
export const Lefter: FC<LefterProps> = ({className, style, ...props}) => {
  const {userAuth} = useAuthStatesContext()
  const {rootDir} = useDirectoryStatesContext()

  const navigate = useNavigate()

  const styleLefter: CSSProperties = {
    ...style,

    color: SAKURA_TEXT,
    display: 'flex',
    flexDirection: 'column',
    fontSize: '18px',
    fontWeight: 700,

    height: 'fit-content',
    marginLeft: style?.marginLeft || '20px',

    userSelect: 'none',
    width: style?.width || '200px'
  }
  const styleBtnRow: CSSProperties = {
    alignItems: 'start',
    display: 'flex',
    flexDirection: 'row',
    height: '48px',

    paddingLeft: '4px',
    width: '100%'
  }
  const styleIcon: CSSProperties = {
    alignItems: 'center',
    borderColor: SAKURA_BORDER,
    borderRadius: '20px',
    borderWidth: '3px',
    cursor: 'pointer',
    display: 'flex',

    fontSize: '28px',
    height: '40px',
    justifyContent: 'center',

    marginRight: '8px',
    width: '40px'
  }
  const styleBlock: CSSProperties = {
    backgroundColor: SAKURA_BG_70,
    borderColor: SAKURA_BORDER,
    borderRadius: '10px',
    borderWidth: '4px',
    display: 'flex',
    flexDirection: 'column',

    minHeight: '600px',
    paddingTop: '8px',
    width: '100%'
  }

  const onClickPostAdd = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      e.preventDefault()
      navigate('/posting/setDirectory')
    },
    [navigate]
  )
  const onClickSettings = useCallback((e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault()
    alert(`아직 준비중입니다.`)
  }, [])

  return (
    <div className={`LEFTER ${className || ''}`} style={styleLefter} {...props}>
      {/* Icon Style */}
      <style>
        {`
          .LEFTER_BTN_ROW span:hover {
            background-color: #F8E8E0;
          }
        `}
      </style>

      {/* Button Row */}
      {userAuth >= 100 && (
        <div className="LEFTER_BTN_ROW " style={styleBtnRow}>
          <Icon iconName="settings" onClick={onClickSettings} style={styleIcon} />
          <Icon iconName="post_add" onClick={onClickPostAdd} style={styleIcon} />
        </div>
      )}

      {/* Sidebar Block */}
      <div style={styleBlock}>
        {rootDir.subDirOIdsArr.length > 0 &&
          rootDir.subDirOIdsArr.map(dirOId => (
            <RowDirectoryPart key={dirOId} dirOId={dirOId} tabCnt={0} />
          ))}
        {rootDir.fileOIdsArr.length > 0 &&
          rootDir.fileOIdsArr.map(fileOId => (
            <RowFilePart key={fileOId} fileOId={fileOId} tabCnt={0} />
          ))}
      </div>
    </div>
  )
}
