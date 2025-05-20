import {CSSProperties, FC, useEffect, useState} from 'react'
import {DivCommonProps} from '../../../common'
import {DailyRecordType, MemberInfoType} from '../../../common/typesAndValues/shareTypes'
import {getWithJwt} from '../../../common/server'
import {alertErrors, writeJwtFromServer} from '../../../common/utils'
import {RecordBodyBlock, RecordHeadBlock} from '../blocks'

type RecentRecordProps = DivCommonProps & {
  member: MemberInfoType
}

export const RecentRecordGroup: FC<RecentRecordProps> = ({member, className, ...props}) => {
  // body 의 comment 의 position 이 absolute 라서 이걸로 가로길이 구해줘야 한다.
  // V 에 갖다대면 코멘트 띄우게끔 하려고 한다.
  const [commentHeadWidth, setCommentHeadWidh] = useState<number>(0)
  const [dailyRecordsArr, setDailyRecordsArr] = useState<DailyRecordType[]>([])

  const styleTable: CSSProperties = {
    borderCollapse: 'collapse',
    width: '100%'
  }

  // Init arr
  useEffect(() => {
    setDailyRecordsArr([])
  }, [])
  // Set arr
  useEffect(() => {
    if (member && member.memOId) {
      const url = `/client/main/getDailyRecordsArr/${member.memOId}/56`
      getWithJwt(url)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errObj, jwtFromServer} = res
          if (ok) {
            setDailyRecordsArr(body.dailyRecordsArr)
            writeJwtFromServer(jwtFromServer)
          } // BLANK LINE COMMENT:
          else {
            alertErrors(url + ' ELSE', errObj)
          }
        })
        .catch(errObj => alertErrors(url + ' CATCH', errObj))
    } // BLANK LINE COMMENT:
    else {
      setDailyRecordsArr([])
    }
  }, [member])

  return (
    <div className={` ${className}`} {...props}>
      <table style={styleTable}>
        <RecordHeadBlock setWidth={setCommentHeadWidh} />
        <RecordBodyBlock recordsArr={dailyRecordsArr} mentWidth={commentHeadWidth} />
      </table>
    </div>
  )
}
