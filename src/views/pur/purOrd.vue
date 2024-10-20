<template>
  <div>
    <el-card id="search">
      <el-row>
        <el-col :span="18">
          <el-input v-model="searchModel.purchaseNum" clearable placeholder="采购单单号" />
          <el-button icon="el-icon-search" round type="primary" @click="getPurchaseList">查询</el-button>
        </el-col>
        <el-col :span="6" align="right">
          <el-button circle icon="el-icon-plus" type="primary" @click="openEditUI(null)" />
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-table :data="purchaseList" stripe style="width: 100%">
        <el-table-column label="#" type="index" width="80">
          <template slot-scope="scope">
            {{ (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="采购单编号" prop="purchaseId" width="120" />
        <el-table-column label="采购单单号" prop="purchaseNum" width="160" />
        <el-table-column label="采购单创建日期" prop="createdDate" width="180" />
        <el-table-column label="采购员名称" prop="merName" width="140" />
        <el-table-column label="状态" prop="status" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1">已入库</el-tag>
            <el-tag v-else type="danger">未入库</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description" />
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              circle
              icon="el-icon-edit"
              size="mini"
              type="primary"
              @click="openEditUI(scope.row.purchaseId)"
            />
            <el-button
              circle
              icon="el-icon-delete"
              size="mini"
              type="danger"
              @click="deletePurchase(scope.row)"
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
      <el-col :span="4">
        <el-button plain style="margin-bottom: 10px" type="primary" @click="clickAdd">添加采购商品信息</el-button>
      </el-col>
      <el-table :data="purchaseForm.purOrderSubList" border stripe style="width: 100%">
        <el-table-column label="#" type="index" width="80" />
        <el-table-column
          label="商品名称"
          prop="goodsName"
          width="233"
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
          label="供应商"
          prop="supplierName"
          width="233"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.supplierId"
              placeholder="请选择"
              @change="changeSupSelect(scope.row, scope.$index)"
            >
              <el-option
                v-for="itemS in optionSup"
                :key="itemS.supplierId"
                :label="itemS.supplierName"
                :value="itemS.supplierId"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="数量"
          prop="goodsNum"
          width="130"
        >
          <template slot-scope="scope">
            <el-input v-model="purchaseForm.purOrderSubList[scope.$index].goodsNum" placeholder="请输入商品数量" />
          </template>
        </el-table-column>
        <el-table-column
          label="进货价"
          prop="buyingPrice"
          width="140"
        >
          <template slot-scope="scope">
            <el-input v-model="purchaseForm.purOrderSubList[scope.$index].buyingPrice" placeholder="请输入商品进货价" />
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
        <el-button type="primary" @click="savePurchase">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import purchaseApi from '@/api/purchaseManage'
import goodsApi from '@/api/goodsManage'
import supplierApi from '@/api/supplierManage'

export default {
  data() {
    return {
      formLabelWidth: '130px',
      purchaseForm: {
        purOrderSubList: []
      },
      dialogFormVisible: false,
      title: '',
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      purchaseList: [],
      optionGoods: [],
      optionSup: [],
      total: 0,
      rules: {}
    }
  },
  created() {
    this.getPurchaseList()
    this.getAllGoodsList()
    this.getAllSupplierList()
  },
  methods: {
    deletePurchase(purchase) {
      this.$confirm(`此操作将删除采购单 ${purchase.purchaseNum} , 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        purchaseApi.deletePurchaseById(purchase.purchaseId).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.dialogFormVisible = false
          this.getPurchaseList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    savePurchase() {
      purchaseApi.savePurchase(this.purchaseForm).then(response => {
        this.$message({
          message: response.message,
          type: 'success'
        })
        this.dialogFormVisible = false
        this.getPurchaseList()
      })
    },
    clearForm() {
      this.purchaseForm = {}
      this.purchaseForm.purOrderSubList = []
    },
    openEditUI(id) {
      if (id == null) {
        this.title = '新增采购单'
      } else {
        this.title = '修改采购单'
        purchaseApi.getPurchaseById(id).then(response => {
          this.purchaseForm = response.data
        })
      }
      this.dialogFormVisible = true
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize
      this.getPurchaseList()
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo
      this.getPurchaseList()
    },
    clickAdd() {
      this.purchaseForm.purOrderSubList.push({
        goodsName: '',
        supplierName: '',
        goodsNum: 0,
        buyingPrice: 0
      })
    },
    getPurchaseList() {
      purchaseApi.getPurchaseList(this.searchModel).then(response => {
        this.purchaseList = response.data.rows
        this.total = response.data.total
      })
    },
    getAllGoodsList() {
      goodsApi.getAllGoodsList().then(response => {
        this.optionGoods = response.data
      })
    },
    getAllSupplierList() {
      supplierApi.getAllSupplierList().then(response => {
        this.optionSup = response.data
      })
    },
    changeGoodsSelect(itemG, index) {
      const goodsId = itemG.goodsId
      goodsApi.getGoodsById(goodsId).then(response => {
        this.purchaseForm.purOrderSubList[index].goodsId = response.data.goodsId
        this.purchaseForm.purOrderSubList[index].goodsName = response.data.goodsName
        this.purchaseForm.purOrderSubList[index].buyingPrice = response.data.buyingPrice
      })
    },
    changeSupSelect(itemS, index) {
      const supplierId = itemS.supplierId
      supplierApi.getSupplierById(supplierId).then(response => {
        this.purchaseForm.purOrderSubList[index].supplierId = response.data.supplierId
        this.purchaseForm.purOrderSubList[index].supplierName = response.data.supplierName
      })
    },
    deleteSubRow(index) {
      this.purchaseForm.purOrderSubList.splice(index, 1)
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
