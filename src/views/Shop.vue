<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6"></el-col>
      <el-col :span="6"></el-col>
      <el-col :span="9">

      </el-col>

      <el-col :span="3">
        <el-button
        type="primary"
        size="medium"
        @click="handleEdit"
        >保存</el-button>
        <el-button
          type="primary"
          size="medium"
          @click="handleBatchDelete"
        >删除</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData"
              stripe
              style="width: 100%"
              border
              @cell-dblclick = "editCell"
              @select-all = "selectAll"
              @select = "selectOne"
              height="250">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="itemId"
        label="ID"
        fixed
        width="180"
      >
      </el-table-column>
      <el-table-column
        label="名称"
        width="180"
      >
        <template v-slot:default="scope">
          <span>{{scope.row.name}}</span>
          <el-input style="display: none"
                    size="small"
                    v-model="scope.row.name" placeholder="请输入名称"
                    @blur="editFinished(scope.row,$event)"></el-input>
        </template>

      </el-table-column>
      <el-table-column
        prop="category"
        label="种类"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="count"
        label="数量"
        width="180"
      ></el-table-column>
        <el-table-column
        prop="unit"
        label="单位"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="origin"
        label="产地"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="date"
        label="日期"
        width="180"
      ></el-table-column>
      <el-table-column align="right"
                       width="180"
                       >
          <template v-slot:header>
              <el-input
                v-model="search"
                size="mini"
                placeholder="输入关键字搜索"/>
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


    <el-pagination
      style="text-align: center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 50, 100]"
      :page-size="pageSize"
      :pager-count="5"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalSize">
    </el-pagination>
      <el-upload
        style="float: left;width:150px"
        ref="upload"
        name="excel"
        :file-list="fileList"
        :before-upload="beforeUpload"
        :on-preview="handlePreview"
        :on-change="handleChange"
        :on-success="handleUploadSuccess"
        :auto-upload="false"
        :limit=1
        action="/api/excel/import/test"
        :on-exceed="handleExceed"
        list-type="text">
        <template v-slot:tip>
          <div class="el-upload__tip" >
            只能上传一个xlsx文件
            <div v-if="uploadIsError">
              错误信息:
              <div>{{errorMessage}}</div>
            </div>
          </div>
        </template>
        <template v-slot:trigger>
          <el-button  size="small" type="primary"  >点击上传</el-button>
        </template>
        <el-button style="margin-left: 10px" type="success" @click="submitUpload" size="small" >提交</el-button>
      </el-upload>

      <el-button  style="margin-left: 10px;float:left" size="small" type="primary" @click="exportTemplate">导出模板</el-button>
  </div>
</template>

<script>

