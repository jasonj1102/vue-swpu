import http from '../../request/http'

/**
 * 用户登录
 */
function login(user){
  return http.post('/api/user/login',{
    username: user.username,
    password: user.password
  })
}

/**
 * 用户注册，只能超级管理员才能注册用户信息
 */
function register(user){
  return http.post('/api/user/register',{
    username: user.username,
    password: user.password
  })
}

/**
 *
 * @param uId
 * @param password
 * @returns {Promise<AxiosResponse<any>>}
 */
// function updatePassword(uId,password){
//   return http.post('/api/user/updatePassword',{
//     uId : uId,
//     password: password
//   })
// }

export default{
  login,
  register
}