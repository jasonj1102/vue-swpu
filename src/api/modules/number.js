import http from "../../request/http";
/**
 *
 * 获取全部电话信息
 * @param page
 * @param size
 * @returns {Promise<AxiosResponse<any>>}
 */
function getAllNumber(page,size){
    return http.get(`/api/number/getAll`,{
        params:{
            page:page,
            size:size
        }
    })
}

function insertNumber(number){
    return http.post('/api/number/insert',{
        consultant : number.consultant,
        number : number.number,
        stuName : number.stuName,
        time : number.time
    })
}

function deleteNumber(nId){
    return http.post(`/api/number/delete/${nId}`)
}

function deleteNumberByIds(nIds){
    return http.post(`/api/number/deleteNumbers`,{
            nIds
        })
}

function searchNumber(search){
    return http.post(`/api/number/search`,{
        page : search.page,
        size : search.size,
        address : search.address,
        stuName : search.stuName
    })
}

function updateNumber(number){
    return http.post(`/api/number/update`,{
        // number
        nId : number.nId,
        consultant : number.consultant,
        number : number.number,
        stuName : number.stuName,
        time : number.time
    })
}


export default {
    getAllNumber,
    insertNumber,
    deleteNumber,
    updateNumber,
    deleteNumberByIds,
    searchNumber
}