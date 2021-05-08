import http from "../../request/http";

function insertTool(tool){
  console.log(tool)
  return http.post(`/api/tool/insert`,{
    toolNumber : tool.toolNumber,
    toolName : tool.toolName,
    url : tool.url,
  })
}


function updateTool(tool){
  return http.post(`/api/tool/update`,{
    tId : tool.tId,
    toolNumber : tool.toolNumber,
    toolName : tool.toolName,
    url : tool.url
  })
}


function getAllTool(page,size){
  //分页获取所有学生信息
  return http.get(`/api/tool/getAll`,{
    params:{
      page : page,
      size : size
    }
  })
}

function searchTool(search){
  return http.post(`/api/tool/search`,{
    page : search.page,
    size : search.size,
    toolName : search.toolName
  })
}

function deleteTool(tId){
  return http.post(`/api/tool/delete/${tId}`)
}

function deleteToolByIds(tIds){
  return http.post(`/api/tool/deleteTools`,{
    tIds
  })
}

export default {
  getAllTool,
  insertTool,
  updateTool,
  deleteTool,
  deleteToolByIds,
  searchTool
}
