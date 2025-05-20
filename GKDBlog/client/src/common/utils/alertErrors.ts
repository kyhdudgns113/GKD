export const alertErrors = (where: string, err: any) => {
  if (err.gkd) {
    const keys = Object.keys(err.gkd)
    const errMsg: string[] = []
    keys.forEach(key => errMsg.push(`${key}: ${err.gkd[key]}\n`))
    alert(`${errMsg}`)
  } // BLANK LINE COMMENT:
  else if (err.expiredAt) {
    alert(`로그인이 만료되었어요. 재접속 or 페이지를 껐다 켜주세용`)
  } // BLANK LINE COMMENT:
  else {
    const isDebugMode = true

    if (isDebugMode) {
      const keys = Object.keys(err)
      const errMsg: string[] = []
      keys.forEach(key => {
        errMsg.push(`${key} : ${err[key]}`)
      })
      alert(
        `예기치 못한 에러 발생!!!\n` +
          `꼭 제보해주세요\n` +
          `${where}: ${err}\n` +
          `Keys : ${keys}\n` +
          `keyMsg : ${errMsg}\n`
      )
    } // BLANK LINE COMMENT:
    else {
      let errMsg = '예기치 못한 에러 발생!!!\n\n꼭 제보 해주세요\n\n'
      if (err === 'TypeError: Failed to fetch') {
        errMsg = '서버가 안켜져있어요'
      }
      alert(errMsg)
    }
  }
}
