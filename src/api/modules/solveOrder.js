import http from "../../request/http";

function getAllSolveOrder(page,size){
  return http.get(`/api/solveOrder/getAll`,{
    params:{
      page:page,
      size:size
    }
  })
}

function deleteSolveOrder(soId){
  return http.post(`/api/solveOrder/delete/${soId}`)
}

function insertSolveOrder(solveOrder){
  console.log(solveOrder)
  return http.post('/api/solveOrder/insert',{
    ...solveOrder
  },{
    headers : {'Content-Type': 'application/json'}
  })
}

function updateSolveOrder(solveOrder){
  console.log(solveOrder)
  return http.post(`/api/solveOrder/update`,{
    ...solveOrder
  },{headers:{'Content-Type': 'application/json'}})
}

function searchSolveOrder(search){
  return http.post(`/api/solveOrder/search`,{
    page : search.page,
    size : search.size,
    sId : search.sId,
    startTime : search.startTime,
    endTime : search.endTime
  })
}

function deleteSolveOrderByIds(soIds){
  return http.post(`/api/solveOrder/deleteSolveOrders`,{
    soIds
  })
}

function downLoad(solveOrderInfo,startTime){
  return http.post(`/api/solveOrder/downLoad`,
      {
        solveOrderInfo : JSON.stringify(solveOrderInfo),
        startTime : startTime
      }
  )
}

export default {
  getAllSolveOrder,
  insertSolveOrder,
  updateSolveOrder,
  searchSolveOrder,
  deleteSolveOrder,
  deleteSolveOrderByIds,
  downLoad
}