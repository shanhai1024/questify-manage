<template>
  <div>
    <!-- 添加权限按钮 -->
    <el-button type="primary" @click="showAddPermissionDialog" style="margin-bottom: 20px; font-size: 14px;">
      <el-icon>
        <plus/>
      </el-icon>
      添加权限
    </el-button>

    <!-- 权限列表 -->
    <el-table :data="permissionsList" style="width: 100%" border>
      <el-table-column label="权限名称" prop="menuName"></el-table-column>
      <el-table-column label="权限路径" prop="path"></el-table-column>
      <el-table-column label="权限标识" prop="perms"></el-table-column>
      <el-table-column label="菜单图标" prop="icon"></el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
      <el-table-column label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === '0' ? 'success' : 'danger'">
            {{ row.status === '0' ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="small" @click="editPermission(row)">编辑</el-button>
          <el-button
              size="small"
              type="danger"
              @click="deletePermission(row)"
              style="margin-left:8px"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
        background
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalPermissions"
        @current-change="fetchPermissions"
        layout="prev, pager, next, jumper"
    ></el-pagination>

    <!-- 编辑权限的对话框 -->
    <el-dialog title="编辑权限" v-model="editDialogVisible" width="50%">
      <el-form :model="currentPermission" ref="editForm" label-width="120px">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="currentPermission.menuName" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="权限路径" prop="path">
          <el-input v-model="currentPermission.path" placeholder="请输入权限路径"></el-input>
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input v-model="currentPermission.component" placeholder="请输入组件路径"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" prop="perms">
          <el-input v-model="currentPermission.perms" placeholder="请输入权限标识"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input v-model="currentPermission.icon" placeholder="请输入菜单图标"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="currentPermission.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="visible">
          <el-radio-group v-model="currentPermission.visible">
            <el-radio label="0">显示</el-radio>
            <el-radio label="1">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单状态" prop="status">
          <el-radio-group v-model="currentPermission.status">
            <el-radio label="0">启用</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEditPermission">保存</el-button>
      </div>
    </el-dialog>

    <!-- 删除权限的对话框 -->
    <el-dialog title="删除权限" :visible.sync="deleteDialogVisible" width="30%">
      <span>确定删除权限: "{{ currentPermission.menuName }}"?</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDeletePermission">确定</el-button>
      </div>
    </el-dialog>

    <!-- 添加权限的对话框 -->
    <el-dialog title="添加权限" v-model="addDialogVisible" width="50%">
      <el-form :model="newPermission" ref="addForm" label-width="120px">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="newPermission.menuName" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="权限路径" prop="path">
          <el-input v-model="newPermission.path" placeholder="请输入权限路径"></el-input>
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input v-model="newPermission.component" placeholder="请输入组件路径"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" prop="perms">
          <el-input v-model="newPermission.perms" placeholder="请输入权限标识"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input v-model="newPermission.icon" placeholder="请输入菜单图标"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="newPermission.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="visible">
          <el-radio-group v-model="newPermission.visible">
            <el-radio label="0">显示</el-radio>
            <el-radio label="1">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单状态" prop="status">
          <el-radio-group v-model="newPermission.status">
            <el-radio label="0">启用</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveNewPermission">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import permissionApi from '@/api/permission'
import { Edit, Delete } from '@element-plus/icons-vue'

export default {
  name: 'Permissions',
  setup() {
    const permissionsList = ref([]) // 权限列表
    const currentPage = ref(1) // 当前页
    const pageSize = ref(10) // 每页大小
    const totalPermissions = ref(0) // 总权限数
    const editDialogVisible = ref(false) // 控制编辑对话框显示
    const deleteDialogVisible = ref(false) // 控制删除对话框显示
    const addDialogVisible = ref(false) // 控制添加权限对话框显示
    const currentPermission = ref({}) // 当前操作的权限对象
    const newPermission = ref({
      menuName: '',
      path: '',
      component: '',
      perms: '',
      icon: '',
      remark: '',
      visible: '0',
      status: '0'
    }) // 新权限对象

    // 获取权限列表
    const fetchPermissions = async (page = 1) => {
      currentPage.value = page // 设置当前页
      const res = await permissionApi.getPermissions({
        page: currentPage.value,
        size: pageSize.value
      })
      permissionsList.value = res.data.list || [] // 获取权限列表
      totalPermissions.value = res.data.total || 0 // 获取总条数
    }

    // 编辑权限
    const editPermission = (permission) => {
      currentPermission.value = {...permission} // 复制权限数据
      editDialogVisible.value = true // 显示编辑对话框
    }

    // 保存编辑权限
    const saveEditPermission = async () => {
      const res = await permissionApi.updatePermission(currentPermission.value.id, currentPermission.value)
      if (res.code === 200) {
        editDialogVisible.value = false // 关闭编辑对话框
        fetchPermissions(currentPage.value) // 重新获取权限列表
      }
    }

    // 删除权限
    const deletePermission = (permission) => {
      currentPermission.value = {...permission} // 设置当前删除的权限
      deleteDialogVisible.value = true // 显示删除对话框
    }

    // 确认删除权限
    const confirmDeletePermission = async () => {
      const res = await permissionApi.deletePermission(currentPermission.value.id)
      if (res.code === 200) {
        deleteDialogVisible.value = false // 关闭删除对话框
        fetchPermissions(currentPage.value) // 重新获取权限列表
      }
    }

    // 添加权限
    const showAddPermissionDialog = () => {
      addDialogVisible.value = true // 显示添加权限对话框
    }

    // 保存新权限
    const saveNewPermission = async () => {
      const res = await permissionApi.createPermission(newPermission.value)
      if (res.code === 200) {
        addDialogVisible.value = false // 关闭添加对话框
        fetchPermissions(currentPage.value) // 重新获取权限列表
      }
    }

    onMounted(() => {
      fetchPermissions(currentPage.value)
    })

    return {
      permissionsList,
      currentPage,
      pageSize,
      totalPermissions,
      fetchPermissions,
      editPermission,
      saveEditPermission,
      deletePermission,
      confirmDeletePermission,
      showAddPermissionDialog,
      saveNewPermission,
      currentPermission,
      editDialogVisible,
      deleteDialogVisible,
      addDialogVisible,
      newPermission
    }
  }
}
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}

.el-dialog .dialog-footer {
  text-align: right;
}
</style>
