import {ChangeEvent, CSSProperties, FC, MouseEvent, useCallback, useEffect, useState} from 'react'
import {DivCommonProps} from '../../../common'
import {Button, Modal, Text5XL, Textarea} from '../../../common/components'
import {useClubRecordStatesContext, useClubRecordCallbacksContext} from '../_contexts'
import {SwitchButton} from '../../../common/components/Buttons/SwitchButton'

// NOTE: 기록을 한 적 없으면 recordTable[name][date] 가 없는게 맞다.
// NOTE: 따라서 memOId 도 record 에서는 불러올 수 없다.

type ModalRecordingPartProps = DivCommonProps & {}
export const ModalRecordingPart: FC<ModalRecordingPartProps> = ({className, ...props}) => {
  const {recordTable, selDate, selMemOId, selName} = useClubRecordStatesContext()
  const {setSelDate, setSelMemOId, setSelName} = useClubRecordStatesContext()
  const {keyDownEnter, keyDownESC, setKeyDownEnter, setKeyDownESC} = useClubRecordStatesContext()
  const {submitRecord} = useClubRecordCallbacksContext()

  const [comment, setComment] = useState<string>('')
  const [condErr, setCondErr] = useState<number>(0)
  const [results, setResults] = useState<number[]>([0, 0, 0])

  const styleBlock: CSSProperties = {
    width: '750px',
    height: '550px'
  }
  const styleRecord: CSSProperties = {
    width: '3.5rem',
    height: '3.5rem',
    textAlign: 'center',
    alignContent: 'center'
  }
  const styleComment: CSSProperties = {
    width: '16rem',
    height: '8rem',

    backgroundColor: 'white',
    borderRadius: '8px',
    marginLeft: '32px',
    paddingLeft: '6px',
    paddingRight: '6px'
  }

  const onChangeComment = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value)
  }, [])

  const onClickSetCondO = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    setCondErr(0)
  }, [])
  const onClickSetCondX = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    setCondErr(1)
  }, [])
  const onClickSetRecord = useCallback(
    (idx: number, val: number) => (e: MouseEvent<HTMLButtonElement>) => {
      setResults(prev => {
        const newPrev = [...prev]
        newPrev[idx] = val
        return newPrev
      })
    },
    []
  )
  const onClickSubmit = useCallback(
    (
        selDate: number,
        selName: string,
        condErr: number,
        results: number[],
        comment: string,
        memOId: string | null
      ) =>
      (e: MouseEvent<HTMLButtonElement>) => {
        submitRecord(selDate, selName, condErr, results, comment, memOId)
        setSelDate(null)
        setSelName('')
        setSelMemOId('')
      },
    [setSelDate, setSelMemOId, setSelName, submitRecord]
  )
  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setSelDate(null)
      setSelName('')
    },
    [setSelDate, setSelName]
  )

  // Init values
  useEffect(() => {
    if (recordTable && selName && selDate) {
      const recordRow = recordTable[selName]
      if (recordRow) {
        const record = recordRow[selDate]
        if (record) {
          setComment(record.comment)
          setCondErr(record.condError)
          setResults([
            record.recordsArr[0].result,
            record.recordsArr[1].result,
            record.recordsArr[2].result
          ])
        }
      }
    }
  }, [recordTable, selDate, selName])
  // Key Down: Enter: Submit record
  useEffect(() => {
    if (keyDownEnter) {
      const memOId = selMemOId
      submitRecord(selDate || 0, selName, condErr, results, comment, memOId)
      setKeyDownEnter(false)
      setSelDate(null)
      setSelName('')
      setSelMemOId('')
    }
  }, [
    comment,
    condErr,
    keyDownEnter,
    results,
    selDate,
    selMemOId,
    selName,
    setKeyDownEnter,
    setSelDate,
    setSelMemOId,
    setSelName,
    submitRecord
  ])
  // Key Down: ESC: Cancel
  useEffect(() => {
    if (keyDownESC) {
      setKeyDownESC(false)
      setSelDate(null)
      setSelName('')
      setSelMemOId(null)
    }
  }, [keyDownESC, setKeyDownESC, setSelDate, setSelMemOId, setSelName])

  return (
    <Modal
      onClose={() => {}}
      style={styleBlock}
      {...props} // BLANK LINE COMMENT:
    >
      <Text5XL>{selDate}</Text5XL>
      <Text5XL className="mt-4">{selName}</Text5XL>

      <div className="flex flex-row w-full justify-between mt-8 px-12">
        {/* 컨장유 췍 */}
        <div className="COND_ERR flex flex-col border-2 p-2 border-gkd-sakura-border rounded-xl">
          <SwitchButton onClick={onClickSetCondO} onOff={condErr === 0}>
            <p>컨장유</p>
            <p>O</p>
          </SwitchButton>
          <SwitchButton className="mt-2" onClick={onClickSetCondX} onOff={condErr === 1}>
            <p>컨장유</p>
            <p>X</p>
          </SwitchButton>
        </div>

        {/* 결과 췍 */}
        {Array(3)
          .fill(null)
          .map((_, idx) => {
            return (
              <div className="flex flex-col border-2 p-2 border-gkd-sakura-border rounded-xl">
                <div className="flex flex-row">
                  <SwitchButton
                    onClick={onClickSetRecord(idx, 0)}
                    onOff={results[idx] === 0}
                    style={styleRecord}>
                    승
                  </SwitchButton>
                  <SwitchButton
                    className="ml-2"
                    onClick={onClickSetRecord(idx, 1)}
                    onOff={results[idx] === 1}
                    style={styleRecord}>
                    무
                  </SwitchButton>
                </div>
                <div className="flex flex-row mt-2">
                  <SwitchButton
                    onClick={onClickSetRecord(idx, 2)}
                    onOff={results[idx] === 2}
                    style={styleRecord}>
                    패
                  </SwitchButton>
                  <SwitchButton
                    className="ml-2"
                    onClick={onClickSetRecord(idx, 3)}
                    onOff={results[idx] === 3}
                    style={styleRecord}>
                    미
                  </SwitchButton>
                </div>
                <div className="flex flex-row mt-2">
                  <SwitchButton
                    onClick={onClickSetRecord(idx, 4)}
                    onOff={results[idx] === 4}
                    style={styleRecord}>
                    X
                  </SwitchButton>
                </div>
              </div>
            )
          })}
      </div>

      {/* 코멘트 및 버튼 */}
      <div className="flex flex-row w-full mt-8">
        <Textarea maxLength={60} onChange={onChangeComment} style={styleComment} value={comment} />
        <Button
          className="mt-auto ml-auto h-fit"
          onClick={onClickSubmit(selDate || 0, selName, condErr, results, comment, selMemOId)}>
          Submit
        </Button>
        <Button className="mt-auto ml-8 mr-8 h-fit" onClick={onClickCancel}>
          Cancel
        </Button>
      </div>
    </Modal>
  )
}
