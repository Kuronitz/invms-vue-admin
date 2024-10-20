<template>
  <div>
    <el-card id="search">
      <el-row>
        <el-col :span="18">
          <el-input v-model="searchModel.outboundCode" clearable placeholder="出库编码" />
          <el-button icon="el-icon-search" round type="primary" @click="getOutboundList">查询</el-button>
        </el-col>
        <el-col :span="6" align="right">
          <el-button circle icon="el-icon-plus" type="primary" @click="openEditUI(null)" />
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-table :data="outboundList" stripe style="width: 100%">
        <el-table-column label="#" type="index" width="80">
          <template slot-scope="scope">
            {{ (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="出库编号" prop="outboundId" width="120" />
        <el-table-column label="出库编码" prop="outboundCode" width="160" />
        <el-table-column label="出库时间" prop="outboundDate" width="180" />
        <el-table-column label="仓管名称" prop="stkName" width="140" />
        <el-table-column label="描述" prop="description" />
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              circle
              icon="el-icon-edit"
              size="mini"
              type="primary"
              @click="openEditUI(scope.row.outboundId)"
            />
            <el-button
              circle
              icon="el-icon-delete"
              size="mini"
              type="danger"
              @click="deleteOutbound(scope.row)"
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
      <el-form ref="outboundForm" :model="outboundForm" :rules="rules" label-width="100px">
        <el-form-item label="出库时间" prop="outboundDate">
          <el-date-picker
            v-model="outboundForm.outboundDate"
            placeholder="选择日期时间"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="outboundForm.description" />
        </el-form-item>
      </el-form>
      <el-col :span="4">
        <el-button plain style="margin-bottom: 10px" type="primary" @click="clickAdd">添加出库商品信息</el-button>
      </el-col>
      <el-table :data="outboundForm.saleOutboundSubList" border stripe style="width: 100%">
        <el-table-column label="#" type="index" width="94" />
        <el-table-column
          label="商品名称"
          prop="goodsName"
          width="190"
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
          width="190"
        >
          <template slot-scope="scope">
            <el-input v-model="outboundForm.saleOutboundSubList[scope.$index].goodsOutNum" />
          </template>
        </el-table-column>
        <el-table-column
          label="商品单位"
          prop="goodsUnit"
          width="161"
        >
          <template slot-scope="scope">
            <el-input v-model="outboundForm.saleOutboundSubList[scope.$index].goodsUnit" />
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
        <el-button type="primary" @click="saveOutbound">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import outboundApi from '@/api/outboundManage'
import goodsApi from '@/api/goodsManage'

export default {
  data() {
    return {
      formLabelWidth: '130px',
      outboundForm: {
        saleOutboundSubList: []
      },
      dialogFormVisible: false,
      title: '',
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      outboundList: [],
      optionGoods: [],
      total: 0,
      rules: {}
    }
  },
  created() {
    this.getOutboundList()
    this.getAllGoodsList()
  },
  methods: {
    deleteOutbound(outbound) {
      this.$confirm(`此操作将删除出库编码 ${outbound.outboundCode} 的信息, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        outboundApi.deleteOutboundById(outbound.outboundId).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.dialogFormVisible = false
          this.getOutboundList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    saveOutbound() {
      outboundApi.saveOutbound(this.outboundForm).then(response => {
        this.$message({
          message: response.message,
          type: 'success'
        })
        this.dialogFormVisible = false
        this.getOutboundList()
      })
    },
    clearForm() {
      this.outboundForm = {}
      this.outboundForm.saleOutboundSubList = []
      this.$refs.outboundForm.clearValidate()
    },
    openEditUI(id) {
      if (id == null) {
        this.title = '新增出库'
      } else {
        this.title = '修改出库'
        outboundApi.getOutboundById(id).then(response => {
          this.outboundForm = response.data
        })
      }
      this.dialogFormVisible = true
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize
      this.getOutboundList()
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo
      this.getOutboundList()
    },
    clickAdd() {
      this.outboundForm.saleOutboundSubList.push({
        goodsName: '',
        goodsType: '',
        goodsOutNum: 0,
        goodsUnit: ''
      })
    },
    getOutboundList() {
      outboundApi.getOutboundList(this.searchModel).then(response => {
        this.outboundList = response.data.rows
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
        this.outboundForm.saleOutboundSubList[index].goodsId = response.data.goodsId
        this.outboundForm.saleOutboundSubList[index].goodsName = response.data.goodsName
        this.outboundForm.saleOutboundSubList[index].goodsType = response.data.goodsType
        this.outboundForm.saleOutboundSubList[index].goodsUnit = response.data.goodsUnit
      })
    },
    deleteSubRow(index) {
      this.outboundForm.saleOutboundSubList.splice(index, 1)
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
  width: 40%;
}
</style>
