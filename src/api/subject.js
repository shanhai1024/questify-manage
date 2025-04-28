import request from '@/utils/request';

/**
 * 获取指定分类的题目列表
 * @param {number} categoryId - 分类ID
 * @param {number} pageNum - 当前页码
 * @param {number} pageSize - 每页数量
 * @returns {Promise} - 返回请求结果
 */
const getSubjectList = (categoryId, pageNum, pageSize) => {
  return request.get('/subject/page', {
    params: { categoryId, pageNum, pageSize }
  });
};

/**
 * 获取指定类型的题目列表
 * @param {number} type - 题目类型（1: 单选题, 2: 多选题, 3: 判断题, 4: 简答题）
 * @param {number} pageNum - 当前页码
 * @param {number} pageSize - 每页数量
 * @returns {Promise} - 返回请求结果
 */
const getAllByType = (type, pageNum, pageSize) => {
  return request.get('/subject/getAllByType', {
    params: { type, pageNum, pageSize }
  });
};

/**
 * 删除指定类型的题目
 * @param {number} type - 题目类型（1: 单选题, 2: 多选题, 3: 判断题, 4: 简答题）
 * @param {number} id - 题目 ID
 * @returns {Promise} - 返回请求结果
 */
const deleteByType = (type, id) => {
  return request.delete('/subject/deleteByType', {
    params: { type, id }  // 发送请求时附带 type 和 id 参数
  });
};

/**
 * 更新题目
 * @param {number} type - 题目类型（1: 单选题, 2: 多选题, 3: 判断题, 4: 简答题）
 * @param {Object} data - 题目更新数据，符合 QuestionUpdateRequest 结构
 * @returns {Promise} - 返回请求结果
 */
const updateSubject = (type, data) => {
  return request.put(`/subject/update?type=${type}`, data);
};

export default {
  getSubjectList,
  getAllByType,
  deleteByType,
  updateSubject
};
