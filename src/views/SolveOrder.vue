<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 登单信息
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-left">
        <el-button
            type="danger"
            icon="el-icon-delete"
            class="handle-del mr10"
            @click="delAllSolveOrder"
        >批量删除</el-button>
        <el-button  type="primary" @click="toggleSelection()" icon="el-icon-circle-close">取消全选</el-button>
        <el-input v-model="query.stuName" placeholder="解决人员" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </div>
      <div class="handle-right">
        <el-button type="primary" icon="el-icon-circle-plus" @click="handleAdd">登单</el-button>
        <el-button type="primary" icon="el-icon-refresh-right" @click="handleLoad">加载全部</el-button>
      </div>
      <el-table
          :data="tableData"
          border
          v-loading = "loading"
          class="table"
          ref="multipleTable"
          header-cell-class-name="table-header"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="category" label="出单类别" align="center" width="150px"></el-table-column>
        <el-table-column prop="address" label="客户住址" align="center" width="150px"></el-table-column>
        <el-table-column prop="number" label="联系电话" align="center" width="160px"></el-table-column>
        <el-table-column prop="description" label="故障现象" align="center" width="450px" show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="sendTime" label="故障下达时间" align="center" width="240px"></el-table-column>
        <el-table-column prop="register" label="登记人" align="center" width="150px"></el-table-column>
        <el-table-column prop="dispatcher" label="派单人" align="center" width="150px"></el-table-column>
        <el-table-column prop="solveTime" label="处理时间" align="center" width="240px"></el-table-column>
        <el-table-column prop="maintainer" label="处理人" align="center" width="150px"></el-table-column>
        <el-table-column type="index" prop="status" label="处理结果" align="center" width="120px">
          <template #default="scope">
            <el-tag
                :type="(scope.row.status === 1 ? 'success': (scope.row.status === 0 ? 'danger': ''))"
            >{{ scope.row.status === 0 ? '未解决':'已解决' }}</el-tag>
          </template>
        </el-table-column>
        <!-- 通过故障下达时间和解决时间做时间差，在computed方法中计算解决-->
        <el-table-column v-model="solveTimer" label="故障解决时长" align="center" width="150px"></el-table-column>
        <el-table-column prop="crystalHead" label="水晶头" align="center" width="150px"></el-table-column>
        <el-table-column prop="networkCable" label="面板" align="center" width="150px"></el-table-column>
        <el-table-column prop="panel" label="网线" align="center" width="240px"></el-table-column>
        <el-table-column prop="port" label="端口" align="center" width="150px"></el-table-column>
        <el-table-column prop="reason" label="具体原因" align="center" width="240px"></el-table-column>
        <el-table-column prop="solution" label="解决方法" align="center" width="150px"></el-table-column>
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
<!--    <el-dialog title="添加派单信息" v-model="addVisible" width="30%" @close="addFormClosed">-->
<!--      <el-form ref="addForm" :model="addForm" label-width="70px">-->
<!--        <el-form-item label="故障类型" prop="category">-->
<!--          <el-input v-model="addForm.category"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="用户住址" prop="address">-->
<!--          <el-input v-model="addForm.address"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="联系方式" prop="number">-->
<!--          <el-input v-model="addForm.number"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="派单时间" prop="sendTime">-->
<!--          <el-date-picker-->
<!--              v-model="addForm.sendTime"-->
<!--              type="datetime"-->
<!--              value-format="yyyy-MM-dd HH:mm:ss"-->
<!--              placeholder="选择日期时间">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="派单人" prop="dispatcher">-->
<!--          <el-select v-model="addForm.dispatcher" placeholder="请选择">-->
<!--            <el-option-->
<!--                v-for="item in stu"-->
<!--                :key="item.sId"-->
<!--                :label="item.stuName"-->
<!--                :value="item.stuName">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="预约时间" prop="appointmentTime">-->
<!--          <el-date-picker-->
<!--              v-model="addForm.appointmentTime"-->
<!--              type="datetime"-->
<!--              value-format="yyyy-MM-dd HH:mm:ss"-->
<!--              placeholder="选择日期时间">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="故障描述" prop="description">-->
<!--          <el-input v-model="addForm.description"></el-input>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <template #footer>-->
<!--        <span class="dialog-footer">-->
<!--            <el-button @click="cancelAdd">取 消</el-button>-->
<!--            <el-button type="primary" @click="saveAdd">确 定</el-button>-->
<!--        </span>-->
<!--      </template>-->
<!--    </el-dialog>-->


<!--    &lt;!&ndash; 编辑弹出框 &ndash;&gt;-->
<!--    <el-dialog title="编辑派单信息" v-model="editVisible" width="30%">-->
<!--      <el-form ref="form" :model="form" label-width="70px">-->
<!--        <el-form-item label="故障类型" prop="category">-->
<!--          <el-input v-model="form.category"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="用户住址" prop="address">-->
<!--          <el-input v-model="form.address"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="联系方式" prop="number">-->
<!--          <el-input v-model="form.number"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="派单时间" prop="sendTime">-->
<!--          <el-date-picker-->
<!--              v-model="form.sendTime"-->
<!--              type="datetime"-->
<!--              value-format="yyyy-MM-dd HH:mm:ss"-->
<!--              placeholder="选择日期时间">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="派单人" prop="dispatcher">-->
<!--          <el-select v-model="form.dispatcher" placeholder="请选择">-->
<!--            <el-option-->
<!--                v-for="item in stu"-->
<!--                :key="item.sId"-->
<!--                :label="item.stuName"-->
<!--                :value="item.stuName">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="预约时间" prop="appointmentTime">-->
<!--          <el-date-picker-->
<!--              v-model="form.appointmentTime"-->
<!--              type="datetime"-->
<!--              value-format="yyyy-MM-dd HH:mm:ss"-->
<!--              placeholder="选择日期时间">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="故障描述" prop="description">-->
<!--          <el-input v-model="form.description"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="状态" prop="status">-->
<!--          <el-input v-model="form.status"></el-input>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <template #footer>-->
<!--        <span class="dialog-footer">-->
<!--            <el-button @click="cancelEdit">取 消</el-button>-->
<!--            <el-button type="primary" @click="saveEdit">确 定</el-button>-->
<!--        </span>-->
<!--      </template>-->
<!--    </el-dialog>-->
  </div>
