import request from '@/utils/request'

export default {
  getStockList(searchModel) {
    return request({
      url: '/stock/list',
      method: 'get',
      params: {
        goodsName: searchModel.goodsName,
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize
      }
    })
  },
  addStock(stock) {
    return request({
      url: '/stock',
      method: 'post',
      data: stock
    })
  },
  updateStock(stock) {
    return request({
      url: '/stock',
      method: 'put',
      data: stock
    })
  },
  saveStock(stock) {
    if (stock.stockId == null) {
      return this.addStock(stock)
    }
    return this.updateStock(stock)
  },
  getStockById(id) {
    return request({
      url: `/stock/${id}`,
      method: 'get'
    })
  },
  deleteStockById(id) {
    return request({
      url: `/stock/${id}`,
      method: 'delete'
    })
  },
  getAllStockList() {
    return request({
      url: '/stock/all',
      method: 'get'
    })
  }
}
