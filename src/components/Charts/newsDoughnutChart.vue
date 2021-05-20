<template>
  <div class="DoughnutChart"></div>
</template>

<script>
  import echarts from 'echarts'

  require('echarts/theme/macarons') // echarts theme

  export default {
    name: 'DoughnutChart',
    data() {
      return {
        doughnut_chart: {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '5%',
            left: 'center'
          },
          series: [
            {
              name: '人工检测',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '40',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: [
                {
                  value: null,
                  name: '中立',
                  itemStyle: {
                    color: '#98a8f1'
                  }
                },
                {
                  value: null,
                  name: '虚假',
                  itemStyle: {
                    color: '#98DAE3'
                  }
                },
                {
                  value: null,
                  name: '真实',
                  itemStyle: {
                    color: '#FAE397'
                  }
                }
              ]
            }
          ]
        }
      }
    },
    mounted() {
      this.getDewsDoughnutChart()
    },
    // 每次销毁前清空
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      getDewsDoughnutChart() {
        this.$store.dispatch('charts/newsDoughnutChart').then((res) => {
          let news_doughnut_data = res.data.news_doughnut_data
          this.doughnut_chart.series[0].data[0].value = news_doughnut_data.n_count
          this.doughnut_chart.series[0].data[1].value = news_doughnut_data.f_count
          this.doughnut_chart.series[0].data[2].value = news_doughnut_data.r_count
          this.initChart()
        })
      },
      initChart() {
        this.chart = echarts.init(this.$el, 'light')
        this.chart.setOption(this.doughnut_chart)
        let _this = this
        window.onresize = function() {
          _this.chart.resize()
        }
      }
    }
  }
</script>

<style scoped>
  .DoughnutChart {
    /*width: 100%;*/
    width: 300px;
    height: 300px;
    margin: 0 auto
  }

</style>
