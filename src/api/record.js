// src/api/record.js
import request from '@/utils/request';

// 新增刷题记录
const submitAnswerRecord = (data) => {
  return request.post('/record', data);
};

// 更新刷题记录
const updateUserRecord = (data) => {
  return request.put('/record', data);
};

// 获取刷题记录详情
const getRecordById = (recordId) => {
  return request.get(`/record/${recordId}`);
};

// 查询用户所有刷题记录
const getUserRecords = () => {
  return request.get('/record/user/');
};

// 分页查询用户刷题记录
const getUserRecordsPage = (page = 1, size = 5) => {
  return request.get(`/record/user/page?page=${page}&size=${size}`);
};

export default {
  submitAnswerRecord,  // 确保名字一致
  updateUserRecord,
  getRecordById,
  getUserRecords,
  getUserRecordsPage,
};
