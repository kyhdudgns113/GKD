import * as U from '../utils'

export const writeJwtFromServer = (jwtFromServer: string) => {
  if (!jwtFromServer) {
    throw new Error('/utils: JWT 가 비었는데?')
  }
  U.writeStringP('jwtFromServer', jwtFromServer)
}
