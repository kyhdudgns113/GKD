import {useCallback, useEffect, useState, type KeyboardEvent, type MouseEvent} from 'react'
import {Input, Modal} from '@component'

import * as C from '@context'

import './_style.scss'

export function ModalSetDir() {
  const {directories, editDirOId} = C.useDirectoryStatesContext()
  const {changeDirName, closeEditDirFileModal, deleteDir} = C.useDirectoryCallbacksContext()

  const [dirName, setDirName] = useState<string>('')

  const onClickDelete = useCallback(
    (dirOId: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      e.preventDefault()
      deleteDir(dirOId)
    },
    [deleteDir]
  )

  const onClickSubmit = useCallback(
    (dirOId: string, dirName: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      e.preventDefault()

      // 모달 닫기도 changeDirName 에서 실행한다.
      changeDirName(dirOId, dirName).then(success => {
        if (success) {
          closeEditDirFileModal()
        } // ::
        else {
          // changeDirName 에서 에러 메시지 출력
        }
      })
    },
    [changeDirName, closeEditDirFileModal]
  )

  const onKeyDownModal = useCallback(
    (dirOId: string, dirName: string) => (e: KeyboardEvent<HTMLDivElement>) => {
      e.stopPropagation()

      if (e.key === 'Enter') {
        e.preventDefault()
        onClickSubmit(dirOId, dirName)
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
    if (directories[editDirOId]) {
      setDirName(directories[editDirOId].dirName)
    } // ::
    else {
      setDirName('--이름 로딩 오류--')
    }
  }, [directories, editDirOId])

  return (
    <Modal onClose={() => {}} onKeyDown={onKeyDownModal(editDirOId, dirName)}>
      <div className="ModalSetDir_Main" tabIndex={0}>
        {/* 1. Title */}
        <p className="_Title">폴더 이름 변경</p>

        {/* 2. Input: Name */}
        <div className="_InputRow">
          <p className="__Label">폴더 이름</p>
          <Input
            className="__Input"
            onChange={e => setDirName(e.currentTarget.value)}
            placeholder="폴더 이름(빈칸이면 변경X)"
            value={dirName} // ::
          />
        </div>

        {/* 3. Button: Save */}
        <div className="_ButtonRow">
          <button className="AppButton_Sakura" onClick={onClickSubmit(editDirOId, dirName)}>
            저장
          </button>
          <button className="AppButton_Sakura" onClick={onClickDelete(editDirOId)}>
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
