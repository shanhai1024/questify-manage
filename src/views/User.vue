<template>
  <div :class="themeClass">
    <!-- ========= 顶部工具栏（搜索/主题切换） ========= -->
    <el-row class="search-bar" type="flex" align="middle">
      <el-input
          v-model="searchQuery"
          placeholder="用户名"
          @keyup.enter="searchUsers"
          style="width:200px;margin-right:10px"
      />
      <el-input
          v-model="phoneQuery"
          placeholder="手机号"
          @keyup.enter="searchUsers"
          style="width:200px;margin-right:10px"
      />
      <el-button type="primary" @click="searchUsers">搜索</el-button>
      <el-button @click="resetSearch">重置</el-button>

    </el-row>

    <!-- ========= 用户表格 ========= -->
    <el-table :data="userList" border style="width:100%;margin-top:20px">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="userName" label="用户名" />
      <el-table-column prop="nickName" label="昵称" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="phoneNumber" label="手机" />
      <el-table-column prop="sex" label="性别">
        <template #default="{row}">
          <el-tag :type="row.sex==='0'?'primary':row.sex==='1'?'success':'warning'">
            {{ row.sex==='0'?'男':row.sex==='1'?'女':'未知' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="{row}">
          <el-tag :type="row.status==='0'?'success':'danger'">
            {{ row.status==='0'?'正常':'停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column label="操作" width="180">
        <template #default="{row}">
          <el-button size="small" @click="openEdit(row)">编辑</el-button>
          <el-button
              size="small"
              type="danger"
              @click="deleteUser(row.id)"
              style="margin-left:8px"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- ========= 分页 ========= -->
    <el-pagination
        :total="totalUsers"
        :page-size="pageSize"
        :current-page="currentPage"
        layout="prev, pager, next, jumper"
        style="margin-top:20px;text-align:center"
        @current-change="handlePageChange"
    />

    <!-- ========= 编辑弹窗 ========= -->
    <el-dialog v-model="dialogVisible" title="编辑用户" width="600px" @close="resetForm">
      <!-- 头像预览 -->
      <div class="avatar-section">
        <el-avatar
            :src="edit.avatar"
            size="large"
            class="preview-avatar"
            @click="openFileDialog"
        />
        <div class="avatar-hint">点击头像更换</div>
      </div>

      <!-- 表单 -->
      <el-form ref="formRef" :model="edit" :rules="rules" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="edit.userName" disabled />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="edit.nickName" />
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="edit.phoneNumber" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="edit.email" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="edit.sex">
            <el-radio label="0">男</el-radio>
            <el-radio label="1">女</el-radio>
            <el-radio label="2">未知</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="edit.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户类型">
          <el-radio-group v-model="edit.userType">
            <el-radio label="0">管理员</el-radio>
            <el-radio label="1">普通用户</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="saveUser">保存</el-button>
      </template>

      <!-- ======= 裁剪弹窗 ======= -->
      <el-dialog
          v-model="showCropper"
          title="裁剪头像"
          width="600px"
          append-to-body
          @closed="uploadedImage=null"
      >
        <Cropper
            v-if="uploadedImage"
            ref="cropper"
            class="cropper"
            :src="uploadedImage"
            :stencil-component="CircleStencil"
        />
        <div style="text-align:center;margin-top:10px">
          <el-button type="primary" @click="cropAndUpload">裁剪并上传</el-button>
        </div>
      </el-dialog>

      <input
          ref="fileInput"
          type="file"
          accept="image/*"
          style="display:none"
          @change="onFileChange"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import userApi from '@/api/user'

/* ============= 主题 ============= */
const themeClass = ref('light-theme')
const toggleTheme = () => {
  themeClass.value =
      themeClass.value === 'light-theme' ? 'dark-theme' : 'light-theme'
  document.body.classList.toggle(
      'dark-theme',
      themeClass.value === 'dark-theme'
  )
}

/* ============= 列表数据 ============= */
const userList = ref([])
const totalUsers = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const searchQuery = ref('')
const phoneQuery = ref('')

const fetchUsers = async () => {
  const res = await userApi.getUserList({
    searchQuery: searchQuery.value,
    phoneQuery: phoneQuery.value,
    page: currentPage.value,
    size: pageSize.value
  })
  userList.value = res.data || []
  totalUsers.value = res.data?.length ?? 0
}
const searchUsers = () => {
  currentPage.value = 1
  fetchUsers()
}
const resetSearch = () => {
  searchQuery.value = ''
  phoneQuery.value = ''
  fetchUsers()
}
const handlePageChange = p => {
  currentPage.value = p
  fetchUsers()
}

/* ============= 编辑弹窗 ============= */
const dialogVisible = ref(false)
const formRef = ref()
const edit = reactive({
  id: '',
  userName: '',
  nickName: '',
  phoneNumber: '',
  email: '',
  sex: '2',
  status: '0',
  userType: '1',
  avatar: ''
})
const rules = {
  nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  phoneNumber: [
    {
      required: true,
      message: '请输入手机号',
      trigger: 'blur'
    },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '手机号格式不正确',
      trigger: 'blur'
    }
  ],
  email: [{type: 'email', message: '邮箱格式不正确', trigger: 'blur'}]
}
const openEdit = row => {
  Object.assign(edit, row)
  dialogVisible.value = true
}
const resetForm = () => {
  Object.keys(edit).forEach(k => (edit[k] = ''))
}
const saveUser = () => {
  formRef.value.validate(async valid => {
    if (!valid) return
    const res = await userApi.updateUserInfo(edit)
    if (res.code === 200) {
      ElMessage.success('保存成功')
      dialogVisible.value = false
      fetchUsers()
    } else ElMessage.error(res.msg || '保存失败')
  })
}

/* ============= 删除用户 ============= */
const deleteUser = async id => {
  await userApi.deleteUserById(id)
  ElMessage.success('删除成功')
  fetchUsers()
}

/* ============= 头像裁剪 ============= */
const showCropper = ref(false)
const uploadedImage = ref(null)
const cropper = ref()
const fileInput = ref()

const openFileDialog = () => fileInput.value?.click()

const onFileChange = e => {
  const file = e.target.files[0]
  if (!file) return
  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    ElMessage.error('仅支持 JPG/PNG 格式');
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    ElMessage.error('头像不能超过 10MB');
    return
  }
  const reader = new FileReader()
  reader.onload = ev => {
    uploadedImage.value = ev.target.result
    nextTick(() => (showCropper.value = true))
  }
  reader.readAsDataURL(file)
}

const cropAndUpload = async () => {
  const result = cropper.value?.getResult()
  if (!result?.canvas) {
    ElMessage.warning('请先裁剪');
    return
  }
  const blob = await new Promise(res =>
      result.canvas.toBlob(res, 'image/jpeg', 0.9)
  )
  const file = new File([blob], 'avatar.jpg', {type: 'image/jpeg'})

  // 获取当前用户ID，若没有则传递null
  const userId = edit.id || null  // 使用编辑框中的用户 ID

  const res = await userApi.uploadUserAvatar(file, userId)
  if (res.code === 200) {
    edit.avatar = res.data
    showCropper.value = false
    ElMessage.success('头像已更新')
  } else {
    ElMessage.error(res.msg || '上传失败')
  }
}

/* ============= 生命周期 ============= */
onMounted(fetchUsers)
</script>

<style scoped>
/* 深色模式，仅示例 */
.dark-theme {
  background: #2c3e50;
  color: #ecf0f1;
}

.search-bar {
  margin-bottom: 20px
}

.avatar-section {
  text-align: center;
  margin-bottom: 24px
}

.preview-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #dcdfe6;
}

.avatar-hint {
  font-size: 13px;
  color: #888
}

.cropper {
  width: 100%;
  height: 400px;
  background: #f5f5f5;
  border-radius: 8px;
}
</style>
