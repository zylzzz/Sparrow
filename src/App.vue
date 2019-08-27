<template>
  <div id="app" v-noRight>
    <!-- PC端 -->
    <el-container v-if="phone==null">
      <!-- 侧边栏 -->
      <el-aside style="width: 200px;">
        <div
          style="background-color: #001529; width: 199px;opacity: 0.95; height: 60px;; position: fixed;"
        >
          <!-- <el-image :src="require('./assets/images/favicon.png')" style="width: 40%;"></el-image> -->
          <p style="text-align: left;padding:10px 0 5px 10px;margin:0;">
            <img src="./assets/images/favicon.png" alt width="30%;" />
          </p>
        </div>
        <el-menu
          :default-active="selectedKeys"
          mode="vertical"
          background-color="#001529"
          text-color="#fff"
          active-text-color="#ffd04b"
          style="height: 100%; text-align: left; position: fixed; width: 200px;margin-top: 60px;"
          @select="changeRoute"
        >
          <el-menu-item index="1">
            <a-icon type="user" style="font-size: 20px;" />
            <span>个人信息</span>
          </el-menu-item>
          <!-- 
          <a-sub-menu key="sub1">
            <span slot="title">
              <a-icon type="file-text" />
              <span>文档管理</span>
          </span>-->
          <el-menu-item index="2">
            <a-icon type="file-text" style="font-size: 20px;" />
            <span>个人文档</span>
          </el-menu-item>
          <el-menu-item index="3" disabled>
            <a-icon type="file-text" style="font-size: 20px;" />
            <span>部门文档</span>
          </el-menu-item>
          <!-- </a-sub-menu> -->

          <el-menu-item index="4">
            <a-icon type="file-search" style="font-size: 20px;" />
            <span>文档检索</span>
          </el-menu-item>
          <el-menu-item index="5" disabled>
            <a-icon type="delete" style="font-size: 20px;" />
            <span>回收站</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header
          style="position: fixed;z-index: 999;background-color: white;height: 60px;width: 100%; line-height: 60px;box-shadow: 0px 5px 6px 0 rgba(0,0,0,.07); "
        >
          <el-image
            :src="require('./assets/logo.png')"
            style="height: 50px; width: 240px; padding: 5px 0; float: left;"
          ></el-image>
          <div style="float: left;width: 30%;margin: 0 0 0 14%;" v-if="noSearchPage">
            <el-autocomplete
              style="width: 100%;"
              :fetch-suggestions="getKeyword"
              @select="turnToSearch"
              @keyup.native.enter.stop="turnToSearchByKeyword"
              v-model="keyword"
              placeholder="搜索你的资源"
            >
              <el-button
                icon="el-icon-search"
                type="primary"
                @click.stop="turnToSearchByKeyword"
                slot="append"
              ></el-button>
            </el-autocomplete>
          </div>

          <!-- 右上角用户小弹窗 -->
          <div style="float: right; margin-right: 13%;" v-if="(loginData.isLogin)">
            <el-popover trigger="hover" placement="bottom" width="150">
              <p style="text-align: center;">{{loginData.currentUserName}}</p>

              <el-button
                type="text"
                icon="el-icon-user"
                @click="changeRoute('1')"
                size="mini"
                style="display:block;margin:0 auto;font-size: 14px;color: #303133;"
              >个人中心</el-button>
              <div class="MyDivider"></div>
              <el-button
                type="text"
                icon="el-icon-switch-button"
                @click="logout"
                size="mini"
                style="display:block;margin:0 auto;font-size: 14px;"
              >退出登陆</el-button>
              <div class="MyDivider"></div>
              <el-button
                type="text"
                style="display:block;margin:0 auto;font-size: 14px;"
                size="mini"
                icon="el-icon-edit-outline"
                @click="registeredData.visible = true"
              >注册</el-button>
              <p slot="reference" style="text-align: center;" type="text">
                <!-- <el-buton type="primary"  circle > -->
                <img src="./assets/images/boy.png" alt width="90%;" />
              </p>
            </el-popover>
          </div>

          <div style="float: right; margin-right:1%" v-if="(loginData.isLogin)">
            <el-popover trigger="click" title="近期新增：" placement="left-start" width="250">
              <div class="MyDivider"></div>

              <!-- list-style-type: none; -->

              <span>8月12日</span>
              <ul style="width:100%">
                <li>添加鼠标覆盖后的功能图标</li>
              </ul>
              <span>8月18日</span>
              <ul style="width:100%">
                <li>内置预览窗口</li>
                <li>修复已知bug</li>
              </ul>
              <p slot="reference" style="text-align: center; padding-top:5px" type="text">
                <a class="el-icon-bell" style="font-size: 25px;"></a>
                <!-- <span icon="el-icon-bell" style="font-size: 30px; "></span> -->
                <!-- <el-buton type="primary"  circle > -->
                <!-- <img src="./assets/images/boy.png" alt width="90%;" /> -->
              </p>
            </el-popover>
          </div>

          <!-- 右上角 登陆按钮 -->
          <div style="float: right; margin-right:15%" v-if="(!loginData.isLogin)">
            <el-button
              style="font-size: 16px;margin-right:24px;"
              size="mini"
              type="danger"
              icon="el-icon-right"
              @click="loginData.visible = true"
            >登陆</el-button>
          </div>
        </el-header>

        <el-main :style="{minHeight: screenHeight - 120 + 'px'}" class="init">
          <router-view></router-view>
        </el-main>

        <el-footer class="footerSize" style="height: 30px;">{{footerText}}</el-footer>
      </el-container>
    </el-container>
    <!-- 移动端 -->
    <div v-if="phone!=null" style="height:100%">
      <div class="headerTop">
        <div style="float: left;font-size: 25px;">
          <span class="el-icon-menu" @click="leftDrawer = true"></span>
        </div>
        <div style="float: left;width: 80%;margin: 0 0 0 3%;" v-if="noSearchPage">
          <el-autocomplete
            style="width: 100%;"
            :fetch-suggestions="getKeyword"
            @select="turnToSearch"
            @keyup.native.enter.stop="turnToSearchByKeyword"
            v-model="keyword"
            placeholder="搜索你的资源"
          >
            <el-button
              icon="el-icon-search"
              type="primary"
              size="mini"
              @click.stop="turnToSearchByKeyword"
              slot="append"
            ></el-button>
          </el-autocomplete>
        </div>
        <div style="float: right;font-size: 25px;">
          <span class="el-icon-more"></span>
        </div>

        <!-- 左侧菜单 -->
        <el-drawer :visible.sync="leftDrawer" direction="ltr" size="200" :show-close="false">
         
            <div
              style="background-color: #001529; width:199px;opacity: 0.95; height: 50px;; position: fixed;padding-top:5px"
            >
              <span style="text-align: left;padding:0 0 0 5px;">
                <img src="./assets/images/favicon.png" alt width="30%;" />
              </span>
              <span style="color: #fff;font-size: 20px;">sparrow
                </span>
            </div>
            <el-menu
              :default-active="selectedKeys"
              mode="vertical"
              class="el-menu-vertical-demo"
              style="height: 50%; text-align: left; position: fixed; width: 200px;margin-top: 50px;"
              @select="changeRoute"
            >
              <el-menu-item index="1">
                <a-icon type="user" style="font-size: 15px;" />
                <span>个人信息</span>
              </el-menu-item>
              <el-menu-item index="2">
                <a-icon type="file-text" style="font-size: 15px;" />
                <span>个人文档</span>
              </el-menu-item>
              <el-menu-item index="3" disabled>
                <a-icon type="file-text" style="font-size: 15px;" />
                <span>部门文档</span>
              </el-menu-item>

              <el-menu-item index="4">
                <a-icon type="file-search" style="font-size: 15px;" />
                <span>文档检索</span>
              </el-menu-item>
              <el-menu-item index="5" disabled>
                <a-icon type="delete" style="font-size: 15px;" />
                <span>回收站</span>
              </el-menu-item>
            </el-menu>

        </el-drawer>
      </div>
    </div>
    <!-- 登陆弹窗 -->
    <el-dialog title="登陆" :visible.sync="loginData.visible" width="400px" style="text-align: left;">
      <div v-loading="LoginLoading" element-loading-text="正在登陆">
        <el-image
          :src="require('./assets/logo.png')"
          style="height:40px; width: 193px; margin: 0 auto; display: block;"
        ></el-image>
        <el-form
          label-position="right"
          label-width="80px"
          style="margin-right: 50px; margin-top: 30px"
          :model="loginData"
          :rules="loginData.rules"
        >
          <el-form-item label="工号" prop="user">
            <el-input v-model="loginData.user"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pwd">
            <el-input v-model="loginData.pwd" show-password></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button
            type="primary"
            @click="registeredData.visible = true"
            style="margin-right: 120px;"
          >注册</el-button>
          <el-button @click="cancelLogin">取 消</el-button>
          <el-button type="primary" @click="login">确 定</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 注册弹窗 -->
    <el-dialog
      title="注册"
      :visible.sync="registeredData.visible"
      width="400px"
      style="text-align: left;"
    >
      <div v-loading="RegistLoading" element-loading-text="正在注册">
        <el-image
          :src="require('./assets/logo.png')"
          style="height:40px; width: 193px; margin: 0 auto; display: block;"
        ></el-image>

        <el-form
          label-position="right"
          label-width="80px"
          style="margin-right: 50px; margin-top: 30px"
          :model="registeredData"
          :rules="registeredData.rules"
        >
          <el-form-item label="工号" prop="work_no">
            <el-input v-model="registeredData.work_no"></el-input>
          </el-form-item>
          <el-form-item label="名字" prop="username">
            <el-input v-model="registeredData.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pwd">
            <el-input v-model="registeredData.pwd" show-password></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="registeredData.email"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="cancelRegistered">取 消</el-button>
          <el-button style="margin-left:210px;" type="primary" @click="registered">确 定</el-button>
          <!-- <el-button @click="registered.visible = true">注册</el-button> -->
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as Api from "./api/api";
import * as DEFAULT from "./json/default";
import { Message, Loading } from "element-ui";

