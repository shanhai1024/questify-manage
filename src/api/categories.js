// src/api/categories.js
import request from '@/utils/request';

// 获取所有分类（不带查询条件）
const getCategories = () => {
  return request.get('/categories');
};

// 添加分类
const addCategory = (data) => {
  return request.post('/categories', data);
};

// 删除分类（按 ID）
const deleteCategoryById = (categoryId) => {
  return request.delete(`/categories/${categoryId}`);
};

// 模糊查询分类（根据名字）
const getCategoriesByName = (categoriesName) => {
  return request.get(`/categories/name/`, {
    params: { categoriesName },
  });
};

// 根据类型查询分类
const getCategoriesByType = (type) => {
  return request.get(`/category/by-type`, {
    params: { type },
  });
};



/**
 * 新增用户学习分类记录
 * @param {Object} data - 用户学习分类记录
 * @returns {Promise} 返回请求结果
 */
const createUserLearningCategory = (data) => {
  return request.post('/learning/category', data);
};


export default {
  getCategories,
  addCategory,
  deleteCategoryById,
  getCategoriesByName,
  getCategoriesByType,
  createUserLearningCategory,
};
