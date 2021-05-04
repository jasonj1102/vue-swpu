// 用户信息
const state = {
  token: localStorage.getItem('token'),
  userInfo:{
    uid:1,
    username:'',
    role:{
      rid:1,
      roleName:'',
      permissions:[
        {
          pid:1,
          index:'',
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
  setToken(context,payload){
    context.commit('setToken',payload)
  },
  setUserInfo(context,payload){
    context.commit('setUserInfo',payload)
  }
}

export default{
  namespaced:true,
  state,
  mutations,
  actions
}