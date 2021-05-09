import api from '../../api/index'

const state = {
  rewardInfo:{
    stuName: '',
    totalMoney: 0
  }
}

const mutations ={
  setRewardInfo(state,payload){
    state.rewardInfo =payload
  }
}

const actions = {
  getAllRewardInfo(context){
    api.fine.
    getAllStuReward()
        .then(res=>{
          context.commit('setRewardInfo',res.data)
        })
  }
}

export default {
  namespaced:true,
  state,
  mutations,
  actions,
}