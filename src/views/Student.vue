<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 人员信息
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-left">
        <el-button
            type="danger"
            icon="el-icon-delete"
            class="handle-del mr10"
            @click="delAllStudent"
        >批量删除</el-button>
        <el-button  type="primary" @click="toggleSelection()" icon="el-icon-circle-close">取消全选</el-button>
        <el-select v-model="query.grade" placeholder="年级" class="handle-select mr10" clearable>
          <el-option key="1" label="2017级" value="2017级"></el-option>
          <el-option key="2" label="2018级" value="2018级"></el-option>
          <el-option key="3" label="2019级" value="2019级"></el-option>
          <el-option key="4" label="2020级" value="2020级"></el-option>
        </el-select>
        <el-input v-model="query.major" placeholder="专业" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </div>
      <div class="handle-right">
        <el-button type="primary" icon="el-icon-circle-plus" @click="handleAdd">添加</el-button>
        <el-button type="primary" icon="el-icon-refresh-right" @click="handleLoad">加载全部</el-button>
      </div>
      <el-table
          :data="tableData"
          border
          class="table"
          ref="multipleTable"
          header-cell-class-name="table-header"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="stuNo" label="学号" align="center"></el-table-column>
        <el-table-column prop="stuName" label="学生姓名" align="center"></el-table-column>
        <el-table-column prop="grade" label="年级" align="center"></el-table-column>
        <el-table-column prop="major" label="专业" align="center"></el-table-column>
        <el-table-column prop="number" label="电话" align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button
                type="text"
                icon="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
                type="text"
                icon="el-icon-delete"
                class="red"
                @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            background
            layout="total, prev, pager, next, jumper"
            :current-page="query.pageIndex"
            :page-size="query.pageSize"
            :total="total"
            @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 添加弹出框 -->
    <el-dialog title="添加学生信息" v-model="addVisible" width="30%" @close="addFormClosed">
      <el-form ref="addForm" :model="addForm" label-width="70px">
        <el-form-item label="学号" prop="stuNo">
          <el-input v-model="addForm.stuNo"></el-input>
        </el-form-item>
        <el-form-item label="学生姓名" prop="stuName">
          <el-input v-model="addForm.stuName"></el-input>
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-input v-model="addForm.grade"></el-input>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="addForm.major"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="number">
          <el-input v-model="addForm.number"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
            <el-button @click="cancelAdd">取 消</el-button>
            <el-button type="primary" @click="saveAdd">确 定</el-button>
        </span>
      </template>
    </el-dialog>


    <!-- 编辑弹出框 -->
    <el-dialog title="编辑学生信息" v-model="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="学号" prop="stuNo">
          <el-input v-model="form.stuNo"></el-input>
        </el-form-item>
        <el-form-item label="学生姓名" prop="stuName">
          <el-input v-model="form.stuName"></el-input>
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-input v-model="form.grade"></el-input>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="form.major"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="number">
          <el-input v-model="form.number"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
            <el-button @click="cancelEdit">取 消</el-button>
            <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {mapState,mapMutations,mapActions} from 'vuex'
