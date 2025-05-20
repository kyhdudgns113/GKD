import {
  ChangeEvent,
  createContext,
  CSSProperties,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import {DivCommonProps, SAKURA_BORDER, Setter} from '../../../common'
import {useTemplateStatesContext} from '../../../template/_contexts'
import {Textarea} from '../../../common/components'
import {alertErrors, writeJwtFromServer} from '../../../common/utils'
import {getWithJwt, putWithJwt} from '../../../common/server'
import {SetDocumentDataType} from '../../../common/typesAndValues/httpDataTypes'

// prettier-ignore
type ContextType = {
  contents: string, setContents: Setter<string>
}
// prettier-ignore
export const DocumentAlphaContext = createContext<ContextType>({
  contents: '', setContents: () => {}
})

export const useDocumentAlphaContext = () => {
  return useContext(DocumentAlphaContext)
}

type DocumentAlphaPartProps = DivCommonProps & {}
export const DocumentAlphaPart: FC<DocumentAlphaPartProps> = ({className, ...props}) => {
  const {clubsArr, selectedClubIdx: clubIdx} = useTemplateStatesContext() /* eslint-disable-line */

  const [contents, setContents] = useState<string>('')
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [isDBLoaded, setIsDBLoaded] = useState<boolean>(false)

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
  const styleText: CSSProperties = {
    height: '600px'
    // BLANK LINE COMMENT:
  }

  const onBlur = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      if (isChanged && clubsArr.length > 0 && clubIdx !== null) {
        const clubOId = clubsArr[clubIdx].clubOId
        if (!clubOId) {
          alert('클럽 아이디가 이상해요')
          return
        }

        const url = `/client/doc/setDocument`
        const _contents = contents.split('\n')
        const data: SetDocumentDataType = {clubOId, contents: _contents}

        putWithJwt(url, data)
          .then(res => res.json())
          .then(res => {
            const {ok, errObj, jwtFromServer} = res

            if (ok) {
              writeJwtFromServer(jwtFromServer)
              setIsChanged(false)
            } // BLANK LINE COMMENT:
            else {
              alertErrors(url + ' ELSE', errObj)
            }
          })
          .catch(errObj => alertErrors(url + ` CATCH`, errObj))
      }
    },
    [contents, clubIdx, clubsArr, isChanged]
  )
  const onChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setContents(e.currentTarget.value)
    setIsChanged(true)
  }, [])

  // Init states
  useEffect(() => {
    setContents('')
    setIsChanged(false)
    setIsDBLoaded(false)
  }, [])
  // Load contents from DB
  useEffect(() => {
    if (clubsArr.length > 0 && clubIdx !== null && isDBLoaded === false) {
      const clubOId = clubsArr[clubIdx].clubOId
      if (!clubOId) {
        alertErrors('클럽 아이디 에러', '문의 주세요')
        return
      }

      const url = `/client/doc/getDocument/${clubOId}`
      getWithJwt(url)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res

          if (ok) {
            setContents(body.contents.join('\n'))
            setIsChanged(false)
            setIsDBLoaded(true)
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors('/client/doc/getDocument ELSE', errObj)
          }
        })
        .catch(errObj => alertErrors('/client/doc/getDocument CATCH', errObj))
    }
  }, [clubIdx, clubsArr, isDBLoaded])

  // prettier-ignore
  const value = {
    contents, setContents
  }

  // RETURN TSX AREA:
  return (
    <DocumentAlphaContext.Provider value={value}>
      <div className={` ${className}`} style={styleBlock} {...props}>
        {isDBLoaded && (
          <Textarea onBlur={onBlur} onChange={onChange} style={styleText} value={contents} />
        )}
      </div>
    </DocumentAlphaContext.Provider>
  )
}