</template>

<script>
import {mapState,mapMutations,mapActions} from 'vuex'
export default {
  name: "solveOrder",
  data() {
    return {
      query: {
        // address: '',
        stuName: '',
        pageIndex:1,
        pageSize:10
      },
      loading:true,
      // addForm:{},
      // form:{
      //   sendTime: '',
      //   appointmentTime: ''
      // },
      multipleSelection: [],
      // editVisible: false,
      // addVisible:false,
      idx:-1,
      id:-1,
    }
  },
  computed:{
    ...mapState('solveOrder',['solveOrderInfo']),
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
    ...mapMutations('solveOrder',['setSolveOrderInfo']),
    ...mapActions('solveOrder',['getAllSolveOrderInfo']),
    // 加载数据
    async loadData () {
      const{code,message,data} = await this.$api.solveOrder.getAllSolveOrder(this.query.pageIndex,this.query.pageSize)
      this.loading = false,
      console.log(data)
      this.setSolveOrderInfo(data)
      console.log(data)
      if (code === 200){
        this.$message.success(message)
      }else if(code === 201){
        this.$message.error(message)
      }
    },
    //加载全部
    handleLoad(){
      this.query.stuName = '',
      this.getAllSolveOrderInfo(this.query.pageIndex)
    },
    // 触发添加按钮
    handleAdd(){
      // this.addVisible = true
    },
    cancelAdd(){
      // this.addVisible = false
    },
    // addFormClosed(){
    //   this.$refs.addForm.resetFields()
    // },
    // 触发添加order的操作
    // async saveAdd(){
    //   let order = {
    //     category : this.addForm.category,
    //     address : this.addForm.address,
    //     number : this.addForm.number,
    //     sendTime : this.$moment(this.addForm.sendTime).format('yyyy-MM-DD HH:mm:ss'),
    //     dispatcher : this.addForm.dispatcher,
    //     description : this.addForm.description,
    //     appointmentTime : this.$moment(this.addForm.appointmentTime).format('YYYY-MM-DD hh:mm:ss'),
    //   }
    //   console.log(order)
    //   const{code,message,data} = await this.$api.order.insertOrder(order)
    //   this.addVisible = false
    //   this.$refs.addForm.resetFields()
    //   console.log(data)
    //   if (code === 200){
    //     this.$message.success(message)
    //     await this.getAllOrderInfo(this.query.pageIndex)
    //     console.log(this.orderInfo)
    //   }else if(code === 201){
    //     this.$message.error(message)
    //   }
    // },
    // 触发搜索按钮
    async handleSearch() {
      let search = {
        page : this.query.pageIndex,
        size : this.query.pageSize,
        stuName : this.query.stuName
      }
      const {code,message,data} = await this.$api.solveOrder.searchSolveOrder(search)
      this.setSolveOrderInfo(data)
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
            await this.$api.solveOrder.deleteSolveOrder(this.orderInfo.list[index].oId)
            this.tableData.splice(index, 1);
            await this.getAllSolveOrderInfo(this.query.pageIndex)
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
    // 批量删除solveOrder
    delAllOrder() {
      const length = this.multipleSelection.length;
      let str = "";
      for (let i = 0; i < length; i++) {
        if (i === length - 1) {
          str += this.multipleSelection[i].solveId
        } else {
          str += this.multipleSelection[i].solveId + ",";
        }
      }
      console.log(str)
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      })
          .then(async () => {
            const {code,message} =await this.$api.solveOrder.deleteSolveOrderByIds(str)
            if (code === 200){
              this.$message.success(message);
            }else {
              this.$message.error(message);
            }
            await this.getAllSolveOrderInfo(this.query.pageIndex)
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
      this.getAllSolveOrderInfo(this.query.pageIndex)
    },
    // 保存编辑,bug问题
    async saveEdit() {
      // this.$set(this.tableData, this.idx, this.form);
      this.editVisible = false
      let solveOrder = {
        solveId : this.solveOrderInfo.list[this.idx].solveId,
        customerName : this.form.customerName,
        register : this.form.register,
        solveTime : this.$moment(this.form.solveTime).format('YYYY-MM-DD hh:mm:ss'),
        dispatcher : this.form.dispatcher,
        description: this.form.description,
        appointmentTime : this.$moment(this.form.appointmentTime).format('YYYY-MM-DD hh:mm:ss'),
        status : this.form.status
      }
      const {code,message} =  await this.$api.solveOrder.updateSolveOrder(solveOrder)
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
      this.getAllSolveOrderInfo(this.query.pageIndex);
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
