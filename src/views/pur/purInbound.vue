<template>
  <div>
    <el-card id="search">
      <el-row>
        <el-col :span="18">
          <el-input v-model="searchModel.inboundCode" clearable placeholder="入库编码" />
          <el-button icon="el-icon-search" round type="primary" @click="getInboundList">查询</el-button>
        </el-col>
        <el-col :span="6" align="right">
          <el-button circle icon="el-icon-plus" type="primary" @click="openEditUI(null)" />
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-table :data="inboundList" stripe style="width: 100%">
        <el-table-column label="#" type="index" width="80">
          <template slot-scope="scope">
            {{ (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="入库编号" prop="inboundId" width="120" />
        <el-table-column label="采购单单号" prop="purchaseNum" width="160" />
        <el-table-column label="入库编码" prop="inboundCode" width="160" />
        <el-table-column label="入库时间" prop="inboundDate" width="180" />
        <el-table-column label="仓管名称" prop="stkName" width="140" />
        <el-table-column label="描述" prop="description" />
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              circle
              icon="el-icon-edit"
              size="mini"
              type="primary"
              @click="openEditUI(scope.row.inboundId)"
            />
            <el-button
              circle
              icon="el-icon-delete"
              size="mini"
              type="danger"
              @click="deleteInbound(scope.row)"
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
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="dialogFormVisible"
      custom-class="customWidth"
      @close="clearForm"
    >
      <el-form ref="inboundForm" :model="inboundForm" :rules="rules" label-width="100px">
        <el-form-item label="订单编号" prop="purchaseNum">
          <el-select v-model="inboundForm" placeholder="请选择" value-key="purchaseId" @change="changePurchaseSelect">
            <el-option
              v-for="itemP in optionPur"
              :key="itemP.purchaseId"
              :label="itemP.purchaseNum"
              :value="itemP"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="入库时间" prop="inboundDate">
          <el-date-picker
            v-model="inboundForm.inboundDate"
            placeholder="选择日期时间"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="inboundForm.description" />
        </el-form-item>
      </el-form>
      <el-table :data="inboundForm.inboundSubList" border stripe style="width: 100%">
        <el-table-column label="#" type="index" width="120" />
        <el-table-column
          label="商品名称"
          prop="goodsName"
          width="340"
        >
          <template slot-scope="scope">
            <el-input v-model="inboundForm.inboundSubList[scope.$index].goodsName" />
          </template>
        </el-table-column>
        <el-table-column
          label="数量"
          prop="goodsNum"
          width="225"
        >
          <template slot-scope="scope">
            <el-input v-model="inboundForm.inboundSubList[scope.$index].goodsInNum" />
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveInbound">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import inboundApi from '@/api/inboundManage'
import purchaseApi from '@/api/purchaseManage'

export default {
  data() {
    return {
      formLabelWidth: '130px',
      inboundForm: {
        inboundSubList: []
      },
      dialogFormVisible: false,
      title: '',
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      inboundList: [],
      optionGoods: [],
      optionPur: [],
      total: 0,
      rules: {}
    }
  },
  created() {
    this.getInboundList()
    this.getAllPurchaseList()
  },
  methods: {
    deleteInbound(inbound) {
      this.$confirm(`此操作将删除采购单 ${inbound.purchaseNum} 的入库信息, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        inboundApi.deleteInboundById(inbound.inboundId).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.dialogFormVisible = false
          this.getInboundList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    saveInbound() {
      console.log(this.inboundForm)
      inboundApi.saveInbound(this.inboundForm).then(response => {
        this.$message({
          message: response.message,
          type: 'success'
        })
        this.dialogFormVisible = false
        this.getInboundList()
      })
    },
    clearForm() {
      this.inboundForm = {}
      this.inboundForm.inboundSubList = []
      this.$refs.inboundForm.clearValidate()
    },
    openEditUI(id) {
      if (id == null) {
        this.title = '新增入库'
      } else {
        this.title = '修改入库'
        inboundApi.getInboundById(id).then(response => {
          this.inboundForm = response.data
        })
      }
      this.dialogFormVisible = true
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize
      this.getInboundList()
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo
      this.getInboundList()
    },
    getInboundList() {
      inboundApi.getInboundList(this.searchModel).then(response => {
        this.inboundList = response.data.rows
        this.total = response.data.total
      })
    },
    getAllPurchaseList() {
      purchaseApi.getAllPurchaseList().then(response => {
        this.optionPur = response.data
      })
    },
    changePurchaseSelect(itemP) {
      const purchaseId = itemP.purchaseId
      this.inboundForm.inboundSubList = []
      purchaseApi.getPurchaseById(purchaseId).then(response => {
        const length = response.data.purOrderSubList.length
        for (let i = 0; i < length; i++) {
          this.inboundForm.inboundSubList.push({
            goodsId: 0,
            goodsName: '',
            goodsInNum: 0
          })
          this.inboundForm.inboundSubList[i].goodsId = response.data.purOrderSubList[i].goodsId
          this.inboundForm.inboundSubList[i].goodsName = response.data.purOrderSubList[i].goodsName
          this.inboundForm.inboundSubList[i].goodsInNum = response.data.purOrderSubList[i].goodsNum
        }
        this.inboundForm.purchaseNum = response.data.purOrderSubList[0].purchaseNumSub
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

.customWidth {
  width: 35%;
}
</style>
