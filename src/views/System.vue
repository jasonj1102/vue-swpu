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
        <el-button type="primary" icon="el-icon-user" round @click="registerUser">用户注册</el-button>
      </div>
      <div class="handle-right">
        <el-button type="primary" icon="el-icon-s-custom" round >角色权限</el-button>
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
                :disabled="scope.row.role.rId === 3"
                @click="handleEditUserRole(scope.$index, scope.row)"
            >分配角色</el-button>
            <el-button
                type="text"
                icon="el-icon-delete"
                class="red"
                :disabled="scope.row.role.rId === 3"
                @click="handleDeleteUser(scope.$index, scope.row)"
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

<!--    用户注册-->
    <el-dialog title="用户注册" v-model="registerUserVisible" width="30%">
      <el-form ref="updateForm" :model="updateForm" label-width="100px" label-position="right">
        <el-form-item label="用户名">
          <el-input v-model="updateForm.username"></el-input>
        </el-form-item>
        <el-form-item label="请输入密码">
          <el-input v-model="updateForm.password" clearable type="password"></el-input>
        </el-form-item>
        <el-form-item label="请确认密码">
          <el-input v-model="updateForm.confirmPassword" clearable type="password"></el-input>
        </el-form-item>
        <p class="login-tips" style="color: #8cc5ff">Tips : 用户默认角色为普通用户!!!</p>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
            <el-button @click="cancelRegisterUser">取 消</el-button>
            <el-button type="primary" @click="saveRegisterUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>

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
      editUserRoleVisible:false,
      registerUserVisible:false
    }
  },
  computed:{
    ...mapState('systemUser',['systemUserInfo']),
    ...mapState('role',['roleInfo']),
    tableData(){
      return this.systemUserInfo.list
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
      console.log(row)
      this.idx = index;
      this.form = row
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
    },
    cancelRegisterUser(){
      this.registerUserVisible = false
    },
    saveRegisterUser(){
      this.$refs.updateForm.validate(async valid=>{
        if (valid&&this.updateForm.password===this.updateForm.confirmPassword){
          const {code,message} = await this.$api.user.register(this.updateForm.username,this.updateForm.confirmPassword);
          this.registerUserVisible = false
          if(code === 200){
            this.$message.success(message)
            await this.getAllSystemUserInfo(this.query.pageIndex)
          }else {
            this.$message.error(message)
          }
        }else {
          this.$message.error("请重新确认密码...")
        }
      })
    },
    registerUser(){
      this.registerUserVisible = true
    },
    handleDeleteUser(index){
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      })
        .then(async () => {
          const {code,message} = await this.$api.user.deleteUser(this.systemUserInfo.list[index].uId)
          if (code ===200){
            this.tableData.splice(index, 1);
            this.$message.success(message)
            await this.getAllSystemUserInfo(this.query.pageIndex)
          }else {
            this.$message.error(message)
          }

        }).catch(() => {});
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
.red {
  color: #ff0000;
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
