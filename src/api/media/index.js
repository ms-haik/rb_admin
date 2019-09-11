import request from '@/plugin/axios'
import qs from 'qs'

export function createResource (data) { // 创建资源
  return request({
    url: '/media/admin/v1/create_media',
    method: 'post',
    data
  })
}

export function deleteResource (data) { // 删除资源
  return request({
    url: '/media/admin/v1/delete_media',
    method: 'post',
    data
  })
}

export function searchResource (data) { // 查询资源列表
  return request({
    url: '/media/admin/v1/search',
    method: 'get',
    transformRequest: [function (data) {
      return qs.stringify(data)
    }],
    params: data
  })
}
