<template>
  <div>
    <el-table :data="tableData"
              stripe
              style="width: 100%"
              border
              height="250">
      <el-table-column
        type="selection"
        width="55"
      ></el-table-column>
      <el-table-column
        prop="id"
        label="商品ID"
        fixed
        width="180"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="category"
        label="种类"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="weight"
        label="重量(公斤)"
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
            @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
        </template>
      </el-table-column>

    </el-table>
      <el-upload
        style="float: left"
        ref="upload"
        :file-list="fileList"
        :before-upload="beforeUpload"
        :on-preview="handlePreview"
        :on-change="handleChange"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :auto-upload="false"
        :limit=1
        action=""
        :on-exceed="handleExceed"
        list-type="text">
        <template v-slot:tip>
          <div class="el-upload__tip" >只能上传一个excel文件</div>
        </template>
        <template v-slot:trigger>
          <el-button  size="small" type="primary">点击上传</el-button>
        </template>
        <el-button style="margin-left: 10px" type="success" @click="submitUpload" size="small" >提交</el-button>
      </el-upload>

      <el-button  style="margin-left: 10px" size="small" type="primary" @click="exportData">导出</el-button>
  </div>
</template>

<script>
export default {
  name: "Shop",

  methods: {

    exportData(){
      console.log('导出数据');
    },
    handleEdit(index,row){
      console.log(index);
      console.log(row);
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

    handleUploadError(){
      this.uploadStatus = 'failed';
    },

    handleUploadSuccess(res){
      if(res){
        this.uploadStatus = 'success';
      }
    },

    handleChange(file){
      if(this.uploadStatus === 'failed'){
        console.log('the upload is failed');
        this.$refs['upload'].clearFiles();
      }else if(this.uploadStatus === 'success'){
        this.$refs['upload'].clearFiles();
      }else if(this.uploadStatus === 'uploading'){
        console.log('the file is uploading');
      }else{
        const name = file.name;
        const extension = name.substring(name.indexOf('.')+1,name.length);
        if(extension != 'txt'){
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
        return false;
      }
    },

    handleExceed(){
      this.$message({
        message: '超过文件数量',
        type: 'error',
        duration: 1000,
      });
    },
  },

  data(){
    return {
      fileList: [],
      uploadStatus: '',
      dialogImportExcelVisible: false,
      search: '',
      tableData: [
        {
          id: '10090',
          date: '1990-01-01',
          name: '猪肉',
          category: '肉制品',
          weight: 10,
          origin: '上海市普陀区金沙江路1518'
        },
        {
          id: '10090',
          date: '1990-02-01',
          name: '牛肉',
          category: '肉制品',
          weight: 20,
          origin: '上海市普陀区金沙江路1518'
        },
        {
          id: '10090',
          date: '1990-03-01',
          name: '鸡肉',
          category: '肉制品',
          weight: 30,
          origin: '上海市普陀区金沙江路1518'
        },
        {
          id: '10090',
          date: '1990-04-01',
          name: '鸭肉',
          category: '肉制品',
          weight: 40,
          origin: '上海市普陀区金沙江路1518'
        },
      ]
    }
  }
}
</script>

<style scoped>

</style>
