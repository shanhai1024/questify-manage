// src/api/user.js
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
const uploadUserAvatar = (file) => {
  const formData = new FormData()
  formData.append('file', file)

  return request.post('/user/uploadAvatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export default {
  registerUser,
  loginUser,
  getUserPermissions,
  getUserData,
  updateUserInfo,
  uploadUserAvatar,
}
