import api from '../../api/index'
// 用户信息
const state = {
  token: localStorage.getItem('token'),
  userInfo:{
    uId:1,
    username:'',
    role:{
      rId:1,
      roleName:'',
      permissions:[
        {
          pId:1,
          index:'',
          icon:'',
          permissionName:''
        }
      ]
    }
  }
}

const mutations = {
  setToken(state,payload){
    state.token = payload
    localStorage.setItem('token',payload)
  },
  setUserInfo(state,payload){
    state.userInfo = payload
  }
}

// 里面的方法会调用mutation中同名的方法
const actions = {
  getUserInfo(context,payload){
    console.log(payload)
    console.log(state.userInfo.username)
    api.user.getUserInfoByUsername(payload)
        .then(res=>{
          context.commit('setUserInfo',res.data)
        })
  }
}

export default{
  namespaced:true,
  state,
  mutations,
  actions
}