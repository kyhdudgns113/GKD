import {Input} from '@component'
import {SAKURA_BORDER} from '@value'

import type {CSSProperties, FC} from 'react'
import type {DivCommonProps} from '@prop'
import {useFileContext} from '../_contexts'

type FileContentsObjectProps = DivCommonProps & {}
/**
 * 파일 내용 수정하는 오브젝트
 *
 * 1. 가급적 file 부터 바꾼다.
 *  - file 에 의해 렌더링 먼저 되고 다른 작업이 실행되는게 오류가 덜 난다.
 */
export const FileContentsObject: FC<FileContentsObjectProps> = ({className, style, ...props}) => {
  const {
    file,
    inputLast,
    onKeyDownInput,
    onKeyDownInputLast,
    onBlurInput,
    onBlurInputLast,
    onChangeInput,
    onChangeInputLast,
    setDivRef,
    setInputRef
  } = useFileContext()

  const styleObject: CSSProperties = {
    // 상위 컴포넌트에서 스타일 넘겨준다.
    ...style
  }

  const styleInputRow: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',

    width: '100%'
  }
  const styleInputContent: CSSProperties = {
    paddingLeft: '8px',
    paddingRight: '8px',
    width: '100%'
  }
  const styleInputLast: CSSProperties = {
    ...styleInputRow,
    borderColor: SAKURA_BORDER,
    borderRadius: '4px',
    borderWidth: '2px',

    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '2px',
    paddingBottom: '2px'
  }

  return (
    <div className={`FILE_CONTENTS_OBJECT ${className || ''}`} style={styleObject} {...props}>
      {/* 1. 파일 내용 행 */}
      {file.contentsArr.map((content, idx) => {
        /**
         * Content 타입별 처리
         *  1-1. 문자열인 경우
         *  1-2. 이미지인 경우
         */
        if (content.type === 'string') {
          // 1-1. 문자열인 경우
          return (
            <div
              className={`INPUT_ROW ROW_STRING idx:${idx}`}
              key={idx}
              ref={ref => setDivRef(idx, ref)}
              style={styleInputRow} // BLANK LINE COMMENT:
            >
              <Input
                onBlur={onBlurInput(idx)}
                onChange={onChangeInput(idx)}
                onKeyDown={onKeyDownInput(idx)}
                ref={ref => setInputRef(idx, ref)}
                style={styleInputContent}
                value={content.value}
              />
            </div>
          )
        } // BLANK LINE COMMENT:
        else {
          // 1-2. 이미지인 경우
          return (
            <div
              className={`INPUT_ROW ROW_IMAGE idx:${idx}`}
              key={idx}
              ref={ref => setDivRef(idx, ref)}
              style={styleInputRow} // BLANK LINE COMMENT:
            >
              <p>{idx}</p>
            </div>
          )
        }
      })}

      {/* 2. 마지막 입력 행 */}
      <div
        className={`INPUT_ROW ROW_STRING idx:${file.contentsArr.length}`}
        ref={ref => setDivRef(file.contentsArr.length, ref)}
        style={styleInputRow} // BLANK LINE COMMENT:
      >
        <Input
          onBlur={onBlurInputLast}
          onChange={onChangeInputLast}
          onKeyDown={onKeyDownInputLast}
          ref={ref => setInputRef(file.contentsArr.length, ref)}
          style={styleInputLast}
          type="text"
          value={inputLast}
        />
      </div>
    </div>
  )
}