export default {
  name: "app",
  data() {
    return {
      // 搜索
      keyword: "",
      noSearchPage: true,
      //loading动画
      LoginLoading: false,
      RegistLoading: false,
      // 手机端 还未完成
      phone: false,
      screenHeight: 0,

      // 登陆
      loginData: {
        visible: false,
        logoutVisible: false,
        isLogin: false,
        currentUserName: "lintean",
        currentUserNo: "",
        currentUserId: "",
        currentUserEmail: "",
        user: "",
        pwd: "",
        rules: {
          user: [
            {
              required: true,
              message: "请输入工号",
              trigger: "blur"
            }
          ],
          pwd: [
            {
              required: true,
              message: "请输入密码",
              trigger: "blur"
            }
          ]
        }
      },
      registeredData: {
        visible: false,
        work_no: "",
        username: "",
        pwd: "",
        email: "",

        rules: {
          work_no: [
            {
              required: true,
              message: "请输入工号",
              trigger: "blur"
            }
          ],
          username: [
            {
              required: true,
              message: "请输入用户名字",
              trigger: "blur"
            }
          ],
          pwd: [
            {
              required: true,
              message: "请输入密码",
              trigger: "blur"
            }
          ],
          email: [
            {
              required: true,
              message: "请输入邮箱",
              trigger: "blur"
            }
          ]
        }
      },
      // 页脚内容
      footerText: "华喜科技 天盛科技 华南理工大学 Micerlabs@2019",

      // 侧边栏
      collapsed: false,
      selectedKeys: "2",

      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",

      //移动端
      leftDrawer: false
    };
  },
  mounted: function() {
    // created: function() {
    //从这里初始化
    // 判断是否是手机访问
    this.phone = this.isPhone();
    // console.log(this.phone);

    // 获取屏幕高度
    this.screenHeight = document.documentElement.clientHeight;

    let _this = this;
    //调用接口 获取用户元数据
    Api.getUser()
      .then(res => {
        // console.log("getUser:", res);
        if (res.data.status === 200) {
          //vuex 用户信息
          _this.$store.commit("setUserInforFromAppVue", res.data.data);
          _this.recordLoginData(res);
          Message({
            message: "用户登陆成功 ",
            center: true,
            type: "success",
            showClose: true,
            customClass: "zZindex"
          });
        } else {
          _this.loginData.visible = true;
        }
      })
      .catch(err => {
        _this.loginData.visible = true;
        Message({
          message: "请先登陆",
          center: true,
          type: "warning",
          showClose: true,
          customClass: "zZindex"
        });
      });

    this.changeKeys(window.location.hash);
  },
  watch: {
    //为了能左边菜单高亮显示
    $route(to, from) {
      this.changeKeys(window.location.hash);
    }
  },
  methods: {
    isPhone() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      return flag;
    },

    //此函数用于登陆之后初始化信息
    recordLoginData(res) {
      let _this = this;
      // 登陆信息
      _this.loginData.currentUserName = res.data.data.userInfo.username;
      _this.loginData.currentUserNo = res.data.data.userInfo.work_no;
      _this.loginData.currentUserEmail = res.data.data.userInfo.email;
      _this.loginData.isLogin = true;

      // vuex 目录信息
      this.$store.commit({
        type: "setCurrentResourceBackup",
        currentResourceBackup: {
          type: "dir",
          id: res.data.data.resource_id
        }
      });

      // 初始化面包屑的路径
      let path = [];
      for (let i = res.data.data.master_dirs.length - 1; i >= 0; --i) {
        path.push({
          id: res.data.data.master_dirs[i].id,
          title: res.data.data.master_dirs[i].title,
          type: "dir"
        });
      }
      path.push({
        id: res.data.data.resource_id,
        title: res.data.data.resource_name
      });

      this.$store.commit({
        type: "setPathBackup",
        pathBackup: path
      });

      this.$root.eventHub.$emit("login");
    },
    login() {
      let _this = this;
      _this.LoginLoading = true;
      //调用接口 用户登陆
      Api.Login(this.loginData.user, this.loginData.pwd)
        .then(res => {
          //vuex 用户信息
          _this.$store.commit("setUserInforFromAppVue", res.data.data);
          //   console.log("Login：", res);
          if (res.data.status === 200) {
            _this.recordLoginData(res);
            _this.loginData.visible = false;
            this.LoginLoading = false;
            Message({
              message: "用户登陆 成功",
              center: true,
              type: "success",
              showClose: true,
              customClass: "zZindex"
            });
          } else {
            Message({
              message: res.data.msg,
              center: true,
              type: "warning",
              showClose: true,
              customClass: "zZindex"
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.LoginLoading = false;

          Message({
            message: "账号密码不正确 " + err,
            center: true,
            type: "warning",
            showClose: true,
            customClass: "zZindex"
          });
        });
    },
    registered() {
      let _this = this;
      //掉用接口 用户注册
      _this.RegistLoading = true;
      Api.newUser(
        this.registeredData.work_no,
        this.registeredData.username,
        this.registeredData.pwd,
        this.registeredData.email
      )
        .then(res => {
          // console.log("registered：", res.data.status);
          if (res.data.status === 200) {
            this.registeredData.visible = false;
            (_this.RegistLoading = false),
              Message({
                message: "用户注册 成功",
                center: true,
                type: "success",
                showClose: true,
                customClass: "zZindex"
              });
          } else {
            Message({
              message: res.data.msg,
              center: true,
              type: "warning",
              showClose: true,
              customClass: "zZindex"
            });
          }
        })
        .catch(err => {
          _this.RegistLoading = false;
          console.log("registered：", err);
          if (err.response.status == 400) {
            Message({
              message: "工号已存在",
              center: true,
              type: "warning",
              showClose: true,
              customClass: "zZindex"
            });
          } else if (err.response.status == 403) {
            Message({
              message: "请先登陆,才能注册新用户",
              center: true,
              type: "warning",
              showClose: true,
              customClass: "zZindex"
            });
          } else {
            Message({
              message: "注册失败",
              center: true,
              type: "warning",
              showClose: true,
              customClass: "zZindex"
            });
          }
          console.log(err);
        });
    },
    logout() {
      let _this = this;
      //调用接口 注销登陆
      Api.Logout()
        .then(res => {
          //   console.log("Logout：", res);

          if (res.data.status === 200) {
            _this.loginData.isLogin = false;
            _this.loginData.visible = true;
            Message({
              message: "注销登陆 成功",
              center: true,
              type: "success",
              showClose: true,
              customClass: "zZindex"
            });
          } else {
            alert(res.data.msg);
          }
        })
        .catch(err => {
          Message({
            message: "注销登陆 失败",
            center: true,
            type: "warning",
            showClose: true,
            customClass: "zZindex"
          });
          _this.handleError(err);
        });
    },
    // 侧边栏
    changeRoute(e) {
      // console.log(e);
      switch (e) {
        case "1": {
          // console.log("toUser");
          this.$router.push({
            path: "/user"
          });
          break;
        }
        case "2": {
          // console.log("toDoc");
          this.$router.push({
            path: "/doc"
          });
          break;
        }
        case "3": {
          // console.log("toDocGroup");
          this.$router.push({
            path: "/doc"
          });
          break;
        }
        case "4": {
          // console.log("toSearch");
          this.$router.push({
            path: "/search"
          });
          break;
        }
      }
    },
    //为了能左边菜单高亮显示
    //监测url改变 然后高亮显示左边对应选项
    changeKeys(hash) {
      console.log(hash);
      if (hash == "#/doc") {
        this.selectedKeys = "2";
        this.noSearchPage = true;
      }

      if (hash.search("#/search") != -1) {
        this.selectedKeys = "4";
        this.noSearchPage = false;
      }
      if (hash == "#/user") {
        this.selectedKeys = "1";
        this.noSearchPage = true;
      }
    },
    handleError(err) {
      console.log(err);
      Message({
        message: DEFAULT.defaultNetwordError,
        center: true,
        type: "success",
        showClose: true,
        customClass: "zZindex"
      });
    },

    //测试专用 上线请注释

    cancelLogin() {
      this.loginData.visible = false;
      Message({
        message: "未登录",
        center: true,
        showClose: true,
        customClass: "zZindex"
      });
    },

    cancelRegistered() {
      this.registeredData.visible = false;
      Message({
        message: "取消注册",
        center: true,
        showClose: true,
        customClass: "zZindex"
      });
    },

    getKeyword(keyword, cb) {
      let _this = this;
      _this.cardLoading = true;
      Api.Suggestions("all", this.keyword, 10)
        .then(res => {
          if (res.data.status === 200) {
            // 数组清空
            let searchSuggestions = [];
            for (let i = 0; i < res.data.data.length; ++i) {
              let temp = {
                value: res.data.data[i]
              };
              searchSuggestions.push(temp);
            }
            cb(searchSuggestions);
            _this.cardLoading = false;
          } else {
            Message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log("getKeyword");

          _this.handleError(err);
          _this.cardLoading = false;
        });
    },
    turnToSearch(item) {
      this.$router.push({
        path: "/search",
        query: {
          keyword: item.value,
          resourceId: null
        }
      });
      this.changeKeys();
    },
    turnToSearchByKeyword() {
      this.$router.push({
        path: "/search",
        query: {
          keyword: this.keyword,
          resourceId: null
        }
      });
      this.changeKeys(window.location.hash);
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.init {
  margin: 0;
  padding: 0 !important;
  position: relative;
  display: block !important;
  background-color: rgba(0, 0, 0, 0.008);
}
/* 用于将提示放在最上层 */
.zZindex {
  z-index: 3000 !important;
}
.footerSize {
  /* position: fixed; */
  width: 85%;
  bottom: 0px;

  /* height: 60px; */
  line-height: 30px;
  margin-top: 0;
  /* box-shadow: 0px -5px 6px 0px rgba(0, 0, 0, 0.05); */
}

.MyDivider {
  margin: 0;
  display: block;
  height: 1px;
  width: 100%;
  background-color: #dcdfe6;
  position: relative;
  /* margin: 5px; */
}

/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 6px;
}
/* 滚动槽 */
::-webkit-scrollbar-track {
  /* -webkit-box-shadow:inset 006 pxrgba(0,0,0,0.3); */
  border-radius: 10px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
  /* -webkit-box-shadow:inset 006 pxrgba(0,0,0,0.5); */
}
::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(0, 0, 0, 0.1);
}

.headerTop {
  width: 100%;
  padding: 5px;
  height: 50px;
  box-shadow: rgba(0, 0, 0, 0.07) 0px 5px 6px 0px;
}

.el-drawer__header {
    margin-bottom: 0px !important;
    padding: 0 0 0 0 !important;
}
</style>
