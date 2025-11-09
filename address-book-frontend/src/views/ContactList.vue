<template>
  <div class="contact-list">
    <!-- 搜索框和新增按钮 -->
    <div class="search-bar">
      <el-input
        placeholder="输入姓名搜索..."
        v-model="searchKeyword"
        clearable
        style="width: 300px;"
      ></el-input>
      <el-button type="primary" @click="handleAdd" style="margin-left: 10px;">
        新增联系人
      </el-button>
    </div>

    <!-- 通讯录标题 -->
    <h2 class="title">通讯录列表</h2>

    <!-- 联系人表格 -->
    <el-table 
      :data="filteredContacts" 
      border 
      style="width: 100%; margin-top: 20px;"
      empty-text="暂无联系人，请点击“新增联系人”添加"
    >
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="phone" label="电话" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button 
            type="primary" 
            size="mini" 
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button 
            type="danger" 
            size="mini" 
            @click="handleDelete(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑联系人弹窗 -->
    <el-dialog 
      :title="formData.id ? '编辑联系人' : '新增联系人'" 
      :visible.sync="dialogVisible" 
      width="30%"
    >
      <el-form 
        :model="formData" 
        label-width="80px"
        :rules="formRules"  
        ref="contactForm"  
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入11位手机号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入正确格式邮箱"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入axios（对接后端接口用）
import axios from 'axios';

export default {
  name: 'ContactList',
  data() {
    // 手机号验证
    const validatePhone = (rule, value, callback) => {
      const phoneReg = /^1[3-9]\d{9}$/;
      if (!value) return callback(new Error('请输入手机号'));
      if (!phoneReg.test(value)) return callback(new Error('请输入正确的11位手机号'));
      callback();
    };

    // 邮箱验证
    const validateEmail = (rule, value, callback) => {
      const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) return callback(); // 邮箱非必填
      if (!emailReg.test(value)) return callback(new Error('请输入正确的邮箱格式（例如：xxx@xxx.com）'));
      callback();
    };

    return {
      contacts: [], // 联系人列表（从后端获取）
      searchKeyword: '', // 搜索关键词
      dialogVisible: false, // 弹窗显示状态
      formData: { id: null, name: '', phone: '', email: '' }, // 表单数据（新增/编辑共用）
      formRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '姓名长度需在2-10个字符之间', trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    // 搜索筛选
    filteredContacts() {
      if (!this.searchKeyword) return this.contacts;
      const keyword = this.searchKeyword.toLowerCase();
      return this.contacts.filter(contact => 
        contact.name.toLowerCase().includes(keyword)
      );
    }
  },
  created() {
    // 初始化时加载联系人列表（从后端接口获取）
    this.loadContacts();
  },
  methods: {
    // 1. 从后端加载联系人列表
    async loadContacts() {
      try {
        // 调用后端接口：获取所有联系人
        const { data } = await axios.get('http://localhost:3000/api/contacts');
        this.contacts = data; // 把后端返回的数据赋值给列表
      } catch (error) {
        console.error('加载联系人失败：', error);
        this.$message.error('加载失败，请检查后端是否启动');
      }
    },

    // 2. 打开新增弹窗（重置表单）
    handleAdd() {
      this.formData = { id: null, name: '', phone: '', email: '' };
      this.dialogVisible = true;
    },

    // 3. 打开编辑弹窗（填充当前数据）
    handleEdit(row) {
      this.formData = { ...row }; // 复制当前行数据（包含id）
      this.dialogVisible = true;
    },

    // 4. 提交表单（新增/编辑共用）
    submitForm() {
      this.$refs.contactForm.validate(async (valid) => {
        if (valid) {
          try {
            if (this.formData.id) {
              // 编辑操作：调用后端更新接口
              await axios.put(
                `http://localhost:3000/api/contacts/${this.formData.id}`,
                this.formData
              );
              this.$message.success('更新成功');
            } else {
              // 新增操作：调用后端新增接口
              await axios.post('http://localhost:3000/api/contacts', this.formData);
              this.$message.success('添加成功');
            }
            this.dialogVisible = false; // 关闭弹窗
            this.loadContacts(); // 重新加载列表（刷新数据）
          } catch (error) {
            console.error('操作失败：', error);
            this.$message.error('操作失败，请重试');
          }
        }
      });
    },

    // 5. 删除联系人
    handleDelete(id) {
      this.$confirm('确定删除该联系人吗？', '提示', { 
        type: 'warning' 
      }).then(async () => {
        try {
          // 调用后端删除接口
          await axios.delete(`http://localhost:3000/api/contacts/${id}`);
          this.$message.success('删除成功');
          this.loadContacts(); // 重新加载列表
        } catch (error) {
          console.error('删除失败：', error);
          this.$message.error('删除失败，请重试');
        }
      });
    }
  }
};
</script>

<style scoped>
.contact-list {
  padding: 20px;
  background-color: #e6f7ee;
  min-height: 100vh;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  color: #333;
  margin: 0 0 20px 0;
  text-align: center;
}

::v-deep .el-table__empty-text {
  color: #666;
  font-size: 16px;
  padding: 40px 0;
}

::v-deep .el-form-item__error {
  font-size: 12px;
  color: #f56c6c;
}
</style>