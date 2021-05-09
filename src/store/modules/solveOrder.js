import api from '../../api/index'

const state = {
  solveOrderInfo:{
    pageNum: 1,
    pageSize: 1,
    size: 1,
    pages: 1,
    list: [
      {
        solveId:1,
        customerName:'',
        register:'',
        solveTime:'',
        maintainer:'',
        maintainers:[
          {
            sId:1,
            stuName:'',
            stuNo:'',
            grade:'',
            major:'',
            number:''
          }
        ],
        status:0,
        reason:'',
        solution:'',
        oId:1,
        order:{
          oId:1,
          category:'',
          address:'',
          number:'',
          description:'',
          sendTime:'',
          dispatcher:'',
          appointmentTime:'',
          status:0
        },
        mId:1,
        material:{
          mId:1,
          crystalHead:1,
          networkCable:1,
          panel:1,
          port:1
        }
      }
    ],
    total: 1
  }
}
const mutations ={
  setSolveOrderInfo(state,payload){
    state.solveOrderInfo = payload
  }
}

const actions = {
  getAllSolveOrderInfo(context,payload){
    api.solveOrder.getAllSolveOrder(payload,10)
        .then(res =>{
          context.commit('setSolveOrderInfo',res.data)
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