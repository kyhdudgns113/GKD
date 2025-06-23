import {useCallback, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Icon} from '@component'
import {NULL_DIR} from '@nullValue'
import {SAKURA_BG_70, SAKURA_BORDER, SAKURA_TEXT} from '@value'
import {RowDirectoryPart, RowFilePart} from './parts'

import {useAuthStatesContext} from '@contexts/auth/__states'
import {useDirectoryStatesContext} from '@contexts/directory/__states'
import {useSocketCallbacksContext} from '@contexts/socket/_callbacks'

import type {CSSProperties, FC, MouseEvent} from 'react'
import type {DivCommonProps} from '@prop'
import type {DirectoryType} from '@shareType'
import {AUTH_ADMIN} from '@secret'

type LefterLayoutProps = DivCommonProps & {}

export const LefterLayout: FC<LefterLayoutProps> = ({className, style, ...props}) => {
  const {userAuth, userOId} = useAuthStatesContext()
  const {directories, rootDirOId} = useDirectoryStatesContext()
  const {emitMainSocket} = useSocketCallbacksContext()
  const [rootDir, setRootDir] = useState<DirectoryType>(NULL_DIR)

  const navigate = useNavigate()

  const styleLefter: CSSProperties = {
    ...style,

    color: SAKURA_TEXT,
    display: 'flex',
    flexDirection: 'column',
    fontSize: '18px',
    fontWeight: 700,

    height: 'fit-content',

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
  const styleTestBtn: CSSProperties = {
    borderRadius: '6px',
    borderWidth: '2px',

    marginTop: '16px'
  }

  const onClickPostAdd = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      e.preventDefault()
      navigate('/posting/')
    },
    [navigate]
  )
  const onClickSettings = useCallback((e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault()
    alert(`아직 준비중입니다.`)
  }, [])

  const onClickTestBtn = useCallback(() => {
    const event = 'mainTest'
    const payload = userOId
    emitMainSocket(event, payload)
  }, [userOId, emitMainSocket])

  // Init rootDir
  useEffect(() => {
    if (rootDirOId) {
      setRootDir(directories[rootDirOId])
    }
  }, [rootDirOId, directories])

  return (
    <div className={`LEFTER ${className || ''}`} style={styleLefter} {...props}>
      {/* 0. Icon Style */}
      <style>
        {`
          .LEFTER_BTN_ROW span:hover {
            background-color: #F8E8E0;
          }
        `}
      </style>

      {/* 1. Button Row */}
      {userAuth === AUTH_ADMIN && (
        <div className="LEFTER_BTN_ROW " style={styleBtnRow}>
          <Icon iconName="settings" onClick={onClickSettings} style={styleIcon} />
          <Icon iconName="post_add" onClick={onClickPostAdd} style={styleIcon} />
        </div>
      )}

      {/* 2. Sidebar Block */}
      <div style={styleBlock}>
        {rootDir.subDirOIdsArr.length > 0 && rootDir.subDirOIdsArr.map(dirOId => <RowDirectoryPart key={dirOId} dirOId={dirOId} tabCnt={0} />)}
        {rootDir.fileOIdsArr.length > 0 && rootDir.fileOIdsArr.map(fileOId => <RowFilePart key={fileOId} fileOId={fileOId} tabCnt={0} />)}
      </div>

      <button className="BTN_SAKURA " onClick={onClickTestBtn} style={styleTestBtn}>
        테스트 1
      </button>
    </div>
  )
}
