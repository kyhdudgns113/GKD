import type {FC} from 'react'
import type {DivCommonProps} from '@prop'

type DirectoryRowObjectProps = DivCommonProps & {
  depth: number
  dirIdx: number
  dirOId: string
}

/**
 * dirOId 디렉토리의 정보를 표시한다
 *
 * 1. 자신의 정보, 버튼들
 * 2. 자식 디렉토리들(재귀)
 * 3. 자식 폴더 생성 행
 * 5. 자식 파일들
 * 4. 자식 파일 추가 행
 */
export const DirectoryRowObject: FC<DirectoryRowObjectProps> = ({
  depth,
  dirIdx,
  dirOId,
  // ::
  className,
  style,
  ...props
}) => {
  return (
    <div className={`DirectoryRow_Object ${className || ''}`} style={style} {...props}>
      <div>
        DirectoryRowObject: {dirOId} {depth} {dirIdx}
      </div>
    </div>
  )
}
