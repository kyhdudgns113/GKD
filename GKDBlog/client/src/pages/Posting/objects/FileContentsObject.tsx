import {useCallback, useEffect, useRef, useState} from 'react'
import {Input, SAKURA_BORDER} from '../../../common/'

import type {ChangeEvent, CSSProperties, FC, KeyboardEvent, FocusEvent} from 'react'
import type {DivCommonProps, FileType, Setter} from '../../../common'

/* eslint-disable */
type FileContentsObjectProps = DivCommonProps & {
  file: FileType
  setFile: Setter<FileType>
}
/**
 * 파일 내용 수정하는 오브젝트
 *
 * 1. 가급적 file 부터 바꾼다.
 *  - file 에 의해 렌더링 먼저 되고 다른 작업이 실행되는게 오류가 덜 난다.
 */
export const FileContentsObject: FC<FileContentsObjectProps> = ({
  file,
  setFile,
  // BLANK LINE COMMENT:
  className,
  style,
  ...props
}) => {
  /**
   * inputLast: 마지막 입력 행에 남아있는 내용
   */
  const [inputLast, setInputLast] = useState<string>('')
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

  const divRefArr = useRef<(HTMLDivElement | null)[]>([])
  const inputRefArr = useRef<(HTMLInputElement | null)[]>([])

  const styleInputRow: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  }
  const styleInputName: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderBottomWidth: '2px',
    width: '100%'
  }

  const _setDivRef = useCallback(
    (idx: number, ref: HTMLDivElement | null) => {
      if (!divRefArr.current) {
        divRefArr.current = []
      }
      divRefArr.current[idx] = ref
    },
    [divRefArr]
  )
  const _setInputRef = useCallback(
    (idx: number, ref: HTMLInputElement | null) => {
      if (!inputRefArr.current) {
        inputRefArr.current = []
      }
      inputRefArr.current[idx] = ref
    },
    [inputRefArr]
  )

  const onBlurInput = useCallback(
    (rowIdx: number) => (e: FocusEvent<HTMLInputElement>) => {
      // onChangeInput 에서 직접 file 의 내용을 바꾼다.
      // 여기선 뭐 안해줘도 된다.
      return {e, rowIdx}
    },
    [setFile]
  )
  const onBlurInputLast = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value
      if (value.length > 0) {
        setFile(prev => {
          const newContentsArr = [...prev.contentsArr]
          newContentsArr.push({type: 'string', value})
          return {...prev, contentsArr: newContentsArr}
        })
        setInputLast('')
      }
    },
    [setFile]
  )
  const onChangeInput = useCallback(
    (rowIdx: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value
      setFile(prev => {
        const newContentsArr = [...prev.contentsArr]
        newContentsArr[rowIdx] = {type: 'string', value}
        return {...prev, contentsArr: newContentsArr}
      })
    },
    [setFile]
  )
  const onChangeInputLast = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputLast(e.currentTarget.value)
  }, [])

  const _keyDownInput_ArrowDown = useCallback(
    (rowIdx: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation()
      e.preventDefault()

      const startIdx = e.currentTarget.selectionStart
      const endIdx = e.currentTarget.selectionEnd
      const direction = e.currentTarget.selectionDirection
      const nextCol = direction === 'forward' ? endIdx : startIdx

      setNeedFocusChange(true)
      setNextFocusCol(nextCol)
      setNextFocusRow(rowIdx + 1)
    },
    []
  )
  const _keyDownInput_ArrowLeft = useCallback(
    (rowIdx: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation()

      const startIdx = e.currentTarget.selectionStart
      const endIdx = e.currentTarget.selectionEnd
      const lastContent = file.contentsArr[file.contentsArr.length - 1]
      const lastContentValue = lastContent.value
      const lastContentType = lastContent.type

      // 맨 앞에서 누른거 아니면 원래 기능대로 작동한다.
      if (startIdx !== null && endIdx !== null && (startIdx > 0 || endIdx > 0)) {
        return
      }

      e.preventDefault()

      if (lastContentType === 'string') {
        setNeedFocusChange(true)
        setNextFocusCol(lastContentValue.length)
        setNextFocusRow(rowIdx - 1)
      } // BLANK LINE COMMENT:
      else {
        setNeedFocusChange(true)
        setNextFocusCol(1)
        setNextFocusRow(rowIdx - 1)
      }
    },
    [file]
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
        (startIdx < value.length || endIdx < value.length)
      ) {
        return
      }

      e.preventDefault()
      setNeedFocusChange(true)
      setNextFocusCol(0)
      setNextFocusRow(rowIdx + 1)
    },
    []
  )
  const _keydownInput_ArrowUp = useCallback(
    (rowIdx: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation()

      // Default 기능도 실행하지 않는다.
      e.preventDefault()

      // 맨 위에서 눌렀으면 아무것도 하지 않는다.
      if (rowIdx === 0) {
        return
      }

      const startIdx = e.currentTarget.selectionStart
      const endIdx = e.currentTarget.selectionEnd
      const direction = e.currentTarget.selectionDirection
      const nextCol = direction === 'forward' ? endIdx : startIdx

      e.preventDefault()

      setNeedFocusChange(true)
      setNextFocusCol(nextCol)
      setNextFocusRow(rowIdx - 1)
    },
    []
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
      } // BLANK LINE COMMENT:
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
      if (value.length > 0) {
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
      }
    },
    [setFile]
  )

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

  const _keyDownLast_ArrowDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation()

      const value = e.currentTarget.value
      if (value.length > 0) {
        setFile(prev => {
          const newContentsArr = [...prev.contentsArr]
          newContentsArr.push({type: 'string', value})
          return {...prev, contentsArr: newContentsArr}
        })
        setInputLast('')
        setNeedFocusChange(true)
        setNextFocusCol(0)
        setNextFocusRow(file.contentsArr.length + 1)
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
      if (startIdx !== null && endIdx !== null && (startIdx > 0 || endIdx > 0)) {
        return
      }

      e.preventDefault()

      const value = e.currentTarget.value
      const newFile = {...file}
      const newContentsArr = newFile.contentsArr
      newContentsArr.push({type: 'string', value})

      if (lastContentType === 'string') {
        const newNextFocusCol = lastContentValue.length
        setFile(newFile)
        setInputLast('')
        setNeedFocusChange(true)
        setNextFocusCol(newNextFocusCol)
        setNextFocusRow(newNextFocusRow)
      } // BLANK LINE COMMENT:
      else {
        setFile(newFile)
        setInputLast('')
        setNeedFocusChange(true)
        setNextFocusCol(1)
        setNextFocusRow(newNextFocusRow)
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
        setNeedFocusChange(true)
        setNextFocusCol(0)
        setNextFocusRow(file.contentsArr.length + 1)
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
      setNeedFocusChange(true)
      setNextFocusCol(nextCol)
      setNextFocusRow(file.contentsArr.length - 1)
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
      } // BLANK LINE COMMENT:
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
      if (value.length > 0) {
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
      }
    },
    [file, setFile]
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

  // 포커스 이동 처리 (하나의 행 내부에 커서 배치)
  useEffect(() => {
    if (needFocusChange && inputRefArr.current && nextFocusRow !== null && nextFocusCol !== null) {
      const inputRef = inputRefArr.current[nextFocusRow]
      if (inputRef) {
        inputRef.focus()
        inputRef.setSelectionRange(nextFocusCol, nextFocusCol)
        setNeedFocusChange(false)
        setNextFocusCol(null)
        setNextFocusRow(null)
      }
    }
  }, [inputRefArr, needFocusChange, nextFocusCol, nextFocusRow])

  return (
    <div className={`FILE_CONTENTS_OBJECT ${className || ''}`} style={style} {...props}>
      {/* 1. 파일 내용 행 */}
      {file.contentsArr.map((content, idx) => {
        /**
         * Content 타입별 처리
         *  1. 문자열
         *  2. 이미지
         */
        if (content.type === 'string') {
          return (
            <div
              className={`INPUT_ROW ROW_STRING idx:${idx}`}
              key={idx}
              ref={ref => _setDivRef(idx, ref)}
              style={styleInputRow} // BLANK LINE COMMENT:
            >
              <Input
                onBlur={onBlurInput(idx)}
                onChange={onChangeInput(idx)}
                onKeyDown={onKeyDownInput(idx)}
                ref={ref => _setInputRef(idx, ref)}
                value={content.value}
              />
            </div>
          )
        } // BLANK LINE COMMENT:
        else {
          return (
            <div
              className={`INPUT_ROW ROW_IMAGE idx:${idx}`}
              key={idx}
              ref={ref => _setDivRef(idx, ref)}
              style={styleInputRow}>
              <p>{idx}</p>
            </div>
          )
        }
      })}

      {/* 2. 마지막 입력 행 */}
      <div className={`INPUT_ROW idx:${file.contentsArr.length}`} style={styleInputRow}>
        <Input
          onBlur={onBlurInputLast}
          onChange={onChangeInputLast}
          onKeyDown={onKeyDownInputLast}
          ref={ref => _setInputRef(file.contentsArr.length, ref)}
          style={styleInputName}
          type="text"
          value={inputLast}
        />
      </div>
    </div>
  )
}
/* eslint-enable */
