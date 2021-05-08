<template>
  <div class="sidebar">
    <el-menu
        class="sidebar-el-menu"
        :default-active="onRoutes"
        :collapse="collapse"
        mode="vertical"
        background-color="#324157"
        text-color="#bfcbd9"
        active-text-color="#20a0ff"
        unique-opened
        router
    >
      <el-menu-item :index="query.index">
        <i :class="query.icon"></i>
        <template #title>
          系统首页
        </template>
      </el-menu-item>
      <el-menu-item v-for="(item,idx) in items"
                  :key="idx"
                  :index="item.index">
        <i :class="item.icon"></i>
        <template #title>
          {{ item.permissionName }}
        </template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
// import bus from "../common/bus";
import {mapState} from 'vuex'

export default {
  data() {
    return {
      query:{
        index : 'dashboard',
        icon : 'el-icon-setting'
      }
    };
  },
  computed: {
    ...mapState('user', ['userInfo']),
    items() {
      let routers = this.userInfo.role.permissions
      routers.forEach((item)=>{
         if(item.pId===2){
           item.index='number'
           item.icon= 'el-icon-phone-outline'
         }else if(item.pId ===3){
           item.icon= 'el-icon-s-promotion'
           item.index = 'order'
         }else if(item.pId ===6){
           item.icon= 'el-icon-user-solid'
           item.index = 'student'
         }else if(item.pId ===5){
           item.icon = 'el-icon-s-tools'
           item.index = 'tool'
         }else if(item.pId ===4){
           item.icon = 'el-icon-document-add'
           item.index = 'solveOrder'
         }else if(item.pId ===1){
           item.icon = 'el-icon-date'
           item.index = 'signForm'
         }else if(item.pId === 7){
           item.icon = 'el-icon-time'
         }else if (item.pId ===8){
           item.icon = 'el-icon-trophy'
           item.index = 'fine'
         }else if(item.pId === 9){
           item.icon = 'el-icon-link'
           item.index = 'workLoad'
         }else {
           item.icon = 'el-icon-switch-button'
           item.index = 'admin'
         }
      })
      return routers
    },
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
    collapse() {
      return this.$store.state.collapse
    }
  },
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.sidebar > ul {
  height: 100%;
}
</style>
