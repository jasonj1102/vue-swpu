import api from '../../api/index'

const state ={
  studentInfo : {
    pageNum: 1,
    pageSize: 1,
    size: 1,
    pages: 1,
    list: [
      {
        sId: 1,
        stuName: '',
        stuNo: '',
        grade: '',
        major: '',
        number: ''
      }
    ],
    total: 1
  }
}

const mutations = {
  setStudentInfo(state,payload){
    state.studentInfo = payload
  }

}

const actions = {
  getAllStudentInfo(context,payload){
    api.student.getAllStudent(payload,10)
        .then(res=>{
              context.commit('setStudentInfo',res.data)
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