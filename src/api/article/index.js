import request from '@/plugin/axios'
import qs from 'qs'

export function createArticle (data) { // 创建文章
  return request({
    url: '/article/admin/v1/create_article',
    method: 'post',
    data
  })
}

export function updateArticle (data) { // 修改文章
  return request({
    url: '/article/admin/v1/update_article',
    method: 'post',
    data
  })
}

export function updateArticleStatus (data) { // 修改文章发布、待发布状态
  return request({
    url: '/article/admin/v1/update_status',
    method: 'post',
    data
  })
}

export function getArticle (data) { // 获取文章详情
  return request({
    url: '/article/admin/v1/get_article',
    method: 'get',
    transformRequest: [function (data) {
      return qs.stringify(data)
    }],
    params: data
  })
}

export function searchArticle (data) { // 查询文章
  return request({
    url: '/article/admin/v1/search',
    method: 'get',
    transformRequest: [function (data) {
      return qs.stringify(data)
    }],
    params: data
  })
}

export function getLabels (data) { // 获取所有标签列表
  return request({
    url: '/label/admin/v1/get_labels',
    method: 'get',
    transformRequest: [function (data) {
      return qs.stringify(data)
    }],
    params: data
  })
}
