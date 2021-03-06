import http from "../../request/http";

function getAllWorkLoad(page,size){
  //分页获取所有学生信息
  return http.get(`/api/workLoad/getAll`,{
    params:{
      page : page,
      size : size
    }
  })
}

function getAllWorkLoadByTime(search){
  return http.post(`/api/workLoad/getAllByTime`,{
    page : search.page,
    size : search.size,
    startTime : search.startTime,
    endTime : search.endTime
  })
}

function downLoad(workLoadInfo,startTime){
  return http.post(`/api/workLoad/downLoad`,
      {
        workLoadInfo : JSON.stringify(workLoadInfo),
        startTime : startTime
      }
  )
}



export default {
  getAllWorkLoad,
  getAllWorkLoadByTime,
  downLoad
}
