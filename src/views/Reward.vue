<template>
  <div class="totalMoney">
    <el-table
        :data="tableData"
        border
        v-loading="loading"
        style="width: 100%">
      <el-table-column
          prop="stuName"
          label="学生姓名"
          width="180" align="center">
      </el-table-column>
      <el-table-column
          prop="totalMoney"
          label="总奖惩"
          width="180" align="center">
      </el-table-column>
    </el-table>
    <el-button type="success" plain @click="exportToExcel">导出>></el-button>
  </div>
</template>

<script>
import {mapState,mapMutations,mapActions} from 'vuex'

export  default {
name:'reward',
  data(){
    return{
      loading:true
    }
  },
  created() {
    this.loadData()
  },
  computed:{
  ...mapState('reward',['rewardInfo']),
    tableData(){
      return this.rewardInfo
    }
  },
  methods:{
  ...mapMutations('reward',['setRewardInfo']),
  ...mapActions('reward',['getAllRewardInfo']),
    async loadData(){
      const{code,message,data} = await this.$api.fine.getAllStuReward()
      this.loading = false,
      console.log(data)
      if (code === 200){
        this.setRewardInfo(data)
        this.$message.success(message)
      }else if(code === 201){
        this.$message.error(message)
      }
    },
    async exportToExcel(){
      const {code,message} = await this.$api.fine.downLoad(this.rewardInfo)
      if (code === 200){
        this.$message.success(message)
      }else {
        this.$message.error(message)
      }
    }
  }
}

</script>