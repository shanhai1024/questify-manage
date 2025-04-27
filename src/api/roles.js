// src/api/v1/roles.js
import request from '@/utils/request';

// 获取所有角色
const getRoles = () => {
  return request.get('/roles');
};

// 根据 ID 获取角色
const getRoleById = (roleId) => {
  return request.get(`/roles/${roleId}`);
};

// 创建角色
const createRole = (data) => {
  return request.post('/roles', data);
};

// 更新角色
const updateRole = (roleId, data) => {
  return request.put(`/roles/${roleId}`, data);
};

// 删除角色
const deleteRole = (roleId) => {
  return request.delete(`/roles/${roleId}`);
};

export default {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
