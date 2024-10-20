import request from '@/utils/request'

export default {
  getPurchaseList(searchModel) {
    return request({
      url: '/purOrder/list',
      method: 'get',
      params: {
        purchaseNum: searchModel.purchaseNum,
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize
      }
    })
  },
  addPurchase(purchase) {
    return request({
      url: '/purOrder',
      method: 'post',
      data: purchase
    })
  },
  updatePurchase(purchase) {
    return request({
      url: '/purOrder',
      method: 'put',
      data: purchase
    })
  },
  savePurchase(purchase) {
    if (purchase.purchaseId == null) {
      return this.addPurchase(purchase)
    }
    return this.updatePurchase(purchase)
  },
  getPurchaseById(id) {
    return request({
      url: `/purOrder/${id}`,
      method: 'get'
    })
  },
  deletePurchaseById(id) {
    return request({
      url: `/purOrder/${id}`,
      method: 'delete'
    })
  },
  getAllPurchaseList() {
    return request({
      url: '/purOrder/all',
      method: 'get'
    })
  }
}
