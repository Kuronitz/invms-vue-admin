import request from '@/utils/request'

export default {
  getSaleList(searchModel) {
    return request({
      url: '/saleOrder/list',
      method: 'get',
      params: {
        saleNum: searchModel.saleNum,
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize
      }
    })
  },
  addSale(sale) {
    return request({
      url: '/saleOrder',
      method: 'post',
      data: sale
    })
  },
  updateSale(sale) {
    return request({
      url: '/saleOrder',
      method: 'put',
      data: sale
    })
  },
  saveSale(sale) {
    if (sale.saleId == null) {
      return this.addSale(sale)
    }
    return this.updateSale(sale)
  },
  getSaleById(id) {
    return request({
      url: `/saleOrder/${id}`,
      method: 'get'
    })
  },
  deleteSaleById(id) {
    return request({
      url: `/saleOrder/${id}`,
      method: 'delete'
    })
  },
  getAllSaleList() {
    return request({
      url: '/saleOrder/all',
      method: 'get'
    })
  }
}
