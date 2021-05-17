<template>
  <el-form class="addForm" ref="form" :model="form" label-position="left" label-width="120px" >
    <el-form-item label="未处理派单详情">
      <el-select v-model="form.oId" placeholder="请选择未完成派单">
        <el-option
            v-for="item in orderList"
            :key="item.oId"
            style="color: #8cc5ff"
            :label='"地址:"+item.address+" 电话:"+item.number+" 派单人:"+item.dispatcher+" 派单时间:"+item.sendTime+" 预约时间:"+item.appointmentTime'
            :value="item.oId">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="登记人">
      <el-input class="c1" v-model="form.register" placeholder="请输入登记人" clearable ></el-input>
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
      <el-checkbox-group v-model="form.maintainer" @change="handleEditCheckedStudent">
        <!--stu-->
        <el-checkbox v-for="s in stu" :label="s.sId" :key="s.sId">{{s.stuName}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="客户签字">
      <el-input class="c1" placeholder="请输入客户名字" v-model="form.customerName" clearable></el-input>
    </el-form-item>
    <el-form-item label="处理结果">
      <!--  使用el中的开关控件和一个tag标签吧 -->
      <!--这里暂时没有写控件去控制状态，后面在order和solveOrder中会加上 -->
        <!--这里使用:lable=“1”才是绑定的数字1-->
        <el-radio v-model="form.status" :label="1">已解决</el-radio>
        <el-radio v-model="form.status" :label="0">未解决</el-radio>
    </el-form-item>
    <el-form-item label="水晶头">
      <el-input class="c1" placeholder="水晶头个数" clearable  v-model="form.material.crystalHead"></el-input>
    </el-form-item>
    <el-form-item  label="面板">
      <el-input class="c1" placeholder="面板个数" clearable v-model="form.material.networkCable"></el-input>
    </el-form-item>
    <el-form-item label="网线">
      <el-input class="c1" placeholder="网线条数" clearable v-model="form.material.panel"></el-input>
    </el-form-item>
    <el-form-item label="端口">
      <el-input class="c1" placeholder="端口个数" clearable v-model="form.material.port"></el-input>
    </el-form-item>
    <el-form-item label="具体原因">
      <el-input class="c2" placeholder="具体原因" clearable v-model="form.reason"></el-input>
    </el-form-item>
    <el-form-item label="解决方法">
      <el-input class="c2" placeholder="解决方法" clearable v-model="form.solution"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">登单</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import {mapState,mapActions} from 'vuex'
export default {
  data() {
    return {
      form: {
        customerName:'',
        register:'',
        solveTime:'',
        maintainer:[],
        status:null,
        reason:'',
        solution:'',
        material:{
          crystalHead:null,
          networkCable:null,
          panel:null,
          port:null
        }
      },
      checkAll:false,
      isIndeterminate: false
    }
  },
  computed:{
    ...mapState('stu',['student']),
    ...mapState('order',['orderInfo']),
    orderList(){
      return this.orderInfo.list
    },
    stu(){
      return this.student
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    ...mapActions('stu',['getStudent']),
    ...mapActions('order',['getAllOrderInfoNotFinish',]),
    loadData(){
      this.getStudent()
      this.getAllOrderInfoNotFinish()
    },
    async onSubmit() {
      let str = ""
      let stuArr = this.form.maintainer
      for (let i=0;i<stuArr.length;i++){
        if(i === stuArr.length-1){
          str +=stuArr[i]
        }else {
          str +=stuArr[i]+","
        }
      }
      let solveOrder = {
        oId : this.form.oId,
        customerName:this.form.customerName,
        register:this.form.register,
        solveTime:this.$moment(this.form.solveTime).format('YYYY-MM-DD HH:mm:ss'),
        maintainer:str,
        status:this.form.status,
        reason:this.form.reason,
        solution:this.form.solution,
        material:{
          crystalHead:this.form.material.crystalHead,
          networkCable:this.form.material.networkCable,
          panel:this.form.material.panel,
          port:this.form.material.port
        }
      }
      const {code,message} = await this.$api.solveOrder.insertSolveOrder(solveOrder)
      if(code ===200){
        this.$message.success(message)
        await this.$router.push({path:'/solveOrder'})
      }else {
        this.$message.error(message)
      }
    },
    handleEditCheckAllChange(val) {
      let stuArr = []
      for(let i=0;i<this.student.length;i++){
        stuArr.push(this.student[i].sId)
      }
      this.form.maintainer = val ? stuArr:[]
      this.isIndeterminate = false;
    },
    handleEditCheckedStudent(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.student.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.student.length;
      this.form.sIds = value
    },
  }
}
</script>

<style>
.c1{
  width: 220px;
}
.c2{
  width: 500px;
}
</style>