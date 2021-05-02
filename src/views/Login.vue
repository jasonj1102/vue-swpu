<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">网信中心在线业务调配系统</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="username">
            <template #prepend>
              <el-button icon="el-icon-user"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="password"
            v-model="param.password"
            @keyup.enter="submitForm()"
          >
            <template #prepend>
              <el-button icon="el-icon-lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="verifycode">
          <div style="display:flex">
            <el-input
              v-model="param.verifycode"
              placeholder="请输入验证码"
            ></el-input>
            <span @click="refreshCode">
              <identify :identifyCode="identifyCode"></identify>
            </span>
          </div>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
        <p class="login-tips">Tips : 非团队成员请勿使用。</p>
      </el-form>
    </div>
  </div>
</template>

<script>
import Identify from '../components/Identify.vue'
export default {
  components: {Identify},
  data() {
    // 验证码自定义验证规则
    const validateVerifycode = (rule, value, callback) => {
      // 输入的验证码值
      const newVal = value.toLowerCase()
      // 生成的验证码值
      const identifyStr = this.identifyCode.toLowerCase()
      if (newVal === '') {
        callback(new Error('请输入验证码'))
      } else if (newVal !== identifyStr) {
        console.log('validateVerifycode:', value)
        callback(new Error('验证码不正确!'))
      } else {
        callback()
      }
  }
  return {
    identifyCodes: '123456789ABCDEFGHGKMNPQRSTUVWXY',
    identifyCode: '',
    param: {
      username: '',
      password: '',
      verifycode: ''
    },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
        verifycode:[
          { required: true, trigger: 'blur', validator: validateVerifycode }
        ]
      }
    };
  },
  created() {
    this.$store.commit("clearTags");
  },
  mounted() {
    // 验证码初始化
    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4)
  },
  methods: {
    // 生成随机数
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 刷新验证码
    refreshCode() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    // 生成四位随机验证码
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ]
      }
    },
    submitForm(){
      // 执行表单验证
      this.$refs.login.validate(valid => {
        // 表单验证成功，去请求后台登录/user/login接口
        if (valid) {
          this.$axios.post('/api/user/login',
            {
              username: this.param.username,
              password: this.param.password
            }).then(res=>{
              var resInfo = res.result;
              var userInfo = res.user;
                if(resInfo.code == 200){
                  // 将返回的用户token信息储存在localStorge
                  localStorage.setItem('token',resInfo.data);
                  // 将返回的用户信息储存在localStorge中
                  localStorage.setItem('user',userInfo);
                  this.$message.success(resInfo.message);
                }else if(resInfo.code == 201){
                  this.$message.error(resInfo.message);
                }else{
                  this.$message.error(resInfo.message);
                }
              }
            )
          this.$router.push("/");
        } else {
          this.$message.error("请重新输入验证码");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.jpg);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>