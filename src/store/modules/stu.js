import api from '../../api/index'

const state ={
  student :[
    {
      sId:1,
      stuName:'',
      stuNo:'',
      grade:'',
      major:'',
      number:''
    }
  ]
}

const mutations = {
  setStudent(state,payload){
    state.student = payload
  }

}

const actions = {
  getStudent(context){
    api.student.getStudent()
        .then(res=>{
              context.commit('setStudent',res.data)
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