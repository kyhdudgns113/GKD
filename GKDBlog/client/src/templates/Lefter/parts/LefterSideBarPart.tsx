import {useCallback, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

import {useAuthStatesContext} from '@contexts/auth/__states'
import {useDirectoryStatesContext} from '@contexts/directory/__states'
import {RowDirectoryBlock, RowFileBlock} from '../blocks'

import {NULL_DIR} from '@nullValue'
import {Icon} from '@component'
import {AUTH_ADMIN} from '@secret'
import {SAKURA_BG_70, SAKURA_BORDER, SAKURA_TEXT} from '@value'

import type {DirectoryType} from '@shareType'
import type {DivCommonProps} from '@prop'
import type {CSSProperties, FC, MouseEvent} from 'react'

type LefterSideBarPartProps = DivCommonProps & {}

export const LefterSideBarPart: FC<LefterSideBarPartProps> = ({className, style, ...props}) => {
  const {userAuth} = useAuthStatesContext()
  const {directories, rootDirOId} = useDirectoryStatesContext()

  const [rootDir, setRootDir] = useState<DirectoryType>(NULL_DIR)

  const navigate = useNavigate()

  const styleLefterSideBar: CSSProperties = {
    ...style,

    color: SAKURA_TEXT,
    display: 'flex',
    flexDirection: 'column',
    fontSize: '18px',
    fontWeight: 700,

    height: 'fit-content',

    userSelect: 'none',
    width: '250px'
  }
  const styleBtnRow: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: '4px'
  }
  const styleSideBar: CSSProperties = {
    backgroundColor: SAKURA_BG_70,
    borderColor: SAKURA_BORDER,
    borderRadius: '10px',
    borderWidth: '4px',

    boxShadow: '2px 2px 4px 0 rgba(0, 0, 0, 0.3)',

    display: 'flex',
    flexDirection: 'column',

    marginTop: '8px',
    minHeight: '600px',
    paddingTop: '8px',
    width: '100%'
  }
  const styleTestBtn: CSSProperties = {
    borderRadius: '6px',
    borderWidth: '2px',

    marginTop: '16px'
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
    alert(`테스트 버튼이에요`)
  }, [])

  // Init rootDir
  useEffect(() => {
    if (rootDirOId) {
      setRootDir(directories[rootDirOId])
    }
  }, [rootDirOId, directories])

  return (
    <div className={`LEFTER_SIDE_BAR_PART ${className || ''}`} style={styleLefterSideBar} {...props}>
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
      <div style={styleSideBar}>
        {rootDir.subDirOIdsArr.length > 0 && rootDir.subDirOIdsArr.map(dirOId => <RowDirectoryBlock key={dirOId} dirOId={dirOId} tabCnt={0} />)}
        {rootDir.fileOIdsArr.length > 0 && rootDir.fileOIdsArr.map(fileOId => <RowFileBlock key={fileOId} fileOId={fileOId} tabCnt={0} />)}
      </div>

      {/* 3. Test Button for Auth */}
      {userAuth === AUTH_ADMIN && (
        <button className="BTN_SAKURA " onClick={onClickTestBtn} style={styleTestBtn}>
          테스트 1
        </button>
      )}
    </div>
  )
}
