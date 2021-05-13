<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 电话信息
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-left">
        <el-button
            type="danger"
            icon="el-icon-delete"
            class="handle-del mr10"
            @click="delAllNumber"
        >批量删除</el-button>
        <el-button  type="primary" @click="toggleSelection()" icon="el-icon-circle-close">取消全选</el-button>
        <el-select v-model="query.address" placeholder="地址" class="handle-select mr10" clearable>
          <el-option key="1" label="明理楼" value="明理楼"></el-option>
          <el-option key="2" label="学生公寓" value="学生公寓"></el-option>
        </el-select>
        <el-input v-model="query.stuName" placeholder="学生姓名" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </div>
      <div class="handle-right">
        <el-button type="primary" icon="el-icon-circle-plus" @click="handleAdd">添加</el-button>
        <el-button type="primary" icon="el-icon-refresh-right" @click="handleLoad">加载全部</el-button>
      </div>
      <el-table
          :data="tableData"
          border
          v-loading="loading"
          class="table"
          ref="multipleTable"
          header-cell-class-name="table-header"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="consultant" label="咨询人" align="center"></el-table-column>
        <el-table-column prop="number" label="电话号码" align="center"></el-table-column>
        <el-table-column prop="stuName" label="接电话人" align="center"></el-table-column>
        <el-table-column prop="time" label="接电话时间" align="center"></el-table-column>
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
    <el-dialog title="添加电话信息" v-model="addVisible" width="30%" @close="addFormClosed">
      <el-form ref="addForm" :model="addForm" label-width="70px">
        <el-form-item label="咨询人" prop="consultant">
          <el-input v-model="addForm.consultant"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="number">
          <el-input v-model="addForm.number"></el-input>
        </el-form-item>
        <el-form-item label="接电话人" prop="stuName">
          <el-select v-model="addForm.stuName" placeholder="请选择">
            <el-option
                v-for="item in stu"
                :key="item.sId"
                :label="item.stuName"
                :value="item.stuName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <el-date-picker
              v-model="addForm.time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
          </el-date-picker>
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
    <el-dialog title="编辑电话信息" v-model="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="咨询人">
          <el-input v-model="form.consultant"></el-input>
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input v-model="form.number"></el-input>
        </el-form-item>
        <el-form-item label="接电话人">
          <el-select v-model="form.stuName" placeholder="请选择">
            <el-option
                v-for="item in stu"
                :key="item.sId"
                :label="item.stuName"
                :value="item.stuName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
              v-model="form.time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
          </el-date-picker>
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
  name: "number",
  data() {
    return {
      query: {
        address: '',
        stuName: '',
        pageIndex:1,
        pageSize:10
      },
      loading:true,
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
    ...mapState('number',['numberInfo']),
    ...mapState('stu',['student']),
    tableData(){
      return this.numberInfo.list
    },
    total(){
      return this.numberInfo.total
    },
    stu(){
      return this.student
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    ...mapMutations('number',['setNumberInfo']),
    ...mapActions('number',['getAllNumberInfo']),
    // 这里获取的学生信息不是分页获取来的
    ...mapActions('stu',['getStudent']),
    async loadData () {
      const{code,message,data} = await this.$api.number.getAllNumber(this.query.pageIndex,this.query.pageSize)
      this.loading = false
      this.getStudent()
      console.log(data)
      if (code === 200){
        this.setNumberInfo(data)
        this.$message.success(message)
      }else if(code === 201){
        this.$message.error(message)
      }
    },
    //加载全部
     handleLoad(){
      this.query.address = '',
          this.query.stuName = '',
      this.getAllNumberInfo(this.query.pageIndex)
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
      let number = {
        consultant : this.addForm.consultant,
        number : this.addForm.number,
        stuName: this.addForm.stuName,
        time: this.$moment(this.addForm.time).format('yyyy-MM-DD HH:mm:ss')
      }
      const{code,message,data} = await this.$api.number.insertNumber(number)
      this.addVisible = false
      this.$refs.addForm.resetFields()
      console.log(data)
      if (code === 200){
        this.$message.success(message)
        await this.getAllNumberInfo(this.query.pageIndex)
        console.log(this.numberInfo)
      }else if(code === 201){
        this.$message.error(message)
      }
    },
    // 触发搜索按钮
    async handleSearch() {
      let search = {
        page : this.query.pageIndex,
        size : this.query.pageSize,
        address : this.query.address,
        stuName : this.query.stuName
      }
      const {code,message,data} = await this.$api.number.searchNumber(search)
      this.setNumberInfo(data)
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
            await this.$api.number.deleteNumber(this.numberInfo.list[index].nId)
            this.tableData.splice(index, 1);
            await this.getAllNumberInfo(this.query.pageIndex)
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
    // 批量删除number
    delAllNumber() {
      const length = this.multipleSelection.length;
      let str = "";
      for (let i = 0; i < length; i++) {
        if (i === length - 1) {
          str += this.multipleSelection[i].nId
        } else {
          str += this.multipleSelection[i].nId + ",";
        }
      }
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      })
          .then(async () => {
            const {code,message} =await this.$api.number.deleteNumberByIds(str)
            if (code === 200){
              this.$message.success(message);
            }else {
              this.$message.error(message);
            }
            await this.getAllNumberInfo(this.query.pageIndex)
          })
          .catch(() => {});

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
      this.getAllNumberInfo(this.query.pageIndex)
    },
    // 保存编辑,bug问题
    async saveEdit() {
      // this.$set(this.tableData, this.idx, this.form);
      this.editVisible = false
      let number = {
        nId : this.numberInfo.list[this.idx].nId,
        consultant : this.form.consultant,
        number : this.form.number,
        stuName: this.form.stuName,
        time: this.$moment(this.form.time).format('yyyy-MM-DD HH:mm:ss')
      }
      console.log(number)
      const {code,message} =  await this.$api.number.updateNumber(number)
      if (code === 200){
        this.$message.success(`修改第 ${this.idx + 1} 行成功`);
        await this.getAllNumberInfo(this.query.pageIndex)
      }else if(code === 201){
        this.$message.error(message)
      }
    },
    // 分页导航
    handlePageChange(val) {
      this.query.pageIndex = val
      this.getAllNumberInfo(this.query.pageIndex);
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
