import {CSSProperties} from 'react'
import {PatchNoteType, SAKURA_BORDER} from '../../common'
import {Text2XL, Text3XL, Text5XL, TextXL} from '../../common/components'

export function StartPage() {
  // BLANK LINE COMMENT:

  const styleDivMain: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  }
  const styleDivPatchNote: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderRadius: '16px',
    borderWidth: '8px',
    display: 'flex',
    flexDirection: 'column',
    height: '70%',
    marginTop: '36px',
    overflowY: 'scroll',
    padding: '8px',
    width: '50%'
  }

  const patchNote_250422: PatchNoteType = {
    date: 250422,
    comments: ['멤버 관리 페이지: 멤버 정렬 추가', '멤버 & 라인업: 멤버 정렬 추가']
  }
  const patchNote_250420: PatchNoteType = {
    date: 250420,
    comments: ['탈퇴 멤버 페이지 추가']
  }
  const patchNote_250410: PatchNoteType = {
    date: 250410,
    comments: ['멤버 관리 페이지: 클럽에서서 멤버 추가, 이동, 삭제하면 반영됨']
  }
  const patchNote_250409: PatchNoteType = {
    date: 250409,
    comments: ['멤버 관리 페이지: 추가됨. 클럽 멤버 이동 테스트 가능']
  }
  const patchNote_250404: PatchNoteType = {
    date: 250404,
    comments: ['회의록: 읽기, 쓰기만 가능한 문서편집기 추가. 동시 편집은 추후 구현 예정']
  }
  const patchNote_250401: PatchNoteType = {
    date: 250401,
    comments: [
      '메인 페이지: 멤버의 대전기록 코멘트 확인기능 추가',
      '멤버&라인업: 멤버의 대전기록 코멘트 확인기능 추가'
    ]
  }
  const patchNote_250331: PatchNoteType = {
    date: 250331,
    comments: [
      '대전기록: 주차 목록에 스크롤 적용',
      '대전기록: 마우스 커서가 가리키는 멤버의 행 강조 추가'
    ]
  }
  const patchNote_250321: PatchNoteType = {
    date: 250321,
    comments: ['전체: ESC 누르면 새 창 닫기 적용']
  }
  const patchNote_250320: PatchNoteType = {
    date: 250320,
    comments: [
      '메인 페이지: 멤버 최근 4주차 기록 확인기능 추가',
      '멤버 정보: 멤버 최근 16주차 기록 확인기능 추가'
    ]
  }
  const patchNote_250318: PatchNoteType = {
    date: 250318,
    comments: ['메인 페이지: 전체 멤버 여기서 보도록 변경']
  }
  const patchNote_250317: PatchNoteType = {
    date: 250317,
    comments: ['전체 멤버: 새로운 페이지 추가']
  }
  const patchNote_250316: PatchNoteType = {
    date: 250316,
    comments: ['대전기록: 주간 코멘트 추가']
  }
  const patchNote_250315: PatchNoteType = {
    date: 250315,
    comments: ['대전기록: 주간통계 추가']
  }
  const patchNote_250314: PatchNoteType = {
    date: 250314,
    comments: [
      '패치노트 기록 시작',
      '대전기록: 일일통계 추가',
      '대전기록: 코멘트에 개행 추가',
      '멤버&라인업: 색 구분 개편',
      '  - 투수력  8,600~ : 보라',
      '  - 투수력  8,300  : 금색',
      '  - 투수력  8,000  : 연두',
      '  - 투수력  7,500  : 분홍',
      '  - 투수력  7,000  : 하늘',
      '  - 투수력 ~6,999  : 흰색'
    ]
  }
  // BLANK LINE COMMENT:

  const patchNoteArr: PatchNoteType[] = [
    patchNote_250422,
    patchNote_250420,
    patchNote_250410,
    patchNote_250409,
    patchNote_250404,
    patchNote_250401,
    patchNote_250331,
    patchNote_250321,
    patchNote_250320,
    patchNote_250318,
    patchNote_250317,
    patchNote_250316,
    patchNote_250315,
    patchNote_250314
  ]
  // BLANK LINE COMMENT:
  return (
    <div className="" style={styleDivMain}>
      <Text5XL className="mt-12">컴프야 클럽 관리 서비스</Text5XL>
      <Text3XL className="mt-6">이용해 주셔서 감사합니다 {'><'}</Text3XL>

      {/* 패치노트 출력부분 */}
      <div className="" style={styleDivPatchNote}>
        {patchNoteArr.map(({date, comments}, idx) => {
          return (
            <div className="flex flex-col mb-4" key={`div${idx}`}>
              {/* 날짜 */}
              <Text2XL className="mb-2">{date}</Text2XL>

              {/* 코멘트들 */}
              {comments.map((comment, cIdx) => (
                <TextXL className="ml-4" key={`comment${cIdx}`}>
                  {comment.split('\n').map((line, lineIdx) => (
                    <span key={lineIdx}>
                      {line.replace(/ /g, '\u00A0')}
                      <br />
                    </span>
                  ))}
                </TextXL>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
