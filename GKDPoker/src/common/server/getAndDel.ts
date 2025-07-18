import {getServerUrl} from './getServerUrl'

const getOrDel =
  (methodName: string) => (path: string, jwt: string | null | undefined, reqUrl?: string) => {
    const headers = {'Content-Type': 'application/json'}
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
