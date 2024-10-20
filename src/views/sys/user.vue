<template>
  <div>
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchModel.username" clearable placeholder="用户名"/>
          <el-input v-model="searchModel.phone" clearable placeholder="电话"/>
          <el-button icon="el-icon-search" round type="primary" @click="getUserList">查询</el-button>
        </el-col>
        <el-col :span="4" align="right">
          <el-button circle icon="el-icon-plus" type="primary" @click="openEditUI(null)"/>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-table :data="userList" stripe style="width: 100%">
        <el-table-column label="#" width="100">
          <template slot-scope="scope">
            {{ (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="用户ID" prop="id" width="100"/>
        <el-table-column label="用户名" prop="username" width="200"/>
        <el-table-column label="电话" prop="phone" width="200"/>
        <el-table-column label="用户状态" prop="status" width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1">正常</el-tag>
            <el-tag v-else type="danger">停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="电子邮箱" prop="email"/>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              circle
              icon="el-icon-edit"
              size="mini"
              type="primary"
              @click="openEditUI(scope.row.id)"
            />
            <el-button
              circle
              icon="el-icon-delete"
              size="mini"
              type="danger"
              @click="deleteUser(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination
      :current-page="searchModel.pageNo"
      :page-size="searchModel.pageSize"
      :page-sizes="[10, 20, 50, 80]"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog :title="title" :visible.sync="dialogFormVisible" @close="clearForm">
      <el-form ref="userFormRef" :model="userForm" :rules="rules">
        <el-form-item :label-width="formLabelWidth" label="用户名" prop="username">
          <el-input v-model="userForm.username" autocomplete="off"/>
        </el-form-item>
        <el-form-item
          v-if="userForm.id == null || false"
          :label-width="formLabelWidth"
          label="登录密码"
          prop="password"
        >
          <el-input v-model="userForm.password" autocomplete="off" type="password"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="联系电话">
          <el-input v-model="userForm.phone" autocomplete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="用户状态">
          <el-switch
            v-model="userForm.status"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="用户角色">
          <el-checkbox-group
            v-model="userForm.roleIdList"
            :max="2"
            style="width: 85%"
          >
            <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleDesc }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="电子邮箱" prop="email">
          <el-input v-model="userForm.email" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userApi from '@/api/userManage'
import roleApi from '@/api/roleManage'

export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      var reg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/
      if (!reg.test(value)) {
        return callback(new Error('邮箱格式错误'))
      }
      callback()
    }
    return {
      roleList: [],
      formLabelWidth: '130px',
      userForm: {
        roleIdList: []
      },
      dialogFormVisible: false,
      title: '',
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      userList: [],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录初始密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入电子邮箱地址', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
    this.getAllRoleList()
  },
  methods: {
    getAllRoleList() {
      roleApi.getAllRoleList().then(response => {
        this.roleList = response.data
      })
    },
    deleteUser(user) {
      this.$confirm(`此操作将删除用户 ${user.username} , 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userApi.deleteUserById(user.id).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.getUserList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    saveUser() {
      this.$refs.userFormRef.validate((valid) => {
        if (valid) {
          userApi.saveUser(this.userForm).then(response => {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.dialogFormVisible = false
            this.getUserList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    clearForm() {
      this.userForm = {
        roleIdList: []
      }
      this.$refs.userFormRef.clearValidate()
    },
    openEditUI(id) {
      if (id == null) {
        this.title = '新建用户'
      } else {
        this.title = '修改用户'
        userApi.getUserById(id).then(response => {
          this.userForm = response.data
        })
      }

      this.dialogFormVisible = true
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize
      this.getUserList()
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo
      this.getUserList()
    },
    getUserList() {
      userApi.getUserList(this.searchModel).then(response => {
        this.userList = response.data.rows
        this.total = response.data.total
      })
    }
  }
}
</script>

<style scoped>
#search .el-input {
  width: 200px;
  margin-right: 10px;
}

.el-dialog .el-input {
  width: 85%;
}
</style>
