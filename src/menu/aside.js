// 菜单 侧边栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '文章管理',
    icon: 'folder-o',
    children: [
      { path: '/article/create', title: '创建文章' },
      { path: '/article/articlelist', title: '文章列表' }
    ]
  },
  {
    title: '媒体资源管理',
    icon: 'folder-o',
    children: [
      { path: '/media/medialist', title: '媒体资源管理' }
    ]
  }
]
