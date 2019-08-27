<template>
  <a-drawer
    title="目录属性"
    getContainer="section"
    width="270"
    :mask="false"
    @close="close"
    :visible="dirMetaVisible"
  >
    <el-row style="margin-top: 10px;color: #9DA2B3;">目录名：</el-row>
    <el-row>{{dirMeta.title}}</el-row>

    <!-- 			<el-row style="margin-top: 10px;">
			<el-col :offset="1" :span="5" style="text-align: right;">创建者：</el-col>
			<el-col :offset="2" :span="16">
				<el-input type="textarea" :rows="5" show-word-limit v-model="docEditMeta.desc" size="small">
				</el-input>
			</el-col>
    </el-row>-->
    <el-row style="margin-top: 10px;color: #9DA2B3;">创建时间：</el-row>
    <!-- <el-row>{{showDirCreatTime}}</el-row> -->
    <el-row
      v-if="dirMeta.created_time != null&& dirMeta.created_time != ''"
    >{{dirMeta.created_time.substr(0,10)+' '+(parseInt(dirMeta.created_time.substr(11,2))+8)+dirMeta.created_time.substr(13,3)}}</el-row>
  </a-drawer>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "DirMeta",
  data() {
    return {
      showDirCreatTime: "yyyy-mm-dd xx:xx:xx"
      //   docright:'section'
    };
  },

  computed: {
    ...mapState(["clickedItemId", "dirMetaVisible"])
  },
  props: ["dirMeta"],
  //   watch: {
  //     dirMetaVisible() {
  //       // console.log("dir created_time: ",this.dirMeta.created_time)
  //       // ’2019-07-28T12:15:27.337+0000‘
  //       //这种目录独有的时间表达方式 就很固定
  //       //永远少8小时 多出个T
  //       var year = this.dirMeta.created_time.substr(0, 10);
  //       var hoursT = this.dirMeta.created_time.substr(10, 3);
  //       var minAndSecon = this.dirMeta.created_time.substr(13, 6);
  //       var newHours = parseInt(hoursT.substr(1, 2)) + 8;
  //       this.showDirCreatTime = year + " " + newHours.toString() + minAndSecon;
  //     }
  //   },
  methods: {
    close() {
      this.$store.commit({
        type: "dirMetaH"
      });
    }
  }
};
</script>

<style>
.ant-drawer-content-wrapper {
  position: fixed;
  margin-top: 60px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
}
</style>
