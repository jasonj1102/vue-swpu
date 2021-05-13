import api from '../../api/index'

const state = {
  roleInfo:[
    {
      rId : 1,
      roleName : ''
    }
  ]
}

const mutations = {
  setRoleInfo(state,payload){
    state.roleInfo = payload
  }
}

const actions = {
  getAllRoleInfo(context){
    api.role.getAllRole().then(
        res=>{
          context.commit('setRoleInfo',res.data)
        }
    )
  }
}

export default {
  namespaced:true,
  state,
  mutations,
  actions
}