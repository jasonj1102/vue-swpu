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

//未完成
// function insertSolveOrder(solveOrder){
//   console.log(solveOrder)
//   return http.post('/api/solveOrder/insert',{
//     // category : order.category,
//     // address : order.address,
//     // number : order.number,
//     // sendTime : order.sendTime,
//     // dispatcher : order.dispatcher,
//     // description: order.description,
//     // appointmentTime : order.appointmentTime
//   })
// }

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
    sId : search.sId
  })
}

function deleteSolveOrderByIds(soIds){
  return http.post(`/api/solveOrder/deleteOrders`,{
    soIds
  })
}

export default {
  getAllSolveOrder,
  // insertSolveOrder,
  updateSolveOrder,
  searchSolveOrder,
  deleteSolveOrder,
  deleteSolveOrderByIds
}