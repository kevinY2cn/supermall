<template>

  <el-table :data="tableData">
    <el-table-column
    prop="date"
    label="日期"
    width="180"
    ></el-table-column>

    <el-table-column
      prop="name"
      label="姓名"
      width="180"
    ></el-table-column>

    <el-table-column
      prop="address"
      label="地址"
      width="180"
    ></el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "Shop",

  data(){
    return {
      tableData: [
        {
          date: '1990-01-01',
          name: 'kevin',
          address: '上海市普陀区金沙江路1518'
        },
        {
          date: '1990-02-01',
          name: 'james',
          address: '上海市普陀区金沙江路1518'
        },
      ]
    }
  }
}
</script>

<style scoped>

</style>
