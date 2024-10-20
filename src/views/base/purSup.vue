<template>
  <div>
    <el-card id="search">
      <el-row>
        <el-col :span="18">
          <el-input v-model="searchModel.supplierName" clearable placeholder="供应商名称"/>
          <el-button icon="el-icon-search" round type="primary" @click="getSupplierList">查询</el-button>
        </el-col>
        <el-col :span="6" align="right">
          <el-button circle icon="el-icon-plus" type="primary" @click="openEditUI(null)"/>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-table :data="supplierList" stripe style="width: 100%">
        <el-table-column label="#" width="80">
          <template slot-scope="scope">
            {{ (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="供应商编号" prop="supplierId" width="100"/>
        <el-table-column label="供应商名称" prop="supplierName" width="160"/>
        <el-table-column label="联系人" prop="contactName" width="100"/>
        <el-table-column label="联系人手机" prop="contactPhone" width="140"/>
        <el-table-column label="供应商联系地址" prop="contactAddress" width="200"/>
        <el-table-column label="供应商状态" prop="status" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1">正常</el-tag>
            <el-tag v-else type="danger">停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description"/>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              circle
              icon="el-icon-edit"
              size="mini"
              type="primary"
              @click="openEditUI(scope.row.supplierId)"
            />
            <el-button
              circle
              icon="el-icon-delete"
              size="mini"
              type="danger"
              @click="deleteSupplier(scope.row)"
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
      <el-form ref="supplierFormRef" :model="supplierForm" :rules="rules">
        <el-form-item :label-width="formLabelWidth" label="供应商名称" prop="supplierName">
          <el-input v-model="supplierForm.supplierName" autocomplete="off"/>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="联系人" prop="contactName">
          <el-input v-model="supplierForm.contactName" autocomplete="off"/>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="联系人手机" prop="contactPhone">
          <el-input v-model="supplierForm.contactPhone" autocomplete="off"/>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="供应商联系地址" prop="contactAddress">
          <el-input v-model="supplierForm.contactAddress" autocomplete="off"/>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="供应商状态" prop="status">
          <el-switch
            v-model="supplierForm.status"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="描述" prop="description">
          <el-input v-model="supplierForm.description" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSupplier">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import supplierApi from '@/api/supplierManage'

export default {
  data() {
    return {
      formLabelWidth: '130px',
      supplierForm: {},
      dialogFormVisible: false,
      title: '',
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      supplierList: [],
      total: 0,
      rules: {
        supplierName: [
          { required: true, message: '请输入供应商名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '请输入联系人手机', trigger: 'blur' }
        ],
        contactAddress: [
          { required: true, message: '请输入供应商联系地址', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getSupplierList()
  },
  methods: {
    deleteSupplier(supplier) {
      this.$confirm(`此操作将删除供应商 ${supplier.supplierName} , 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        supplierApi.deleteSupplierById(supplier.supplierId).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.dialogFormVisible = false
          this.getSupplierList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    saveSupplier() {
      this.$refs.supplierFormRef.validate((valid) => {
        if (valid) {
          supplierApi.saveSupplier(this.supplierForm).then(response => {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.dialogFormVisible = false
            this.getSupplierList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    clearForm() {
      this.supplierForm = {}
      this.$refs.supplierFormRef.clearValidate()
    },
    openEditUI(id) {
      if (id == null) {
        this.title = '新增供应商'
      } else {
        this.title = '修改供应商'
        supplierApi.getSupplierById(id).then(response => {
          this.supplierForm = response.data
        })
      }
      this.dialogFormVisible = true
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize
      this.getSupplierList()
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo
      this.getSupplierList()
    },
    getSupplierList() {
      supplierApi.getSupplierList(this.searchModel).then(response => {
        this.supplierList = response.data.rows
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
