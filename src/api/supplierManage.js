import request from '@/utils/request'

export default {
  getSupplierList(searchModel) {
    return request({
      url: '/supplier/list',
      method: 'get',
      params: {
        supplierName: searchModel.supplierName,
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize
      }
    })
  },
  addSupplier(supplier) {
    return request({
      url: '/supplier',
      method: 'post',
      data: supplier
    })
  },
  updateSupplier(supplier) {
    return request({
      url: '/supplier',
      method: 'put',
      data: supplier
    })
  },
  saveSupplier(supplier) {
    if (supplier.supplierId == null) {
      return this.addSupplier(supplier)
    }
    return this.updateSupplier(supplier)
  },
  getSupplierById(id) {
    return request({
      url: `/supplier/${id}`,
      method: 'get'
    })
  },
  deleteSupplierById(id) {
    return request({
      url: `/supplier/${id}`,
      method: 'delete'
    })
  },
  getAllSupplierList() {
    return request({
      url: '/supplier/all',
      method: 'get'
    })
  }
}
