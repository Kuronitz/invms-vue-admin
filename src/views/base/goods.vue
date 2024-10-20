<template>
  <div>
    <el-card id="search">
      <el-row>
        <el-col :span="18">
          <el-input v-model="searchModel.goodsName" clearable placeholder="商品名称"/>
          <el-button icon="el-icon-search" round type="primary" @click="getGoodsList">查询</el-button>
        </el-col>
        <el-col :span="6" align="right">
          <el-button circle icon="el-icon-plus" type="primary" @click="openEditUI(null)"/>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-table :data="goodsList" stripe style="width: 100%">
        <el-table-column label="#" width="80">
          <template slot-scope="scope">
            {{ (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="商品编号" prop="goodsId" width="100"/>
        <el-table-column label="商品名称" prop="goodsName" width="150"/>
        <el-table-column label="商品编码" prop="goodsCode" width="150"/>
        <el-table-column label="商品类别" prop="goodsType" width="100"/>
        <el-table-column label="商品品牌" prop="goodsBrand" width="120"/>
        <el-table-column label="商品单位" prop="goodsUnit" width="100"/>
        <el-table-column label="标准买价" prop="buyingPrice" width="100"/>
        <el-table-column label="标准卖价" prop="sellingPrice" width="100"/>
        <el-table-column label="描述" prop="description"/>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              circle
              icon="el-icon-edit"
              size="mini"
              type="primary"
              @click="openEditUI(scope.row.goodsId)"
            />
            <el-button
              circle
              icon="el-icon-delete"
              size="mini"
              type="danger"
              @click="deleteGoods(scope.row)"
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
      <el-form ref="goodsFormRef" :model="goodsForm" :rules="rules">
        <el-form-item :label-width="formLabelWidth" label="商品名称" prop="goodsName">
          <el-input v-model="goodsForm.goodsName" autocomplete="off"/>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="商品类别" prop="goodsType">
          <el-input v-model="goodsForm.goodsType" autocomplete="off"/>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="商品品牌" prop="goodsBrand">
          <el-input v-model="goodsForm.goodsBrand" autocomplete="off"/>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="商品单位" prop="goodsUnit">
          <el-input v-model="goodsForm.goodsUnit" autocomplete="off"/>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="标准买价" prop="buyingPrice">
          <el-input v-model="goodsForm.buyingPrice" autocomplete="off"/>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="标准卖价" prop="sellingPrice">
          <el-input v-model="goodsForm.sellingPrice" autocomplete="off"/>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="描述" prop="description">
          <el-input v-model="goodsForm.description" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveGoods">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import goodsApi from '@/api/goodsManage'

export default {
  data() {
    return {
      formLabelWidth: '130px',
      goodsForm: {},
      dialogFormVisible: false,
      title: '',
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      goodsList: [],
      total: 0,
      rules: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        goodsType: [
          { required: true, message: '请输入商品类别', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        goodsBrand: [
          { required: true, message: '请输入商品品牌', trigger: 'blur' }
        ],
        goodsUnit: [
          { required: true, message: '请输入商品单位', trigger: 'blur' }
        ],
        buyingPrice: [
          { required: true, message: '请输入标准买价', trigger: 'blur' }
        ],
        sellingPrice: [
          { required: true, message: '请输入标准卖价', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    deleteGoods(goods) {
      this.$confirm(`此操作将删除商品 ${goods.goodsName} , 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        goodsApi.deleteGoodsById(goods.goodsId).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.dialogFormVisible = false
          this.getGoodsList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    saveGoods() {
      this.$refs.goodsFormRef.validate((valid) => {
        if (valid) {
          goodsApi.saveGoods(this.goodsForm).then(response => {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.dialogFormVisible = false
            this.getGoodsList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    clearForm() {
      this.goodsForm = {}
      this.$refs.goodsFormRef.clearValidate()
    },
    openEditUI(id) {
      if (id == null) {
        this.title = '新增商品'
      } else {
        this.title = '修改商品'
        goodsApi.getGoodsById(id).then(response => {
          this.goodsForm = response.data
        })
      }
      this.dialogFormVisible = true
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize
      this.getGoodsList()
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo
      this.getGoodsList()
    },
    getGoodsList() {
      goodsApi.getGoodsList(this.searchModel).then(response => {
        this.goodsList = response.data.rows
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
