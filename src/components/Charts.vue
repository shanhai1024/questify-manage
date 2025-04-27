<template>
  <el-card class="charts-card" shadow="never" :body-style="bodyStyle">
    <div class="chart-container">
      <!-- 题型占比饼图 -->
      <div ref="typeChart" class="chart"></div>
      <!-- 语言占比饼图 -->
      <div ref="langChart" class="chart"></div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { getCharts } from '@/api/dashboard';
import * as echarts from 'echarts';

const typeChart = ref(null);
const langChart = ref(null);

/**
 * 获取数据并渲染图表
 */
const fetchDataAndRenderCharts = async () => {
  try {
    const { data } = await getCharts();

    // 确保 DOM 元素渲染完毕后再初始化 ECharts
    nextTick(() => {
      // 初始化题型占比图表
      const typeChartInstance = echarts.init(typeChart.value);
      typeChartInstance.setOption({
        title: {
          text: '题型占比',
          left: 'center',
          textStyle: {
            color: document.body.getAttribute('data-theme') === 'dark' ? '#fff' : '#000',
          }
        },
        tooltip: {
          trigger: 'item',
          textStyle: {
            color: document.body.getAttribute('data-theme') === 'dark' ? '#fff' : '#000',
          }
        },
        backgroundColor: document.body.getAttribute('data-theme') === 'dark' ? '#2c2c2c' : '#fff',
        series: [
          {
            type: 'pie',
            radius: '70%',
            data: data.type,
            label: {
              formatter: '{b}: {d}%',
              color: document.body.getAttribute('data-theme') === 'dark' ? '#fff' : '#000',
            },
            itemStyle: {
              borderColor: document.body.getAttribute('data-theme') === 'dark' ? '#333' : '#ddd',
              borderWidth: 1,
            }
          },
        ],
      });

      // 初始化语言占比图表
      const langChartInstance = echarts.init(langChart.value);
      langChartInstance.setOption({
        title: {
          text: '语言占比',
          left: 'center',
          textStyle: {
            color: document.body.getAttribute('data-theme') === 'dark' ? '#fff' : '#000',
          }
        },
        tooltip: {
          trigger: 'item',
          textStyle: {
            color: document.body.getAttribute('data-theme') === 'dark' ? '#fff' : '#000',
          }
        },
        backgroundColor: document.body.getAttribute('data-theme') === 'dark' ? '#2c2c2c' : '#fff',
        series: [
          {
            type: 'pie',
            radius: '70%',
            data: data.lang,
            label: {
              formatter: '{b}: {d}%',
              color: document.body.getAttribute('data-theme') === 'dark' ? '#fff' : '#000',
            },
            itemStyle: {
              borderColor: document.body.getAttribute('data-theme') === 'dark' ? '#333' : '#ddd',
              borderWidth: 1,
            }
          },
        ],
      });
    });
  } catch (error) {
    console.error('获取数据失败:', error);
  }
};

onMounted(() => {
  fetchDataAndRenderCharts();
});
</script>

<style scoped>
.charts-card {
  border-radius: 12px;
  background: var(--el-bg-color);
  box-shadow: var(--el-box-shadow);
}

.chart-container {
  display: flex;
  gap: 24px;
  margin-top: 20px;
}

.chart {
  flex: 1;
  height: 400px;
}
</style>
