<template>
  <div class="container">
    <h2 class="title">简答题管理</h2>

    <!-- 添加题目按钮 -->
    <div style="margin-bottom: 20px; text-align: right;">
      <!-- 按钮点击后打开添加简答题的对话框 -->
      <el-button type="success" @click="openAddDialog">添加简答题</el-button>
    </div>

    <!-- 表格展示题目数据 -->
    <el-table :data="paginatedData" style="width: 100%" stripe>
      <el-table-column label="题目" prop="question" width="300"></el-table-column>
      <el-table-column label="难度" prop="difficult" width="120"></el-table-column>
      <el-table-column label="分数" prop="score" width="120"></el-table-column>

      <!-- 操作列：编辑和删除 -->
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <!-- 编辑按钮，点击后打开编辑对话框 -->
          <el-button @click="openEditDialog(scope.row)" type="primary" size="small">编辑</el-button>
          <!-- 删除按钮，点击后调用删除函数 -->
          <el-button @click="deleteQuestion(scope.row.id, scope.row.type)" type="danger" size="small" style="margin-left: 10px;">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @current-change="handlePageChange"
        layout="total, prev, pager, next, jumper"
    ></el-pagination>

    <!-- 编辑简答题弹出框 -->
    <el-dialog v-model="editDialogVisible" width="60%" title="编辑简答题" custom-class="edit-dialog">
      <el-form :model="editForm" label-width="120px" ref="editFormRef" :rules="editFormRules">
        <!-- 题目名称 -->
        <el-form-item label="题目名称" prop="question">
          <el-input v-model="editForm.question" placeholder="请输入题目名称"></el-input>
        </el-form-item>

        <!-- 难度 -->
        <el-form-item label="难度" prop="difficult">
          <el-select v-model="editForm.difficult" placeholder="请选择难度">
            <el-option label="简单" :value="1"></el-option>
            <el-option label="中等" :value="2"></el-option>
            <el-option label="困难" :value="3"></el-option>
          </el-select>
        </el-form-item>

        <!-- 分数 -->
        <el-form-item label="分数" prop="score">
          <el-input-number v-model="editForm.score" :min="1" :max="100"></el-input-number>
        </el-form-item>

        <!-- 答案 -->
        <el-form-item label="答案" prop="answer">
          <el-input type="textarea" v-model="editForm.answer" placeholder="请输入简答题答案"></el-input>
        </el-form-item>

        <!-- 解析 -->
        <el-form-item label="解析" prop="solution">
          <el-input type="textarea" v-model="editForm.solution" placeholder="请输入题目解析"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <!-- 取消按钮，关闭对话框 -->
        <el-button @click="editDialogVisible = false">取消</el-button>
        <!-- 确认按钮，提交编辑 -->
        <el-button type="primary" @click="submitEdit">确认</el-button>
      </span>
    </el-dialog>

    <!-- 添加简答题弹出框 -->
    <el-dialog v-model="addDialogVisible" width="60%" title="添加简答题" custom-class="edit-dialog">
      <el-form :model="addForm" label-width="120px" ref="addFormRef" :rules="addFormRules">
        <!-- 题目名称 -->
        <el-form-item label="题目名称" prop="question">
          <el-input v-model="addForm.question" placeholder="请输入题目名称"></el-input>
        </el-form-item>

        <!-- 难度 -->
        <el-form-item label="难度" prop="difficult">
          <el-select v-model="addForm.difficult" placeholder="请选择难度">
            <el-option label="简单" :value="1"></el-option>
            <el-option label="中等" :value="2"></el-option>
            <el-option label="困难" :value="3"></el-option>
          </el-select>
        </el-form-item>

        <!-- 分数 -->
        <el-form-item label="分数" prop="score">
          <el-input-number v-model="addForm.score" :min="1" :max="100"></el-input-number>
        </el-form-item>

        <!-- 答案 -->
        <el-form-item label="答案" prop="answer">
          <el-input type="textarea" v-model="addForm.answer" placeholder="请输入简答题答案"></el-input>
        </el-form-item>

        <!-- 解析 -->
        <el-form-item label="解析" prop="solution">
          <el-input type="textarea" v-model="addForm.solution" placeholder="请输入题目解析"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <!-- 取消按钮，关闭对话框 -->
        <el-button @click="addDialogVisible = false">取消</el-button>
        <!-- 确认按钮，提交新增 -->
        <el-button type="primary" @click="submitAdd">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { ElTable, ElTableColumn, ElButton, ElPagination, ElDialog, ElMessage, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElInputNumber } from 'element-plus';
import api from '@/api/subject';

