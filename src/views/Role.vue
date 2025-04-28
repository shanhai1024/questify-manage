<template>
  <div :class="themeClass">
    <!-- 搜索工具栏 -->
    <el-row class="search-bar" type="flex" align="middle">
      <el-input
          v-model="searchQuery"
          placeholder="角色名称"
          @keyup.enter="searchRoles"
          style="width:200px;margin-right:10px"
      />
      <el-input
          v-model="roleKeyQuery"
          placeholder="角色权限标识"
          @keyup.enter="searchRoles"
          style="width:200px;margin-right:10px"
      />
      <el-button type="primary" @click="searchRoles">搜索</el-button>
      <el-button @click="resetSearch">重置</el-button>
      <el-button style="margin-left:auto" @click="openAddRoleDialog">
        添加角色
      </el-button>
    </el-row>

    <!-- 角色表格 -->
    <el-table :data="roleList" border style="width:100%;margin-top:20px">
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="roleKey" label="角色权限标识" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column prop="status" label="状态">
        <template #default="{row}">
          <el-tag :type="row.status === '0' ? 'success' : 'danger'">
            {{ row.status === '0' ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{row}">
          <el-button size="small" @click="openEdit(row)">编辑</el-button>
          <el-button
              size="small"
              type="danger"
              @click="deleteRole(row.id)"
              style="margin-left:8px"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
        :total="totalRoles"
        :page-size="pageSize"
        :current-page="currentPage"
        layout="prev, pager, next, jumper"
        style="margin-top:20px;text-align:center"
        @current-change="handlePageChange"
    />

    <!-- 编辑弹窗 -->
    <el-dialog v-model="dialogVisible" title="编辑角色" width="600px" @close="resetForm">
      <el-form ref="formRef" :model="editRole" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="editRole.name" />
        </el-form-item>
        <el-form-item label="角色权限标识" prop="roleKey">
          <el-input v-model="editRole.roleKey" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="editRole.remark" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="editRole.status">
            <el-radio label="0">启用</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="saveRole">保存</el-button>
      </template>
    </el-dialog>

    <!-- 添加角色弹窗 -->
    <el-dialog v-model="addRoleDialogVisible" title="添加角色" width="600px" @close="resetAddForm">
      <el-form ref="addFormRef" :model="newRole" :rules="addRoleRules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="newRole.name" />
        </el-form-item>
        <el-form-item label="角色权限标识" prop="roleKey">
          <el-input v-model="newRole.roleKey" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="newRole.remark" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="newRole.status">
            <el-radio label="0">启用</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="addRoleDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="addRole">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import roleApi from '@/api/roles'

/* 主题切换 */
const themeClass = ref('light-theme')

/* 角色列表数据 */
const roleList = ref([])
const totalRoles = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const searchQuery = ref('')
const roleKeyQuery = ref('')

const fetchRoles = async () => {
  const res = await roleApi.getRoles({
    searchQuery: searchQuery.value,
    roleKeyQuery: roleKeyQuery.value,
    page: currentPage.value,
    size: pageSize.value
  })
  roleList.value = res.data || []
  totalRoles.value = res.total || 0
}

const searchRoles = () => {
  currentPage.value = 1
  fetchRoles()
}

const resetSearch = () => {
  searchQuery.value = ''
  roleKeyQuery.value = ''
  fetchRoles()
}

const handlePageChange = p => {
  currentPage.value = p
  fetchRoles()
}

/* 编辑角色 */
const dialogVisible = ref(false)
const formRef = ref()
const editRole = reactive({
  id: '',
  name: '',
  roleKey: '',
  remark: '',
  status: '0'
})

const rules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  roleKey: [{ required: true, message: '请输入角色权限标识', trigger: 'blur' }]
}

const openEdit = row => {
  Object.assign(editRole, row)
  dialogVisible.value = true
}

const resetForm = () => {
  Object.keys(editRole).forEach(k => (editRole[k] = ''))
}

const saveRole = async () => {
  formRef.value.validate(async valid => {
    if (!valid) return
    const res = await roleApi.updateRole(editRole.id,editRole)
    if (res.code === 200) {
      ElMessage.success('保存成功')
      dialogVisible.value = false
      fetchRoles()
    } else ElMessage.error(res.msg || '保存失败')
  })
}

/* 删除角色 */
const deleteRole = async id => {
  await roleApi.deleteRole(id)
  ElMessage.success('删除成功')
  fetchRoles()
}

/* 添加角色 */
const addRoleDialogVisible = ref(false)
const addFormRef = ref()
const newRole = reactive({
  name: '',
  roleKey: '',
  remark: '',
  status: '0'
})

const addRoleRules = {
  name: [{required: true, message: '请输入角色名称', trigger: 'blur'}],
  roleKey: [{required: true, message: '请输入角色权限标识', trigger: 'blur'}]
}

const openAddRoleDialog = () => {
  addRoleDialogVisible.value = true
}

const resetAddForm = () => {
  Object.keys(newRole).forEach(k => (newRole[k] = ''))
}

const addRole = async () => {
  addFormRef.value.validate(async valid => {
    if (!valid) return
    const res = await roleApi.createRole(newRole)
    if (res.code === 200) {
      ElMessage.success('角色添加成功')
      addRoleDialogVisible.value = false
      fetchRoles()
    } else ElMessage.error(res.msg || '添加失败')
  })
}

/* 生命周期 */
onMounted(fetchRoles)
</script>

<style scoped>
/* 深色模式 */
.dark-theme {
  background: #2c3e50;
  color: #ecf0f1;
}

.search-bar {
  margin-bottom: 20px
}
</style>
