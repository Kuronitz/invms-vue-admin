import request from '@/utils/request'

export default {
  getGoodsList(searchModel) {
    return request({
      url: '/goods/list',
      method: 'get',
      params: {
        goodsName: searchModel.goodsName,
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize
      }
    })
  },
  addGoods(goods) {
    return request({
      url: '/goods',
      method: 'post',
      data: goods
    })
  },
  updateGoods(goods) {
    return request({
      url: '/goods',
      method: 'put',
      data: goods
    })
  },
  saveGoods(goods) {
    if (goods.goodsId == null) {
      return this.addGoods(goods)
    }
    return this.updateGoods(goods)
  },
  getGoodsById(id) {
    return request({
      url: `/goods/${id}`,
      method: 'get'
    })
  },
  deleteGoodsById(id) {
    return request({
      url: `/goods/${id}`,
      method: 'delete'
    })
  },
  getAllGoodsList() {
    return request({
      url: '/goods/all',
      method: 'get'
    })
  }
}
