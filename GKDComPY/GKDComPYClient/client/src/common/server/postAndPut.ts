import {get} from './getAndDel'
import {getServerUrl} from './getServerUrl'
import * as U from '../utils'
import {
  decodeJwtFromServer,
  encodeJwtFromClient,
  jwtHeaderLenBase,
  jwtHeaderLenVali
} from '../secret'

const postOrPut =
  (methodName: string) =>
  (path: string, data: object, jwt: string | null | undefined, reqUrl?: string) => {
    let headers = {'Content-Type': 'application/json'}
    let init: RequestInit = {
      method: methodName,
      body: JSON.stringify(data),
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin'
    }

    if (jwt) {
      init = {
        ...init,
        headers: {
          ...headers,
          Authorization: `Bearer ${jwt}`,
          url: reqUrl || 'NULL URL'
        }
      }
    } // BLANK LINE COMMENT:
    else init = {...init, headers}
    return fetch(getServerUrl(path), init)
  }
export const post = postOrPut('POST')
export const put = postOrPut('PUT')

const postOrPutJwt = (methodName: string) => async (path: string, data: Object) => {
  try {
    const jwt = await U.readStringP('jwt') // BLANK LINE COMMENT:
      .then(ret => {
        const {header, jwtBody} = decodeJwtFromServer(ret || '', jwtHeaderLenBase)
        return encodeJwtFromClient(header, jwtBody)
      })

    return get('/gkdJwt/requestValidation', jwt, path)
      .then(res => res.json())
      .then(res => {
        const {ok, body, errObj} = res
        if (ok) {
          const {header, jwtBody} = decodeJwtFromServer(body.jwtFromServer, jwtHeaderLenVali)
          const jwtFromClient = encodeJwtFromClient(header, jwtBody)

          if (jwtFromClient) {
            return postOrPut(methodName)(path, data, jwtFromClient)
          } // BLANK LINE COMMENT:
          else {
            throw {jwt: `NULL JWT ERROR IN ${path}`} // eslint-disable-line
          }
        } // BLANK LINE COMMENT:
        else {
          throw errObj
        }
      })
      .catch(err => {
        throw err
      })
  } catch (err: any) {
    throw err
  }
}
export const postWithJwt = postOrPutJwt('POST')
export const putWithJwt = postOrPutJwt('PUT')
