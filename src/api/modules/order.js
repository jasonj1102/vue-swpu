import http from "../../request/http";

function getAllOrder(page,size){
    return http.get(`/api/order/getAll`,{
        params:{
            page:page,
            size:size
        }
    })
}

function deleteOrder(oId){
    return http.post(`/api/order/delete/${oId}`)
}

function insertOrder(order){
    console.log(order)
    return http.post('/api/order/insert',{
        category : order.category,
        address : order.address,
        number : order.number,
        sendTime : order.sendTime,
        dispatcher : order.dispatcher,
        description: order.description,
        appointmentTime : order.appointmentTime
    })
}
function updateOrder(order){
    return http.post(`/api/order/update`,{
        oId : order.oId,
        category : order.category,
        address : order.address,
        number : order.number,
        sendTime : order.sendTime,
        dispatcher : order.dispatcher,
        description : order.description,
        appointmentTime : order.appointmentTime,
        status : order.status
    })
}

function searchOrder(search){
    return http.post(`/api/order/search`,{
        page : search.page,
        size : search.size,
        address : search.address,
        stuName : search.stuName
    })
}

function deleteOrderByIds(oIds){
    return http.post(`/api/order/deleteOrders`,{
        oIds
    })
}

export default {
    getAllOrder,
    insertOrder,
    updateOrder,
    searchOrder,
    deleteOrder,
    deleteOrderByIds
}