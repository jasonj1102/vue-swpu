import api from '../../api/index'

const state = {
  orderInfo:{
    pageNum: 1,
    pageSize: 1,
    size: 1,
    pages: 1,
    list: [
      {
        oId:1,
        category:'',
        address:'',
        number:'',
        description:'',
        sendTime:'',
        dispatcher:'',
        appointmentTime:'',
        status:0
      }
    ],
    total: 1
  }
}

const mutations = {
  setOrderInfo(state,payload){
    state.orderInfo = payload
  },
  setOrder(state,payload){
    state.orderInfo.list = payload
  }
}

const actions = {
  getAllOrderInfo(context,payload){
    api.order.
    getAllOrder(payload,10)
        .then(res=>{
          context.commit('setOrderInfo',res.data)
        })
  },
  getAllOrderInfoNotFinish(context){
    api.order.getAllOrderInfoNotFinish().then(
        res=>{
          context.commit('setOrder',res.data)
        })
  }
}

export default {
  namespaced:true,
  state,
  mutations,
  actions
}