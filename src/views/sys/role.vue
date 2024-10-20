<template>
  <div>
    <el-card id="search">
      <el-row>
        <el-col :span="18">
          <el-input v-model="searchModel.roleName" clearable placeholder="角色名"/>
          <el-button icon="el-icon-search" round type="primary" @click="getRoleList">查询</el-button>
        </el-col>
        <el-col :span="6" align="right">
          <el-button circle icon="el-icon-plus" type="primary" @click="openEditUI(null)"/>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-table :data="roleList" stripe style="width: 100%">
        <el-table-column label="#" width="80">
          <template slot-scope="scope">
            {{ (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="角色编号" prop="roleId" width="180"/>
        <el-table-column label="角色名称" prop="roleName" width="200"/>
        <el-table-column label="角色描述" prop="roleDesc"/>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              circle
              icon="el-icon-edit"
              size="mini"
              type="primary"
              @click="openEditUI(scope.row.roleId)"
            />
            <el-button
              circle
              icon="el-icon-delete"
              size="mini"
              type="danger"
              @click="deleteRole(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination
      :current-page="searchModel.pageNo"
      :page-size="searchModel.pageSize"
      :page-sizes="[5, 10, 20, 50]"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="dialogFormVisible" @close="clearForm">
      <el-form ref="roleFormRef" :model="roleForm" :rules="rules">
        <el-form-item :label-width="formLabelWidth" label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" autocomplete="off"/>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc" autocomplete="off"/>
        </el-form-item>

        <el-form-item
          :label-width="formLabelWidth"
          label="权限设置"
          prop="menuIdList"
        >
          <el-tree
            ref="menuRef"
            :data="menuIdList"
            :props="menuProps"
            default-expand-all
            node-key="menuId"
            show-checkbox
            style="width:85%"
          />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import roleApi from '@/api/roleManage'
import menuApi from '@/api/menuManage'

export default {
  data() {
    return {
      menuIdList: [],
      menuProps: {
        children: 'children',
        label: 'title'
      },
      formLabelWidth: '130px',
      roleForm: {},
      dialogFormVisible: false,
      title: '',
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      roleList: [],
      total: 0,
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRoleList()
    this.getAllMenu()
  },
  methods: {
    getAllMenu() {
      menuApi.getAllMenu().then(response => {
        this.menuIdList = response.data
      })
    },
    deleteRole(role) {
      this.$confirm(`此操作将删除用户 ${role.roleName} , 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        roleApi.deleteRoleById(role.roleId).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.dialogFormVisible = false
          this.getRoleList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    saveRole() {
      this.$refs.roleFormRef.validate((valid) => {
        if (valid) {
          const checkedKeys = this.$refs.menuRef.getCheckedKeys()
          const halfCheckedKeys = this.$refs.menuRef.getHalfCheckedKeys()
          this.roleForm.menuIdList = checkedKeys.concat(halfCheckedKeys)
          roleApi.saveRole(this.roleForm).then(response => {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.dialogFormVisible = false
            this.getRoleList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    clearForm() {
      this.roleForm = {}
      this.$refs.roleFormRef.clearValidate()
      this.$refs.menuRef.setCheckedKeys([])
    },
    openEditUI(id) {
      if (id == null) {
        this.title = '新增角色'
      } else {
        this.title = '修改角色'
        roleApi.getRoleById(id).then(response => {
          this.roleForm = response.data
          this.$refs.menuRef.setCheckedKeys(response.data.menuIdList)
        })
      }
      this.dialogFormVisible = true
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize
      this.getRoleList()
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo
      this.getRoleList()
    },
    getRoleList() {
      roleApi.getRoleList(this.searchModel).then(response => {
        this.roleList = response.data.rows
        this.total = response.data.total
      })
    }
  }
}
</script>

<style>
#search .el-input {
  width: 200px;
  margin-right: 10px;
}

.el-dialog .el-input {
  width: 85%;
}
</style>
