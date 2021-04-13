<template>
  <el-container>
    <el-form :model="form" ref="loginForm" label-width="100px">
        <el-form-item
          label="账户"
          required>
          <el-input
              v-model="form.username"
              placeholder="请输入账户名"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          required>
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('loginForm')">登陆</el-button>
      </el-form-item>
    </el-form>

  </el-container>
</template>

<script>

import g_request from '@request/index'

export default {
  name: "Login",
  data(){
      return {
        form:{
          username: '',
          password: ''
        }
      }
  },

  beforeMount() {
    this.request = g_request;
  },

  methods: {
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
        if(valid){
          this.request.headers = { 'content-type': 'application/json' };
          this.request.data = this.form;
          this.request.post('/login/do')
          .then(response => {
            if(response.data.statusCode === "SUCCESS"){
              this.$message({
                message: '登陆成功',
                type: 'success',
                center: true,
                duration: 2000,
                onClose: () => {
                  console.log('关闭之后的回掉');
                  //todo 跳转到首页
                  this.$router.push("home");
                }
              })
            }
          }).catch(err => {
            console.log(err);
            this.$message({
              message: '登陆失败',
              duration: 1000,
              onClose: function(){
                console.log('关闭之后的回调');
              },
              type: 'error',
              center: true
            })
          })
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
