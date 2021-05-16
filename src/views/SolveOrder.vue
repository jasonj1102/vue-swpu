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
        <el-select v-model="query.sId" placeholder="处理人" class="handle-select mr10" clearable>
          <el-option
              v-for="item in stu"
              :key="item.sId"
              :label="item.stuName"
              :value="item.sId">
          </el-option>
        </el-select>
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
        <el-table-column prop="order.category" label="出单类别" align="center" width="100px"></el-table-column>
        <el-table-column prop="order.address" label="客户住址" align="center" width="150px"></el-table-column>
        <el-table-column prop="order.number" label="联系电话" align="center" width="160px"></el-table-column>
        <el-table-column prop="order.description" label="故障现象" align="center" width="300px" show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="order.sendTime" label="故障下达时间" align="center" width="180px"></el-table-column>
        <el-table-column prop="order.dispatcher" label="派单人" align="center" width="100px"></el-table-column>
        <el-table-column prop="register" label="登记人" align="center" width="100px"></el-table-column>
        <el-table-column prop="solveTime" label="处理时间" align="center" width="180px"></el-table-column>
        <el-table-column prop="maintainerName" label="处理人" align="center" width="200px"></el-table-column>
        <el-table-column prop="customerName" label="客户签字" align="center" width="100px"></el-table-column>
        <el-table-column type="index" prop="status" label="处理结果" align="center" width="120px">
          <template #default="scope">
            <el-tag
                :type="(scope.row.status === 1 ? 'success': (scope.row.status === 0 ? 'danger': ''))"
            >{{ scope.row.status === 0 ? '未解决':'已解决' }}</el-tag>
          </template>
        </el-table-column>
        <!-- 通过故障下达时间和解决时间做时间差，在computed方法中计算解决-->
        <el-table-column prop="duration" label="故障解决时长" align="center" width="180px"></el-table-column>
        <el-table-column prop="material.crystalHead" label="水晶头" align="center" width="70px"></el-table-column>
        <el-table-column prop="material.networkCable" label="面板" align="center" width="50px"></el-table-column>
        <el-table-column prop="material.panel" label="网线" align="center" width="50px"></el-table-column>
        <el-table-column prop="material.port" label="端口" align="center" width="50px"></el-table-column>
        <el-table-column prop="reason" label="具体原因" align="center" width="200px"></el-table-column>
        <el-table-column prop="solution" label="解决方法" align="center" width="200px"></el-table-column>
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

    <!--            <el-form ref="form.order" :model="form.order">-->
    <!--              <el-form-item width="150" label="出单类别" prop="category"></el-form-item>-->
    <!--              <el-form-item width="100" label="客户住址"></el-form-item>-->
    <!--              <el-form-item width="300" label="联系电话"></el-form-item>-->
    <!--              <el-form-item width="150" label="派单人"></el-form-item>-->
    <!--              <el-form-item width="100" label="派单时间"></el-form-item>-->
    <!--              <el-form-item width="300" label="故障现象"></el-form-item>-->
    <!--            </el-form>-->

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑登单信息" v-model="editVisible" width="50%">
      <el-form ref="form" :model="form" label-width="70px">
<!--          这个是派单信息的弹框，不能进行编辑-->
        <el-form-item label="派单详情">
          <el-popover trigger="hover" placement="right" disabled="true">
            <p>姓名:{{form.order.category}}</p>
              <el-input size="medium" slot="reference" v-model="form.order.address"></el-input>
          </el-popover>
