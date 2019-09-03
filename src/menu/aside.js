// 菜单 侧边栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '文章管理',
    icon: 'folder-o',
    children: [
      { path: '/article/create', title: '创建文章' },
      { path: '/article/toberelease', title: '待发布' },
      { path: '/article/released', title: '已发布' }
    ]
  }
]