export default {
  name: 'JudgmentQuestionManagement',
  components: {
    ElTable,
    ElTableColumn,
    ElButton,
    ElPagination,
    ElDialog,
    ElMessage,
    ElForm,
    ElFormItem,
    ElInput,
    ElSelect,
    ElOption,
    ElInputNumber
  },
  setup() {
    // 数据绑定
    const data = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);

    // 获取简答题数据
    const getSubjectData = async () => {
      try {
        // 调用接口获取简答题数据
        const response = await api.getAllByType(4, currentPage.value, pageSize.value);
        if (response.code === 200) {
          data.value = response.data.list;
          total.value = response.data.total;
        }
      } catch (error) {
        console.error('Error fetching subject data:', error);
      }
    };

    // 页面加载时调用获取数据
    onMounted(() => {
      getSubjectData();
    });

    // 分页数据计算
    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return data.value.slice(start, end);
    });

    // 页码变化处理
    const handlePageChange = (page) => {
      currentPage.value = page;
      getSubjectData();
    };

    // 编辑弹出框相关
    const editDialogVisible = ref(false);
    const editForm = ref({
      id: null,
      question: '',
      difficult: 1,
      score: 1,
      solution: '',
      answer: ''
    });

    const editFormRules = {
      question: [{ required: true, message: '请输入题目名称', trigger: 'blur' }],
      difficult: [{ required: true, message: '请选择难度', trigger: 'change' }],
      score: [{ required: true, message: '请输入分数', trigger: 'blur' }],
      answer: [{ required: true, message: '请输入答案', trigger: 'blur' }],
      solution: [{ required: true, message: '请输入解析', trigger: 'blur' }]
    };

    // 打开编辑对话框并填充数据
    const openEditDialog = (row) => {
      editForm.value = {
        id: row.id,
        question: row.question,
        difficult: row.difficult,
        score: row.score,
        solution: row.solution,
        answer: row.answer
      };
      editDialogVisible.value = true;
    };

    // 提交编辑操作
    const submitEdit = async () => {
      try {
        await editFormRef.value.validate();
        const requestData = {
          info: {
            id: editForm.value.id,
            name: editForm.value.question,
            difficulty: editForm.value.difficult,
            settleName: '未知出题人',
            type: 4,
            score: editForm.value.score,
            parse: editForm.value.solution
          },
          judge: null,
          multiples: null,
          brief: null,
          questionTypeCode: 4,
          answer: editForm.value.answer
        };

        // 调用接口更新数据
        const response = await api.updateSubject(4, requestData);
        if (response.code === 200) {
          ElMessage.success('修改成功');
          editDialogVisible.value = false;
          getSubjectData();
        } else {
          ElMessage.error('修改失败');
        }
      } catch (error) {
        console.error('Error updating question:', error);
        ElMessage.error('修改失败，请重试');
      }
    };

    const editFormRef = ref(null);

    // 添加弹出框相关
    const addDialogVisible = ref(false);
    const addForm = ref({
      question: '',
      difficult: 1,
      score: 1,
      solution: '',
      answer: ''
    });

    const addFormRules = {
      question: [{ required: true, message: '请输入题目名称', trigger: 'blur' }],
      difficult: [{ required: true, message: '请选择难度', trigger: 'change' }],
      score: [{ required: true, message: '请输入分数', trigger: 'blur' }],
      answer: [{ required: true, message: '请输入答案', trigger: 'blur' }],
      solution: [{ required: true, message: '请输入解析', trigger: 'blur' }]
    };

    // 打开添加对话框
    const openAddDialog = () => {
      addForm.value = {
        question: '',
        difficult: 1,
        score: 1,
        solution: '',
        answer: ''
      };
      addDialogVisible.value = true;
    };

    // 提交添加操作
    const submitAdd = async () => {
      try {
        await addFormRef.value.validate();
        const requestData = {
          info: {
            name: addForm.value.question,
            difficulty: addForm.value.difficult,
            settleName: '未知出题人',
            type: 4,
            score: addForm.value.score,
            parse: addForm.value.solution
          },
          questionTypeCode: 4,
          answer: addForm.value.answer
        };

        const response = await api.addSubject(requestData);
        if (response.code === 200) {
          ElMessage.success('添加成功');
          addDialogVisible.value = false;
          getSubjectData();
        } else {
          ElMessage.error('添加失败');
        }
      } catch (error) {
        console.error('Error adding question:', error);
        ElMessage.error('添加失败，请重试');
      }
    };

    const addFormRef = ref(null);

    // 删除题目
    const deleteQuestion = async (id, type) => {
      try {
        const response = await api.deleteByType(type, id);
        if (response.code === 200) {
          ElMessage.success('删除成功');
          getSubjectData();
        } else {
          ElMessage.error('删除失败');
        }
      } catch (error) {
        console.error('Error deleting question:', error);
        ElMessage.error('删除失败，请重试');
      }
    };

    return {
      data,
      currentPage,
      pageSize,
      total,
      paginatedData,
      handlePageChange,
      editDialogVisible,
      editForm,
      editFormRules,
      openEditDialog,
      submitEdit,
      editFormRef,
      addDialogVisible,
      addForm,
      addFormRules,
      openAddDialog,
      submitAdd,
      addFormRef,
      deleteQuestion
    };
  },
};
</script>

<style scoped>
.container {
  margin: 20px;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.el-table {
  margin-top: 20px;
}

.dialog-footer {
  text-align: center;
}

.close-button {
  background-color: #409EFF;
  color: white;
  padding: 8px 25px;
  border-radius: 4px;
  border: none;
}

.close-button:hover {
  background-color: #66b1ff;
}
</style>
