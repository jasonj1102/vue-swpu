import api from '../../api/index'

const state = {
  workLoadInfo:{
    pageNum: 1,
    pageSize: 1,
    size: 1,
    pages: 1,
    list: [
      {
        studentName:'',
        numbers:'',
        telecoms:'',
        campusNetWork:'',
        other:'',
      }
    ],
    total: 1
  }
}

const mutations = {
  setWorkLoadInfo(state,payload){
    state.workLoadInfo = payload
  },

}

const actions = {
  getAllWorkLoadInfo(context,payload){
    api.workLoad.getAllWorkLoad(payload,10)
        .then(res=>{
          context.commit('setWorkLoadInfo',res.data)
        })
  }
}

export default {
  namespaced:true,
  state,
  mutations,
  actions
}