import {useCallback, useEffect, useState} from 'react'
import {Input, Modal} from '@component'
import {useModalCallbacksContext} from '@contexts/modal/_callbacks'
import {useDirectoryStatesContext} from '@contexts/directory/__states'
import {useDirectoryCallbacksContext} from '@contexts/directory/_callbacks'
import {SAKURA_TEXT, SAKURA_BORDER, SAKURA_BG, SAKURA_BG_50} from '@value'

import type {CSSProperties} from 'react'
import type {DirectoryType} from '@shareType'

export function ModalFixDir() {
  const {closeModal} = useModalCallbacksContext()
  const {directories, fixDirOId} = useDirectoryStatesContext()
  const {modifyDirName, deleteDirectory} = useDirectoryCallbacksContext()

  const [directory, setDirectory] = useState<DirectoryType | null>(null)
  const [nowDirName, setNowDirName] = useState('')
  const [newDirName, setNewDirName] = useState('')

  const styleModal: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '400px',
    width: '500px'
  }
  const styleTitle: CSSProperties = {
    color: SAKURA_TEXT,
    fontSize: '24px',
    fontWeight: 'bold',
    marginTop: '8px'
  }
  const styleInputRow: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
    justifyContent: 'center',
    marginTop: '48px',
    width: '100%'
  }
  const styleInputLabel: CSSProperties = {
    alignContent: 'center',
    color: SAKURA_TEXT,
    fontSize: '18px',
    fontWeight: 'bold',
    textAlign: 'center'
  }
  const styleInput: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderWidth: '2px',
    color: SAKURA_TEXT,
    fontSize: '16px',
    padding: '10px',
    width: '300px'
  }
  const styleButtonRow: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: '48px',
    justifyContent: 'center',
    marginTop: '48px',
    width: '100%'
  }
  const styleButton: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderRadius: '10px',
    borderWidth: '4px',
    color: SAKURA_TEXT,
    fontSize: '20px',
    fontWeight: 'bold',
    padding: '10px',
    width: '80px'
  }

  const onChangeInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDirName(e.target.value)
  }, [])

  const onClickFix = useCallback(
    (fixDirOId: string, newDirName: string) => () => {
      // 1. 폴더명 바뀌긴 했나 체크
      if (newDirName === nowDirName) {
        alert('새로운 폴더명과 기존 폴더명이 같습니다.')
        return
      }
      // 2. 폴더명 적혀있나 체크
      if (newDirName.trim() === '') {
        // 모달 닫자
        closeModal()
        return
      }
      // 3. 부모 폴더가 있나 체크
      const parentDir = directories[directory?.parentDirOId || '']
      if (!parentDir) {
        alert(`왜 부모 폴더가 없는거지?`)
        return
      }

      // 4. 부모폴더에 중복된 이름 있나 체크
      const subDirOIdsArr = parentDir.subDirOIdsArr
      const arrLen = subDirOIdsArr.length
      for (let i = 0; i < arrLen; i++) {
        const subDirOId = subDirOIdsArr[i]
        const subDir = directories[subDirOId]
        if (subDir?.dirName === newDirName) {
          alert('부모폴더에 중복된 이름이 있습니다.')
          return
        }
      }

      // 5. 수정
      modifyDirName(fixDirOId, newDirName, closeModal)
    },
    [nowDirName, directories, directory, closeModal, modifyDirName]
  )
  const onClickDelete = useCallback(() => {
    deleteDirectory(fixDirOId)
    closeModal()
  }, [fixDirOId, closeModal, deleteDirectory])
  const onClickCancel = useCallback(() => {
    closeModal()
  }, [closeModal])

  // Automatically set dirName, directory
  useEffect(() => {
    if (directories[fixDirOId]) {
      setNowDirName(directories[fixDirOId].dirName)
      setDirectory(directories[fixDirOId])
    } // BLANK LINE COMMENT:
    else {
      setNowDirName(`${fixDirOId}_??`)
    }
  }, [directories, fixDirOId])

  return (
    <Modal onClose={() => {}}>
      <div className="MODAL_FIX_DIR" style={styleModal}>
        {/* 1. 타이틀 */}
        <p style={styleTitle}>[{nowDirName}] 수정/삭제</p>

        {/* 2. 폴더 이름 입력 행 */}
        <div style={styleInputRow}>
          <p style={styleInputLabel}>폴더명</p>
          <Input
            onChange={onChangeInput}
            style={styleInput}
            placeholder={nowDirName}
            value={newDirName}
          />
        </div>

        {/* 3. 버튼 행 */}
        <div className="MODAL_FIX_DIR_BUTTON_ROW " style={styleButtonRow}>
          {/* 3-1. 버튼 행 호버 효과 */}
          <style>
            {`
              .MODAL_FIX_DIR_BUTTON_ROW button {
                background-color: ${SAKURA_BG};
              }
              .MODAL_FIX_DIR_BUTTON_ROW button:hover {
                background-color: ${SAKURA_BG_50};
              }
            `}
          </style>

          {/* 3-2. 버튼 행 버튼 */}
          <button onClick={onClickFix(fixDirOId, newDirName)} style={styleButton}>
            수정
          </button>
          <button onClick={onClickDelete} style={styleButton}>
            삭제
          </button>
          <button onClick={onClickCancel} style={styleButton}>
            취소
          </button>
        </div>
      </div>
    </Modal>
  )
}
