<template>
  <el-container class="center">
    <el-main>
      <el-form :model="form" :rules="rules" status-icon label-width="100px" ref="register_form">
        <el-form-item label="账户"  prop="username" >
          <el-input v-model="form.username"
                    clearable
                    placeholder="请输入账户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" >
          <el-input v-model="form.password"
                    clearable
                    placeholder="请输入密码"
                    show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword" >
          <el-input v-model="form.confirmPassword"
                    placeholder="请输入密码"
                    show-password>
          </el-input>
        </el-form-item>
        <el-form-item label="性别"  prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="省份"  prop="province" >
          <el-select v-model="form.province"
                     filterable
                     placeholder="请选择"
                     v-on:visble-change="loadProvinces"
                     v-on:change="loadCity"
                     >
            <el-option v-for="item in province_array"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市"  prop="city" >
          <el-select v-model="form.city"
                     filterable
                     placeholder="请选择"
                     >
            <el-option v-for="item in city_array"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱"  prop="email" >
          <el-input v-model="form.email"
                    placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="submitForm('register_form')">注册</el-button>
          <el-button  @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>

import g_request from '../request/index'

export default {

  beforeMount() {
    this.request = g_request;//创建Vue组件时就获得request组件
    this.loadProvinces();//加载省份数据
  },

  name: "Register",
  components: {
  },
  methods: {
    submitForm(formName){
      console.log('submit!!');
      console.log('form_city: '+this.form.city);
      console.log('form_province: '+this.form.province);
      this.$refs[formName].validate((valid,invalidFields) => {
        if (valid) {
          this.request.data = {
            username: this.form.username,
            password: this.form.password,
            sex: this.form.sex,
            email: this.form.email,
            provinceId: this.form.province,
            cityId: this.form.city
          }
          const loading = this.$loading({ //出现加载框
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.request.post('/register')
          .then( response => {
            if(response.data.statusCode === "FAILED"){
              //注册失败,提醒客户
              this.$message({
                message: '注册失败',
                center:true,
                type: 'error'
              });
            }else{
              //注册成功,返回主页
              //todo
              this.$message({
                message: '注册成功',
                center:true,
                type: 'success'
              });
            }
            loading.close();//加载框消失
          });
        } else {
          console.log('error submit!!');
          console.log(invalidFields);
          return false;
        }
      })
    },


    resetForm(){
      this.$refs.register_form.resetFields();
    },

    loadProvinces(){
      if(this.province_array.length === 0){
        this.request.timeout = 5000;
        this.request.get('/province/all')
          .then(response => {
            if(response.data){
              response.data.forEach((item) => {
               this.province_array.push(item);
              })
            }
          }).catch(err => {
          console.log(err);
        })
      }
    },

    loadCity(){
      if(this.form.province != this.pre_province){
        this.pre_province = this.form.province;
        this.request.headers = { 'content-type': 'application/json' },
        this.request.get('/province/'+this.form.province+'/city')
        .then(response => {
          console.log('response.data is '+ response.data);
          console.log('response.status '+response.status);
          this.city_array.length = 0; //清空数组
          this.form.city = null;//清空城市选项
          response.data.forEach((city) => {
            this.city_array.push(city); //重新添加城市
          });
        })
        .catch(err => {
          console.log('error is '+ err);
        });
      }
    },

  },

  data() {
    const checkPassword = (rule,value,callback) => {
      if (!value) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    };

    const checkConfirmPassword = (rule,value,callback) => {
      if(value !== this.form.password){
        callback(new Error('两次密码必须一致'));
      }else{
        callback();
      }
    };

    const checkEmail = (rule,value,callback) => {
      if(value) {
        let regFor163 = new RegExp('^[A-Za-z]\\w{7,15}@163.com$'); //163邮箱匹配
        let regForQQ = new RegExp('^[1-9]\\d{4,9}@qq.com$'); //qq邮箱匹配
        if(!regFor163.test(value) && !regForQQ.test(value)){
           callback(new Error('请输入正确的邮箱地址'));
         /* return callback(new Error('8-16位,数字、字母或下划线.以字母打头'));*/
        }else{
          callback();
        }
      }else{
        callback(new Error('邮箱不能为空'))
      }
    };

    const checkIsExistName = (rule,value,callback) => {
      if(value){
        this.request.get('/register/checkUserIsExist/'+value)
        .then(response => {
          if(response.data){
            callback(new Error('账户已经存在'));
          }else{
            callback();
          }
        })
        .catch(err => {
          console.log(err);
          callback(new Error('网络错误'));
        });
      }else{
        callback(new Error('账户不能为空'))
      }
    };

  /*  let checkValue = (rule,value,callback) => {
      if(!value) return callback(new Error('值不能为空'))
    }*/
    return {
      province_array: [],
      city_array: [],
      rules: {
        username: [
         /* { validator: checkValue,trigger: 'blur'},*/
          { required: true,message: '账户不能为空',trigger: 'blur'},
          { validator: checkIsExistName,trigger: 'blur'}
          ],
        password: [
          { required: true,message: '密码不能为空',trigger: 'blur'},
          { validator: checkPassword,trigger:'blur'}
          ],
        confirmPassword: [
          { required: true,message: '密码不能为空',trigger: 'blur'},
          { validator: checkConfirmPassword,trigger:'blur'}
        ],
        sex: [
          { required: true,message: '性别不能为空',trigger: 'blur'}
        ],
        email: [
          { required: true,message: '邮箱不能为空',trigger: 'blur'},
          { validator: checkEmail,trigger: ['blur','change']},
        ],
        province: [
          {required: true,message: '省份不能为空',trigger: 'blur'},
          {type: "number",message: '类型不符合',trigger: 'blur'},
        ]
      },
      form: {
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        sex: 1,
        province: null,
        pre_province: -1001,
        city: null
      }
    }
  }
}
</script>



<style scoped>
.center {
  width: 500px;
  height: 528px;
  position: absolute;
  margin: auto;
  left: 0px;
  right: 0px;
}
</style>
