import http from "../../request/http";

/**
 *
 * 获取全部电话信息
 * @param page
 * @param size
 * @returns {Promise<AxiosResponse<any>>}
 */
function getAllNumber(page,size){
    return http.get('/api/number/getAll',{
        params:{
            page:page,
            size:size
        }
    })
}

export default {
    getAllNumber
}