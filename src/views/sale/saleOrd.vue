<template>
  <div>
    <el-card id="search">
      <el-row>
        <el-col :span="18">
          <el-input v-model="searchModel.saleNum" clearable placeholder="销售订单号" />
          <el-button icon="el-icon-search" round type="primary" @click="getSaleList">查询</el-button>
        </el-col>
        <el-col :span="6" align="right">
          <el-button circle icon="el-icon-plus" type="primary" @click="openEditUI(null)" />
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-table :data="saleList" stripe style="width: 100%">
        <el-table-column label="#" type="index" width="80">
          <template slot-scope="scope">
            {{ (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="销售单编号" prop="saleId" width="120" />
        <el-table-column label="销售订单号" prop="saleNum" width="160" />
        <el-table-column label="销售单创建日期" prop="createdDate" width="180" />
        <el-table-column label="销售员名称" prop="samName" width="140" />
        <el-table-column label="描述" prop="description" />
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              circle
              icon="el-icon-edit"
              size="mini"
              type="primary"
              @click="openEditUI(scope.row.saleId)"
            />
            <el-button
              circle
              icon="el-icon-delete"
              size="mini"
              type="danger"
              @click="deleteSale(scope.row)"
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
      <el-form ref="saleForm" :model="saleForm" :rules="rules" label-width="100px">
        <el-form-item label="销售时间" prop="createdDate">
          <el-date-picker
            v-model="saleForm.createdDate"
            placeholder="选择日期时间"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="saleForm.description" />
        </el-form-item>
      </el-form>
      <el-col :span="4">
        <el-button plain style="margin-bottom: 10px" type="primary" @click="clickAdd">添加销售商品信息</el-button>
      </el-col>
      <el-table :data="saleForm.saleOrderSubList" border stripe style="width: 100%">
        <el-table-column label="#" type="index" width="96" />
        <el-table-column
          label="商品名称"
          prop="goodsName"
          width="240"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.goodsId"
              placeholder="请选择"
              @change="changeGoodsSelect(scope.row, scope.$index)"
            >
              <el-option
                v-for="itemG in optionGoods"
                :key="itemG.goodsId"
                :label="itemG.goodsName"
                :value="itemG.goodsId"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="数量"
          prop="goodsNum"
          width="240"
        >
          <template slot-scope="scope">
            <el-input v-model="saleForm.saleOrderSubList[scope.$index].goodsNum" placeholder="请输入商品数量" />
          </template>
        </el-table-column>
        <el-table-column
          label="商品单价"
          prop="sellingPrice"
          width="240"
        >
          <template slot-scope="scope">
            <el-input v-model="saleForm.saleOrderSubList[scope.$index].sellingPrice" placeholder="请输入商品单价" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="50px">
          <template slot-scope="scope">
            <el-tooltip
              :enterable="false"
              content="删除"
              effect="dark"
              placement="top"
            >
              <el-button
                circle
                icon="el-icon-delete"
                size="mini"
                type="danger"
                @click="deleteSubRow(scope.$index)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSale">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import saleApi from '@/api/saleManage'
import goodsApi from '@/api/goodsManage'

export default {
  data() {
    return {
      formLabelWidth: '130px',
      saleForm: {
        saleOrderSubList: []
      },
      dialogFormVisible: false,
      title: '',
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      saleList: [],
      optionGoods: [],
      total: 0,
      rules: {}
    }
  },
  created() {
    this.getSaleList()
    this.getAllGoodsList()
  },
  methods: {
    deleteSale(sale) {
      this.$confirm(`此操作将删除销售订单 ${sale.saleNum} , 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        saleApi.deleteSaleById(sale.saleId).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.dialogFormVisible = false
          this.getSaleList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    saveSale() {
      saleApi.saveSale(this.saleForm).then(response => {
        this.$message({
          message: response.message,
          type: 'success'
        })
        this.dialogFormVisible = false
        this.getSaleList()
      })
    },
    clearForm() {
      this.saleForm = {}
      this.saleForm.saleOrderSubList = []
      this.$refs.saleForm.clearValidate()
    },
    openEditUI(id) {
      if (id == null) {
        this.title = '新增销售单'
      } else {
        this.title = '修改销售单'
        saleApi.getSaleById(id).then(response => {
          this.saleForm = response.data
        })
      }
      this.dialogFormVisible = true
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize
      this.getSaleList()
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo
      this.getSaleList()
    },
    clickAdd() {
      this.saleForm.saleOrderSubList.push({
        goodsId: '',
        goodsName: '',
        goodsNum: 0,
        sellingPrice: 0
      })
    },
    getSaleList() {
      saleApi.getSaleList(this.searchModel).then(response => {
        this.saleList = response.data.rows
        this.total = response.data.total
      })
    },
    getAllGoodsList() {
      goodsApi.getAllGoodsList().then(response => {
        this.optionGoods = response.data
      })
    },
    changeGoodsSelect(itemG, index) {
      const goodsId = itemG.goodsId
      goodsApi.getGoodsById(goodsId).then(response => {
        this.saleForm.saleOrderSubList[index].goodsId = response.data.goodsId
        this.saleForm.saleOrderSubList[index].goodsName = response.data.goodsName
        this.saleForm.saleOrderSubList[index].sellingPrice = response.data.sellingPrice
      })
    },
    deleteSubRow(index) {
      this.saleForm.saleOrderSubList.splice(index, 1)
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