<!--          <el-popover placement="right">-->
<!--            <span>用户昵称: {{ form.order.category }}</span>-->
<!--            <el-input-->
<!--                slot="reference"-->
<!--                v-model="form.order.category"-->
<!--                auto-complete="off"-->
<!--                disabled-->
<!--            />-->
<!--          </el-popover>-->
        </el-form-item>
        <el-form-item label="登记人">
          <el-input v-model="form.register"></el-input>
        </el-form-item>
        <el-form-item label="处理时间">
          <el-date-picker
              v-model="form.solveTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择处理日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="处理人">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleEditCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="form.sIds" @change="handleEditCheckedStudent">
            <!--stu-->
            <el-checkbox v-for="s in stu" :label="s.sId" :key="s.sId">{{s.stuName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="客户签字">
          <el-input v-model="form.customerName"></el-input>
        </el-form-item>
        <el-form-item label="处理结果">
          <!--  使用el中的开关控件和一个tag标签吧 -->
          <!--这里暂时没有写控件去控制状态，后面在order和solveOrder中会加上 -->
          <el-input v-model="form.status"></el-input>
        </el-form-item>
        <el-form-item label="水晶头">
          <el-input v-model="form.material.crystalHead"></el-input>
        </el-form-item>
        <el-form-item label="面板">
          <el-input v-model="form.material.networkCable"></el-input>
        </el-form-item>
        <el-form-item label="网线">
          <el-input v-model="form.material.panel"></el-input>
        </el-form-item>
        <el-form-item label="端口">
          <el-input v-model="form.material.port"></el-input>
        </el-form-item>
        <el-form-item label="具体原因">
          <el-input v-model="form.reason"></el-input>
        </el-form-item>
        <el-form-item label="解决方法">
          <el-input v-model="form.solution"></el-input>
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
  name: "solveOrder",
  data() {
    return {
      query: {
        // address: '',
        sId:null,
        stuName: '',
        pageIndex:1,
        pageSize:10
      },
      checkAll:false,
      isIndeterminate: false,
      loading:true,
      // addForm:{},
      form:{
        sIds:[],
      },
      multipleSelection: [],
      editVisible: false,
      // addVisible:false,
      idx:-1,
      id:-1,
    }
  },
  computed:{
    ...mapState('solveOrder',['solveOrderInfo']),
    ...mapState('stu',['student']),
    tableData(){
      let solveOrderArr = this.solveOrderInfo.list
      for(let j =0;j<solveOrderArr.length;j++){
        let str = ""
        let stuArr = solveOrderArr[j].maintainers
        let startTime =  this.$moment(solveOrderArr[j].order.sendTime).format('YYYY-MM-DD hh:mm:ss')
        let endTime = this.$moment(solveOrderArr[j].solveTime).format('YYYY-MM-DD hh:mm:ss')
        for (let i = 0; i<stuArr.length;i++){
          str += (i === stuArr.length-1?stuArr[i].stuName:stuArr[i].stuName+' ')
        }
        solveOrderArr[j].maintainerName = str
        solveOrderArr[j].duration = this.getDuration(startTime,endTime)
      }
      return solveOrderArr
    },
    total(){
      return this.solveOrderInfo.total
    },
    stu(){
      return this.student
    }
  },
  created() {
    this.loadData()
  },
  watch:{
    "$route":"fetchSolveOrder"
  },
  methods: {
    ...mapMutations('solveOrder',['setSolveOrderInfo']),
    ...mapActions('solveOrder',['getAllSolveOrderInfo']),
    ...mapActions('stu',['getStudent']),
    // 加载数据
    fetchSolveOrder(){
      if(this.$route.path ==='/solveOrder'){
        console.log('跳转成功')
        this.getAllSolveOrderInfo(this.query.pageIndex)
      }
    },
    async loadData () {
      this.getStudent()
      const{code,message,data} = await this.$api.solveOrder.getAllSolveOrder(this.query.pageIndex,this.query.pageSize)
      this.loading = false
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
      this.query.sId = null,
      this.getAllSolveOrderInfo(this.query.pageIndex)
    },
    // 触发添加按钮,跳转至登单的form表单
    handleAdd(){
      this.$router.push({path:'/solveOrderForm'})
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
        sId : this.query.sId
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
            await this.$api.solveOrder.deleteSolveOrder(this.solveOrderInfo.list[index].solveId)
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
    delAllSolveOrder() {
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
      let formArr = row
      this.idx = index;
      //这是字符串
      let sId = formArr.maintainer.split(',')
      for (let i = 0;i<sId.length;i++){
        sId[i] = parseInt(sId[i])
      }
      formArr.sIds = sId
      this.form = formArr
      this.editVisible = true;
    },
    cancelEdit(){
      this.editVisible = false
      this.getAllSolveOrderInfo(this.query.pageIndex)
    },
    // 保存编辑,bug问题
    async saveEdit() {
      // this.$set(this.tableData, this.idx, this.form);
      let stuArr = this.form.sIds
      let str = ""
      for(let i =0;i<stuArr.length;i++){
        str += (i === stuArr.length-1 ? stuArr[i] : stuArr[i]+",")
      }
      let material ={
        mId : this.solveOrderInfo.list[this.idx].material.mId,
        crystalHead:parseInt(this.form.material.crystalHead),
        networkCable:parseInt(this.form.material.networkCable),
        panel:parseInt(this.form.material.panel),
        port:parseInt(this.form.material.port)
      }
      let solveOrder = {
        solveId : this.solveOrderInfo.list[this.idx].solveId,
        customerName : this.form.customerName,
        register : this.form.register,
        solveTime : this.$moment(this.form.solveTime).format('YYYY-MM-DD hh:mm:ss'),
        maintainer : str,
        material:{
          ...material
        },
        reason: this.form.reason,
        status:parseInt(this.form.status),
        solution : this.form.solution
      }
      console.log(solveOrder)
      const {code,message} =  await this.$api.solveOrder.updateSolveOrder(solveOrder)
      this.editVisible = false
      if (code === 200){
        this.$message.success(`修改第 ${this.idx + 1} 行成功`);
        await this.getAllSolveOrderInfo(this.query.pageIndex)
      }else if(code === 201){
        this.$message.error(message)
      }
    },
    // 分页导航
    handlePageChange(val) {
      this.query.pageIndex = val
      this.getAllSolveOrderInfo(this.query.pageIndex);
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
    // 计算时间差
    getDuration(startTime,endTime){
      //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
      let dateBegin = new Date(startTime.replace(/-/g, "/"))//将-转化为/，使用new Date
      let dateEnd = new Date(endTime.replace(/-/g, "/"))
      let dateDiff = dateEnd.getTime() - dateBegin.getTime()//时间差的毫秒数
      let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000))//计算出相差天数
      let leave1=dateDiff%(24*3600*1000)    //计算天数后剩余的毫秒数
      let hours=Math.floor(leave1/(3600*1000))//计算出小时数
      //计算相差分钟数
      let leave2=leave1%(3600*1000)    //计算小时数后剩余的毫秒数
      let minutes=Math.floor(leave2/(60*1000))//计算相差分钟数
      //计算相差秒数
      let leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
      let seconds=Math.round(leave3/1000)
      return dayDiff+"天"+hours+"时"+minutes+"分"+seconds+"秒"
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
