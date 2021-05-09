<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 奖惩信息
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-left">
        <el-button
            type="danger"
            icon="el-icon-delete"
            class="handle-del mr10"
            @click="delAllFine"
        >批量删除</el-button>
        <el-button  type="primary" @click="toggleSelection()" icon="el-icon-circle-close">取消全选</el-button>
        <el-select v-model="query.sId" placeholder="学生姓名" class="handle-select mr10" clearable>
          <el-option
              v-for="item in stu"
              :key="item.sId"
              :label="item.stuName"
              :value="item.sId">
          </el-option>
        </el-select>
        <el-date-picker
            v-model="query.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" style="margin-right:10px">
        </el-date-picker>
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
        <el-table-column prop="sIdsName" label="学生姓名" align="center"></el-table-column>
        <el-table-column prop="category" label="奖励or罚款" align="center">
          <template #default="scope">
            <el-tag
                :type="(scope.row.category === 1 ? 'success': (scope.row.category === 0 ? 'danger': ''))"
            >{{ scope.row.category === 1 ?'奖励':'罚款'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="money" label="金钱" align="center"></el-table-column>
        <el-table-column prop="description" label="奖惩详情" align="center"></el-table-column>
        <el-table-column prop="time" label="奖惩时间" align="center"></el-table-column>
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
        <el-button type="success" plain @click="handleTotalMoney">奖惩总计>></el-button>
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
    <el-dialog title="添加奖惩信息" v-model="addVisible" width="50%" @close="addFormClosed">
      <el-form ref="addForm" :model="addForm" label-width="70px">
    <!-- 加一个checkout多项选择器-->
        <el-form-item label="学生姓名">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleAddCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="addForm.sIds" @change="handleAddCheckedStudent">
            <el-checkbox v-for="item in student" :label="item.sId" :key="item.sId">{{item.stuName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="奖惩类别">
        <!--这里使用:lable=“1”才是绑定的数字1-->
          <el-radio v-model="query.radio" :label="1">奖励</el-radio>
          <el-radio v-model="query.radio" :label="0">惩罚</el-radio>
        </el-form-item>
        <el-form-item label="金钱">
          <el-input v-model="addForm.money"></el-input>
        </el-form-item>
        <el-form-item label="奖惩详情">
          <el-input v-model="addForm.description"></el-input>
        </el-form-item>
        <el-form-item label="奖惩时间" prop="time">
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
        <el-form-item label="学生姓名" prop="sIds">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleEditCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="form.sIds" @change="handleEditCheckedStudent">
            <el-checkbox v-for="stu in student" :label="stu.sId" :key="stu.sId">{{stu.stuName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="奖惩类别" prop="category">
          <el-radio v-model="query.radio1" :label="1">奖励</el-radio>
          <el-radio v-model="query.radio1" :label="0">惩罚</el-radio>
        </el-form-item>
        <el-form-item label="金钱" prop="money">
          <el-input v-model="form.money"></el-input>
        </el-form-item>
        <el-form-item label="奖惩详情">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="奖惩时间" prop="time">
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
import {mapActions, mapMutations, mapState} from 'vuex'

export default {
  name: "fine",
  data() {
    return {
      query: {
        sId:null,
        dateRange:[],
        pageIndex:1,
        radio1:0,
        pageSize:10,
      },
      checkAll:false,
      isIndeterminate: false,
      addForm:{
        sIds:[]
      },
      form:{
        sIds:[],

      },
      loading : true,
      multipleSelection: [],
      editVisible: false,
      addVisible:false,
      idx:-1,
      id:-1,
    }
  },
  computed:{
    ...mapState('fine',['fineInfo']),
    // 单独获取的所有学生信息
    ...mapState('stu',['student']),
    tableData(){
      let fineArr = this.fineInfo.list
      for(let j =0;j<fineArr.length;j++){
        let str = ""
        let stuArr = fineArr[j].students
        for (let i = 0; i<stuArr.length;i++){
          str += (i === stuArr.length-1?stuArr[i].stuName:stuArr[i].stuName+' ')
        }
        fineArr[j].sIdsName = str
      }
      return fineArr
    },
    total(){
      return this.fineInfo.total
    },
    stu(){
      return this.student
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    ...mapMutations('fine',['setFineInfo']),
    ...mapActions('fine',['getAllFineInfo']),
    // 这里获取的学生信息不是分页获取来的
    ...mapActions('stu',['getStudent']),
    async loadData () {
      this.getStudent()
      const{code,message,data} = await this.$api.fine.getAllFine(this.query.pageIndex,this.query.pageSize)
      this.loading = false
      console.log(data)
      if (code === 200){
        this.setFineInfo(data)
        this.$message.success(message)
      }else if(code === 201){
        this.$message.error(message)
      }
    },
    //加载全部
    handleLoad(){
      this.query.sId = '',
          this.query.dateRange=[],
          this.getAllFineInfo(this.query.pageIndex)
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
      // 将学生id,以逗号分割，绑定至string里面
      let stuArr = this.addForm.sIds
      let str = ""
      for(let i =0;i<stuArr.length;i++){
        str += (i === stuArr.length-1 ? stuArr[i] : stuArr[i]+",")
      }
      let fine = {
        sIds : str,
        category : this.query.radio,
        money: this.addForm.money,
        description : this.addForm.description,
        time: this.$moment(this.addForm.time).format('yyyy-MM-DD HH:mm:ss')
      }
      console.log(fine)
      const{code,message} = await this.$api.fine.insertFine(fine)
      this.addVisible = false
      if (code === 200){
        this.$message.success(message)
        await this.getAllFineInfo(this.query.pageIndex)
        console.log(this.fineInfo)
      }else if(code === 201){
        this.$message.error(message)
      }
    },
    // 触发搜索按钮
    async handleSearch() {
      let search = {
        page : this.query.pageIndex,
        size : this.query.pageSize,
        sIds : this.query.sId,
        // 这里的时间如果选，date-picker默认会选择电脑当前时间，这个问题不知道咋解决，就只能在后端判断如果两个时间相同，查询时就不带上改参数
        // 有大佬知道如何让其不填充电脑当前时间的吗？求解
        startTime: this.$moment(this.query.dateRange[0]).format('yyyy-MM-DD HH:mm:ss'),
        endTime: this.$moment(this.query.dateRange[1]).format('yyyy-MM-DD HH:mm:ss')
      }
      const {code,message,data} = await this.$api.fine.searchFine(search)
      this.setFineInfo(data)
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
            await this.$api.fine.deleteFine(this.fineInfo.list[index].fId)
            this.tableData.splice(index, 1);
            await this.getAllFineInfo(this.query.pageIndex)
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
    // 批量删除fine
    delAllFine() {
      // 二次确认删除
      const length = this.multipleSelection.length;
      let str = "";
      for (let i = 0; i < length; i++) {
        if (i === length - 1) {
          str += this.multipleSelection[i].fId
        } else {
          str += this.multipleSelection[i].fId + ",";
        }
      }
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      })
          .then(async () => {
            this.$message.success("删除成功")
            const {code,message} =await this.$api.fine.deleteFineByIds(str)
            if (code === 200){
              this.$message.success(message);
            }else {
              this.$message.error(message);
            }
            await this.getAllFineInfo(this.query.pageIndex)
          })
          .catch(() => {});
      this.multipleSelection = [];
    },
    // 编辑操作
    handleEdit(index, row) {
      let formArr = row
      this.idx = index;
      //这是字符串
      let sId = formArr.sIds.split(',')
      for (let i = 0;i<sId.length;i++){
        sId[i] = parseInt(sId[i])
      }
      formArr.sIds = sId
      this.query.radio1 = formArr.category
      this.form = formArr
      this.editVisible = true;
    },
    cancelEdit(){
      this.editVisible = false
      this.getAllFineInfo(this.query.pageIndex)
    },
    // 保存编辑,bug问题
    async saveEdit() {
      // this.$set(this.tableData, this.idx, this.form);
      // 将学生id,以逗号分割，绑定至string里面
      let stuArr = this.form.sIds
      let str = ""
      for(let i =0;i<stuArr.length;i++){
        str += (i === stuArr.length-1 ? stuArr[i] : stuArr[i]+",")
      }
      this.editVisible = false
      let fine = {
        fId : this.fineInfo.list[this.idx].fId,
        sIds : str,
        category :  this.query.radio1,
        money: this.form.money,
        description: this.form.description,
        time: this.$moment(this.form.time).format('yyyy-MM-DD HH:mm:ss')
      }
      console.log(fine)
      const {code,message} =  await this.$api.fine.updateFine(fine)
      if (code === 200){
        this.$message.success(`修改第 ${this.idx + 1} 行成功`);
        await this.getAllFineInfo(this.query.pageIndex)
      }else if(code === 201){
        this.$message.error(message)
      }

    },
    // 分页导航
    handlePageChange(val) {
      this.query.pageIndex = val
      this.getAllFineInfo(this.query.pageIndex);
    },
    // check多选框的执行方法,全选CheckBox触发的方法,val==ture表示全选按钮被选中
    handleAddCheckAllChange(val) {
      let stuArr = []
      for(let i=0;i<this.student.length;i++){
        stuArr.push(this.student[i].sId)
      }
      this.addForm.sIds = val ? stuArr:[]
      this.isIndeterminate = false;
    },
    handleAddCheckedStudent(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.student.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.student.length;
      this.addForm.sIds = value
    },
    handleEditCheckAllChange(val) {
      let stuArr = []
      for(let i=0;i<this.student.length;i++){
        stuArr.push(this.student[i].sId)
      }
      this.form.sIds = val ? stuArr:[]
      this.isIndeterminate = false;
    },
    handleEditCheckedStudent(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.student.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.student.length;
      this.form.sIds = value
    },
    handleTotalMoney(){
      this.$router.push({path:'/reward'})
    }
  }
};
</script>

<style>
.el-dialog__body {
  padding:0px 10px;
}
.el-pagination{
  padding: 15px 5px;
}
.pagination{
  margin: 10px 0px;
}
</style>

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
