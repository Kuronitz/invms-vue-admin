<template>
  <div class="dashboard-container">
    <div class="info-container">
      <el-card>
        <div id="dataRegion" ref="dataRef" style="width: 1000px;height:400px;" />
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import stockApi from '@/api/stockManage'

export default {
  data() {
    return {
      name: 'Dashboard',
      computed: {
        ...mapGetters([
          'name'
        ])
      },
      myChart: null,
      searchModel: {
        goodsName: '',
        pageNo: 1,
        pageSize: 10
      },
      stockList: []
    }
  },
  mounted() {
    this.initChart()
    this.getStockData()
  },
  methods: {
    initChart() {
      this.myChart = this.$echarts.init(this.$refs.dataRef)
    },
    getStockData() {
      stockApi.getAllStockList().then(response => {
        this.stockList = response.data
        this.drawCharts()
      })
    },
    drawCharts() {
      const option = {
        title: {
          text: '商品库存情况'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['库存', '销量']
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          splitLine: { show: false },
          name: ''
        },
        series: [
          {
            name: '库存',
            type: 'line',
            data: []
          },
          {
            name: '销量',
            type: 'line',
            data: []
          }
        ]
      }
      for (let i = 0; i < this.stockList.length; i++) {
        option.xAxis.data.push(this.stockList[i].goodsName)
        option.series[0].data.push(this.stockList[i].stockNum)
        option.series[1].data.push(this.stockList[i].saleNum)
      }
      this.myChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
