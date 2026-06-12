import axios from 'axios'

const request = axios.create({
  baseURL: '/api/v1',
  timeout: 15000
})

// snake_case → camelCase（请求参数用）
function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

function convertKeysToCamel(obj) {
  if (obj === null || obj === undefined) return obj
  if (Array.isArray(obj)) return obj.map(convertKeysToCamel)
  if (typeof obj !== 'object') return obj
  const result = {}
  for (const key of Object.keys(obj)) {
    result[toCamelCase(key)] = convertKeysToCamel(obj[key])
  }
  return result
}

// camelCase → snake_case（响应数据转换）
function toSnakeCase(str) {
  return str.replace(/[A-Z]/g, letter => '_' + letter.toLowerCase())
}

function convertKeys(obj) {
  if (obj === null || obj === undefined) return obj
  if (Array.isArray(obj)) return obj.map(convertKeys)
  if (typeof obj === 'string' && /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}/.test(obj)) return obj
  if (typeof obj !== 'object') return obj
  const result = {}
  for (const key of Object.keys(obj)) {
    result[toSnakeCase(key)] = convertKeys(obj[key])
  }
  return result
}

// 请求拦截：snake_case params + data → camelCase
request.interceptors.request.use(config => {
  if (config.params) {
    config.params = convertKeysToCamel(config.params)
  }
  if (config.data && typeof config.data === 'object' && !(config.data instanceof FormData)) {
    config.data = convertKeysToCamel(config.data)
  }
  return config
})

// 响应拦截：解包 Result + 转 snake_case
request.interceptors.response.use(
  response => {
    const body = response.data
    if (body.code && body.code !== 200) {
      return Promise.reject(new Error(body.message || '请求失败'))
    }
    return convertKeys(body.data)
  },
  error => {
    const msg = error.response?.data?.message || error.message || '网络错误'
    return Promise.reject(new Error(msg))
  }
)

export default request
