import request from '@/utils/request'

export default {
  getOutboundList(searchModel) {
    return request({
      url: '/saleOutbound/list',
      method: 'get',
      params: {
        outboundCode: searchModel.outboundCode,
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize
      }
    })
  },
  addOutbound(outbound) {
    return request({
      url: '/saleOutbound',
      method: 'post',
      data: outbound
    })
  },
  updateOutbound(outbound) {
    return request({
      url: '/saleOutbound',
      method: 'put',
      data: outbound
    })
  },
  saveOutbound(outbound) {
    if (outbound.outboundId == null) {
      return this.addOutbound(outbound)
    }
    return this.updateOutbound(outbound)
  },
  getOutboundById(id) {
    return request({
      url: `/saleOutbound/${id}`,
      method: 'get'
    })
  },
  deleteOutboundById(id) {
    return request({
      url: `/saleOutbound/${id}`,
      method: 'delete'
    })
  },
  getAllOutboundList() {
    return request({
      url: '/saleOutbound/all',
      method: 'get'
    })
  }
}
