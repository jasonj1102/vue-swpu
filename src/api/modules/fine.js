import http from "../../request/http";

function getAllFine(page,size){
  return http.get(`/api/fine/getAll`,{
    params:{
      page:page,
      size:size
    }
  })
}

function insertFine(fine){
  return http.post('/api/fine/insert',{
    sIds : fine.sIds,
    category : fine.category,
    money : fine.money,
    time : fine.time,
    description : fine.description
  })
}

function deleteFine(fId){
  return http.post(`/api/fine/delete/${fId}`)
}

function deleteFineByIds(fIds){
  return http.post(`/api/fine/deleteFines`,{
    fIds
  })
}

function searchFine(search){
  return http.post(`/api/fine/getAllByTime`,{
    page : search.page,
    size : search.size,
    // sIds
    sIds : search.sIds,
    startTime : search.startTime,
    endTime : search.endTime
  })
}

function updateFine(fine){
  return http.post(`/api/fine/update`,{
    // fine
    fId : fine.fId,
    sIds : fine.sIds,
    category : fine.category,
    money : fine.money,
    description : fine.description,
    time : fine.time
  })
}

function getAllStuReward(){
  return http.get(`/api/fine/getAllStuReward`)
}


export default {
  getAllFine,
  insertFine,
  deleteFine,
  updateFine,
  deleteFineByIds,
  searchFine,
  getAllStuReward
}