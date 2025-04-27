// src/api/userLearningCategory.js
import request from '@/utils/request';

/**
 * 新增用户学习分类记录
 * @param {Object} data - 用户学习分类记录
 * @returns {Promise} 返回请求结果
 */
const createUserLearningCategory = (data) => {
  return request.post('/learning/category', data);
};

/**
 * 更新用户学习分类记录
 * @param {Object} data - 用户学习分类记录
 * @returns {Promise} 返回请求结果
 */
const updateUserLearningCategory = (data) => {
  return request.put('/learning/category', data);
};

/**
 * 删除用户学习分类记录
 * @param {number} id - 用户学习分类记录 ID
 * @returns {Promise} 返回请求结果
 */
const deleteUserLearningCategory = (id) => {
  return request.delete(`/learning/category/${id}`);
};

/**
 * 根据 ID 查询用户学习分类记录
 * @param {number} id - 用户学习分类记录 ID
 * @returns {Promise} 返回请求结果
 */
const getUserLearningCategoryById = (id) => {
  return request.get(`/learning/category/${id}`);
};

/**
 * 查询当前用户所有学习分类记录
 * @returns {Promise} 返回请求结果
 */
const getAllUserLearningCategories = () => {
  return request.get('/learning/category/user');
};




/**
 * 查询当前用户在某分类下的学习进度
 * @param {number} categoryId - 分类 ID
 * @returns {Promise} 返回请求结果
 */
const getUserLearningProgress = (categoryId) => {
  return request.get('/learning/progress', { params: { categoryId } });
};

export default {
  createUserLearningCategory,
  updateUserLearningCategory,
  deleteUserLearningCategory,
  getUserLearningCategoryById,
  getAllUserLearningCategories,
  getUserLearningProgress,
};
