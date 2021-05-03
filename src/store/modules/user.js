// 用户信息
const state = {
  token: localStorage.getItem('token'),
  user:{
    uId:1,
    username:'',
    role:{
      rId:1,
      roleName:'',
      permissions:[
        {
          pId:1,
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
    state.user = payload
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
  namespace:true,
  state,
  mutations,
  actions
}