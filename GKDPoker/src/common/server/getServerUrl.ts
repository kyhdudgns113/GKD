import {serverUrl} from '../typesAndValues'

export const getServerUrl = (path: string) => {
  const host = serverUrl
  return [host, path].join('')
}
