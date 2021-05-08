<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 工具信息
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-left">
        <el-button
            type="danger"
            icon="el-icon-delete"
            class="handle-del mr10"
            @click="delAllTool"
        >批量删除</el-button>
        <el-button  type="primary" @click="toggleSelection()" icon="el-icon-circle-close">取消全选</el-button>
        <el-input v-model="query.toolName" placeholder="工具名称" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </div>
      <div class="handle-right">
        <el-button type="primary" icon="el-icon-circle-plus" @click="handleAdd">添加</el-button>
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
        <el-table-column prop="toolNumber" label="工具编号" align="center"></el-table-column>
        <el-table-column prop="toolName" label="工具名称" align="center"></el-table-column>
        <el-table-column prop="url" label="图片详情" align="center"></el-table-column>
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
    <el-dialog title="添加工具信息" v-model="addVisible" width="30%" @close="addFormClosed">
      <el-form ref="addForm" :model="addForm" label-width="70px">
        <el-form-item label="工具编号" prop="toolNumber">
          <el-input v-model="addForm.toolNumber"></el-input>
        </el-form-item>
        <el-form-item label="工具名称" prop="toolName">
          <el-input v-model="addForm.toolName"></el-input>
        </el-form-item>
        <!-- 这里将加一个上传图片的组件 -->
        <el-form-item label="图片" prop="url">
          <el-input v-model="addForm.url"></el-input>
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
    <el-dialog title="编辑工具信息" v-model="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="工具编号" prop="toolNumber" >
          <el-input v-model="form.toolNumber" readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="工具名称" prop="toolName">
          <el-input v-model="form.toolName"></el-input>
        </el-form-item>
        <!-- 这里将加一个上传图片的组件 -->
        <el-form-item label="图片" prop="url">
          <el-input v-model="form.url"></el-input>
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
  name: "tool",
  data() {
    return {
      query: {
        toolName:'',
        pageIndex:1,
        pageSize:10
      },
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
    ...mapState('tool',['toolInfo']),
    tableData(){
      return this.toolInfo.list
    },
    total(){
      return this.toolInfo.total
    },
  },
  created() {
    this.loadData()
  },
  methods: {
    ...mapMutations('tool',['setToolInfo']),
    ...mapActions('tool',['getAllToolInfo']),
    async loadData () {
      const{code,message,data} = await this.$api.tool.getAllTool(this.query.pageIndex,this.query.pageSize)
      console.log(data)
      if (code === 200){
        this.setToolInfo(data)
        this.$message.success(message)
      }else if(code === 201){
        this.$message.error(message)
      }
    },
    //加载全部
    handleLoad(){
      this.query.toolName = '',
          this.getAllToolInfo(this.query.pageIndex)
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
      let tool = {
        toolNumber : this.addForm.toolNumber,
        toolName : this.addForm.toolName,
        url : this.addForm.url
      }
      console.log(tool)
      const{code,message,data} = await this.$api.tool.insertTool(tool)
      this.addVisible = false
      this.$refs.addForm.resetFields()
      console.log(data)
      if (code === 200){
        this.$message.success(message)
        await this.getAllToolInfo(this.query.pageIndex)
        console.log(this.toolInfo)
      }else if(code === 201){
        this.$message.error(message)
      }
    },
    // 触发搜索按钮
    async handleSearch() {
      let search = {
        page : this.query.pageIndex,
        size : this.query.pageSize,
        toolName : this.query.toolName
      }
      const {code,message,data} = await this.$api.tool.searchTool(search)
      this.setToolInfo(data)
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
            await this.$api.tool.deleteTool(this.toolInfo.list[index].tId)
            this.tableData.splice(index, 1);
            await this.getAllToolInfo(this.query.pageIndex)
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
    // 批量删除tool信息
    async delAllTool() {
      const length = this.multipleSelection.length;
      let str = "";
      for (let i = 0; i < length; i++) {
        if (i === length - 1) {
          str += this.multipleSelection[i].tId
        } else {
          str += this.multipleSelection[i].tId + ",";
        }
      }
      const {code,message} =await this.$api.tool.deleteToolByIds(str)
      if (code === 200){
        this.$message.success(message);
      }else {
        this.$message.error(message);
      }
      await this.getAllToolInfo(this.query.pageIndex)
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
      this.getAllToolInfo(this.query.pageIndex)
    },
    // 保存编辑,bug问题
    async saveEdit() {
      // this.$set(this.tableData, this.idx, this.form);
      this.editVisible = false
      let tool = {
        tId : this.toolInfo.list[this.idx].tId,
        toolNumber : this.form.toolNumber,
        toolName : this.form.toolName,
        url: this.form.url
      }
      console.log(tool)
      const {code,message} =  await this.$api.tool.updateTool(tool)
      if (code === 200){
        this.$message.success(`修改第 ${this.idx + 1} 行成功`);
        await this.getAllToolInfo(this.query.pageIndex)
      }else if(code === 201){
        this.$message.error(message)
      }

    },
    // 分页导航
    handlePageChange(val) {
      this.query.pageIndex = val
      this.getAllToolInfo(this.query.pageIndex);
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
  margin-left: 10px;
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
