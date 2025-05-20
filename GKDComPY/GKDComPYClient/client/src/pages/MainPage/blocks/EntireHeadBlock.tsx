import {CSSProperties, FC, MouseEvent, useCallback} from 'react'
import {SAKURA_BORDER, TableHeadCommonProps} from '../../../common'
import {useCommMembersContext} from '../parts'
import {getWithJwt} from '../../../common/server'
import {useTemplateStatesContext} from '../../../template/_contexts'
import {alertErrors, writeJwtFromServer} from '../../../common/utils'

type EntireHeadBlockProps = TableHeadCommonProps & {}

export const EntireHeadBlock: FC<EntireHeadBlockProps> = ({className, ...props}) => {
  const {comm} = useTemplateStatesContext()
  const {
    sortEntireByBatter,
    sortEntireByClub,
    sortEntireByName,
    sortEntireByPitcher,
    sortEntireByTotal
  } = useCommMembersContext()

  const styleBatter: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderRightWidth: '2px',
    width: '3rem'
  }
  const styleClub: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderRightWidth: '2px',
    width: '4.5rem'
  }
  const styleHead: CSSProperties = {
    borderBottomWidth: '4px',
    borderColor: SAKURA_BORDER,
    fontWeight: 700,
    fontSize: '1.125rem',
    lineHeight: '1.625rem'
  }
  const styleIdx: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderRightWidth: '2px',
    width: '2rem'
  }
  const styleName: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderRightWidth: '2px',
    width: '7.25rem'
  }
  const stylePitcher: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderRightWidth: '2px',
    width: '3rem'
  }
  const styleTotal: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderRightWidth: '2px',
    width: '3rem'
  }

  const onClickBatter = useCallback(
    (e: MouseEvent<HTMLTableCellElement>) => {
      sortEntireByBatter()
    },
    [sortEntireByBatter]
  )
  const onClickClub = useCallback(
    (e: MouseEvent<HTMLTableCellElement>) => {
      sortEntireByClub()
    },
    [sortEntireByClub]
  )
  const onClickName = useCallback(
    (e: MouseEvent<HTMLTableCellElement>) => {
      sortEntireByName()
    },
    [sortEntireByName]
  )
  const onClickPitcher = useCallback(
    (e: MouseEvent<HTMLTableCellElement>) => {
      sortEntireByPitcher()
    },
    [sortEntireByPitcher]
  )
  const onClickTotal = useCallback(
    (e: MouseEvent<HTMLTableCellElement>) => {
      sortEntireByTotal()
    },
    [sortEntireByTotal]
  )

  /* eslint-disable */
  const onClickQuestion = useCallback(
    (e: MouseEvent<HTMLTableCellElement>) => {
      if (comm && comm.commOId) {
        // const url = `/client/setAllMemOId/${comm.commOId}`
        const url = `/client/onClickQuestion/${comm.commOId}`
        getWithJwt(url)
          .then(res => res.json())
          .then(res => {
            const {ok, errObj, jwtFromServer} = res
            if (ok) {
              writeJwtFromServer(jwtFromServer)
              alert('YES')
            } // BLANK LINE COMMENT:
            else {
              alertErrors(url + ' ELSE', errObj)
            }
          })
          .catch(errObj => alertErrors(url + ' CATCH', errObj))
      }
    },
    [comm]
  )
  /* eslint-enable */

  return (
    <thead style={styleHead}>
      <tr>
        <td style={styleIdx}>#</td>
        <td onClick={onClickName} style={styleName}>
          닉네임
        </td>
        <td onClick={onClickBatter} style={styleBatter}>
          타자
        </td>
        <td onClick={onClickPitcher} style={stylePitcher}>
          투수
        </td>
        <td onClick={onClickTotal} style={styleTotal}>
          총합
        </td>
        <td onClick={onClickClub} style={styleClub}>
          클럽
        </td>
        <td>?</td>
      </tr>
    </thead>
  )
}
