<template>
  <div class="container">
    <h2 class="title">单选题管理</h2>
    <el-table :data="paginatedData" style="width: 100%" stripe>
      <!-- 题目列 -->
      <el-table-column label="题目" prop="question" width="300">
      </el-table-column>

      <!-- 难度列 -->
      <el-table-column label="难度" prop="difficult" width="120">
      </el-table-column>

      <!-- 分数列 -->
      <el-table-column label="分数" prop="score" width="120">
      </el-table-column>

      <!-- 选项列 -->
      <el-table-column label="选项" width="400">
        <template #default="scope">
          <el-button @click="toggleDialog(scope.row.id)" type="link" size="small">
            {{ scope.row.isOptionsVisible ? '隐藏选项' : '查看选项' }}
          </el-button>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button @click="openEditDialog(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="deleteQuestion(scope.row.id, scope.row.type)" type="danger" size="small" style="margin-left: 10px;">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @current-change="handlePageChange"
        layout="total, prev, pager, next, jumper"
    ></el-pagination>

    <!-- 查看选项弹出框 -->
    <el-dialog v-model="dialogVisible" width="60%" title="查看选项" custom-class="option-dialog">
      <div v-if="selectedQuestion">
        <div v-for="option in selectedQuestion.options" :key="option.label" class="option-item">
          <el-button
              :type="option.isCorrect ? 'primary' : 'default'"
              class="option-button"
              size="medium"
              :style="option.isCorrect ? { backgroundColor: '#409EFF', color: '#fff' } : { backgroundColor: '#f0f0f0', color: '#333' }"
              disabled
          >
            <span class="option-label">{{ option.label }}:</span>
            <span>{{ option.content }}</span>
          </el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" class="close-button">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 编辑题目弹出框 -->
    <el-dialog v-model="editDialogVisible" width="60%" title="编辑单选题" custom-class="edit-dialog">
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

        <!-- 选项 -->
        <el-form-item label="选项" prop="options">
          <div v-for="(option, index) in editForm.options" :key="index" class="option-item">
            <el-input
                v-model="option.content"
                placeholder="请输入选项内容"
                style="width: 300px; margin-right: 10px;"
            ></el-input>
            <el-checkbox v-model="option.isCorrect" :disabled="isCorrectDisabled(index)">正确答案</el-checkbox>
            <el-button type="danger" size="small" @click="removeOption(index)" style="margin-left: 10px;">删除</el-button>
          </div>
          <el-button type="primary" size="small" @click="addOption">添加选项</el-button>
        </el-form-item>

        <!-- 解析 -->
        <el-form-item label="解析" prop="solution">
          <el-input type="textarea" v-model="editForm.solution" placeholder="请输入题目解析"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { ElTable, ElTableColumn, ElButton, ElPagination, ElDialog, ElMessage, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElInputNumber, ElCheckbox, ElMessageBox } from 'element-plus';
import api from '@/api/subject';

export default {
  name: 'App',
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
    ElInputNumber,
    ElCheckbox,
    ElMessageBox
  },
  setup() {
    const data = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);

    const getSubjectData = async () => {
      try {
        const response = await api.getAllByType(1, currentPage.value, pageSize.value);
        if (response.code === 200) {
          data.value = response.data.list;
          total.value = response.data.total;
        }
      } catch (error) {
        console.error('Error fetching subject data:', error);
      }
    };

    onMounted(() => {
      getSubjectData();
    });

    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return data.value.slice(start, end);
    });

    const handlePageChange = (page) => {
      currentPage.value = page;
      getSubjectData();
    };

    const editDialogVisible = ref(false);
    const editForm = ref({
      id: null,
      question: '',
      difficult: 1,
      score: 1,
      solution: '',
      options: []
    });

    const editFormRules = {
      question: [{ required: true, message: '请输入题目名称', trigger: 'blur' }],
      difficult: [{ required: true, message: '请选择难度', trigger: 'change' }],
      score: [{ required: true, message: '请输入分数', trigger: 'blur' }],
      options: [
        {
          validator: (rule, value, callback) => {
            if (!value || value.length < 2) {
              callback(new Error('至少需要两个选项'));
            } else if (!value.some(option => option.isCorrect)) {
              callback(new Error('至少需要一个正确答案'));
            } else {
              callback();
            }
          },
          trigger: 'change'
        }
      ],
      solution: [{ required: true, message: '请输入解析', trigger: 'blur' }]
    };

    const openEditDialog = (row) => {
      editForm.value = {
        id: row.id,
        question: row.question,
        difficult: row.difficult,
        score: row.score,
        solution: row.solution,
        options: row.options.map(option => ({
          id: option.id || null,  // 假设选项有 ID
          label: option.label,
          content: option.content,
          isCorrect: option.isCorrect
        }))
      };
      editDialogVisible.value = true;
    };

    const addOption = () => {
      editForm.value.options.push({
        label: String.fromCharCode(65 + editForm.value.options.length), // A, B, C, D...
        content: '',
        isCorrect: false
      });
    };

    const removeOption = (index) => {
      if (editForm.value.options.length > 2) {
        editForm.value.options.splice(index, 1);
        // 重新调整选项的 label
        editForm.value.options.forEach((option, i) => {
          option.label = String.fromCharCode(65 + i);
        });
      } else {
        ElMessage.warning('至少需要两个选项');
      }
    };

    const isCorrectDisabled = (currentIndex) => {
      const correctCount = editForm.value.options.filter(option => option.isCorrect).length;
      return correctCount === 1 && !editForm.value.options[currentIndex].isCorrect;
    };

    const submitEdit = async () => {
      try {
        await editFormRef.value.validate();
        const requestData = {
          info: {
            id: editForm.value.id,
            name: editForm.value.question,
            difficulty: editForm.value.difficult,
            settleName: '未知出题人',
            type: 1,
            score: editForm.value.score,
            parse: editForm.value.solution
          },
          radios: editForm.value.options.map(option => ({
            id: option.id || null,
            infoId: editForm.value.id,
            optionType: option.label.charCodeAt(0) - 64, // A -> 1, B -> 2, etc.
            optionContent: option.content,
            isCorrect: option.isCorrect ? 1 : 0
          })),
          multiples: null,
          judge: null,
          brief: null
        };

        const response = await api.updateSubject(1, requestData);
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

    const dialogVisible = ref(false);
    const selectedQuestion = ref(null);

    const toggleDialog = (id) => {
      const question = data.value.find(item => item.id === id);
      if (question) {
        selectedQuestion.value = question;
        dialogVisible.value = true;
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
      addOption,
      removeOption,
      isCorrectDisabled,
      submitEdit,
      editFormRef,
      deleteQuestion,
      dialogVisible,
      selectedQuestion,
      toggleDialog
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

/* 查看选项弹出框的样式 */
.option-dialog .el-dialog__header {
  background-color: #f4f4f4;
  border-bottom: 2px solid #dcdfe6;
}

.option-dialog .el-dialog__body {
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 编辑弹出框的样式 */
.edit-dialog .el-dialog__body {
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.option-item {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.option-button {
  font-size: 18px;
  padding: 12px 20px;
  border-radius: 8px;
  transition: background-color 0.3s;
  width: 100%;
  margin-bottom: 8px;
  text-align: left;
}

.option-label {
  font-weight: bold;
  margin-right: 10px;
}

.option-button.correct {
  background-color: #409EFF;
  color: white;
}

.option-button.incorrect {
  background-color: #f0f0f0;
  color: #333;
}

.option-button:hover {
  background-color: #f0f0f0;
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
