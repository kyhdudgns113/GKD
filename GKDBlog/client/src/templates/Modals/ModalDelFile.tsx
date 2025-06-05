import {useCallback, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Modal} from '@component'
import {SAKURA_BG_70, SAKURA_BORDER, SAKURA_TEXT} from '@value'
import {useModalCallbacksContext} from '@contexts/modal/_callbacks'
import {useDirectoryStatesContext} from '@contexts/directory/__states'
import {useDirectoryCallbacksContext} from '@contexts/directory/_callbacks'

import type {CSSProperties} from 'react'

export function ModalDelFile() {
  const {fileRows, fixFileOId} = useDirectoryStatesContext()
  const {deleteFile} = useDirectoryCallbacksContext()
  const {closeModal} = useModalCallbacksContext()

  const navigate = useNavigate()

  const [fileName, setFileName] = useState<string>('')

  const styleModal: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '200px',
    width: '400px'
  }
  const styleFileName: CSSProperties = {
    fontSize: '32px'
  }
  const styleDelText: CSSProperties = {
    fontSize: '32px',
    fontWeight: 700
  }
  const styleBtnRow: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: '64px',

    marginTop: '32px',
    width: 'fit-content'
  }
  const styleBtn: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderRadius: '10px',
    borderWidth: '4px',
    color: SAKURA_TEXT,
    cursor: 'pointer',
    fontSize: '24px',
    fontWeight: 700,

    width: '90px'
  }

  const callbackDelete = useCallback(() => {
    closeModal()
    navigate('/posting/')
  }, [closeModal, navigate])

  const onClickDelete = useCallback(() => {
    if (fixFileOId) {
      deleteFile(fixFileOId, callbackDelete)
    } // BLANK LINE COMMENT:
    else {
      alert('에러: 파일 정보가 없습니다.')
    }
  }, [callbackDelete, deleteFile, fixFileOId])
  const onClickCancel = useCallback(() => {
    closeModal()
  }, [closeModal])

  // Init fileName
  useEffect(() => {
    if (fixFileOId) {
      setFileName(fileRows[fixFileOId].name)
    } // BLANK LINE COMMENT:
    else {
      setFileName('<에러>')
    }
  }, [fixFileOId, fileRows])

  return (
    <Modal onClose={() => {}}>
      <div className="MODAL_DEL_FILE" style={styleModal}>
        <style>
          {`
            .MODAL_DEL_FILE button:hover {
              background-color: ${SAKURA_BG_70};
            }
            `}
        </style>
        {/* 1. 파일 이름 */}
        <p style={styleFileName}>{fileName}</p>

        {/* 2. 삭제 텍스트 */}
        <p style={styleDelText}>삭제하시겠습니까?</p>

        {/* 3. 버튼 행 */}
        <div className="BTN_ROW" style={styleBtnRow}>
          <button onClick={onClickDelete} style={styleBtn}>
            삭제
          </button>
          <button onClick={onClickCancel} style={styleBtn}>
            취소
          </button>
        </div>
      </div>
    </Modal>
  )
}
