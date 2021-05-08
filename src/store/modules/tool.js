import api from '../../api/index'

const state ={
  toolInfo : {
    pageNum: 1,
    pageSize: 1,
    size: 1,
    pages: 1,
    list: [
      {
        tId: 1,
        toolNumber:'',
        toolName: '',
        url:''
      }
    ],
    total: 1
  }
}

const mutations = {
  setToolInfo(state,payload){
    state.toolInfo = payload
  }

}

const actions = {
  getAllToolInfo(context,payload){
    api.tool.getAllTool(payload,10)
        .then(res=>{
              context.commit('setToolInfo',res.data)
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