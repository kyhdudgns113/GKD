import {useCallback, useEffect, useState, type KeyboardEvent, type MouseEvent} from 'react'
import {Input, Modal} from '@component'

import * as C from '@context'

import './_style.scss'

export function ModalSetFile() {
  const {fileRows, editFileOId} = C.useDirectoryStatesContext()
  const {changeFileName, closeEditDirFileModal, deleteFile} = C.useDirectoryCallbacksContext()

  const [fileName, setFileName] = useState<string>('')

  const onClickDelete = useCallback(
    (fileOId: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      e.preventDefault()
      deleteFile(fileOId)
    },
    [deleteFile]
  )

  const onClickSubmit = useCallback(
    (fileOId: string, fileName: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      e.preventDefault()

      // 모달 닫기도 changeFileName 에서 실행한다.
      changeFileName(fileOId, fileName).then(success => {
        if (success) {
          closeEditDirFileModal()
        } // ::
        else {
          // changeFileName 에서 에러 메시지 출력
        }
      })
    },
    [changeFileName, closeEditDirFileModal]
  )

  const onKeyDownModal = useCallback(
    (fileOId: string, fileName: string) => (e: KeyboardEvent<HTMLDivElement>) => {
      e.stopPropagation()

      if (e.key === 'Enter') {
        e.preventDefault()
        onClickSubmit(fileOId, fileName)
      } // ::
      else if (e.key === 'Escape') {
        e.preventDefault()
        closeEditDirFileModal()
      }
    },
    [closeEditDirFileModal, onClickSubmit]
  )

  // 초기화: dirName
  useEffect(() => {
    if (fileRows[editFileOId]) {
      setFileName(fileRows[editFileOId].fileName)
    } // ::
    else {
      setFileName('--이름 로딩 오류--')
    }
  }, [fileRows, editFileOId])

  return (
    <Modal onClose={() => {}} onKeyDown={onKeyDownModal(editFileOId, fileName)}>
      <div className="ModalSetFile_Main" tabIndex={0}>
        {/* 1. Title */}
        <p className="_Title">파일 이름 변경</p>

        {/* 2. Input: Name */}
        <div className="_InputRow">
          <p className="__Label">파일 이름</p>
          <Input
            className="__Input"
            onChange={e => setFileName(e.currentTarget.value)}
            placeholder="파일 이름(빈칸이면 변경X)"
            value={fileName} // ::
          />
        </div>

        {/* 3. Button: Save */}
        <div className="_ButtonRow">
          <button className="AppButton_Sakura" onClick={onClickSubmit(editFileOId, fileName)}>
            저장
          </button>
          <button className="AppButton_Sakura" onClick={onClickDelete(editFileOId)}>
            삭제
          </button>
          <button className="AppButton_Sakura" onClick={closeEditDirFileModal}>
            취소
          </button>
        </div>
      </div>
    </Modal>
  )
}
