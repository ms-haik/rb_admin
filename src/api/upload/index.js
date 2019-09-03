import request from '@/plugin/axios'

export function UploadByFile (data) {
  return request({
    url: '/file/upload',
    method: 'post',
    data
  })
}

export function UploadImg (data) {
  return request({
    url: '/file/upload/img/common',
    method: 'post',
    data
  })
}
