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
          @click="handleBatchDelete"
        >删除</el-button>
        <el-button
          type="primary"
          size="medium"
          @click="save"
        >保存</el-button>
      </el-col>
    </el-row>
    <el-table
        :data="permission_list"
        @cell-dblclick = "editCell"
        @select="selectOne"
        @select-all="selectAll"
        width="100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        type="index"
        width="55">
      </el-table-column>
      <el-table-column prop="id" label="ID" width="180" class-name="hidden" label-class-name="hidden"></el-table-column>
      <el-table-column prop="permissionName" label="权限名" width="180">
        <template v-slot:default="scope">
          <span>{{scope.row.permissionName}}</span>
          <el-input style="display: none"
                    size="small"
                    v-model="scope.row.permissionName" placeholder="请输入名称"
                    @blur="editFinished(scope,$event)"></el-input>
        </template>

      </el-table-column>
      <el-table-column prop="moduleName" label="可访问模块" width="180">
        <template v-slot:default="scope">
          <span>{{scope.row.moduleName}}</span>
          <el-cascader
            placeholder = "请选择"
            v-model="value"
            style="display: none"
            :options="moduleOptions"
            :props="{checkStrictly: true, label: 'moduleName', value: 'id'}"
            @change="handleChange"
            @visible-change="visibleChange(scope,value,$event)"
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
    request.all([moduleListReq,permissionListReq])
      .then(responses => {
        let module_list_response = responses[0];
        let permission_list_response = responses[1];
        if(module_list_response.status == 200 && permission_list_response.status == 200){
          this.moduleOptions = module_list_response.data;
          this.permission_list = permission_list_response.data.rows;
        }
      });
  },
  methods: {
    handleChange(val){
      this.value = val[0];
    },
    visibleChange(scope,val,isVisible){
      let row = scope.row;
      let moduleName;
      if(!isVisible){
        //todo 下拉框消失
       if(this.value.length <= 0){
         //todo
         //必须选一个
       }else{
         //隐藏
         this.moduleOptions.forEach((op,index,array) => {
              if(op.id == this.value){
                moduleName = op.moduleName;
              }
         });
         row.moduleName = moduleName;
         if(row.id){
           this.updateList[scope.$index] = {
             id: row.id,
             permissionName: row.permissionName,
             moduleName: row.moduleName,
             moduleId: this.value,
           };
         }else{
           this.insertList[scope.$index] = {
             id: null,
             permissionName: row.permissionName,
             moduleName: row.moduleName,
             moduleId: this.value,
           };
         }
         let cell = this.activeCell;
         cell.children[0].children[1].style.display = "none";
         cell.children[0].children[0].style.display = "inline";
       }
      }else{
        //todo 下拉框出现
        this.value = null;
        if(row.id){
          this.moduleOptions.forEach((obj,index,array) => {
            if(row.moduleName == obj.moduleName){
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
    editFinished(scope,event){
      let row = scope.row;
      let target = event.target;
      let div = target.parentNode;
      let span = div.previousSibling;
      div.style.display = "none";
      span.style.display = "inline";
      if(row.id > 0){
        this.updateList[scope.$index] = {
          id: row.id,
          permissionName: row.permissionName,
          moduleName: row.moduleName,
          moduleId: this.value,
        };
      }else{
        this.insertList[scope.$index] = {
          id: null,
          permissionName: row.permissionName,
          moduleName: row.moduleName,
          moduleId: this.value,
        }
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
        permissionName: null,
        moduleId : null,
        moduleName: null
      };
      this.permission_list.push(nullObj);
    },
    handleDelete(index,row){

      if(row.id > 0){
        this.deleteList[index] = row.id;
        this.permission_list.remove(index);
      }else{
        //todo
        //删除还未保存的数据
        this.permission_list.remove(index);
      }
    },
    handleBatchDelete(){
      //请先保存新增的数据
      if(this.insertList.length > 0){
        this.$message({
          message: '请先保存新增的数据',
          type : 'error',
          duration: 1500
        })
      }else{
        //todo 批量删除
        console.log(this.permission_list);

        for(let j=0; j<this.permission_list.length; j++){
          if(this.permission_list[j].id == null){
            this.permission_list.remove(j);
            j--;
          }
          for(let i=0; i<this.deleteList.length; i++) {
            if (this.deleteList[i] == this.permission_list[j].id) {
              this.permission_list.remove(j);
              j--;
            }
          }
        }
      }
    },
    selectOne(selection){
      this.deleteList = [];
      selection.forEach((item,index,array) => {
        if(item.id > 0)
          this.deleteList.push(item.id);
      })
      console.log(this.deleteList);
    },

    selectAll(selection){
      this.deleteList = [];
      selection.forEach((item,index,array) => {
        if(item.id > 0)
          this.deleteList.push(item.id);
      })
      console.log(selection);
    },
    save(){
      let requestArray = [];
      if(this.insertList.length > 0){
        let i = this.insertList.length - 1;
        let newArray = [];
        while(i >= 0){
          if(this.insertList[i]){
            newArray.push(this.insertList[i]);
          }
          i--;
        }
        let req = request.postByJson("/permission/add",newArray);
        requestArray.push(req);
      }

      if(this.updateList.length > 0){
        let i = this.updateList.length - 1;
        let newArray = [];
        while(i >= 0){
          if(this.updateList[i]){
            newArray.push(this.updateList[i]);
          }
          i--;
        }
        let req = request.postByJson("/permission/update",newArray);
        requestArray.push(req);
      }

      if(this.deleteList.length > 0){
        let i = this.deleteList.length - 1;
        let newArray = [];
        while(i >= 0){
          if(this.deleteList[i]){
            newArray.push(this.deleteList[i]);
          }
          i--;
        }
        let req = request.postByJson("/permission/delete",newArray);
        requestArray.push(req);
      }

      if(requestArray.length > 0){
        request.all(requestArray)
        .then(resArray => {
          request.get("/permission/list")
          .then(res => {
            if(res.status == 200){
              this.permission_list = res.data.rows;
              this.insertList = [];
              this.deleteList = [];
              this.updateList = [];
            }
          })
        });
      }
    }
  },
  data(){
    return {
      activeCell: null,
      value: [],
      moduleOptions: [
        {
        id: 1,
        moduleName: "登陆模块"
        },
        {
          id: 2,
          moduleName: "权限管理模块"
        }
        ],
      insertList: [],
      updateList: [],
      deleteList: [],
      permission_list: [
        {
          id: 1,
          permissionName: '登陆权限',
          moduleName: '登陆模块'
        },
        {
          id: 1,
          permissionName: '管理权限',
          moduleName: '权限管理模块'
        }
      ]
    }
  }
}
</script>

<style>
.hidden{
  display: none;
}
</style>
