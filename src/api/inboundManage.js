import request from '@/utils/request'

export default {
  getInboundList(searchModel) {
    return request({
      url: '/purInbound/list',
      method: 'get',
      params: {
        inboundCode: searchModel.inboundCode,
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize
      }
    })
  },
  addInbound(inbound) {
    return request({
      url: '/purInbound',
      method: 'post',
      data: inbound
    })
  },
  updateInbound(inbound) {
    return request({
      url: '/purInbound',
      method: 'put',
      data: inbound
    })
  },
  saveInbound(inbound) {
    if (inbound.inboundId == null) {
      return this.addInbound(inbound)
    }
    return this.updateInbound(inbound)
  },
  getInboundById(id) {
    return request({
      url: `/purInbound/${id}`,
      method: 'get'
    })
  },
  deleteInboundById(id) {
    return request({
      url: `/purInbound/${id}`,
      method: 'delete'
    })
  },
  getAllInboundList() {
    return request({
      url: '/purInbound/all',
      method: 'get'
    })
  }
}
