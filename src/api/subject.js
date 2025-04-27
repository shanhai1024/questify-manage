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

export default {
  getSubjectList
};
