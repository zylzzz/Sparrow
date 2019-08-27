<template>
  <a-drawer
    width="270"
    getContainer="section"
    :mask="false"
    @close="close"
    :visible="docMetaVisible"
  >
    <div slot="title">
      <span>文档属性</span>
    </div>
    <div class="loadingMsg" v-loading="DocLoading" element-loading-text="请稍后">
      <el-button
        size="small"
        @click="docEditMetaVisible = true"
        icon="el-icon-edit"
        type="primary"
        plain
      ></el-button>
      <el-row style="margin-top: 10px;color: #9DA2B3;">文档名：</el-row>
      <el-row>{{docMeta.title}}</el-row>
      <!-- 			<el-row style="margin-top: 10px;">
			<el-col :offset="1" :span="5" style="text-align: right;">创建者：</el-col>
			<el-col :offset="2" :span="16">
				<span>{{docMeta.creator}}</span>
			</el-col>
      </el-row>-->
      <el-row style="margin-top: 10px;color: #9DA2B3;">创建时间：</el-row>
      <el-row v-if="docMeta.created_time==undefined"></el-row>
      <el-row v-if="docMeta.created_time!=undefined">{{docMeta.created_time.substr(0,16)}}</el-row>
      <el-row style="margin-top: 10px;color: #9DA2B3;">修改时间</el-row>
      <el-row v-if="docMeta.modified_time==undefined"></el-row>
      <el-row v-if="docMeta.modified_time!=undefined">{{docMeta.modified_time.substr(0,16)}}</el-row>
      <el-row style="margin-top: 10px;color: #9DA2B3;">简介</el-row>
      <el-row>{{docMeta.desc}}</el-row>
    </div>
    <!-- 文档meta修改 -->
    <a-drawer width="420" @close="docEditMetaVisible = false" :visible="docEditMetaVisible">
      <div slot="title">
        <span>修改文档信息</span>
      </div>
      <el-row style="margin-top: 10px;">
        <el-col :offset="1" :span="5" style="text-align: right;">文档名：</el-col>
        <el-col :offset="2" :span="16">
          <el-input type="text" v-model="docEditMeta.title" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :offset="1" :span="5" style="text-align: right;">简介：</el-col>
        <el-col :offset="2" :span="16">
          <el-input
            type="textarea"
            :rows="8"
            show-word-limit
            v-model="docEditMeta.desc"
            size="small"
          ></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-button
          style="position: absolute; top: 10px; right: 10px;"
          size="small"
          @click="updateDocMeta"
          type="primary"
          plain
        >保存修改</el-button>
      </el-row>
    </a-drawer>
  </a-drawer>
</template>

<script>
import { mapState } from "vuex";
import * as DEFAULT from "../json/default";
import * as Api from "../api/api";
import { Message, Loading } from "element-ui";
export default {
  name: "DocMeta",
  data() {
    return {
      // 文档meta
      docEditMetaVisible: false,
      DocLoading: true,
      docMeta: {
        id: "1",
        title: "****",
        desc: "****",
        creator: "green",
        files: ["1", "2", "ABC"],
        meta_state: 1,
        created_time: "****-**-** **:**:**",
        modified_time: "****-**-** **:**:**"
      },
      docEditMeta: {
        title: "****",
        desc: "****"
      }
    };
  },
  //从vuex中获取 是否显示
  computed: {
    ...mapState(["docMetaVisible"])
  },
  props: ["clickedItemId"],
  watch: {
    docMetaVisible(newOne, oldOne) {
      if (newOne && this.clickedItemId != "") {
        this.getDocMeta();
      }
    },
    clickedItemId() {
      if (this.docMetaVisible == true&& this.clickedItemId != "") {
        // console.log(this.clickedItemId);
        this.getDocMeta();
      }
    }
  },
  methods: {
    updateDocMeta() {
      let _this = this;
      Api.editDocMeta(
        this.clickedItemId,
        this.docEditMeta.title,
        this.docEditMeta.desc
      )
        .then(res => {
          if (res.data.status === 200) {
            _this.docMeta = JSON.parse(JSON.stringify(_this.docEditMeta));
            _this.docEditMetaVisible = false;
            _this.$parent.itemDBClicked(-1);
            Message.success("修改成功");
          } else {
            Message.error(res.data.msg);
          }
        })
        .catch(err => {
          Message.error("修改失败 " + err.response.status);

          // _this.handleError(err);
        });
    },
    getDocMeta() {
      let _this = this;
      this.DocLoading = true;

      Api.getDocMeta(this.clickedItemId)
        .then(res => {
          if (res.data.status === 200) {
            _this.docMeta = res.data.data;
            _this.docEditMeta = JSON.parse(JSON.stringify(_this.docMeta));
            //关闭loading动画
            this.DocLoading = false;
            // DocLoading.close();

            // console.log("Doc created_time: ",res.data.data.created_time);
            // console.log("Doc modified_time: ",res.data.data.modified_time);
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
        type: "docMetaH"
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
