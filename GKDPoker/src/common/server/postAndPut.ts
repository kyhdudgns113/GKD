import {getServerUrl} from './getServerUrl'

const postOrPut =
  (methodName: string) =>
  (path: string, data: object, jwt: string | null | undefined, reqUrl?: string) => {
    const headers = {'Content-Type': 'application/json'}
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
