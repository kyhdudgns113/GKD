/**
 * 0: 하이카드
 * 1: 원페어
 * 2: 투페어
 * 3: 트리플
 * 4: 스트레이트
 * 5: 플러쉬
 * 6: 풀하우스
 * 7: 포카드
 * 8: 스트레이트 플러쉬
 */

export const getCardNumber = (card: number) => {
  const cardNumber = card % 13
  return cardNumber
}
export const getCardShape = (card: number) => {
  const cardShape = Math.floor(card / 13)
  return cardShape
}
export const getCardShow = (card: number) => {
  const cardNum = getCardNumber(card) + 2

  if (cardNum < 10) {
    return cardNum.toLocaleString()
  } // BLANK LINE COMMENT:
  else if (cardNum === 10) {
    return 'T'
  } // BLANK LINE COMMENT:
  else if (cardNum === 11) {
    return 'J'
  } // BLANK LINE COMMENT:
  else if (cardNum === 12) {
    return 'Q'
  } // BLANK LINE COMMENT:
  else if (cardNum === 13) {
    return 'K'
  } // BLANK LINE COMMENT:
  else if (cardNum === 14) {
    return 'A'
  } // BLANK LINE COMMENT:
  else {
    return '?'
  }
}

export const isStiffle = (cards: number[]) => {
  const STIFFLE_SCORE = 8
  // 같은 모양끼리 모아놓고, 숫자 큰걸 앞에 둔다.
  cards.sort((a, b) => {
    const [shapeA, numberA] = [getCardShape(a), getCardNumber(a)]
    const [shapeB, numberB] = [getCardShape(b), getCardNumber(b)]

    if (shapeA !== shapeB) {
      return shapeB - shapeA
    } // BLANK LINE COMMENT:
    else {
      return numberB - numberA
    }
  })

  let isA: boolean = false
  let status: number[] = []
  let [cnt, prevNum, prevShape] = [0, 20, -1]

  for (let i = 0; i < cards.length; i++) {
    const cardNum = getCardNumber(cards[i])
    const cardShape = getCardShape(cards[i])

    if (prevShape !== cardShape) {
      status = [cardNum]
      cnt = 1

      // 모양이 갱신되었으니 현재 카드가 A 인지 확인한다.
      if (cardNum === 12) {
        isA = true
      } // BLANK LINE COMMENT:
      else {
        isA = false
      }
    } // BLANK LINE COMMENT:
    else {
      if (prevNum - 1 > cardNum) {
        status = [cardNum]
        cnt = 1
      } // BLANK LINE COMMENT:
      else {
        status.push(cardNum)
        cnt++

        if (cnt === 5) {
          return {isMade: true, score: STIFFLE_SCORE, status}
        }
        // 같은 모양으로 5432 가 들어왔으며, 같은 모양의 A 도 있었던 경우우
        if (cnt === 4 && cardNum === 0 && isA) {
          return {isMade: true, score: STIFFLE_SCORE, status: [3, 2, 1, 0, 12]}
        }
      }
    }

    prevNum = cardNum
    prevShape = cardShape
  }

  return {isMade: false, score: 8, status: []}
}
export const isFour = (cards: number[]) => {
  // 모양 정보는 중요하지 않다. 숫자만 본다.
  cards.sort((a, b) => {
    const [numberA, numberB] = [getCardNumber(a), getCardNumber(b)]
    return numberB - numberA
  })

  let fourCardNum = -1
  let [cnt, prevNum] = [0, -1]

  for (let i = 0; i < cards.length; i++) {
    const cardNum = getCardNumber(cards[i])

    if (cardNum !== prevNum) {
      cnt = 1
    } // BLANK LINE COMMENT:
    else {
      cnt++

      if (cnt === 4) {
        fourCardNum = cardNum

        for (let j = 0; j < cards.length; j++) {
          const cardNum2 = getCardNumber(cards[j])
          if (cardNum2 !== fourCardNum) {
            const status = [cardNum, cardNum, cardNum, cardNum, cardNum2]
            return {isMade: true, score: 7, status}
          }
        }
      }
    }

    prevNum = cardNum
  }

  return {isMade: false, score: 7, status: []}
}
export const isFullHouse = (cards: number[]) => {
  // 모양 정보는 중요하지 않다. 숫자만 본다.
  cards.sort((a, b) => {
    const [numberA, numberB] = [getCardNumber(a), getCardNumber(b)]
    return numberB - numberA
  })

  let threeCardNum = -1
  const twoCardNumArr = []
  let [cnt, prevNum] = [0, -1]

  for (let i = 0; i < cards.length; i++) {
    const cardNum = getCardNumber(cards[i])

    if (cardNum !== prevNum) {
      cnt = 1
    } // BLANK LINE COMMENT:
    else {
      cnt++

      if (cnt === 3) {
        threeCardNum = Math.max(cardNum, threeCardNum)
      } // BLANK LINE COMMENT:
      else if (cnt === 2) {
        twoCardNumArr.push(cardNum)
      }
    }

    prevNum = cardNum
  }

  if (threeCardNum !== -1 && twoCardNumArr.length > 1) {
    const filterArr = twoCardNumArr.filter(num => num !== threeCardNum)
    const res2Num = Math.max(...filterArr)
    const status = [threeCardNum, threeCardNum, threeCardNum, res2Num, res2Num]
    return {isMade: true, score: 6, status}
  }
  return {isMade: false, score: 6, status: []}
}
export const isFlush = (cards: number[]) => {
  cards.sort((a, b) => {
    const [shapeA, numberA] = [getCardShape(a), getCardNumber(a)]
    const [shapeB, numberB] = [getCardShape(b), getCardNumber(b)]

    if (shapeA !== shapeB) {
      return shapeB - shapeA
    } // BLANK LINE COMMENT:
    else {
      return numberB - numberA
    }
  })

  let prevShape = -1
  let status: number[] = []

  for (let i = 0; i < cards.length; i++) {
    const cardShape = getCardShape(cards[i])
    const cardNum = getCardNumber(cards[i])

    if (prevShape !== cardShape) {
      status = [cardNum]
    } // BLANK LINE COMMENT:
    else {
      status.push(cardNum)
      if (status.length === 5) {
        return {isMade: true, score: 5, status}
      }
    }

    prevShape = cardShape
  }

  return {isMade: false, score: 5, status: []}
}
export const isStraight = (cards: number[]) => {
  // 모양 정보는 중요하지 않다. 숫자만 본다.
  cards.sort((a, b) => {
    const [numberA, numberB] = [getCardNumber(a), getCardNumber(b)]
    return numberB - numberA
  })

  let status: number[] = []
  let [cnt, prevNum] = [0, 20]

  for (let i = 0; i < cards.length; i++) {
    const cardNum = getCardNumber(cards[i])

    if (prevNum - 1 > cardNum) {
      cnt = 1
      status = [cardNum]
    } // BLANK LINE COMMENT:
    else if (prevNum - 1 === cardNum) {
      cnt++
      status.push(cardNum)
      if (cnt === 5) {
        return {isMade: true, score: 4, status}
      }
    } // BLANK LINE COMMENT:
    else {
      // DO NOTHING:
    }

    prevNum = cardNum
  }

  return {isMade: false, score: 4, status: []}
}
export const isTriple = (cards: number[]) => {
  cards.sort((a, b) => {
    const [numberA, numberB] = [getCardNumber(a), getCardNumber(b)]
    return numberB - numberA
  })

  let threeCardNum = -1
  let [cnt, prevNum] = [0, -1]

  for (let i = 0; i < cards.length; i++) {
    const cardNum = getCardNumber(cards[i])

    if (cardNum !== prevNum) {
      cnt = 1
    } // BLANK LINE COMMENT:
    else {
      cnt++

      if (cnt === 3) {
        threeCardNum = cardNum
        let [num0, num1] = [-1, -1]

        for (let j = 0; j < cards.length; j++) {
          const cardNum2 = getCardNumber(cards[j])
          if (cardNum2 !== threeCardNum) {
            if (num0 === -1) {
              num0 = cardNum2
            } else {
              num1 = cardNum2
              break
            }
          }
        }

        const status = [threeCardNum, threeCardNum, threeCardNum, num0, num1]
        return {isMade: true, score: 3, status}
      }
    }

    prevNum = cardNum
  }

  return {isMade: false, score: 3, status: []}
}
export const isTwoPair = (cards: number[]) => {
  cards.sort((a, b) => {
    const [numberA, numberB] = [getCardNumber(a), getCardNumber(b)]
    return numberB - numberA
  })

  const pairNumArr: number[] = []
  let [cnt, prevNum] = [0, -1]

  for (let i = 0; i < cards.length; i++) {
    const cardNum = getCardNumber(cards[i])

    if (cardNum !== prevNum) {
      cnt = 1
    } // BLANK LINE COMMENT:
    else {
      cnt++

      if (cnt === 2) {
        pairNumArr.push(cardNum)
      }
    }

    prevNum = cardNum
  }

  if (pairNumArr.length > 1) {
    const [twoPairNum1, twoPairNum2] = [pairNumArr[0], pairNumArr[1]]
    const otherNum = cards.filter(
      card => getCardNumber(card) !== twoPairNum1 && getCardNumber(card) !== twoPairNum2
    )[0]
    const status = [twoPairNum1, twoPairNum1, twoPairNum2, twoPairNum2, getCardNumber(otherNum)]
    return {isMade: true, score: 2, status}
  }

  return {isMade: false, score: 2, status: []}
}
export const isOnePair = (cards: number[]) => {
  cards.sort((a, b) => {
    const [numberA, numberB] = [getCardNumber(a), getCardNumber(b)]
    return numberB - numberA
  })

  let pairNum = -1
  let [cnt, prevNum] = [0, -1]

  for (let i = 0; i < cards.length; i++) {
    const cardNum = getCardNumber(cards[i])

    if (cardNum !== prevNum) {
      cnt = 1
    } // BLANK LINE COMMENT:
    else {
      cnt++

      if (cnt === 2) {
        pairNum = cardNum
        break
      }
    }

    prevNum = cardNum
  }

  if (pairNum !== -1) {
    const otherCards = cards.filter(card => getCardNumber(card) !== pairNum)
    const status = [
      pairNum,
      pairNum,
      getCardNumber(otherCards[0]),
      getCardNumber(otherCards[1]),
      getCardNumber(otherCards[2])
    ]
    return {isMade: true, score: 1, status}
  }

  return {isMade: false, score: 1, status: []}
}
export const isHighCard = (cards: number[]) => {
  cards.sort((a, b) => {
    const [numberA, numberB] = [getCardNumber(a), getCardNumber(b)]
    return numberB - numberA
  })

  const status = cards.map(card => getCardNumber(card)).splice(0, 5)

  return {isMade: true, score: 0, status}
}

export const getPokerScore = (cards: number[]) => {
  const pokerScore = [
    isStiffle(cards),
    isFour(cards),
    isFullHouse(cards),
    isFlush(cards),
    isStraight(cards),
    isTriple(cards),
    isTwoPair(cards),
    isOnePair(cards),
    isHighCard(cards)
  ]

  return pokerScore.find(score => score.isMade) || {isMade: false, score: -1, status: []}
}
