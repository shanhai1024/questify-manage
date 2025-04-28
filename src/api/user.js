import request from '@/utils/request'

// 用户注册
const registerUser = (data) => {
  return request.post('/user/register', data)
}

// 用户登录
const loginUser = (data) => {
  return request.post('/user/login', data)
}

// 获取用户权限列表
const getUserPermissions = () => {
  return request.get('/user/getPermissionList')
}

// 获取当前登录用户信息
const getUserData = () => {
  return request.get('/user/getUserData')
}

// 修改用户信息
const updateUserInfo = (data) => {
  return request.put('/user/updateUserInfo', data)
}

// 上传用户头像（文件）
const uploadUserAvatar = (file, userId = null) => {
  const formData = new FormData();
  formData.append('file', file);

  // 构建查询参数（如果是管理员且指定了userId）
  const params = {};
  if (userId !== null ) {
    params.userId = userId;
  }

  return request.post('/user/uploadAvatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    params: params  // 添加查询参数
  });
};


// 获取用户列表
const getUserList = (params) => {
  return request.get('/user/getUserList', { params })
}
// 删除用户
const deleteUserById = (id) => {
  return request.get(`/user/deleteUserById/${{id}}`)
}

export default {
  registerUser,
  loginUser,
  getUserPermissions,
  getUserData,
  updateUserInfo,
  uploadUserAvatar,
  getUserList,  // 添加 getUserList 方法
}
