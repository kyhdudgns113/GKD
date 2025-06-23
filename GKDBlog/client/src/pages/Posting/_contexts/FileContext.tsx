import {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react'
import {NULL_FILE} from '@nullValue'

import type {ChangeEvent, FC, FocusEvent, KeyboardEvent, PropsWithChildren, RefObject} from 'react'
import type {FileType} from '@shareType'
import type {Setter} from '@type'

// prettier-ignore
type ContextStatesType = {
  file: FileType, setFile: Setter<FileType>
  inputLast: string, setInputLast: Setter<string>

  needFocusChange: boolean, setNeedFocusChange: Setter<boolean>
  nextFocusCol: number | null, setNextFocusCol: Setter<number | null>
  nextFocusRow: number | null, setNextFocusRow: Setter<number | null>

  needSelectChange: boolean, setNeedSelectChange: Setter<boolean>
  selectRowStart: number | null, setSelectRowStart: Setter<number | null>
  selectRowEnd: number | null, setSelectRowEnd: Setter<number | null>
  selectDirection: 'forward' | 'backward' | null, setSelectDirection: Setter<'forward' | 'backward' | null>

  divRefArr: RefObject<(HTMLDivElement | null)[]>,
  inputRefArr: RefObject<(HTMLInputElement | null)[]>
}
// prettier-ignore
type ContextCallbacksType = {
  onKeyDownInput: (rowIdx: number) => (e: KeyboardEvent<HTMLInputElement>) => void
  onKeyDownInputLast: (e: KeyboardEvent<HTMLInputElement>) => void
  onBlurInput: (rowIdx: number) => (e: FocusEvent<HTMLInputElement>) => void
  onBlurInputLast: (e: FocusEvent<HTMLInputElement>) => void
  onChangeInput: (rowIdx: number) => (e: ChangeEvent<HTMLInputElement>) => void
  onChangeInputLast: (e: ChangeEvent<HTMLInputElement>) => void
  setDivRef: (idx: number, ref: HTMLDivElement | null) => void
  setInputRef: (idx: number, ref: HTMLInputElement | null) => void
}

// prettier-ignore
export const FileContext = createContext<ContextStatesType & ContextCallbacksType>({
  // 상태 변수수
  file: NULL_FILE, setFile: () => {},
  inputLast: '', setInputLast: () => {},

  needFocusChange: false, setNeedFocusChange: () => {},
  nextFocusCol: null, setNextFocusCol: () => {},
  nextFocusRow: null, setNextFocusRow: () => {},

  needSelectChange: false, setNeedSelectChange: () => {},
  selectRowStart: null, setSelectRowStart: () => {},
  selectRowEnd: null, setSelectRowEnd: () => {},
  selectDirection: null, setSelectDirection: () => {},

  divRefArr: {current: []},
  inputRefArr: {current: []},

  // 콜백 함수
  onKeyDownInput: () => () => {},
  onKeyDownInputLast: () => {},
  onBlurInput: () => () => {},
  onBlurInputLast: () => {},
  onChangeInput: () => () => {},
  onChangeInputLast: () => {},
  setDivRef: () => {},
  setInputRef: () => {},
})

export const useFileContext = () => useContext(FileContext)

export const FileProvider: FC<PropsWithChildren> = ({children}) => {
  /**
   * inputLast: 마지막 입력 행에 남아있는 내용
   */
  const [inputLast, setInputLast] = useState<string>('')
  /**
   * file: 파일 그 자체
   */
  const [file, setFile] = useState<FileType>(NULL_FILE)
  /**
   * needFocusChange: focus 를 이동할 지 여부
   * nextFocusCol: focus 를 이동할 열
   * nextFocusRow: focus 를 이동할 행
   *
   * 주의 : 여러 행을 동시에 선택하는 selection 상황을 처리하진 않는다.
   */
  const [needFocusChange, setNeedFocusChange] = useState<boolean>(false)
  const [nextFocusCol, setNextFocusCol] = useState<number | null>(null)
  const [nextFocusRow, setNextFocusRow] = useState<number | null>(null)
  /**
   * needSelectChange: select 를 이동할 지 여부
   * nextSelectCol: select 를 이동할 열
   * nextSelectRow: select 를 이동할 행
   *
   * 주의 : 여러 행을 동시에 선택하는 selection 상황을 처리한다.
   */
  const [needSelectChange, setNeedSelectChange] = useState<boolean>(false)
  const [selectRowStart, setSelectRowStart] = useState<number | null>(null)
  const [selectRowEnd, setSelectRowEnd] = useState<number | null>(null)
  const [selectDirection, setSelectDirection] = useState<'forward' | 'backward' | null>(null)

  const divRefArr = useRef<(HTMLDivElement | null)[]>([])
  const inputRefArr = useRef<(HTMLInputElement | null)[]>([])

  /**
   * 선택된 행의 개수를 반환한다.
   * - range 가 여러개인 경우는 고려하지 않았다.
   */
  const _getSelectedRowCnt = useCallback(() => {
    const selection = window.getSelection()
    if (selection) {
      const range = selection.getRangeAt(0)
      return Math.abs(range.endOffset - range.startOffset)
    }
    return 0
  }, [])
  const _isSelection = useCallback(() => {
    /* 하나의 행만 window.selection 되어있어도 true 리턴한다. */
    if (_getSelectedRowCnt() > 0) {
      return true
    }
    return false
  }, [_getSelectedRowCnt])

  const _keyDownInput_ArrowDown = useCallback(
    (rowIdx: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation()
      e.preventDefault()

      const isSelection = _isSelection()

      if (e.shiftKey) {
        // content 의 마지막 row 에서 Shfit+Up 이후 Shift+Down 하면 셀렉션 바뀌어야 한다.
        // if (rowIdx === file.contentsArr.length - 1) {
        //   return
        // }

        if (isSelection) {
          setNeedSelectChange(true)
          setSelectRowEnd(prev => (prev || 0) + 1)
        } // ::
        else if (rowIdx < file.contentsArr.length - 1) {
          setNeedSelectChange(true)
          setSelectRowStart(rowIdx)
          setSelectRowEnd(rowIdx + 1)
        } // ::
        else {
          // DO NOTHING:
          // inputLast 에 아무것도 없기 때문에 굳이 selection 해줄 이유 없다.
        }
      } // ::
      else {
        // shift 안 누른 경우

        if (!isSelection) {
          /**
           * 셀렉션 되어있지 않은 경우
           * - 커서를 다음 행으로 옮긴다.
           */
          const startIdx = e.currentTarget.selectionStart
          const endIdx = e.currentTarget.selectionEnd
          const direction = e.currentTarget.selectionDirection
          const nextCol = direction === 'forward' ? endIdx : startIdx

          setNeedFocusChange(true)
          setNextFocusCol(nextCol)
          setNextFocusRow(rowIdx + 1)
        } // ::
        else {
          /**
           * 셀렉션 되어있는 경우
           * 1. 셀렉션 상태를 해제한다.
           * 2. 커서를 최하단 행의 다음 행으로 옮긴다.
           *   - inputLast 로 갈 수도 있다.
           */

          // 1. 셀렉션 상태를 해제한다.
          const selection = window.getSelection()
          if (selection) {
            selection.removeAllRanges()
            setSelectDirection(null)
            setSelectRowStart(null)
            setSelectRowEnd(null)
          }

          // 2. 커서를 최하단 행의 다음 행으로 옮긴다.
          //  - 그 다음행이 inputLast 인 경우도 고려한다.
          const nextFocusRow = Math.max(selectRowStart || 0, selectRowEnd || 0) + 1
          const nextRowContent = file.contentsArr[nextFocusRow]
          const nextRowContentType = nextRowContent?.type || 'string'
          const nextCol = nextRowContentType === 'string' ? nextRowContent?.value.length || 0 : 1

          setNeedFocusChange(true)
          setNextFocusCol(nextCol)
          setNextFocusRow(nextFocusRow)
        }
      }
    },
    [file, selectRowStart, selectRowEnd, _isSelection]
  )
  const _keyDownInput_ArrowLeft = useCallback(
    (rowIdx: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation()

      const startIdx = e.currentTarget.selectionStart
      const endIdx = e.currentTarget.selectionEnd

      // shift 안 누른채 행의 맨 앞에서 누른거 아니면 원래 기능대로 작동한다.
      // rowIdx 에서 shift + startIdx=0 이면 복수의 행 선택하게 해야한다.
      if (startIdx !== null && endIdx !== null && !e.shiftKey && (startIdx > 0 || endIdx > 0)) {
        return
      }

      // 첫 번째 행에서 Shift+Down 이후 Shift+Left 하면 작동해야 한다.
      // if (rowIdx === 0) {
      //   return
      // }

      const isSelection = _isSelection()

      if (e.shiftKey) {
        if (isSelection) {
          /**
           * 셀렉션 된 상태
           * - endRow 만 바꿔주면 됨
           */
          e.preventDefault()
          setNeedSelectChange(true)
          setSelectRowEnd(prev => Math.max((prev || 0) - 1, 0))
        } // ::
        else if (startIdx === 0 && rowIdx > 0) {
          /**
           * 셀렉션 되어있진 않으며, 0번째 행은 아닌 경우
           * - 새로운 selection 을 만들어주면 됨.
           */
          e.preventDefault()
          setNeedSelectChange(true)
          setSelectRowStart(rowIdx)
          setSelectRowEnd(rowIdx - 1)
        } // ::
        else {
          /**
           * 셀렉션 되어있지도 않고, 0번째 행인 경우
           * - // DO NOTHING:
           */
        }
      } // ::
      else {
        // Shift 안 누른 경우
        e.preventDefault()

        if (!isSelection) {
          /**
           * 셀렉션 안 되어있는 상태
           * - 상단의 조건으로 인해 커서는 맨앞에 있다
           * - 커서를 이전 행으로 옮긴다.
           */
          const lastContent = file.contentsArr[file.contentsArr.length - 1]
          const lastContentValue = lastContent.value
          const lastContentType = lastContent.type

          /**
           * 이전 row 에 있는 콘텐츠에 있는 타입별로 처리한다.
           */
          if (lastContentType === 'string') {
            setNeedFocusChange(true)
            setNextFocusCol(lastContentValue.length)
            setNextFocusRow(rowIdx - 1)
          } // ::
          else {
            setNeedFocusChange(true)
            setNextFocusCol(1)
            setNextFocusRow(rowIdx - 1)
          }
        } // ::
        else {
          /**
           * 셀렉션 되어있는 경우
           * - 셀렉션 상태를 해제한다.
           * - 커서를 최상단 행으로 옮긴다.
           *   - 윗 방향으로 이동하는건 아니기에 최상단 행으로 옮긴다.
           */
          const selection = window.getSelection()
          if (selection) {
            selection.removeAllRanges()
            setSelectDirection(null)
            setSelectRowStart(null)
            setSelectRowEnd(null)
          }

          const topRow = Math.min(selectRowStart || 0, selectRowEnd || 0)
          const topRowContent = file.contentsArr[topRow]
          const topRowContentType = topRowContent?.type || 'string'
          const topCol = topRowContentType === 'string' ? topRowContent?.value.length || 0 : 1

          setNeedFocusChange(true)
          setNextFocusCol(topCol)
          setNextFocusRow(topRow)
        }
      }
    },
    [file, selectRowStart, selectRowEnd, _isSelection]
  )
  const _keydownInput_ArrowRight = useCallback(
    (rowIdx: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation()

      const value = e.currentTarget.value
      const startIdx = e.currentTarget.selectionStart
      const endIdx = e.currentTarget.selectionEnd

      // 맨 뒤에서 누른거 아니면 원래 기능대로 작동한다.
      if (
        startIdx !== null &&
        endIdx !== null &&
        !e.shiftKey &&
        (startIdx < value.length || endIdx < value.length)
      ) {
        return
      }

      const isSelection = _isSelection()

      /* Shift 키 눌렀는지 여부에 따른 처리 */
      if (e.shiftKey) {
        // Shift 키 누른 경우

        if (isSelection) {
          /**
           * 셀렉션 된 상태
           * - endRow 만 바꿔주면 됨
           */
          e.preventDefault()
          setNeedSelectChange(true)
          setSelectRowEnd(prev => Math.min((prev || 0) + 1, file.contentsArr.length - 1))
        } // ::
        else if (rowIdx < file.contentsArr.length - 1) {
          /**
           * 셀렉션 안 되어있는 상태
           * - 상단의 조건으로 인해 커서는 맨뒤에 있다
           * - 셀렉션을 만들어준다.
           */
          e.preventDefault()
          setNeedSelectChange(true)
          setSelectRowStart(rowIdx)
          setSelectRowEnd(rowIdx + 1)
        } // ::
        else {
          /**
           * selection 되어있지도 않고, contents 의 끝 행인 경우
           * - 어차피 inputLast 에는 내용이 없다.
           * - // DO NOTHING:
           */
        }
      } // ::
      else {
        // Shift 안 누른 경우

        e.preventDefault()

        if (!isSelection) {
          /**
           * 셀렉션 안 되어있는 상태
           * - 커서를 다음 행으로 옮긴다.
           */
          setNeedFocusChange(true)
          setNextFocusCol(0)
          setNextFocusRow(rowIdx + 1)
        } // ::
        else {
          /**
           * 셀렉션 되어있는 경우
           * - 셀렉션 상태를 해제한다.
           * - 커서를 최하단 행으로 옮긴다.
           *   - 아래 방향으로 이동하는건 아니기에 최하단 행으로 옮긴다.
           */
          const selection = window.getSelection()
          if (selection) {
            selection.removeAllRanges()
            setSelectDirection(null)
            setSelectRowStart(null)
            setSelectRowEnd(null)
          }

          const bottomRow = Math.max(selectRowStart || 0, selectRowEnd || 0)
          const bottomRowContent = file.contentsArr[bottomRow]
          const bottomRowContentType = bottomRowContent?.type || 'string'
          const bottomCol =
            bottomRowContentType === 'string' ? bottomRowContent?.value.length || 0 : 1

          setNeedFocusChange(true)
          setNextFocusCol(bottomCol)
          setNextFocusRow(bottomRow)
        }
      }
    },
    [file, selectRowStart, selectRowEnd, _isSelection]
  )
  const _keydownInput_ArrowUp = useCallback(
    (rowIdx: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation()

      // 모든 경우에 대해서 Default 기능도 실행하지 않는다.
      e.preventDefault()

      // 맨 위에서 눌러도 작동할때가 있다.
      //   - shift+Down 이후 shift+Up 하면 작동해야한다.
      // if (rowIdx === 0) {
      //   return
      // }

      const startIdx = e.currentTarget.selectionStart
      const endIdx = e.currentTarget.selectionEnd
      const direction = e.currentTarget.selectionDirection
      const nextCol = direction === 'forward' ? endIdx : startIdx

      const isSelection = _isSelection()

      /* Shift 키 눌렀는지 여부에 따른 처리 */
      if (e.shiftKey) {
        // Shift 키 누른 경우

        if (isSelection) {
          setNeedSelectChange(true)
          setSelectRowEnd(prev => Math.max((prev || 0) - 1, 0))
        } // ::
        else if (rowIdx > 0) {
          setNeedSelectChange(true)
          setSelectRowStart(rowIdx)
          setSelectRowEnd(rowIdx - 1)
        } // ::
        else {
          // DO NOTHING:
        }
      } // ::
      else {
        // Shift 안 누른 경우

        if (!isSelection) {
          /**
           * 셀렉션 안 되어있는 경우
           * - 커서를 윗 행으로 옮긴다.
           */
          /**
           * 셀렉션 안 되어있는 경우
           * - 커서를 윗 행으로 옮긴다.
           */
          setNeedFocusChange(true)
          setNextFocusCol(nextCol)
          setNextFocusRow(rowIdx - 1)
        } // ::
        else {
          /**
           * 셀렉션 되어있는 경우
           * - 셀렉션 상태를 해제한다.
           * - 커서를 최상단 행의 윗 행으로 옮긴다.
           */
          const selection = window.getSelection()
          if (selection) {
            selection.removeAllRanges()
            setSelectDirection(null)
            setSelectRowStart(null)
            setSelectRowEnd(null)
          }

          const topRow = Math.min(selectRowStart || 0, selectRowEnd || 0) - 1
          const topRowContent = topRow >= 0 ? file.contentsArr[topRow] : {type: 'string', value: ''}
          const topRowContentType = topRowContent.type || 'string'
          const topCol = topRowContentType === 'string' ? topRowContent.value.length || 0 : 1

          setNeedFocusChange(true)
          setNextFocusCol(topCol)
          setNextFocusRow(topRow)
        }
      }
    },
    [file, selectRowStart, selectRowEnd, _isSelection]
  )
  const _keydownInput_Backspace = useCallback(
    (rowIdx: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation()

      const startIdx = e.currentTarget.selectionStart
      const endIdx = e.currentTarget.selectionEnd

      // 맨 앞에서 누른거 아니면 원래 기능대로 작동한다.
      if (startIdx !== null && endIdx !== null && (startIdx > 0 || endIdx > 0)) {
        return
      }

      // 맨 앞이면서 0번째 행이면 아무것도 하지 않는다.
      if (rowIdx === 0) {
        return
      }

      const newFile = {...file}
      const newContentsArr = newFile.contentsArr // call by reference 로 한다
      const lastContent = newContentsArr[rowIdx - 1]
      const lastContentType = lastContent.type
      const lastContentValue = lastContent.value

      /**
       * 타입에 따라 처리
       * 1. 문자열 타입일 경우
       * 2. 이미지 타입일 경우
       */
      if (lastContentType === 'string') {
        e.preventDefault()
        newContentsArr[rowIdx - 1].value = lastContentValue + newContentsArr[rowIdx].value
        newContentsArr.splice(rowIdx, 1)
        setFile(newFile)
        setNeedFocusChange(true)
        setNextFocusCol(lastContentValue.length)
        setNextFocusRow(rowIdx - 1)
      } // ::
      else {
        e.preventDefault()
        newContentsArr.splice(rowIdx, 1)
        setFile(newFile)
        setNeedFocusChange(true)
        setNextFocusCol(0)
        setNextFocusRow(rowIdx - 1)
      }
    },
    [file, setFile]
  )
  const _keydownInput_Enter = useCallback(
    (rowIdx: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation()

      const value = e.currentTarget.value
      const startIdx = e.currentTarget.selectionStart
      const endIdx = e.currentTarget.selectionEnd

      const prevContent = value.slice(0, startIdx || 0)
      const nextContent = value.slice(endIdx || 0)

      setFile(prev => {
        const newContentsArr = [...prev.contentsArr]
        newContentsArr.splice(rowIdx, 1, {type: 'string', value: prevContent})
        newContentsArr.splice(rowIdx + 1, 0, {type: 'string', value: nextContent})
        return {...prev, contentsArr: newContentsArr}
      })
      setNeedFocusChange(true)
      setNextFocusCol(0)
      setNextFocusRow(rowIdx + 1)
    },
    [setFile]
  )

  const _keyDownLast_ArrowDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation()

      const value = e.currentTarget.value

      /* inputLast 에 내용이 있는 경우만 작동함 */
      if (value.length > 0) {
        setFile(prev => {
          const newContentsArr = [...prev.contentsArr]
          newContentsArr.push({type: 'string', value})
          return {...prev, contentsArr: newContentsArr}
        })
        setInputLast('')

        /* Shift 키 눌렀는지 여부에 따른 처리 */
        if (e.shiftKey) {
          /**
           * Shift 키 누른채로 아래키 눌렀을때
           * - selection 을 설정해준다.
           */
          setNeedSelectChange(true)
          setSelectRowStart(file.contentsArr.length)
          setSelectRowEnd(file.contentsArr.length)
        } // ::
        else {
          /**
           * Shift 키 안 눌렀을때
           * - 커서를 새로운 inputLast 로 변경한다.
           */
          setNeedFocusChange(true)
          setNextFocusCol(0)
          setNextFocusRow(file.contentsArr.length + 1)
        }
      }
    },
    [file, setFile]
  )
  const _keyDownLast_ArrowLeft = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation()

      const startIdx = e.currentTarget.selectionStart
      const endIdx = e.currentTarget.selectionEnd
      const lastContent = file.contentsArr[file.contentsArr.length - 1]
      const lastContentValue = lastContent.value
      const lastContentType = lastContent.type
      const newNextFocusRow = file.contentsArr.length - 1

      // 맨 앞에서 누른거 아니면 원래 기능대로 작동한다.
      if (startIdx !== null && endIdx !== null && !e.shiftKey && (startIdx > 0 || endIdx > 0)) {
        return
      }

      const value = e.currentTarget.value
      const newFile = {...file, contentsArr: [...file.contentsArr]}
      const newContentsArr = newFile.contentsArr
      newContentsArr.push({type: 'string', value})

      /* Shift 키 눌렀는지 여부에 따른 처리 */
      if (e.shiftKey) {
        // Shift 키 눌렀을때

        if (startIdx === 0) {
          /**
           * 커서가 맨 앞에 있는 경우
           * - selection 을 설정해준다.
           * - shift 키 누른 상태에서 startIdx === 0 인 경우는 상단에서 걸러내지 않았다.
           */
          e.preventDefault()

          if (value.length > 0) {
            setFile(newFile)
          }
          setInputLast('')
          setNeedSelectChange(true)
          setSelectRowStart(file.contentsArr.length)
          setSelectRowEnd(file.contentsArr.length - 1)

          setNeedFocusChange(true)
          setNextFocusCol(0)
          setNextFocusRow(newNextFocusRow)
        } // ::
        else {
          /**
           * 커서가 맨 앞에 있지 않은 경우
           * - default 기능을 실행한다.
           */
        }
      } // ::
      else {
        // Shift 키 안 눌렀을때
        e.preventDefault()

        /* inputLast 바로 윗 행의 타입에 따라 처리 */
        if (lastContentType === 'string') {
          const newNextFocusCol = lastContentValue.length
          if (value.length > 0) {
            setFile(newFile)
          }
          setInputLast('')
          setNeedFocusChange(true)
          setNextFocusCol(newNextFocusCol)
          setNextFocusRow(newNextFocusRow)
        } // ::
        else {
          if (value.length > 0) {
            setFile(newFile)
          }
          setInputLast('')
          setNeedFocusChange(true)
          setNextFocusCol(1)
          setNextFocusRow(newNextFocusRow)
        }
      }
    },
    [file, setFile]
  )
  const _keyDownLast_ArrowRight = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation()

      const value = e.currentTarget.value
      const startIdx = e.currentTarget.selectionStart
      const endIdx = e.currentTarget.selectionEnd
      const contentLen = value.length

      // 끝행이 아니면 원래 기능대로 작동한다.
      if (startIdx !== null && endIdx !== null && (startIdx < contentLen || endIdx < contentLen)) {
        return
      }

      if (value.length > 0) {
        e.preventDefault()
        setFile(prev => {
          const newContentsArr = [...prev.contentsArr]
          newContentsArr.push({type: 'string', value})
          return {...prev, contentsArr: newContentsArr}
        })
        setInputLast('')

        /* Shift 키 눌렀는지 여부에 따른 처리 */
        if (e.shiftKey) {
          /**
           * Shift 키 눌렀을때
           * - selection 을 설정해준다.
           */
          setNeedSelectChange(true)
          setSelectRowStart(file.contentsArr.length)
          setSelectRowEnd(file.contentsArr.length)
        } // ::
        else {
          /**
           * Shift 키 안 눌렀을때
           * - 커서를 새로운 inputLast 로 변경한다.
           */
          setNeedFocusChange(true)
          setNextFocusCol(0)
          setNextFocusRow(file.contentsArr.length + 1)
        }
      }
    },
    [file, setFile]
  )
  const _keyDownLast_ArrowUp = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation()

      const value = e.currentTarget.value
      const startIdx = e.currentTarget.selectionStart
      const endIdx = e.currentTarget.selectionEnd
      const direction = e.currentTarget.selectionDirection
      const nextCol = direction === 'forward' ? endIdx : startIdx

      e.preventDefault()
      if (value.length > 0) {
        setFile(prev => {
          const newContentsArr = [...prev.contentsArr]
          newContentsArr.push({type: 'string', value})
          return {...prev, contentsArr: newContentsArr}
        })
      }
      setInputLast('')

      /* Shift 키 눌렀는지 여부에 따른 처리 */
      if (e.shiftKey) {
        /**
         * Shift 키 눌렀을때
         * - selection 을 설정해준다.
         */
        setNeedSelectChange(true)
        setSelectRowStart(file.contentsArr.length)
        setSelectRowEnd(file.contentsArr.length)
      } // ::
      else {
        /**
         * Shift 키 안 눌렀을때
         * - 커서를 윗 행으로 옮겨준다.
         */
        setNeedFocusChange(true)
        setNextFocusCol(nextCol)
        setNextFocusRow(file.contentsArr.length - 1)
      }
    },
    [file, setFile]
  )
  const _keydownLast_Backspace = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation()

      // 마지막행의 type 은 무조건 string 이다.
      // 이미지는 넣자마자 바로 이전 행에 추가하자.
      const value = e.currentTarget.value
      const startIdx = e.currentTarget.selectionStart
      const endIdx = e.currentTarget.selectionEnd
      const lastContent = file.contentsArr[file.contentsArr.length - 1]
      const lastContentType = lastContent.type
      const lastContentValue = lastContent.value

      // 맨 앞에서 누른거 아니면 원래 기능대로 작동한다.
      if (startIdx !== null && endIdx !== null && (startIdx > 0 || endIdx > 0)) {
        return
      }

      const newFile = {...file}
      const newContentsArr = newFile.contentsArr // call by reference 로 한다

      /**
       * 마지막 콘텐츠 타입에 따라 처리
       * 1. 문자열 타입일 경우
       * 2. 이미지 타입일 경우
       *    - 해당 이미지를 지우고 inputLast 로 대체한다
       */
      if (lastContentType === 'string') {
        e.preventDefault()
        newContentsArr[newContentsArr.length - 1].value = lastContentValue + value
        setFile(newFile)
        setInputLast('')
        setNeedFocusChange(true)
        setNextFocusCol(lastContent.value.length)
        setNextFocusRow(file.contentsArr.length - 1)
      } // ::
      else {
        e.preventDefault()
        newContentsArr[newContentsArr.length - 1] = {type: 'string', value}
        setFile(newFile)
        setInputLast('')
        setNeedFocusChange(true)
        setNextFocusCol(0)
        setNextFocusRow(file.contentsArr.length - 1)
      }
    },
    [file]
  )
  const _keydownLast_Enter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation()

      const value = e.currentTarget.value
      const startIdx = e.currentTarget.selectionStart
      const endIdx = e.currentTarget.selectionEnd

      const newContent = value.slice(0, startIdx || 0) // file 에 당장 추가될 내용
      const newInputLast = value.slice(endIdx || 0) // 마지막 입력 행에 남아있는 내용

      setFile(prev => {
        const newContentsArr = [...prev.contentsArr]
        newContentsArr.push({type: 'string', value: newContent})
        return {...prev, contentsArr: newContentsArr}
      })
      setInputLast(newInputLast || '')
      setNeedFocusChange(true)
      setNextFocusCol(0)
      setNextFocusRow(file.contentsArr.length + 1)
    },
    [file, setFile]
  )

  const onBlurInput = useCallback(
    (rowIdx: number) => (e: FocusEvent<HTMLInputElement>) => {
      // onChangeInput 에서 직접 file 의 내용을 바꾼다.
      // 여기선 뭐 안해줘도 된다.
      return {e, rowIdx}
    },
    []
  )
  const onBlurInputLast = useCallback((e: FocusEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    if (value.length > 0) {
      setFile(prev => {
        const newContentsArr = [...prev.contentsArr]
        newContentsArr.push({type: 'string', value})
        return {...prev, contentsArr: newContentsArr}
      })
      setInputLast('')
    }
  }, [])
  const onChangeInput = useCallback(
    (rowIdx: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value
      setFile(prev => {
        const newContentsArr = [...prev.contentsArr]
        newContentsArr[rowIdx] = {type: 'string', value}
        return {...prev, contentsArr: newContentsArr}
      })
    },
    []
  )
  const onChangeInputLast = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputLast(e.currentTarget.value)
  }, [])

  const onKeyDownInput = useCallback(
    (rowIdx: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'ArrowDown':
          _keyDownInput_ArrowDown(rowIdx)(e)
          break
        case 'ArrowLeft':
          _keyDownInput_ArrowLeft(rowIdx)(e)
          break
        case 'ArrowRight':
          _keydownInput_ArrowRight(rowIdx)(e)
          break
        case 'ArrowUp':
          _keydownInput_ArrowUp(rowIdx)(e)
          break
        case 'Backspace':
          _keydownInput_Backspace(rowIdx)(e)
          break
        case 'Enter':
          _keydownInput_Enter(rowIdx)(e)
          break
        case 'Escape': {
          const selection = window.getSelection()
          if (selection) {
            const yes = selection.getRangeAt(0)
            console.log(`offsets in: ${yes.startOffset} ${yes.endOffset}`)
          }
          break
        }
      }
    },
    [
      _keyDownInput_ArrowDown,
      _keyDownInput_ArrowLeft,
      _keydownInput_ArrowRight,
      _keydownInput_ArrowUp,
      _keydownInput_Backspace,
      _keydownInput_Enter
    ]
  )
  const onKeyDownInputLast = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'ArrowDown':
          _keyDownLast_ArrowDown(e)
          break
        case 'ArrowLeft':
          _keyDownLast_ArrowLeft(e)
          break
        case 'ArrowRight':
          _keyDownLast_ArrowRight(e)
          break
        case 'ArrowUp':
          _keyDownLast_ArrowUp(e)
          break
        case 'Backspace':
          _keydownLast_Backspace(e)
          break
        case 'Enter':
          _keydownLast_Enter(e)
          break
        default:
          break
      }
    },
    [
      _keyDownLast_ArrowDown,
      _keyDownLast_ArrowLeft,
      _keyDownLast_ArrowRight,
      _keyDownLast_ArrowUp,
      _keydownLast_Backspace,
      _keydownLast_Enter
    ]
  )

  const setDivRef = useCallback(
    (idx: number, ref: HTMLDivElement | null) => {
      if (!divRefArr.current) {
        divRefArr.current = []
      }
      divRefArr.current[idx] = ref
    },
    [divRefArr]
  )
  const setInputRef = useCallback(
    (idx: number, ref: HTMLInputElement | null) => {
      if (!inputRefArr.current) {
        inputRefArr.current = []
      }
      inputRefArr.current[idx] = ref
    },
    [inputRefArr]
  )

  // 포커스 이동 처리 (하나의 행 내부에 커서 배치)
  // - 마지막 행에서 focus 가 바뀌고 selection 수행되어야 하는 경우가 있다.
  // - selection 과 순서를 바꾸면 안된다.
  useEffect(() => {
    if (needFocusChange && inputRefArr.current && nextFocusRow !== null && nextFocusCol !== null) {
      const inputRef = inputRefArr.current[nextFocusRow]
      if (inputRef) {
        // console.log(`useEffect_focus nextCol: ${nextFocusCol} nextRow: ${nextFocusRow}`)

        inputRef.focus()
        inputRef.setSelectionRange(nextFocusCol, nextFocusCol)
        setNeedFocusChange(false)
        setNextFocusCol(null)
        setNextFocusRow(null)
      }
    }
  }, [inputRefArr, needFocusChange, nextFocusCol, nextFocusRow])

  // 셀렉션 이동 처리 (하나 이상의 행 걸쳐서 선택)
  useEffect(() => {
    if (needSelectChange && divRefArr && selectRowStart !== null && selectRowEnd !== null) {
      console.log(`useEffect_selection ${selectRowStart} ${selectRowEnd}`)
      const selection = window.getSelection()
      if (!selection) {
        return
      }

      const start = Math.min(selectRowStart, selectRowEnd)
      const end = Math.max(selectRowStart, selectRowEnd)

      const startDivRef = divRefArr.current[start]
      const endDivRef = divRefArr.current[end]

      if (startDivRef !== null && endDivRef !== null) {
        const range = document.createRange()
        range.setStartBefore(startDivRef)
        range.setEndAfter(endDivRef)

        const nextDirection =
          selectRowStart < selectRowEnd
            ? 'forward'
            : selectRowStart > selectRowEnd
            ? 'backward'
            : null

        setNeedSelectChange(false)
        setSelectDirection(nextDirection)

        selection.removeAllRanges()
        selection.addRange(range)
      }

      // 이거 나중에 써야되니 주석처리
      // setSelectRowStart(null)
      // setSelectRowEnd(null)
    }
  }, [divRefArr, needSelectChange, selectRowEnd, selectRowStart])

  // prettier-ignore
  const value: ContextStatesType & ContextCallbacksType = {
    // 상태 변수
    file, setFile,
    inputLast, setInputLast,

    needFocusChange, setNeedFocusChange,
    nextFocusCol, setNextFocusCol,
    nextFocusRow, setNextFocusRow,

    needSelectChange, setNeedSelectChange,
    selectRowStart, setSelectRowStart,
    selectRowEnd, setSelectRowEnd,
    selectDirection, setSelectDirection,
    
    divRefArr,
    inputRefArr,
    // 콜백 함수
    onKeyDownInput,
    onKeyDownInputLast,
    onBlurInput,
    onBlurInputLast,
    onChangeInput,
    onChangeInputLast,
    setDivRef,
    setInputRef,
  }

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>
}
