<template>
  <a-drawer
    width="270"
    getContainer="section"
    :mask="false"
    @close="close"
    :visible="fileMetaVisible"
  >
    <div slot="title">
      <span>文件属性</span>
    </div>
    <div v-loading="fileloading">
      <el-button
        size="small"
        @click="fileEditMetaVisible = true"
        type="primary"
        plain
        icon="el-icon-edit"
      ></el-button>
      <el-row style="margin-top: 10px;color: #9DA2B3;">文件名：</el-row>
      <el-row>{{fileMeta.title + '.' + fileMeta.ext}}</el-row>
      <!-- 			<el-row style="margin-top: 10px;">
			<el-col :offset="1" :span="5" style="text-align: right;">创建者：</el-col>
			<el-col :offset="2" :span="16">
				<span>{{docList[currentItemClicked].created_time}}</span>
			</el-col>
      </el-row>-->
      <el-row style="margin-top: 10px;color: #9DA2B3;">创建时间：</el-row>
      <el-row v-if="fileMeta.created_time==undefined"></el-row>
      <el-row v-if="fileMeta.created_time!=undefined">{{fileMeta.created_time.substr(0,16)}}</el-row>

      <el-row style="margin-top: 10px;color: #9DA2B3;">修改时间：</el-row>
      <el-row v-if="fileMeta.modified_time==undefined"></el-row>
      <el-row v-if="fileMeta.modified_time!=undefined">{{fileMeta.modified_time.substr(0,16)}}</el-row>

      <el-row style="margin-top: 10px;">
        <el-col :offset="1" :span="5" style="text-align: right;color: #9DA2B3;">类目：</el-col>
        <el-col :offset="2" :span="16">
          <el-tag
            v-for="(fc, index) in fileCategories"
            :key="index"
            type="success"
            style="margin-right: 5px;"
          >{{fc.title}}</el-tag>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :offset="1" :span="5" style="text-align: right;color: #9DA2B3;">标签：</el-col>
        <el-col :offset="2" :span="16">
          <el-tag
            v-for="(ft, index) in fileTags"
            :key="index"
            type="primary"
            style="margin-right: 5px;"
          >{{ft.title}}</el-tag>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :offset="1" :span="5" style="text-align: right;color: #9DA2B3;">简介：</el-col>
        <el-col :offset="2" :span="16">
          <span>{{fileMeta.desc}}</span>
        </el-col>
      </el-row>
    </div>
    <!-- 文件meta修改 -->
    <a-drawer width="420" @close="fileEditMetaVisible = false" :visible="fileEditMetaVisible">
      <div slot="title">
        <span>修改文件信息</span>
      </div>
      <el-row style="margin-top: 10px;">
        <el-col :offset="1" :span="5" style="text-align: right;color: #9DA2B3;">文件名：</el-col>
        <el-col :offset="2" :span="16">
          <el-input type="text" v-model="fileEditMeta.title" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :offset="1" :span="5" style="text-align: right;color: #9DA2B3;">简介：</el-col>
        <el-col :offset="2" :span="16">
          <el-input
            type="textarea"
            :rows="8"
            show-word-limit
            v-model="fileEditMeta.desc"
            size="small"
          ></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-button
          style="position: absolute; top: 10px; right: 10px;"
          size="small"
          @click="updateFileMeta"
          type="primary"
          plain
        >保存修改</el-button>
      </el-row>
    </a-drawer>
  </a-drawer>
</template>

<script>
// 此组件未完成
// 需要后台增添接口
import { mapState } from "vuex";
import * as DEFAULT from "../json/default";
import * as Api from "../api/api";

export default {
  name: "FileMeta",
  data() {
    return {
      // 文件meta
      fileEditMetaVisible: false,
      fileMeta: DEFAULT.fm,
      fileEditMeta: DEFAULT.fm,
      fileCategories: DEFAULT.tg,
      fileTags: DEFAULT.tg,
      //加载动画
      fileloading: true
    };
  },
  computed: {
    ...mapState(["fileMetaVisible"])
  },
  props: ["clickedItemId"],
  watch: {
    fileMetaVisible(newOne, oldOne) {
      if (newOne && this.clickedItemId != "") {
        this.getFileMeta();
      }
    },
    clickedItemId() {
      if (this.fileMetaVisible == true&& this.clickedItemId != "") {
        // console.log(this.clickedItemId);
        this.getFileMeta();
      }
    }
  },
  methods: {
    getFileMeta() {
      let _this = this;
      _this.fileloading = true;

      Api.getFileMeta(this.clickedItemId)
        .then(res => {
          if (res.data.status === 200) {
            _this.fileMeta = res.data.data;
            _this.fileEditMeta = JSON.parse(JSON.stringify(res.data.data));
            _this.getFileCategories();
            _this.getFileTags();
            _this.fileloading = false;

            // console.log("File created_time: ",res.data.data.created_time);
            // console.log("File modified_time: ",res.data.data.modified_time);
          } else {
            _this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          _this.$message.error(err);
        });
    },
    updateFileMeta() {
      let _this = this;
      let temp = this.fileEditMeta;
      Api.editFileMeta(
        temp.id,
        temp.title,
        temp.desc,
        temp.categories,
        temp.tags
      )
        .then(res => {
          if (res.data.status === 200) {
            _this.fileMeta = JSON.parse(JSON.stringify(_this.fileEditMeta));
            _this.$parent.itemDBClicked(-1);
            _this.fileEditMetaVisible = false;
          } else {
            _this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          _this.$message.error(err);
        });
    },
    getFileCategories() {
      let _this = this;
      Api.getFileCategories(this.clickedItemId)
        .then(res => {
          if (res.data.status === 200) {
            _this.fileCategories = res.data.data;
          } else {
            _this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          _this.$message.error(err);
        });
    },
    //获取类目
    getFileTags() {
      let _this = this;
      Api.getFileTags(this.clickedItemId)
        .then(res => {
          if (res.data.status === 200) {
            _this.fileTags = res.data.data;
          } else {
            _this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          _this.$message.error(err);
        });
    },
    close() {
      this.$store.commit({
        type: "fileMetaH"
      });
    },
    handleError(err) {
      console.log(err);
      this.$message.warning(DEFAULT.defaultNetwordError);
    }
  }
};
</script>

<style>
</style>
