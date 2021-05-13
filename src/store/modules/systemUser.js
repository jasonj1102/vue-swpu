import api from '../../api/index'

const state = {
  systemUserInfo : {
    pageNum: 1,
    pageSize: 1,
    size: 1,
    pages: 1,
    list: [
      {
        uId: 1,
        username: '',
        role: {
          rId: 1,
          roleName: '',
          permissions: [
            {
              pId: 1,
              index: '',
              icon: '',
              permissionName: ''
            }
          ]
        }
      }
    ],
    total:1
  }
}

const mutations = {
  setSystemUserInfo(state,payload){
    state.systemUserInfo = payload
  }
}

const actions = {
  getAllSystemUserInfo(context,payload){
    api.role.getAllUserRole(payload,10)
        .then(
            res=>{
              context.commit('setSystemUserInfo',res.data)
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