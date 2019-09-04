const userDB = [
  { username: 'admin', password: 'redandblue5679', uuid: 'admin-uuid', name: '管理员' }
  // { username: 'editor', password: 'editor', uuid: 'editor-uuid', name: '编辑' },
  // { username: 'user1', password: 'user1', uuid: 'user1-uuid', name: '用户1' }
]

export default [
  {
    path: process.env.NODE_ENV === 'production' ? '/login' : '/api/login',
    // path: '/api/login',
    method: 'post',
    handle ({ body }) {
      const user = userDB.find(e => e.username === body.username && e.password === body.password)
      if (user) {
        return {
          code: 200,
          msg: '登录成功',
          data: {
            ...user,
            token: 'redandblue5679'
          }
        }
      } else {
        return {
          code: 401,
          msg: '用户名或密码错误',
          data: {}
        }
      }
    }
  }
]