export default {
  name: "student",
  data() {
    return {
      query: {
        grade: '',
        major: '',
        pageIndex:1,
        pageSize:10
      },
      addForm:{},
      form:{},
      multipleSelection: [],
      editVisible: false,
      addVisible:false,
      idx:-1,
      id:-1,
    }
  },
  computed:{
    ...mapState('student',['studentInfo']),
    tableData(){
      return this.studentInfo.list
    },
    total(){
      return this.studentInfo.total
    },
  },
  created() {
    this.loadData()
  },
  methods: {
    ...mapMutations('student',['setStudentInfo']),
    ...mapActions('student',['getAllStudentInfo']),
    async loadData () {
      const{code,message,data} = await this.$api.student.getAllStudent(this.query.pageIndex,this.query.pageSize)
      console.log(data)
      if (code === 200){
        this.setStudentInfo(data)
        this.$message.success(message)
      }else if(code === 201){
        this.$message.error(message)
      }
    },
    //加载全部
    handleLoad(){
      this.query.grade = '',
          this.query.major = '',
          this.getAllStudentInfo(this.query.pageIndex)
    },
    // 触发添加按钮
    handleAdd(){
      this.addVisible = true
    },
    cancelAdd(){
      this.addVisible = false
    },
    addFormClosed(){
      this.$refs.addForm.resetFields()
    },
    // 触发添加number的操作
    async saveAdd(){
      let student = {
        stuNo : this.addForm.stuNo,
        stuName : this.addForm.stuName,
        grade : this.addForm.grade,
        major : this.addForm.major,
        number : this.addForm.number
      }
      const{code,message,data} = await this.$api.student.insertStudent(student)
      this.addVisible = false
      this.$refs.addForm.resetFields()
      console.log(data)
      if (code === 200){
        this.$message.success(message)
        await this.getAllStudentInfo(this.query.pageIndex)
        console.log(this.studentInfo)
      }else if(code === 201){
        this.$message.error(message)
      }
    },
    // 触发搜索按钮
    async handleSearch() {
      let search = {
        page : this.query.pageIndex,
        size : this.query.pageSize,
        grade : this.query.grade,
        major : this.query.major
      }
      const {code,message,data} = await this.$api.student.searchStudent(search)
      this.setStudentInfo(data)
      if (code === 200){
        this.$message.success(message)
      }else {
        this.$message.error(message)
      }
    },
    // 删除操作
    handleDelete(index) {
      // 二次确认删除
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      })
          .then(async () => {
            this.$message.success("删除成功")
            await this.$api.student.deleteStudent(this.studentInfo.list[index].sId)
            this.tableData.splice(index, 1);
            await this.getAllStudentInfo(this.query.pageIndex)
          })
          .catch(() => {});
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val)
      console.log(this.multipleSelection)
    },
    toggleSelection() {
      this.$refs.multipleTable.clearSelection();
    },
    // 批量删除student
    async delAllStudent() {
      const length = this.multipleSelection.length;
      let str = "";
      for (let i = 0; i < length; i++) {
        if (i === length - 1) {
          str += this.multipleSelection[i].sId
        } else {
          str += this.multipleSelection[i].sId + ",";
        }
      }
      const {code,message} =await this.$api.student.deleteStudentByIds(str)
      if (code === 200){
        this.$message.success(message);
      }else {
        this.$message.error(message);
      }
      await this.getAllStudentInfo(this.query.pageIndex)
      this.multipleSelection = [];
    },
    // 编辑操作
    handleEdit(index, row) {
      this.idx = index;
      this.form = row;
      this.editVisible = true;
    },
    cancelEdit(){
      this.editVisible = false
      this.getAllStudentInfo(this.query.pageIndex)
    },
    // 保存编辑,bug问题
    async saveEdit() {
      // this.$set(this.tableData, this.idx, this.form);
      this.editVisible = false
      let student = {
        sId : this.studentInfo.list[this.idx].sId,
        stuNo : this.form.stuNo,
        stuName : this.form.stuName,
        grade: this.form.grade,
        major : this.form.major,
        number : this.form.number
      }
      console.log(student)
      const {code,message} =  await this.$api.student.updateStudent(student)
      if (code === 200){
        this.$message.success(`修改第 ${this.idx + 1} 行成功`);
        await this.getAllStudentInfo(this.query.pageIndex)
      }else if(code === 201){
        this.$message.error(message)
      }

    },
    // 分页导航
    handlePageChange(val) {
      this.query.pageIndex = val
      this.getAllStudentInfo(this.query.pageIndex);
    }
  }
};
</script>

<style scoped>
.handle-left {
  margin-bottom: 20px;
  float: left;
}

.handle-right {
  margin-bottom: 20px;
  float: right;
}

.handle-select {
  width: 120px;
  margin-left: 20px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
