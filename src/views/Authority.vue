<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6"></el-col>
      <el-col :span="6"></el-col>
      <el-col :span="8">

      </el-col>

      <el-col :span="4">
        <el-button
          type="primary"
          size="medium"
          @click="addPermission"
        >添加</el-button>
        <el-button
          type="primary"
          size="medium"
        >删除</el-button>
        <el-button
          type="primary"
          size="medium"
        >保存</el-button>
      </el-col>
    </el-row>
    <el-table
        :data="permission_list"
        @cell-dblclick = "editCell"
        width="100%">
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="name" label="权限名" width="180">
        <template v-slot:default="scope">
          <span>{{scope.row.name}}</span>
          <el-input style="display: none"
                    size="small"
                    v-model="scope.row.name" placeholder="请输入名称"
                    @blur="editFinished(scope.row,$event)"></el-input>
        </template>

      </el-table-column>
      <el-table-column prop="module_name" label="可访问模块" width="180">
        <template v-slot:default="scope">
          <span>{{scope.row.module}}</span>
          <el-cascader
            placeholder = "请选择"
            v-model="value"
            style="display: none"
            :options="moduleOptions"
            :props="{checkStrictly: true, label: 'module_name', value: 'id'}"
            @change="handleChange"
            @visible-change="visibleChange(scope.row,value,$event)"
            @blur="blurMethod"
            @focus="focusMethod"
            clearable></el-cascader>
        </template>

      </el-table-column>
      <el-table-column align="right"
                       width="180"
      >
        <template v-slot:header>
          <el-input
            size="mini"
            placeholder="操作"/>
        </template>
        <template v-slot:default="scope">
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            circle
            @click="handleDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

Array.prototype.remove = function(index){
  if(isNaN(index) || this.length < index) {return false};
  this.splice(index,1);
}
import request from 'request'

export default {
  name: "Authority",
  mounted() {
    let moduleListReq = request.get('/module/list');
    let permissionListReq = request.get('/permission/list');
    request.all(moduleListReq,permissionListReq)
      .then(res => {
        console.log(res);
      });
  },
  methods: {
    handleChange(val){
      this.value = val;
    },
    visibleChange(row,val,isVisible){
      let module_name;
      if(!isVisible){
        //todo 下拉框消失
       if(this.value.length <= 0){
         //todo
         //必须选一个
       }else{
         //隐藏
         console.log(this.value);
         this.moduleOptions.forEach((op,index,array) => {
              if(op.id == this.value[0]){
                module_name = op.module_name;
              }
         });
         row.module_name = module;
         let cell = this.activeCell;
         cell.children[0].children[1].style.display = "none";
         cell.children[0].children[0].style.display = "inline";
       }
      }else{
        //todo 下拉框出现
        this.value = null;
        if(row.id){
          this.moduleOptions.forEach((obj,index,array) => {
            if(row.module_name == obj.module_name){
              this.value = obj.id;
            }
          })
        }else{

        }
      }
    },
    blurMethod(){
      console.log('blur');
    },
    focusMethod(event){
      console.log('focus');
    },
    editFinished(row,event){
      let target = event.target;
      let div = target.parentNode;
      let span = div.previousSibling;
      div.style.display = "none";
      span.style.display = "inline";
      if(row.id > 0){
        this.updateList.push({
          id: row.id,
          name: row.name,
          module: row.module
        });
      }else{
        this.insertList.push({
          id: null,
          name: row.name,
          module: row.module
        });
      }
    },
    editCell(row,column,cell,event){
      if(cell && cell.children[0].children[0] && cell.children[0].children[1]) {
        cell.children[0].children[0].style.display = "none";
        cell.children[0].children[1].style.display = "inline";
        cell.children[0].children[1].children[0].click();
        cell.children[0].children[1].children[0].focus();
        this.activeCell = cell;
      }
    },
    addPermission(){
      let nullObj = {
        id: null,
        name: null,
        module: null
      };
      this.permission_list.push(nullObj);
    },
    handleDelete(index,row){

      if(row.id > 0){

      }else{
        //todo
        //删除还未保存的数据
        this.permission_list.remove(index);
      }
    },
  },
  data(){
    return {
      activeCell: null,
      value: [],
      moduleOptions: [
        {
        id: 1,
        module_name: "登陆模块"
        },
        {
          id: 2,
          module_name: "权限管理模块"
        }],
      insertList: [],
      updateList: [],
      permission_list: [
        {
          id: 1,
          name: '登陆权限',
          module_name: '登陆模块'
        },
        {
          id: 1,
          name: '管理权限',
          module_name: '权限管理模块'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