import request from '../request/index'
export default {
  name: "Shop",

  mounted() {
    this.doGetData();
  },

  methods: {
    doGetData(page,pageSize){
      request.params = {
        page: page?page:this.currentPage,
        pageSize: pageSize?pageSize:this.pageSize
      }
      request.get("/item/list")
        .then(res => {
          let data = res.data;
          this.tableData = data.rows;
          this.totalSize = data.totalSize;
        }).catch(err => {
        if(err) console.log("错误");
      })
    },
    editFinished(row,event){
      let target = event.target;
      let div = target.parentNode;
      let span = div.previousSibling;
      div.style.display = "none";
      span.style.display = "inline";
      this.updateList.push( {
        itemId: row.itemId,
        date: row.date,
        name: row.name,
        category: row.category,
        unit: row.unit,
        count: row.count,
        origin: row.origin
      });

    },

    editCell(row,column,cell,event){
      if(cell && cell.children[0].children[0] && cell.children[0].children[1]) {
        cell.children[0].children[0].style.display = "none";
        cell.children[0].children[1].style.display = "inline";
        cell.children[0].children[1].children[0].focus();
      }
    },
    handleSizeChange(val){
      this.pageSize = val;
      this.doGetData();
    },
    handleCurrentChange(val){
      this.currentPage = val;
      this.doGetData();
    },
    exportTemplate(){
      request.responseType = 'blob'; //设置这个类型才能下载
      request.get('/excel/export')
          .then(response => {
            let disposition = response.headers['content-disposition'];
            let startIndex = disposition.indexOf('=');
            let filename = disposition.substring(startIndex + 1);
            if(response.status == 200){
              //下载成功
              let data = response.data;
              let reader = new FileReader();
              reader.readAsDataURL(data);
              reader.onload = function(e){
                let a = document.createElement('a');
                a.download = filename;
                a.href = e.target.result.toString();
                let body = document.getElementsByTagName('body')[0];
                body.append(a);
                a.click();
                body.removeChild(a);
              }
            }else{
              console.error(response.status);
            }
          })
          .catch(err => {
            console.log(err);
            //todo
          })
    },
    handleEdit(){
      if(this.updateList.length > 0){
        request.data = this.updateList;
        request.postByJson("/item/update")
          .then(res => {
            if(res) {
              console.log(res);
              console.log('update');
            }
            this.updateList = [];
          }).catch(err => {
            console.log(err);
          //this.updateList = [];
        });
      }
    },
    handleDelete(index,row){
      console.log(index);
      console.log(row);
      request.data = {
        itemId: row.itemId
      };
      request.post("/item/delete")
      .then(res => {
        if(res.status == 200){
          this.doGetData();
        }
      }).catch(err => {
        console.log(err);
      })
    },
    handleBatchDelete(){
      console.log('删除');
      if(this.deleteList.length > 0){
        request.data = this.deleteList;
        request.postByJson("/item/delete/list")
        .then(res => {
          if(res.status == 200){
            this.doGetData();
          }
        })
      }
    },
    submitUpload(){
      if(this.uploadStatus === 'wait'){
        console.log('submit upload');
        this.$refs.upload.submit();
      }
    },
    beforeRemove(){
      console.log('移除文件');
    },

    handlePreview(){
      console.log('handle preview');
    },

    handleUploadSuccess(res){
      if(res){
        this.$refs['upload'].clearFiles();
        console.log(res);
        if(res.statusCode === 'SUCCESS'){
          this.uploadStatus = 'success';
          this.$message({
            message: '上传成功',
            type: 'success',
            duration: 1000,
          });
        }else{
          this.uploadStatus = 'failed';
          this.uploadIsError = true;
          this.errorMessage = res.resultMessage;
        }
      }
    },

    handleChange(file){
      if(this.uploadStatus === 'success'){
        console.log('the upload is success');
        this.uploadIsError = false;
        this.errorMessage = '';
        this.uploadStatus = 'wait';
      }else if(this.uploadStatus === 'uploading'){
        console.log('the file is uploading');
      }else{
        const name = file.name;
        const extension = name.substring(name.indexOf('.') + 1,name.length);
        if(extension != 'xlsx'){
          console.debug("The upload file's extension is %s",extension);
          this.$refs['upload'].clearFiles();
          this.$message({
            message: '文件类型不正确',
            type: 'error',
            duration: 1000,
          });
          this.uploadStatus = 'failed';
        }else{
          //todo
          this.uploadStatus = 'wait';
        }
      }
    },

    beforeUpload(file){
      console.log('before upload');
      if(!file){
        this.$message({
          message: '无法上传',
          type: 'error',
          duration: 1000,
        });
        //return false;
      }else{
        this.uploadIsError = false;
        this.errorMessage = '';
      }
    },

    handleExceed(){
      this.$message({
        message: '超过文件数量',
        type: 'error',
        duration: 1000,
      });
    },

    selectOne(selection){
      this.deleteList = selection;
      console.log(this.deleteList);
    },

    selectAll(selection){
      this.deleteList = selection;
      console.log(this.deleteList);
    }
  },

  data(){
    return {
      deleteList: [],
      updateList: [],
      totalSize: 0,
      currentPage: 1,
      pageSize: 10,
      uploadIsError: false,
      errorMessage: '',
      fileList: [],
      uploadStatus: '',
      dialogImportExcelVisible: false,
      search: '',
      tableData: [
        {
          itemId: '10090',
          date: '1990-01-01',
          name: '猪肉',
          category: '肉制品',
          unit: '公斤',
          count: 10,
          origin: '上海市普陀区金沙江路1518'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
