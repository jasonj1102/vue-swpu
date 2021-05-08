import http from "../../request/http";

function getStudent(){
  // 获取所有学生信息，不是分页获取的
  return http.get(`/api/stu/getAllStudent`)
}

function insertStudent(student){
  return http.post(`/api/stu/insert`,{
    stuNo : student.stuNo,
    stuName : student.stuName,
    grade : student.grade,
    major : student.major,
    number : student.number
  })
}


function updateStudent(student){
  return http.post(`/api/stu/update`,{
    sId : student.sId,
    stuNo : student.stuNo,
    stuName : student.stuName,
    grade : student.grade,
    major : student.major,
    number : student.number
  })
}


function getAllStudent(page,size){
  //分页获取所有学生信息
  return http.get(`/api/stu/getAll`,{
    params:{
      page : page,
      size : size
    }
  })
}

function searchStudent(search){
  return http.post(`/api/stu/search`,{
    page : search.page,
    size : search.size,
    grade : search.grade,
    major : search.major
  })
}

function deleteStudent(sId){
  return http.post(`/api/stu/delete/${sId}`)
}

function deleteStudentByIds(sIds){
  return http.post(`/api/stu/deleteStudents`,{
    sIds
  })
}

export default {
  getStudent,
  getAllStudent,
  insertStudent,
  updateStudent,
  deleteStudent,
  deleteStudentByIds,
  searchStudent
}
