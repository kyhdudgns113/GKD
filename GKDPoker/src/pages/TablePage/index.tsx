import {FC} from 'react'
import {DivCommonProps} from '../../common'
import {
  TablePageCallbacks,
  TablePageCallbacksKeyDown,
  TablePageEffects,
  TablePageStates
} from './_context'
import {TablePageLayout} from './TablePageLayout'

type TablePageProps = DivCommonProps & {}
export const TablePage: FC<TablePageProps> = ({className, ...props}) => {
  return (
    <TablePageStates>
      <TablePageCallbacks>
        <TablePageCallbacksKeyDown>
          <TablePageEffects>
            <TablePageLayout className={className} {...props} />
          </TablePageEffects>
        </TablePageCallbacksKeyDown>
      </TablePageCallbacks>
    </TablePageStates>
  )
}
