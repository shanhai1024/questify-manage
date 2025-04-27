// src/api/labels.js
import request from '@/utils/request'; // 使用统一封装的 request 实例

// 添加标签
const addLabel = (data) => {
  return request.post('/labels', data);
};

// 获取标签（通过标签 ID）
const getLabelById = (labelId) => {
  return request.get(`/labels/${labelId}`);
};

// 更新标签
const updateLabel = (data) => {
  return request.put('/labels', data);
};

// 导出标签相关方法
export default {
  addLabel,
  getLabelById,
  updateLabel,
};
