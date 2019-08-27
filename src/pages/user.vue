<template>
  <div style="margin-top:100px">
    <div class="user-content">
      <div v-if="!hava_infot">
        <div class="grid-content">
          <p style="font-size:20px;">
            <b>请先登陆</b>
          </p>
        </div>
      </div>

      <div class="grid-content" v-if="hava_infot">
        <div>
          <p style="font-size:20px;">
            <b>个人信息</b>
          </p>
        </div>

        <div style="margin-top:10%;">
          <p style="font-size:16px;">
            <b style="float: left;">昵称:</b>
            <span style="margin-left:20px">{{username}}</span>
          </p>
        </div>

        <div style="margin-top:5%;">
          <p style="font-size:16px;">
            <b style="float: left;">工号:</b>
            <span style="margin-left:20px">{{work_no}}</span>
          </p>
        </div>

        <div style="margin-top:5%;">
          <p style="font-size:16px;">
            <b style="float: left;">邮箱:</b>
            <span style="margin-left:20px">{{email}}</span>
          </p>
        </div>

        <div style="margin-top:5%;">
          <p style="font-size:16px;">
            <b style="float: left;">个人目录:</b>
          </p>
          <span style="margin-left:20px">
            <el-button size="mini" @click="goUserDirs()">{{resource_name}}</el-button>
          </span>
        </div>

        <div style="margin-top:5%;">
          <p style="font-size:16px;">
            <b style="float: left;">主目录:</b>
          </p>
          <div >
            <span v-for="(document, index) in master_dirs" :key="index">
              <el-button size="mini" @click="goMasterDirs(index)">{{document.title}}</el-button>
              <span class="el-icon-arrow-right"></span>
            </span>
          </div>
        </div>

        <div style="margin-top:5%;">
          <p style="font-size:16px;">
            <b style="float: left;">所在群组:</b>
          </p>
        </div>

        <div
          style="margin-top:2%;"
          v-loading="userLoading"
          element-loading-text="请稍后"
          v-for="(gro, index) in group"
          :key="index"
        >
          <p style="font-size:16px;">
            <b style="float: left;"></b>
            <span style="margin-left:20px">{{gro.group_name}}</span>
            <span style="margin-left:20px">{{gro.group_desc}}</span>
          </p>
        </div>

        <!-- <div style="margin-top:15%;">
          <el-button type="success" @click="updatePublicMsg" disabled>更新信息</el-button>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import * as Api from "../api/api";
import { Message, Loading } from "element-ui";

export default {
  name: "user",
  data() {
    return {
      work_no: "",
      email: "",
      username: "",

      master_dirs: [],
      resource_id: "",
      resource_name: "",
      //验证 store.js中是否有userInformatio
      hava_infot: false,

      userLoading: true,

      group: []
    };
  },
  mounted: function() {
    let _this = this;
    //从store.js中获取数据
    if (_this.$store.state.userInformation != null) {
      _this.work_no = _this.$store.state.userInformation.userInfo.work_no;
      _this.email = _this.$store.state.userInformation.userInfo.email;
      _this.username = _this.$store.state.userInformation.userInfo.username;

      _this.master_dirs = _this.$store.state.userInformation.master_dirs;

      _this.resource_id = _this.$store.state.userInformation.resource_id;
      _this.resource_name = _this.$store.state.userInformation.resource_name;
      _this.hava_infot = true;
    }

    Api.getGroupOfUser()
      .then(res => {
        // console.log("getUser:", res);
        if (res.data.status === 200) {
          _this.group = res.data.data;
          // console.log("getUser:", _this.group);
          _this.userLoading = false;
        } else {
          Message.warning(res);
          _this.userLoading = false;
        }
      })
      .catch(err => {
        Message.warning(err);
        _this.userLoading = false;
      });
  },
  methods: {
    updatePublicMsg() {
      console.log("更新信息");
    },
    goMasterDirs(index) {
      console.log("去主目录", index);
    },
    goUserDirs() {
      console.log("去个人目录");
    }
  }
};
</script>


<style scoped>
.user-content {
  /* float: right; */
  margin: 5% 0 0 30%;
}
.grid-content {
  float: left;
  width: 50%;
  height: 100%;
}
</style>  


