import http from "../../request/http";

function getStudent(){
    // 获取所有学生信息，不是分页获取的
    return http.get(`/api/stu/getAllStudent`)
}

export default {
    getStudent
}
