import {
  ChangeEvent,
  createContext,
  CSSProperties,
  FC,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import {DivCommonProps, SAKURA_BORDER, Setter} from '../../../common'
import {useTemplateStatesContext} from '../../../template/_contexts'
import {getWithJwt} from '../../../common/server'
import {alertErrors, writeJwtFromServer} from '../../../common/utils'
import {DocChangeType} from '../../../common/typesAndValues/shareTypes'

// prettier-ignore
type ContextType = {
  contents: string[], setContents: Setter<string[]>
}
// prettier-ignore
export const DocumentContext = createContext<ContextType>({
  contents: [], setContents: () => {}
})

export const useDocumentContext = () => {
  return useContext(DocumentContext)
}

type DocumentPartProps = DivCommonProps & {}
export const DocumentPart: FC<DocumentPartProps> = ({className, ...props}) => {
  const {clubsArr, selectedClubIdx: clubIdx} = useTemplateStatesContext()

  /* eslint-disable */
  const [changeQ, setChangeQ] = useState<DocChangeType[]>([])
  const [contents, setContents] = useState<string[]>([])
  const [delEnd, setDelEnd] = useState<number | null>(null)
  const [delStart, setDelStart] = useState<number | null>(null)
  const [selectEnd, setSelectEnd] = useState<number | null>(null)
  const [selectStart, setSelectStart] = useState<number | null>(null)
  const [isDBLoaded, setIsDBLoaded] = useState<boolean>(false)
  const [lastContent, setLastContent] = useState<string>('')
  const [lastMOut, setLastMOut] = useState<number | null>(null)
  const [testFocus, setTestFocus] = useState<number | null>(null)
  /* eslint-enable */

  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [mouseDown, setMouseDown] = useState<number | null>(null)
  const [mouseOut, setMouseOut] = useState<number | null>(null)
  const [mouseOver, setMouseOver] = useState<number | null>(null)
  const [mouseUp, setMouseUp] = useState<number | null>(null)
  const [shiftMDown, setShiftMDown] = useState<number | null>(null)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const styleBlock: CSSProperties = {
    ...props.style,
    display: 'flex',
    flexDirection: 'column',
    width: '750px',
    minHeight: '200px',
    height: 'fit-content',
    borderColor: SAKURA_BORDER,
    borderWidth: '6px',
    borderRadius: '12px',

    boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.4)',

    padding: '8px'
  }
  const styleBottom: CSSProperties = {
    flexGrow: 1,
    minHeight: '20px',
    width: '100%'
  }
  const styleInput: CSSProperties = {
    backgroundColor: 'white',
    outline: 'none',
    width: '100%'
  }

  // AREA1: Content's event handler
  const onBlur = useCallback(
    (rowIdx: number) => (e: ChangeEvent<HTMLInputElement>) => {
      setIsChanged(false)
      if (isChanged) {
      }
    },
    [isChanged]
  )
  const onChange = useCallback(
    (rowIdx: number) => (e: ChangeEvent<HTMLInputElement>) => {
      setIsChanged(true)
      if ((contents.length || 0) === rowIdx) {
        setLastContent(e.target.value)
      } // BLANK LINE COMMENT:
      else {
        setContents(prev => {
          const newPrev = [...prev]
          newPrev[rowIdx] = e.target.value
          return newPrev
        })
      }
    },
    [contents]
  )
  const onFocus = useCallback(
    (rowIdx: number) => (e: FocusEvent<HTMLInputElement>) => {
      setTestFocus(rowIdx)
    },
    []
  )
  const onKeyDown = useCallback(
    (rowIdx: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      const clicked = e.key
      switch (clicked) {
        case 'ArrowUp':
          break
      }
    },
    []
  )
  const onMouseDown = useCallback(
    (rowIdx: number) => (e: MouseEvent<HTMLInputElement>) => {
      setLastMOut(null)
      setMouseDown(rowIdx)
      setMouseOut(null)
      setMouseUp(null)
      if (e.shiftKey) {
        setShiftMDown(rowIdx)
      } // BLANK LINE COMMENT:
      else {
        setShiftMDown(null)
      }
    },
    []
  )
  const onMouseOut = useCallback(
    (rowIdx: number) => (e: MouseEvent<HTMLInputElement>) => {
      setMouseOut(rowIdx)
    },
    []
  )
  const onMouseOver = useCallback(
    (rowIdx: number) => (e: MouseEvent<HTMLInputElement>) => {
      setMouseOver(rowIdx)
    },
    []
  )
  const onMouseUp = useCallback(
    (rowIdx: number) => (e: MouseEvent<HTMLInputElement>) => {
      setMouseDown(null)
      setMouseUp(rowIdx)
      setShiftMDown(null)
    },
    []
  )

  // AREA2: Other's event handler
  const onClickDiv = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      /**
       * 클릭하면 최하단 row 가 선택되도록 한다.
       */
      const lastRowIdx = contents.length || 0
      inputRefs.current[lastRowIdx]?.focus()
      setContents([
        '테스트용 텍스트가 생성되었습니다. 0',
        '테스트용 텍스트가 생성되었습니다. 1',
        '테스트용 텍스트가 생성되었습니다. 2',
        '테스트용 텍스트가 생성되었습니다. 3',
        '테스트용 텍스트가 생성되었습니다. 4',
        '테스트용 텍스트가 생성되었습니다. 5',
        '테스트용 텍스트가 생성되었습니다. 6'
      ])
    },
    [contents]
  )

  // AREA3: Event Area
  // Set lastMOut
  useEffect(() => {
    if (mouseDown !== null && lastMOut === null) {
      setLastMOut(mouseOut)
    }
  }, [lastMOut, mouseDown, mouseOut])

  // Set selectEnd
  useEffect(() => {
    if (shiftMDown !== null) {
      setSelectEnd(shiftMDown)
    } // BLANK LINE COMMENT:
    else if (mouseOver !== null) {
      setSelectEnd(mouseOver)
    }
  }, [mouseOver, shiftMDown])
  // Set selectStart
  useEffect(() => {
    if (mouseDown !== null && shiftMDown === null) {
      setSelectStart(mouseDown)
    }
  }, [mouseDown, shiftMDown])

  // AREA4: useEffect Area
  // Init
  useEffect(() => {
    setIsDBLoaded(false)
    setChangeQ([])
    setContents([])
  }, [clubIdx])
  // Get initial contents
  useEffect(() => {
    if (!isDBLoaded && clubsArr.length > 0 && clubIdx !== null) {
      const {clubOId} = clubsArr[clubIdx]
      const url = `/client/doc/getDocument/${clubOId}`

      getWithJwt(url)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            writeJwtFromServer(jwtFromServer)
            setContents(body.contents)
            setIsDBLoaded(true)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(`${url} ELSE`, errObj)
          }
        })
        .catch(errObj => alertErrors(`${url} CATCH`, errObj))
    }
  }, [clubIdx, clubsArr, isDBLoaded])

  const InputRow = (rowIdx: number) => {
    return (
      <input
        className=""
        onBlur={onBlur(rowIdx)}
        onChange={onChange(rowIdx)}
        onFocus={onFocus(rowIdx)}
        onKeyDown={onKeyDown(rowIdx)}
        onMouseDown={onMouseDown(rowIdx)}
        onMouseOut={onMouseOut(rowIdx)}
        onMouseOver={onMouseOver(rowIdx)}
        onMouseUp={onMouseUp(rowIdx)}
        ref={el => (inputRefs.current[rowIdx] = el)}
        style={styleInput}
        value={rowIdx !== contents.length ? contents[rowIdx] : lastContent} // BLANK LINE COMMENT:
      />
    )
  }

  // prettier-ignore
  const value = {
    contents, setContents
  }
  // RETURN TSX AREA:
  return (
    <DocumentContext.Provider value={value}>
      <div className={`${className}`} style={styleBlock} {...props}>
        <p className="select-none">Document is working now...</p>

        {/* 테스트용 텍스트 출력 구간 */}
        <p>testFocus: {testFocus !== null ? testFocus : 'NULL'}</p>
        {/* <p>mouseDown: {mouseDown !== null ? mouseDown : 'NULL'}</p> */}
        <p>mouseUp: {mouseUp !== null ? mouseUp : 'NULL'}</p>
        <p>lastMOut: {lastMOut !== null ? lastMOut : 'NULL'}</p>
        {/* <p>mouseOut: {mouseOut !== null ? mouseOut : 'NULL'}</p> */}
        <p>mouseOver: {mouseOver !== null ? mouseOver : 'NULL'}</p>

        {/* contents 블록 구간 */}
        {contents.map((content, rowIdx) => InputRow(rowIdx))}

        {/* 마지막 행 */}
        {InputRow(contents.length || 0)}

        {/* 맨 밑 공간 */}
        <div className="" onClick={onClickDiv} style={styleBottom} />
      </div>
    </DocumentContext.Provider>
  )
}
