import {getServerUrl} from './getServerUrl'
import * as U from '../utils'
import {
  decodeJwtFromServer,
  encodeJwtFromClient,
  jwtHeaderLenBase,
  jwtHeaderLenVali
} from '../secret'

const getOrDel =
  (methodName: string, jwt?: string | null | undefined) =>
  (path: string, jwt: string | null | undefined, reqUrl?: string) => {
    let headers = {'Content-Type': 'application/json'}
    let init: RequestInit = {
      method: methodName
    }

    if (jwt) {
      init = {
        ...init,
        headers: {
          ...headers,
          Authorization: `Bearer ${jwt}`,
          url: reqUrl || ''
        }
      }
    } // BLANK LINE COMMENT:
    else init = {...init, headers}
    return fetch(getServerUrl(path), init)
  }
export const get = getOrDel('GET')
export const del = getOrDel('DELETE')

const getOrDelJwt2 = (methodName: string) => async (path: string) => {
  try {
    const jwt = await U.readStringP('jwt') // BLANK LINE COMMENT:
      .then(ret => {
        const {header, jwtBody} = decodeJwtFromServer(ret || '', jwtHeaderLenBase)
        return encodeJwtFromClient(header, jwtBody)
      })
    return await get(`/gkdJwt/requestValidation`, jwt, path)
      .then(res => res.json())
      .then(async res => {
        const {ok, body, errObj} = res
        const {jwtFromServer} = body
        if (ok) {
          const {header, jwtBody} = decodeJwtFromServer(jwtFromServer, jwtHeaderLenVali)
          const jwtFromClient = encodeJwtFromClient(header, jwtBody)
          if (jwtFromClient) {
            return await getOrDel(methodName)(path, jwtFromClient)
          } // BLANK LINE COMMENT:
          else {
            throw {jwt: `NULL JWT ERROR IN ${path}`} // eslint-disable-line
          }
        } // BLANK LINE COMMENT:
        else {
          throw errObj
        }
      })
      .catch(errObj => {
        throw errObj
      })
    // BLANK LINE COMMENT:
  } catch (errObj) {
    // BLANK LINE COMMENT:
    throw errObj
  }
}
export const getWithJwt = getOrDelJwt2('GET')
export const delWithJwt = getOrDelJwt2('DELETE')
