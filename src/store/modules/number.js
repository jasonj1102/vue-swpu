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
                nid: 1
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
    setNumberInfo(context,payload){
        context.commit('setNumberInfo',payload)
    }
}

export default {
    namespaced:true,
    state,
    mutations,
    actions
}