import {CSSProperties, FC, useEffect, useState} from 'react'
import {DivCommonProps, getCardNumber, getCardShape} from '../../../common'
import {useTablePageStatesContext} from '../_context/__states'

type CardProps = DivCommonProps & {
  cardIdx: number
  isBig?: boolean
  isShow: boolean
}
export const Card: FC<CardProps> = ({cardIdx, isBig, isShow, className, ...props}) => {
  const {deck} = useTablePageStatesContext()

  const [backgroundColor, setBackgroundColor] = useState<string>('')
  const [cardVal, setCardVal] = useState<string>('')
  const [color, setColor] = useState<string>('')

  const styleCard: CSSProperties = {
    alignItems: 'center',
    backgroundColor,
    borderColor: '#404844',
    borderWidth: isBig ? '4px' : '2px',
    color,
    display: 'flex',
    flexDirection: 'column',
    fontSize: isBig ? '36px' : '24px',
    fontWeight: 700,
    height: isBig ? '90px' : '54px',
    justifyContent: 'center',
    width: isBig ? '60px' : '36px'
  }

  // Set backgroundColor, color
  useEffect(() => {
    const card = deck[cardIdx]
    const cardShape = getCardShape(card)
    const cardNumber = getCardNumber(card)

    const cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
    const cardVal = cardValues[cardNumber]

    if (isShow) {
      switch (cardShape) {
        case 0:
          setBackgroundColor('#FF9999')
          setColor('#AA0000')
          break
        case 1:
          setBackgroundColor('#FFFF99')
          setColor('#888800')
          break
        case 2:
          setBackgroundColor('#99FF99')
          setColor('#008800')
          break
        case 3:
          setBackgroundColor('#9999FF')
          setColor('#0000AA')
          break
        default:
          setBackgroundColor('#C0C8C4')
          setColor('#A0A8A4')
          break
      }
      setCardVal(cardVal)
    } // BLANK LINE COMMENT:
    else {
      setBackgroundColor('#C0C8C4')
      setColor('#A0A8A4')
      setCardVal('X')
    }
  }, [cardIdx, deck, isShow])

  return (
    <div className={`CARD ${className || ''}`} style={styleCard} {...props}>
      <p>{cardVal}</p>
    </div>
  )
}
