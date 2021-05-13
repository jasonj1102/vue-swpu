import http from "../../request/http";

function getAllUserRole(page,size){
  return http.get(`/api/role/getUserRole`,{
    params:{
      page : page,
      size : size
    }
  })
}

function updateToUserRole(username,rId){
  return http.post(`/api/role/insertToUserRole`,{
    username : username,
    rId : rId
  })
}

function getAllRole(){
  return http.get(`/api/role/getAll`)
}

export default {
  getAllRole,
  getAllUserRole,
  updateToUserRole
}
