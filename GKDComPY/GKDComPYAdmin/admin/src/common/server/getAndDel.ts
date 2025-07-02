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

const getOrDelJwt = (methodName: string) => async (path: string) => {
  try {
    const jwt = await U.readStringP('jwt') // BLANK LINE COMMENT:
      .then(ret => {
        const {header, jwtBody} = decodeJwtFromServer(ret || '', jwtHeaderLenBase)
        return encodeJwtFromClient(header, jwtBody)
      })
    const res = await get('/gkdJwt/requestValidation', jwt, path)
    const resJson = await res.json()

    const {ok, body, errObj} = resJson

    if (ok) {
      // console.log(`GET AND DEL JWT : OK`)
      const {header, jwtBody} = decodeJwtFromServer(body.jwtFromServer, jwtHeaderLenVali)
      const jwtFromClient = encodeJwtFromClient(header, jwtBody)
      if (jwtFromClient) {
        return getOrDel(methodName)(path, jwtFromClient)
      } // BLANK LINE COMMENT:
      else {
        throw new Error(`${methodName}_${path} : NULL JWT ERROR`)
      }
    } // BLANK LINE COMMENT:
    else {
      throw new Error(errObj[Object.keys(errObj)[0]])
    }
    // BLANK LINE COMMENT:
  } catch (errObj) {
    // BLANK LINE COMMENT:
    throw errObj
  }
}
export const getWithJwt = getOrDelJwt('GET')
export const delWithJwt = getOrDelJwt('DELETE')
