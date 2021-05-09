import api from '../../api/index'

const state = {
  fineInfo:{
    pageNum: 1,
    pageSize: 1,
    size: 1,
    pages: 1,
    list: [
      {
        fId:1,
        sIds:'',
        sIdsName:'',
        students:[
          {
            sId:1,
            stuName:'',
            stuNo:'',
            grade:'',
            major:'',
            number:''
          }
        ],
        category:1,
        description:'',
        money:0,
        time:''
      }
    ],
    total: 1
  }
}

const mutations ={
  setFineInfo(state,payload){
    state.fineInfo =payload
  }
}

const actions = {
  getAllFineInfo(context,payload){
    api.fine.
    getAllFine(payload,10)
        .then(res=>{
          context.commit('setFineInfo',res.data)
        })
  }
}

export default {
  namespaced:true,
  state,
  mutations,
  actions,
}