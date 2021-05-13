<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 工作量统计
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-left">
        <el-tag style="width: 90px;height: 40px; margin-right: 10px;position: relative;top: -5px">选择时间-->> </el-tag>
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
        <el-button type="primary" icon="el-icon-circle-plus" @click="handleExport">导出</el-button>
        <el-button type="primary" icon="el-icon-refresh-right" @click="handleLoad">加载全部</el-button>
      </div>
      <el-table
          :data="tableData"
          border
          v-loading = "loading"
          class="table"
          ref="multipleTable"
          header-cell-class-name="table-header"
      >
        <el-table-column prop="studentName" label="学生姓名" align="center"></el-table-column>
        <el-table-column prop="numbers" label="接电话数" align="center"></el-table-column>
        <el-table-column prop="telecoms" label="电信出单数" align="center" ></el-table-column>
        <el-table-column prop="campusNetwork" label="校园网出单数" align="center" ></el-table-column>
        <el-table-column prop="other" label="其他情况出单" align="center" ></el-table-column>
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

  </div>
</template>

<script>
import {mapState,mapMutations,mapActions} from 'vuex'
export default {
  name: "workLoad",
  data() {
    return {
      query: {
        dateRange:[],
        pageIndex:1,
        pageSize:10
      },
      loading:true
    }
  },
  computed:{
    ...mapState('workLoad',['workLoadInfo']),
    tableData(){
      return this.workLoadInfo.list
    },
    total(){
      return this.workLoadInfo.total
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    ...mapMutations('workLoad',['setWorkLoadInfo']),
    ...mapActions('workLoad',['getAllWorkLoadInfo']),
    // 加载数据
    async loadData () {
      const{code,message,data} = await this.$api.workLoad.getAllWorkLoad(this.query.pageIndex,this.query.pageSize)
      this.loading = false,
      this.setWorkLoadInfo(data)
      console.log(data)
      if (code === 200){
        this.$message.success(message)
      }else if(code === 201){
        this.$message.error(message)
      }
    },
    // 触发搜索按钮
    async handleSearch() {
      let search = {
        page : this.query.pageIndex,
        size : this.query.pageSize,
        startTime : this.$moment(this.query.dateRange[0]).format('yyyy-MM-DD HH:mm:ss'),
        endTime : this.$moment(this.query.dateRange[1]).format('yyyy-MM-DD HH:mm:ss')
      }
      const {code,message,data} = await this.$api.workLoad.getAllWorkLoadByTime(search)
      this.setWorkLoadInfo(data)
      if (code === 200){
        this.$message.success(message)
      }else {
        this.$message.error(message)
      }
    },
    handleLoad(){
        this.query.dateRange=[],
        this.getAllWorkLoadInfo(this.query.pageIndex)
    },
    handlePageChange(val) {
      this.query.pageIndex = val
      this.getAllWorkLoadInfo(this.query.pageIndex);
    },
    handleExport(){

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

.table {
  width: 100%;
  font-size: 14px;
}
</style>
