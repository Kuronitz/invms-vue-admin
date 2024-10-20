import request from '@/utils/request'

export default {
  getRoleList(searchModel) {
    return request({
      url: '/role/list',
      method: 'get',
      params: {
        roleName: searchModel.roleName,
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize
      }
    })
  },
  addRole(role) {
    return request({
      url: '/role',
      method: 'post',
      data: role
    })
  },
  updateRole(role) {
    return request({
      url: '/role',
      method: 'put',
      data: role
    })
  },
  saveRole(role) {
    if (role.roleId == null) {
      return this.addRole(role)
    }
    return this.updateRole(role)
  },
  getRoleById(id) {
    return request({
      url: `/role/${id}`,
      method: 'get'
    })
  },
  deleteRoleById(id) {
    return request({
      url: `/role/${id}`,
      method: 'delete'
    })
  },
  getAllRoleList() {
    return request({
      url: '/role/all',
      method: 'get'
    })
  }
}
