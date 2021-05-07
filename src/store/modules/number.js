import api from '../../api/index'

const state = {
    numberInfo:{
        pageNum: 1,
        pageSize: 1,
        size: 1,
        pages: 1,
        list: [
            {
                consultant: '',
                stuName: '',
                time: '',
                number: '',
                nId: 1
            }
        ],
        total: 1
    }
}

const mutations ={
    setNumberInfo(state,payload){
        state.numberInfo =payload
    }
}

const actions = {
     getAllNumberInfo(context,payload){
        api.number.
            getAllNumber(payload,10)
                .then(res=>{
            context.commit('setNumberInfo',res.data)
        })
    }
}

export default {
    namespaced:true,
    state,
    mutations,
    actions,
}