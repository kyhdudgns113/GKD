import {CSSProperties, FC} from 'react'
import {MemberInfoType} from '../../../common/typesAndValues/shareTypes'
import {DivCommonProps} from '../../../common'
import {Card} from '../addons'

type MemberLineUpBlockProps = DivCommonProps & {
  member: MemberInfoType
}
export const MemberLineUpBlock: FC<MemberLineUpBlockProps> = ({member, className, ...props}) => {
  const styleDivMain: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  }
  return (
    <div className={`MEMBER_LINE_UP_BLOCK ${className || ''}`} style={styleDivMain} {...props}>
      <div className="flex flex-row justify-between" style={{width: '656px'}}>
        <Card member={member} posIdx={0} />
        <Card member={member} posIdx={1} />
        <Card member={member} posIdx={2} />
        <Card member={member} posIdx={3} />
        <Card member={member} posIdx={4} />
      </div>
      <div className="flex flex-row" style={{marginTop: '32px'}}>
        <div className="flex flex-row justify-between" style={{width: '656px'}}>
          <Card member={member} posIdx={5} />
          <Card member={member} posIdx={6} />
          <Card member={member} posIdx={7} />
          <Card member={member} posIdx={8} />
          <Card member={member} posIdx={9} />
        </div>
        <div style={{marginLeft: '64px'}}>
          <Card member={member} posIdx={10} />
        </div>
      </div>
      <div className="flex flex-row justify-between" style={{width: '1192px', marginTop: '32px'}}>
        <Card member={member} posIdx={11} />
        <Card member={member} posIdx={12} />
        <Card member={member} posIdx={13} />
        <Card member={member} posIdx={14} />
        <Card member={member} posIdx={15} />
        <Card member={member} posIdx={16} />
        <Card member={member} posIdx={17} />
        <Card member={member} posIdx={18} />
        <Card member={member} posIdx={19} />
      </div>
      <div className="flex flex-row justify-between" style={{width: '656px', marginTop: '32px'}}>
        <Card member={member} posIdx={20} />
        <Card member={member} posIdx={21} />
        <Card member={member} posIdx={22} />
        <Card member={member} posIdx={23} />
        <Card member={member} posIdx={24} />
      </div>
    </div>
  )
}
