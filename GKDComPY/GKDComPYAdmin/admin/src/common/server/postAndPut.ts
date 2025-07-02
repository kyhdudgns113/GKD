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
    const res = await get('/gkdJwt/requestValidation', jwt, path)
    const resJson = await res.json()
    const {ok, body, errObj} = resJson

    if (ok) {
      const {header, jwtBody} = decodeJwtFromServer(body.jwtFromServer, jwtHeaderLenVali)
      const jwtFromClient = encodeJwtFromClient(header, jwtBody)

      if (jwtFromClient) {
        return postOrPut(methodName)(path, data, jwtFromClient)
      } // BLANK LINE COMMENT:
      else {
        throw new Error(`${methodName}_${path} : NULL JWT ERROR`)
      }
    } // BLANK LINE COMMENT:
    else {
      console.log(`postAndPutWithJWT ok === false`)
      console.log(`ERROR : ${errObj}`)
      console.log(`Keys : ${Object.keys(errObj)}`)
      Object.keys(errObj).forEach(key => {
        console.log(`errObj[${key}]: ${errObj[key]}`)
      })
      throw new Error(errObj[Object.keys(errObj)[0]])
    }
  } catch (err: any) {
    console.log(`PostOrPutJWT : ${err}`)
    Object.keys(err).forEach(key => console.log(`${key} : ${err.key ?? ''}`))
    throw err
  }
}
export const postWithJwt = postOrPutJwt('POST')
export const putWithJwt = postOrPutJwt('PUT')
