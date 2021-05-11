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
          @click="addRole"
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
        :data="roleList"
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
      <el-table-column prop="roleName" label="角色名" width="180">
        <template v-slot:default="scope">
          <span>{{scope.row.roleName}}</span>
          <el-input style="display: none"
                    size="small"
                    v-model="scope.row.roleName" placeholder="请输入名称"
                    @blur="editFinished(scope,$event)"></el-input>
        </template>

      </el-table-column>

      <el-table-column prop="createDate" label="创建时间" width="180" ></el-table-column>
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
  name: "Role",
  mounted() {
    request.get("/role/list")
    .then(res => {
      if(res.status == 200){
        this.roleList = res.data.rows;
      }
    })
  },
  methods: {
    handleChange(val){
      this.value = val[0];
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
          roleName: row.roleName
        };
      }else{
        this.insertList[scope.$index] = {
          id: null,
          roleName: row.roleName
        }
      }
    },
    editCell(row,column,cell,event){
      if(cell && cell.children[0].children[0] && cell.children[0].children[1]) {
        cell.children[0].children[0].style.display = "none";
        cell.children[0].children[1].style.display = "inline";
        cell.children[0].children[1].children[0].click();
        cell.children[0].children[1].children[0].focus();
      }
    },
    addRole(){
      let nullObj = {
        id: null,
        roleName: null,
      };
      this.roleList.push(nullObj);
    },
    handleDelete(index,row){

      if(row.id > 0){
        this.deleteList[index] = row.id;
        this.roleList.remove(index);
      }else{
        //todo
        //删除还未保存的数据
        this.roleList.remove(index);
      }
    },
    handleBatchDelete(){
      if(this.insertList.length > 0){
        this.$message({
          message: '请先保存新增的数据',
          type : 'error',
          duration: 1500
        })
      }else{
        //todo 批量删除

        for(let j=0; j<this.roleList.length; j++){
          if(this.roleList[j].id == null){
            this.roleList.remove(j);
            j--;
          }
          for(let i=0; i<this.deleteList.length; i++) {
            if (this.deleteList[i] == this.roleList[j].id) {
              this.roleList.remove(j);
              j--;
            }
          }
        }
      }
    },
    selectOne(selection){
      selection.forEach((item,index,array) => {
        if(item.id > 0){
          this.deleteList.push(item.id);
        }
      });
  },

    selectAll(selection){
      selection.forEach((item,index,array) => {
        if(item.id > 0){
          this.deleteList.push(item.id);
        }
      });
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
        let req = request.postByJson("/role/add",newArray);
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
        let req = request.postByJson("/role/update",newArray);
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
        let req = request.postByJson("/role/delete",newArray);
        requestArray.push(req);
      }

      if(requestArray.length > 0){
        request.all(requestArray)
        .then(resArray => {
          request.get("/role/list")
          .then(res => {
            if(res.status == 200){
              this.roleList = res.data.rows;
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
      insertList: [],
      updateList: [],
      deleteList: [],
      roleList: []
    }
  }
}
</script>

<style>
.hidden{
  display: none;
}
</style>
