<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">网信中心在线业务调配系统</div>
      <el-form
        :model="param"
        :rules="rules"
        ref="login"
        label-width="0px"
        class="ms-content"
      >
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
        <el-form-item prop="verifyCode">
          <div style="display: flex">
            <el-input
              v-model="param.verifyCode"
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
import Identify from "../components/Identify.vue";
import {mapMutations} from "vuex";


export default {
  components: { Identify },
  data() {
    // 验证码自定义验证规则
    // const validateVerifyCode = (rule, value, callback) => {
    //   // 输入的验证码值
    //   const newVal = value.toLowerCase();
    //   // 生成的验证码值
    //   const identifyStr = this.identifyCode.toLowerCase();
    //   if (newVal === "") {
    //     callback(new Error("请输入验证码"));
    //   } else if (newVal !== identifyStr) {
    //     console.log("validateVerifyCode:", value);
    //     callback(new Error("验证码不正确!"));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      identifyCodes: "123456789ABCDEFGHGKMNPQRSTUVWXY",
      identifyCode: "",
      param: {
        username: "",
        password: "",
        verifyCode: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        // verifyCode: [
        //   { required: true, trigger: "blur", validator: validateVerifyCode },
        // ],
      },
    };
  },
  created() {
    this.$store.commit("clearTags");
  },
  mounted() {
    // 验证码初始化
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
  },
  methods: {
    // 引入user命名空间下的方法,将信息交由vuex进行状态管理
    ...mapMutations('user',['setToken','setUserInfo']),
    // 生成随机数
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    // 刷新验证码
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    // 生成四位随机验证码
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ];
      }
    },
    submitForm() {
      // 执行表单验证
      this.$refs.login.validate(async (valid) => {
        // 表单验证成功，去请求后台登录/api/user/login接口
        if (valid) {
          let user = {
            username: this.param.username,
            password: this.param.password,
          };
          const {code,message,data} = await this.$api.user.login(user);
          if (code === 200) {
            // 获取token
            const token = data.token;
            this.setToken(token);
            // 获取用户信息
            const userInfo = data.user;
            this.setUserInfo(userInfo);
            this.$message.success(message);
          } else if (code === 201) {
            this.$message.error(message);
          } else if (code === 401) {
            this.$message.error(message);
          }
          await this.$router.push("/");
        } else {
          this.$message.error("请重新输入验证码");
          return false;
        }
      });
    },
  },
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