<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 派单信息
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-left">
        <el-button
            type="primary"
            icon="el-icon-delete"
            class="handle-del mr10"
            @click="delAllOrder"
        >批量删除</el-button>
        <el-button  type="primary" @click="toggleSelection()">取消选择</el-button>
        <el-select v-model="query.address" placeholder="派单地址" class="handle-select mr10">
          <el-option key="1" label="明理楼" value="明理楼"></el-option>
          <el-option key="2" label="思学楼" value="思学楼"></el-option>
          <el-option key="3" label="博学楼" value="博学楼"></el-option>
          <el-option key="4" label="学生公寓" value="学生公寓"></el-option>
        </el-select>
        <el-input v-model="query.stuName" placeholder="派单人" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </div>
      <div class="handle-right">
        <el-button type="primary" icon="el-icon-circle-plus" @click="handleAdd">派单</el-button>
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
        <el-table-column prop="category" label="故障类型" align="center" width="100px"></el-table-column>
        <el-table-column prop="address" label="用户住址" align="center" width="130px"></el-table-column>
        <el-table-column prop="number" label="联系方式" align="center" width="160px"></el-table-column>
        <el-table-column prop="sendTime" label="派单时间" align="center" width="160px"></el-table-column>
        <el-table-column prop="dispatcher" label="派单人" align="center" width="150px"></el-table-column>
        <el-table-column prop="appointmentTime" label="预约时间" align="center" width="160px"></el-table-column>
        <el-table-column prop="description" label="故障描述" align="center" width="450px" show-overflow-tooltip="true"></el-table-column>
        <el-table-column type="index" prop="status" label="状态" align="center" width="100px">
          <template #default="scope">
            <el-tag
                :type="(scope.row.status === 1 ? 'success': (scope.row.status === 0 ? 'danger': ''))"
            >{{ scope.row.status === 0 ? '处理中':'已完成' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
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
    <el-dialog title="添加派单信息" v-model="addVisible" width="30%" @close="addFormClosed">
      <el-form ref="addForm" :model="addForm" label-width="70px">
        <el-form-item label="故障类型" prop="category">
          <el-input v-model="addForm.category"></el-input>
        </el-form-item>
        <el-form-item label="用户住址" prop="address">
          <el-input v-model="addForm.address"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="number">
          <el-input v-model="addForm.number"></el-input>
        </el-form-item>
        <el-form-item label="派单时间" prop="sendTime">
          <el-date-picker
              v-model="addForm.sendTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="派单人" prop="dispatcher">
          <el-select v-model="addForm.dispatcher" placeholder="请选择">
            <el-option
                v-for="item in stu"
                :key="item.sId"
                :label="item.stuName"
                :value="item.stuName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预约时间" prop="appointmentTime">
          <el-date-picker
              v-model="addForm.appointmentTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="故障描述" prop="description">
          <el-input v-model="addForm.description"></el-input>
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
    <el-dialog title="编辑派单信息" v-model="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="故障类型" prop="category">
          <el-input v-model="form.category"></el-input>
        </el-form-item>
        <el-form-item label="用户住址" prop="address">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="number">
          <el-input v-model="form.number"></el-input>
        </el-form-item>
        <el-form-item label="派单时间" prop="sendTime">
          <el-date-picker
              v-model="form.sendTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="派单人" prop="dispatcher">
          <el-select v-model="form.dispatcher" placeholder="请选择">
            <el-option
                v-for="item in stu"
                :key="item.sId"
                :label="item.stuName"
                :value="item.stuName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预约时间" prop="appointmentTime">
          <el-date-picker
              v-model="form.appointmentTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="故障描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-input v-model="form.status"></el-input>
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
  name: "order",
  data() {
    return {
      query: {
        address: '',
        stuName: '',
        pageIndex:1,
        pageSize:10
      },
      addForm:{},
      form:{
        sendTime: '',
        appointmentTime: ''
      },
      multipleSelection: [],
      editVisible: false,
      addVisible:false,
      idx:-1,
      id:-1,
    }
  },
  computed:{
    ...mapState('stu',['student']),
    ...mapState('order',['orderInfo']),
    // status(){
    //   let s = this.tableData[this].status
    //   console.log(s)
    //   if(s === 1){
    //     return '已完成'
    //   }else if (s === 0){
    //     return '处理中'
    //   }else {
    //     return ''
    //   }
    // },
    stu(){
      return this.student
    },
    tableData(){
      return this.orderInfo.list
    },
    total(){
      return this.orderInfo.total
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    ...mapMutations('order',['setOrderInfo']),
    ...mapActions('order',['getAllOrderInfo']),
    // 这里获取的学生信息不是分页获取来的
    ...mapActions('stu',['getStudent']),
    // 加载数据
    async loadData () {
      const{code,message,data} = await this.$api.order.getAllOrder(this.query.pageIndex,this.query.pageSize)
      this.getStudent()
      console.log(data)
      this.setOrderInfo(data)
      console.log(data)
      if (code === 200){
        this.$message.success(message)
      }else if(code === 201){
        this.$message.error(message)
      }
    },
    //加载全部
    handleLoad(){
      this.query.address = '',
          this.query.stuName = '',
          this.getAllOrderInfo(this.query.pageIndex)
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
    // 触发添加order的操作
    async saveAdd(){
      let order = {
        category : this.addForm.category,
        address : this.addForm.address,
        number : this.addForm.number,
        sendTime : this.$moment(this.addForm.sendTime).format('yyyy-MM-DD HH:mm:ss'),
        dispatcher : this.addForm.dispatcher,
        description : this.addForm.description,
        appointmentTime : this.$moment(this.addForm.appointmentTime).format('YYYY-MM-DD hh:mm:ss'),
      }
      console.log(order)
      const{code,message,data} = await this.$api.order.insertOrder(order)
      this.addVisible = false
      this.$refs.addForm.resetFields()
      console.log(data)
      if (code === 200){
        this.$message.success(message)
        await this.getAllOrderInfo(this.query.pageIndex)
        console.log(this.orderInfo)
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
      const {code,message,data} = await this.$api.order.searchOrder(search)
      this.setOrderInfo(data)
      if (code === 200){
        this.$message.success(message)
      }else {
        this.$message.error(message)
      }
    },
    // 删除操作
    handleDelete(index) {
      console.log(index)
      // 二次确认删除
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      })
          .then(async () => {
            this.$message.success("删除成功");
            console.log(index)
            await this.$api.order.deleteOrder(this.orderInfo.list[index].oId)
            this.tableData.splice(index, 1);
            await this.getAllOrderInfo(this.query.pageIndex)
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
    // 批量删除order
    async delAllOrder() {
      const length = this.multipleSelection.length;
      let str = "";
      for (let i = 0; i < length; i++) {
        if (i === length - 1) {
          str += this.multipleSelection[i].oId
        } else {
          str += this.multipleSelection[i].oId + ",";
        }
      }
      console.log(str)
      const {code,message} =await this.$api.order.deleteOrderByIds(str)
      if (code === 200){
        this.$message.success(message);
      }else {
        this.$message.error(message);
      }
      await this.getAllOrderInfo(this.query.pageIndex)
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
      this.getAllOrderInfo(this.query.pageIndex)
    },
    // 保存编辑,bug问题
    async saveEdit() {
      // this.$set(this.tableData, this.idx, this.form);
      this.editVisible = false
      let order = {
        oId : this.orderInfo.list[this.idx].oId,
        category : this.form.category,
        address : this.form.address,
        number : this.form.number,
        sendTime : this.$moment(this.form.sendTime).format('YYYY-MM-DD hh:mm:ss'),
        dispatcher : this.form.dispatcher,
        description: this.form.description,
        appointmentTime : this.$moment(this.form.appointmentTime).format('YYYY-MM-DD hh:mm:ss'),
        status : this.form.status
      }
      console.log(order)
      const {code,message} =  await this.$api.order.updateOrder(order)
      if (code === 200){
        this.$message.success(`修改第 ${this.idx + 1} 行成功`);
        await this.getAllOrderInfo(this.query.pageIndex)
      }else if(code === 201){
        this.$message.error(message)
      }

    },
    // 分页导航
    handlePageChange(val) {
      this.query.pageIndex = val
      this.getAllOrderInfo(this.query.pageIndex);
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
