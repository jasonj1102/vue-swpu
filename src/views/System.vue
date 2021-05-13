<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 系统用户管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-left">
        <el-button type="primary" icon="el-icon-circle-plus" @click="handleExport">导出</el-button>
        <el-button type="primary" icon="el-icon-refresh-right" @click="handleLoad">加载全部</el-button>
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
        <el-table-column prop="username" label="用户名" align="center"></el-table-column>
        <el-table-column prop="role.roleName" label="所属角色" align="center"></el-table-column>
        <el-table-column label="操作" width="500" align="center">
          <template #default="scope">
            <el-button
                type="text"
                icon="el-icon-edit"
                @click="handleEditPassword(scope.$index, scope.row)"
            >修改密码</el-button>
            <el-button
                type="text"
                icon="el-icon-mouse"
                class="red"
                @click="handleEditUserRole(scope.$index, scope.row)"
            >分配角色</el-button>
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

    <!--修改用户密码-->
    <el-dialog title="密码修改" v-model="editPasswordVisible" width="30%">
      <el-form ref="updateForm" :model="updateForm" label-width="100px" label-position="right">
        <el-form-item label="用户名">
          <el-input v-model="form.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="请输入密码">
          <el-input v-model="updateForm.password" clearable type="password"></el-input>
        </el-form-item>
        <el-form-item label="请确认密码">
          <el-input v-model="updateForm.confirmPassword" clearable type="password"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
            <el-button @click="cancelEditPassword">取 消</el-button>
            <el-button type="primary" @click="saveEditPassword">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分配用户角色-->
    <el-dialog title="角色分配" v-model="editUserRoleVisible" width="30%">
      <el-form ref="updateForm" :model="updateForm" label-width="100px" label-position="right">
        <el-form-item label="用户名">
          <el-input v-model="form.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="分配角色">
          <el-radio-group v-model="form.role.rId">
            <!--roles-->
            <el-radio v-for="r in roles" :label="r.rId" :key="r.rId">{{r.roleName}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
            <el-button @click="cancelEditUserRole">取 消</el-button>
            <el-button type="primary" @click="saveEditUserRole">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {mapState,mapMutations,mapActions} from 'vuex'
export default {
  name: "system",
  data() {
    return {
      query: {
        pageIndex:1,
        pageSize:10
      },
      form:{},
      updateForm:{
        password:'',
        confirmPassword:'',
        userRole:''
      },
      loading:true,
      editPasswordVisible:false,
      editUserRoleVisible:false
    }
  },
  computed:{
    ...mapState('systemUser',['systemUserInfo']),
    ...mapState('role',['roleInfo']),
    tableData(){
      let systemUserArr =  this.systemUserInfo.list
      for(let s= 0;s<systemUserArr.length;s++){
        if(systemUserArr[s].role.roleName === 'user'){
          systemUserArr[s].role.roleName = 'user(普通用户)'
        }else if(systemUserArr[s].role.roleName ==='groupLeader'){
          systemUserArr[s].role.roleName = 'groupLeader(组长)'
        }else if(systemUserArr[s].role.roleName ==='root'){
          systemUserArr[s].role.roleName = 'root(超级管理员)'
        }
      }
      return systemUserArr
    },
    total(){
      return this.systemUserInfo.total
    },
    roles(){
      return this.roleInfo
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    ...mapMutations('systemUser',['setSystemUserInfo']),
    ...mapActions('systemUser',['getAllSystemUserInfo']),
    ...mapActions('role',['getAllRoleInfo']),
    // 加载数据
    async loadData () {
      const{code,message,data} = await this.$api.role.getAllUserRole(this.query.pageIndex,this.query.pageSize)
      await this.getAllRoleInfo()
      this.loading = false
      this.setSystemUserInfo(data)
      console.log(data)
      if (code === 200){
        this.$message.success(message)
      }else if(code === 201){
        this.$message.error(message)
      }
    },
    handlePageChange(val) {
      this.query.pageIndex = val
      this.getAllSystemUserInfo(this.query.pageIndex);
    },
    handleEditPassword(index, row){
      this.idx = index;
      this.form = row;
      this.editPasswordVisible = true;
      this.updateForm.confirmPassword = ''
    },
    cancelEditPassword(){
      this.editPasswordVisible = false
    },
    saveEditPassword() {
      // this.$set(this.tableData, this.idx, this.form);
      this.$refs.updateForm.validate(async (valid)=>{
        if (valid&&this.updateForm.password === this.updateForm.confirmPassword){
          const {code,message} =  await this.$api.user.updatePassword(this.form.uId,this.updateForm.confirmPassword)
          if (code === 200){
            this.editPasswordVisible = false
            this.$message.success(message);
          }else if(code === 201){
            this.$message.error(message)
          }
        }else {
          this.$message.error("请重新确认密码...")
        }
      })
    },
    handleEditUserRole(index,row){
      this.idx = index;
      this.form = row;
      this.editUserRoleVisible = true;
    },
    cancelEditUserRole(){
      this.editUserRoleVisible = false
    },
    async saveEditUserRole(){
      let username = this.form.username
      let rId = this.form.role.rId
      const {code,message} = await this.$api.role.updateToUserRole(username,rId)
      if(code ===200){
        this.editUserRoleVisible = false
        this.$message.success(message)
        this.getAllSystemUserInfo(this.query.pageIndex)
      }else {
        this.$message.error(message)
      }
    }
  }
};
</script>

<style scoped>
.handle-left {
  margin-bottom: 20px;
  float: left;
}
.el-input{
  width: 320px;
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
