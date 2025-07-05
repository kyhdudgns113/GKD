import {useCallback, useEffect, useMemo, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {Input} from '@component'
import {SAKURA_BG_70, SAKURA_BORDER, SAKURA_TEXT} from '@value'
import {NULL_FILE} from '@nullValue'
import {FileContentsObject} from '../objects'

import {useModalCallbacksContext} from '@contexts/modal/_callbacks'
import {useDirectoryStatesContext} from '@contexts/directory/__states'
import {useDirectoryCallbacksContext} from '@contexts/directory/_callbacks'
import {useFileContext} from '../_contexts'

import type {ChangeEvent, CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'
import type {FileType} from '@shareType'

type SelectedFilePartProps = DivCommonProps & {
  width: string
}

export const SelectedFilePart: FC<SelectedFilePartProps> = ({width, className, style, ...props}) => {
  const {openModal} = useModalCallbacksContext()
  const {setFixFileOId} = useDirectoryStatesContext()
  const {getFileInfo, toggleFilesIsHidden, toggleFilesIsIntro, updateFileNameContents} = useDirectoryCallbacksContext()
  const {file, setFile} = useFileContext()

  const [inputName, setInputName] = useState<string>('')

  const location = useLocation()
  const navigate = useNavigate()

  const stylePart: CSSProperties = {
    ...style,
    borderColor: SAKURA_BORDER,
    borderRadius: '8px',
    borderWidth: '2px',
    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',

    marginTop: '48px',
    minHeight: '600px',
    width: width || '800px'
  }
  const styleHeadRow: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    height: '48px',

    marginLeft: 'auto',
    width: 'fit-content'
  }
  const styleHeadBtn: CSSProperties = useMemo(() => {
    const ret: CSSProperties = {
      borderColor: SAKURA_BORDER,
      borderRadius: '8px',
      borderWidth: '2px',
      color: SAKURA_TEXT,
      height: '32px',

      marginRight: '8px',
      width: '48px'
    }

    return ret
  }, [])
  const styleIntroBtn: CSSProperties = useMemo(() => {
    const ret: CSSProperties = {
      ...styleHeadBtn
    }

    if (file.isIntroPost) {
      ret.backgroundColor = SAKURA_BG_70
    }
    return ret
  }, [file, styleHeadBtn])
  const styleHiddenBtn: CSSProperties = useMemo(() => {
    const ret: CSSProperties = {
      ...styleHeadBtn
    }

    if (file.isHidden) {
      ret.backgroundColor = '#CCCCCC'
    }

    return ret
  }, [file, styleHeadBtn])
  const styleTitleRow: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',

    justifyContent: 'center',
    marginTop: '16px'
  }
  const styleInputName: CSSProperties = {
    borderColor: '#000000',
    borderRadius: '8px',
    borderWidth: '2px',
    height: '32px',

    marginLeft: '10px',

    paddingLeft: '8px',
    width: '600px'
  }
  const styleContentBlock: CSSProperties = {
    ...style,

    borderColor: SAKURA_BORDER,
    borderRadius: '8px',
    borderWidth: '2px',

    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content',

    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '32px',
    marginBottom: '32px',
    minHeight: '400px',

    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '8px',
    paddingBottom: '12px',

    width: '700px'
  }

  const _gotoPosting = useCallback(() => {
    navigate('/posting/')
  }, [navigate])

  const onChangeInputName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputName(e.target.value)
  }, [])

  const onClickIntro = useCallback(
    (file: FileType) => () => {
      toggleFilesIsIntro(file, setFile)
    },
    [toggleFilesIsIntro, setFile]
  )
  const onClickHidden = useCallback(
    (file: FileType) => () => {
      toggleFilesIsHidden(file, setFile)
    },
    [toggleFilesIsHidden, setFile]
  )
  const onClickUpdate = useCallback(() => {
    if (!inputName) {
      alert('제목을 입력해주세요.')
      return
    }

    updateFileNameContents(file)
  }, [file, inputName, updateFileNameContents])
  const onClickCancel = useCallback(() => {
    navigate('/posting/')
  }, [navigate])
  const onClickDelete = useCallback(() => {
    openModal('deleteFile')
  }, [openModal])

  // 1. Get fileOId from url
  // 2. Load file from server
  useEffect(() => {
    const fileOId = location.pathname.split('/posting/').pop()

    if (fileOId) {
      getFileInfo(fileOId, setFile, _gotoPosting)
      setFixFileOId(fileOId)
    } // ::
    else {
      setFile(NULL_FILE)
      setFixFileOId('')
    }
  }, [location, _gotoPosting, getFileInfo, setFile, setFixFileOId])

  // Set inputName from file
  useEffect(() => {
    setInputName(file.name)
  }, [file])

  // NULL 렌더링: 파일 선택되지 않았으면 로딩중 리턴
  if (!file || !file.fileOId) {
    return <div>Loading...</div>
  }

  return (
    <div className={`SELECTED_FILE_PART ${className || ''}`} style={stylePart} {...props}>
      {/* style: 버튼 호버 시 배경색 변경 */}
      <style>
        {`
          .HEAD_ROW button:hover {
            background-color: ${SAKURA_BG_70};
          }
        `}
      </style>

      {/* 1. 수정,취소,삭제 버튼 행 */}
      <div className="HEAD_ROW " style={styleHeadRow}>
        <button onClick={onClickIntro(file)} style={styleIntroBtn}>
          공지
        </button>
        <button onClick={onClickHidden(file)} style={styleHiddenBtn}>
          숨김
        </button>

        <button onClick={onClickUpdate} style={styleHeadBtn}>
          수정
        </button>
        <button onClick={onClickCancel} style={styleHeadBtn}>
          취소
        </button>
        <button onClick={onClickDelete} style={styleHeadBtn}>
          삭제
        </button>
      </div>

      {/* 2. 파일 제목 행 */}
      <div className="TITLE_ROW " style={styleTitleRow}>
        <p>제목</p>
        <Input onChange={onChangeInputName} placeholder={file.name} style={styleInputName} value={inputName} />
      </div>

      {/* 3. 파일 내용 */}
      <FileContentsObject style={styleContentBlock} />
    </div>
  )
}
