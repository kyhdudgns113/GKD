import {ChangeEvent, CSSProperties, FC} from 'react'
import {DivCommonProps, SAKURA_BORDER} from '../../../common'
import {Text2XL} from '../../../common/components'
import {useTemplateStatesContext} from '../../../template/_contexts'

type ClubRowBlockProps = DivCommonProps & {
  onChangeSelect: (e: ChangeEvent<HTMLSelectElement>) => void
  clubOId: string | null
}
export const ClubRowBlock: FC<ClubRowBlockProps> = ({
  onChangeSelect,
  clubOId,
  className,
  ...props
}) => {
  const {clubsArr, comm} = useTemplateStatesContext()

  const styleDiv: CSSProperties = {
    borderColor: SAKURA_BORDER,
    borderWidth: '4px',
    display: 'flex',
    flexDirection: 'row',
    fontSize: '1.25rem',
    justifyContent: 'center',
    lineHeight: '1.75rem',
    overflow: 'hidden'
  }
  const styleSelect: CSSProperties = {
    backgroundColor: '#FFFFFF',
    color: '#F89890',
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
    paddingBottom: '4px',
    paddingLeft: '8px',
    paddingTop: '4px',
    width: '12rem'
  }
  const styleText: CSSProperties = {
    alignContent: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: SAKURA_BORDER,
    borderRightWidth: '4px',
    paddingRight: '8px',
    textAlign: 'center',
    width: '5rem'
  }

  if (!comm || !clubsArr) return null
  return (
    <div className={`text-gkd-sakura-text ${className}`} style={styleDiv} {...props}>
      <Text2XL style={styleText}>클럽</Text2XL>
      <select onChange={onChangeSelect} style={styleSelect} value={clubOId || ''}>
        {comm.clubOIdsArr.map((_clubOId, cIdx) => {
          const club = clubsArr[cIdx]

          if (!club) return null
          return (
            <option key={`club${cIdx}`} value={club.clubOId}>
              {club.name}
            </option>
          )
        })}
      </select>
    </div>
  )
}
