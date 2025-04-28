import request from '@/utils/request'

// 获取权限列表（支持分页、搜索等功能）
const getPermissions = (params) => {
    return request({
        url: 'menu/list',  // 根据实际的 API 路径调整
        method: 'get',
        params: params  // 传递查询参数，例如分页信息、搜索条件
    })
}

// 获取所有权限（无需传入任何参数，返回所有权限）
const getAllPermissions = () => {
    return request({
        url: 'menu/all',  // 根据实际的 API 路径调整
        method: 'get'
    })
}

// 新增权限
const createPermission = (data) => {
    return request({
        url: 'menu',  // 根据实际的 API 路径调整
        method: 'post',
        data: data  // 传递新增权限的数据
    })
}

// 更新权限
const updatePermission = (id, data) => {
    return request({
        url: `menu/${id}`,  // 动态插入权限 ID
        method: 'put',
        data: data  // 传递更新的数据
    })
}

// 删除权限
const deletePermission = (id) => {
    return request({
        url: `menu/${id}`,  // 动态插入权限 ID
        method: 'delete'
    })
}

// 默认导出所有功能
export default {
    getPermissions,
    getAllPermissions,
    createPermission,
    updatePermission,
    deletePermission
}
