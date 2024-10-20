<template>
  <div>
    <el-card id="search">
      <el-row>
        <el-col :span="18">
          <el-input v-model="searchModel.goodsName" clearable placeholder="商品名称"/>
          <el-button icon="el-icon-search" round type="primary" @click="getStockList">查询</el-button>
        </el-col>
        <el-col :span="6" align="right">
          <el-button circle icon="el-icon-plus" type="primary" @click="openEditUI(null)"/>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-table :data="stockList" stripe style="width: 100%">
        <el-table-column label="#" width="80">
          <template slot-scope="scope">
            {{ (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="仓库编号" prop="stockId" width="120"/>
        <el-table-column label="商品编号" prop="goodsId" width="120"/>
        <el-table-column label="商品名称" prop="goodsName" width="180"/>
        <el-table-column label="库存数量" prop="stockNum" width="120"/>
        <el-table-column label="销售数量" prop="saleNum" width="120"/>
        <el-table-column label="标准卖价" prop="sellingPrice" width="120"/>
        <el-table-column label="生产日期" prop="manuFacDate" width="180"/>
        <el-table-column label="商品有效期" prop="validityDate"/>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              circle
              icon="el-icon-edit"
              size="mini"
              type="primary"
              @click="openEditUI(scope.row.stockId)"
            />
            <el-button
              circle
              icon="el-icon-delete"
              size="mini"
              type="danger"
              @click="deleteStock(scope.row)"
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
      <el-form ref="stockFormRef" :model="stockForm" :rules="rules">
        <el-form-item :label-width="formLabelWidth" label="商品名称" prop="goodsName">
          <el-select v-model="stockForm" placeholder="请选择" value-key="goodsId" @change="changeSelect">
            <el-option
              v-for="item in options"
              :key="item.goodsId"
              :label="item.goodsName"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="库存数量" prop="stockNum">
          <el-input v-model="stockForm.stockNum" autocomplete="off"/>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="销售数量" prop="saleNum">
          <el-input v-model="stockForm.saleNum" autocomplete="off"/>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="生产日期" prop="manuFacDate">
          <el-date-picker
            v-model="stockForm.manuFacDate"
            placeholder="选择日期时间"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="商品有效期" prop="validityDate">
          <el-input v-model="stockForm.validityDate" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveStock">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import stockApi from '@/api/stockManage'
import goodsApi from '@/api/goodsManage'

export default {
  data() {
    return {
      formLabelWidth: '130px',
      stockForm: {},
      dialogFormVisible: false,
      title: '',
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      stockList: [],
      options: [],
      total: 0,
      rules: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        stockNum: [
          { required: true, message: '请输入库存数量', trigger: 'blur' }
        ],
        saleNum: [
          { required: true, message: '请输入销售数量', trigger: 'blur' }
        ],
        manuFacDate: [
          { required: true, message: '请输入生产日期', trigger: 'blur' }
        ],
        validityDate: [
          { required: true, message: '请输入商品有效期', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getStockList()
    this.getAllGoodsList()
  },
  methods: {
    deleteStock(stock) {
      this.$confirm(`此操作将删除商品 ${stock.goodsName} 库存信息, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        stockApi.deleteStockById(stock.stockId).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.dialogFormVisible = false
          this.getStockList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    saveStock() {
      this.$refs.stockFormRef.validate((valid) => {
        if (valid) {
          stockApi.saveStock(this.stockForm).then(response => {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.dialogFormVisible = false
            this.getStockList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    clearForm() {
      this.stockForm = {}
      this.$refs.stockFormRef.clearValidate()
    },
    openEditUI(id) {
      if (id == null) {
        this.title = '新增库存'
      } else {
        this.title = '修改库存'
        stockApi.getStockById(id).then(response => {
          this.stockForm = response.data
        })
      }
      this.dialogFormVisible = true
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize
      this.getStockList()
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo
      this.getStockList()
    },
    getStockList() {
      stockApi.getStockList(this.searchModel).then(response => {
        this.stockList = response.data.rows
        this.total = response.data.total
      })
    },
    getAllGoodsList() {
      goodsApi.getAllGoodsList().then(response => {
        this.options = response.data
      })
    },
    changeSelect(item) {
      this.stockForm.goodsId = item.goodsId
      this.stockForm.sellingPrice = item.sellingPrice
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
