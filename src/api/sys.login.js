import request from '@/plugin/axios'

export function AccountLogin (data) {
  return request({
    url: '/login',
    method: 'post',
    from: 'mock',
    data
  })
}

// export function AccountLogin (data) {
//   return request({
//     url: '/user/login',
//     method: 'post',
//     data
//   })
// }
