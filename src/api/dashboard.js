import request from '@/utils/request';

/**
 * 获取图表数据
 * @returns {Promise} 返回图表数据（题型占比与语言占比）
 */
export const getCharts = () => {
  return request.get('/platform/charts');
};
