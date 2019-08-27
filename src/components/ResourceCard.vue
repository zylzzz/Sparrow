<template>
  <el-card :body-style="{ padding: '0px',height:'100%'}" v-menus>
    <div style="position: relative;top: 0px;left:0" v-show="doc.showSmallIcons">
      <div >
        <span
          @click.stop="$parent.indexShowBeClick(index)"
          calss="menu"
          style="font-size: 20px;right: 10%;position: absolute"
        >
           <span @click="getMousePos"> <a-icon type="ellipsis" /></span>
        </span>

        <span
          v-show="doc.ext == null"
          @click="$parent.indexShowBeClick(index);$parent.callGroup()"
          style="font-size: 20px;right: 30%;position: absolute;opacity:0.7"
        >
          <a-icon type="team" />
        </span>
        <span
          v-show="doc.ext != null"
          @click="$parent.indexShowBeClick(index);$parent.filePreview()"
          style="font-size: 20px;right: 30%;position: absolute;opacity:0.7"
        >
          <a-icon type="eye" />
        </span>
      </div>
    </div>
    <div style="padding-top:15%;">
      <div class="cardImage" :style="styleCardImage">
        <el-image
          :src="doc.thumbnail_url"
          fit="scale-down"
          alt="fileImage"
          style="width:100%;height: 100%;"
        >
          <div slot="error">
            <img src="../assets/images/imageF.svg" alt="加载失败" style="width:100%;height: 100%;" />
          </div>
        </el-image>
      </div>
      <div class="MyDivider"></div>
      <div
        v-if="index!=0"
        class="resCardName"
       
        style="text-overflow: ellipsis; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; overflow: hidden;cursor: default;"
      >
        <span
          class="nameText"
          v-show="!doc.isEditStatus"
        >{{doc.ext != null? doc.title + '.' + doc.ext: doc.title}}</span>
        <el-input
          ref="changeName"
          v-show="doc.isEditStatus"
          class="changeName"
          size="medium"
          v-model="doc.title"
          @keyup.enter.native.stop="enter"
          @blur.stop="changeName"
          @click.native.stop="getFocus"
        ></el-input>
      </div>
      <div
        v-if="index==0"
        class="resCardName"
        style="text-overflow: ellipsis; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; overflow: hidden;"
      >
        <span class="nameText">{{doc.title}}</span>
      </div>
    </div>
  </el-card>
</template>

<script>
import * as Api from "../api/api";
import * as DEFAULT from "../json/default";
import { Message } from "element-ui";

export default {
  name: "ResourceCard",
  //从doc.vue传过来的三个值
  props: ["doc", "index", "styleCardImage"],
  data() {
    return {
      fileEditMeta: {},
      docEditMeta: {},
      primaryName: "",
      //自定义右键菜单
      menuShow: false,
      menuLeft: 0,
      menuTop: 0
    };
  },
  watch: {
    editStatus(newOne, oldOne) {
      if (newOne) {
        let _this = this;
        setTimeout(function() {
          _this.$refs.changeName.focus();
          _this.primaryName = _this.doc.title;
        }, 1);
      }
    },

    //监听自定义命令v-menu directive.js 对这里的三个值改变，然后存到store.js
    menuTop() {
      // console.log("card: ",this.menuShow,this.menuLeft,this.menuTop)
      this.$store.commit("setmenu", {
        Show: this.menuShow,
        Left: this.menuLeft,
        Top: this.menuTop
      });
    }
  },
  computed: {
    editStatus() {
      return this.doc.isEditStatus;
    }
  },
  methods: {
    edit() {
      if (!this.doc.isEditStatus && this.$parent.isIndexClicked(this.index)) {
        this.$parent.callChangeName();
      }
    },
    getFocus() {},
    enter() {
      this.$refs.changeName.blur();
    },
    //判断 改名对象
    changeName() {
      if (this.doc.type == "doc") {
        this.changeDocName();
      } else if (this.doc.type == "dir") {
        this.editResources();
      } else {
        this.changeFileName();
      }
    },

    editResources() {
      let _this = this;
      Api.editDirMeta(this.doc.id, this.doc.title)
        .then(res => {
          if (res.data.status === 200) {
            _this.changeSuccess();
          } else {
            Message.error(res.data.msg);
          }
        })
        .catch(err => {
          _this.changeError(err);
        });
    },
    changeDocName() {
      let _this = this;
      Api.getDocMeta(this.doc.id)
        .then(res => {
          if (res.data.status === 200) {
            _this.docEditMeta = res.data.data;
            _this.docEditMeta.title = _this.doc.title;
            _this.updateDocMeta();
          } else {
            Message.error(res.data.msg);
          }
        })
        .catch(err => {
          _this.changeError(err);
        });
    },
    changeFileName() {
      let _this = this;
      Api.getFileMeta(this.doc.id)
        .then(res => {
          if (res.data.status === 200) {
            _this.fileEditMeta = res.data.data;
            _this.fileEditMeta.title = _this.doc.title;
            _this.updateFileMeta();
          } else {
            Message.error(res.data.msg);
          }
        })
        .catch(err => {
          _this.changeError(err);
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
            _this.changeSuccess();
          } else {
            Message.error(res.data.msg);
          }
        })
        .catch(err => {
          _this.changeError(err);
        });
    },
    updateDocMeta() {
      let _this = this;
      Api.editDocMeta(
        this.doc.id,
        this.docEditMeta.title,
        this.docEditMeta.desc
      )
        .then(res => {
          if (res.data.status === 200) {
            _this.changeSuccess();
          } else {
            Message.error(res.data.msg);
          }
        })
        .catch(err => {
          _this.changeError(err);
        });
    },
    changeSuccess() {
      Message.success("改名成功");
      this.$parent.stopEditNameByIndex(this.index);
    },
    changeError(err) {
      console.log(err);
      Message.error("改名失败 " + err.response.status);
      this.$parent.stopEditNameByIndex(this.index);
    },
    //获取 鼠标位置 用以打开小菜单
    getMousePos(event) {
      var e = event || window.event;
      this.menuShow = true;
      this.menuTop = event.pageY + 5;
      this.menuLeft = event.pageX - 190 ;
      // console.log( this.menuLeft, this.menuTop);
    }
  }
};
</script>

<style>
.changeName {
  width: 80%;
}
.cardImage {
  width: 150px;
  height: 150px;
  display: block;
  margin: 0 auto;
}
.resCardName {
  /* border: 1px solid rgb(76, 0, 255); */
  margin-top: 8%;
  text-align: center;
}
.nameText {
  font-size: 14px;
}
</style>
