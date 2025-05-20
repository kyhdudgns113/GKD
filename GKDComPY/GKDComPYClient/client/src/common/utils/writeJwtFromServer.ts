import * as U from '../utils'

export const writeJwtFromServer = (jwtFromServer: string) => {
  try {
    if (!jwtFromServer) {
      throw new Error('/utils: JWT 가 비었는데?')
    }
    U.writeStringP('jwt', jwtFromServer)
    // BLANK LINE COMMENT:
  } catch (errObj) {
    // BLANK LINE COMMENT:
    throw errObj
  }
}
