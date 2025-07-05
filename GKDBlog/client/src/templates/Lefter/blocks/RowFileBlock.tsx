import {useCallback, useEffect, useMemo, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Icon} from '@component'
import {SAKURA_BG_30} from '@value'
import {AUTH_ADMIN} from '@commons/secret'

import {useAuthStatesContext} from '@contexts/auth/__states'
import {useDirectoryStatesContext} from '@contexts/directory/__states'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'

type RowFileBlockProps = DivCommonProps & {
  fileOId: string
  tabCnt: number
}

export const RowFileBlock: FC<RowFileBlockProps> = ({fileOId, tabCnt, className, style, ...props}) => {
  const {userAuth} = useAuthStatesContext()
  const {fileRows} = useDirectoryStatesContext()

  const [fileName, setFileName] = useState<string>('--')
  const [isHidden, setIsHidden] = useState<boolean>(false)
  const [isIntroPost, setIsIntroPost] = useState<boolean>(false)

  const navigate = useNavigate()

  const styleRowBlock: CSSProperties = {
    ...style,
    display: 'flex',
    flexDirection: 'row',
    marginLeft: `${tabCnt * 8}px`
  }
  const styleIcon: CSSProperties = {
    fontSize: '22px',
    marginLeft: '4px',
    marginRight: '4px'
  }
  const styleFileName: CSSProperties = useMemo(() => {
    return {
      backgroundColor: isHidden ? '#D8D8D8' : isIntroPost ? '#FFCCCC' : 'transparent',
      cursor: 'pointer',
      fontSize: '16px',
      marginLeft: '4px',

      width: '80%'
    }
  }, [isHidden, isIntroPost])

  const onClickFile = useCallback(
    (fileOId: string) => () => {
      if (fileRows[fileOId]) {
        navigate(`/reading/${fileOId}`)
      }
    },
    [fileRows, navigate]
  )

  // Set file name
  useEffect(() => {
    if (!fileRows[fileOId]) {
      setFileName('로딩중...')
    } // ::
    else {
      setFileName(fileRows[fileOId].name)
    }
  }, [fileOId, fileRows])

  // Set isHidden
  useEffect(() => {
    if (fileRows[fileOId]?.isHidden) {
      setIsHidden(true)
    } // ::
    else {
      setIsHidden(false)
    }
  }, [fileOId, fileRows])

  // Set isIntroPost
  useEffect(() => {
    if (fileRows[fileOId]?.isIntroPost) {
      setIsIntroPost(true)
    } // ::
    else {
      setIsIntroPost(false)
    }
  }, [fileOId, fileRows])

  /**
   * 1. 공지 파일로 등록된건 렌더링 안한다
   * 2. 관리자가 아니면 숨겨진 파일을 렌더링 하지 않는다.
   */
  if (!fileRows[fileOId] || (userAuth !== AUTH_ADMIN && (isHidden || isIntroPost))) return null

  return (
    <div
      className={`ROW_FILE_BLOCK file:${fileOId} ${className || ''}`}
      onClick={onClickFile(fileOId)}
      style={styleRowBlock}
      {...props} // ::
    >
      {/* 0. 폴더에 마우스 가져다 대면 색 변경(hover) */}
      <style>
        {`
          .ROW_FILE_BLOCK:hover {
            background-color: ${SAKURA_BG_30};
          }
        `}
      </style>

      {/* 1. 파일 아이콘 */}
      {isIntroPost ? <Icon iconName="emoji_objects" style={styleIcon} /> : <Icon iconName="file_present" style={styleIcon} />}

      {/* 2. 파일 이름 */}
      <p style={styleFileName}>{fileName}</p>
    </div>
  )
}
