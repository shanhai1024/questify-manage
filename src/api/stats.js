// src/api/stats.js
import request from '@/utils/request';

// 新增刷题记录
const getStatsData = () => {
    return request.get('/platform/stats');
};


export default {
    getStatsData,
};
