<template>
  <a-drawer width="460" @close="close" :visible="groupVisible" v-menus>
    <div slot="title">
      <span>查看群组</span>
      <!-- <el-dropdown style="position: absolute; top: 10px; right: 10px;" @command="operateGroup"> -->
      <!-- <div style="margin-right:50px"> -->
      <el-button-group style="float: right;margin-right:50px">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="groupDrawer.newGroupVisible = true"
        >新建</el-button>
        <el-button
          type="success"
          icon="el-icon-circle-plus-outline"
          size="small"
          @click="groupDrawer.addGroupVisible = true"
        >添加</el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="small"
          @click="isDeleteScene = !isDeleteScene"
        >
          <span v-if="isDeleteScene">取消</span>
        </el-button>
      </el-button-group>
      <!-- </div> -->
    </div>

    <!-- 群组列表 -->
    <div>
      <span v-if="TaNoGrounp" style="color: #9DA2B3;">该资源还没有群组，请先新建，再添加</span>
    </div>

    <div
      style="border-bottom: #e8e8e8 1px solid;"
      v-if="!TaNoGrounp"
      v-loading="GroupLoading"
      element-loading-text="请稍后"
    >
      <el-row
        style="height: 120px; border-top: #e8e8e8 1px solid; cursor: pointer; padding: 10px;"
        v-for="(group, index) in groupList"
        :key="index"
        @click.native="showGroupUser(index)"
      >
        <el-col :span="14" style="height: 100px">
          <h3 v-if="group!=undefined">{{group.groupInfo.group_name}}</h3>

          <span
            style="color:rgba(0, 0, 0, 0.45); text-overflow: ellipsis; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden;"
            v-if="group!=undefined"
          >{{group.groupInfo.group_desc}}</span>
        </el-col>
        <el-col :offset="2" :span="8" style="height: 100px; line-height: 100px; text-align: right;">
          <span>{{permissionMap[group.permission]}}</span>
          <!-- <span class="el-icon-d-arrow-right" style="margin-left:10px"></span>
          -->
          <span style="margin-left:10px;">
            <img src="../assets/images/toRight.svg" alt="向右打开详情" width="25%" />
          </span>
        </el-col>
        <el-button
          v-show="isDeleteScene"
          plain
          circle
          icon="el-icon-close"
          type="danger"
          style="position: absolute; right: 0px; top: 2px;"
          size="mini"
          @click.stop="deleteGroup(index)"
        ></el-button>
      </el-row>
    </div>

    <!-- 群组列表 含群组名、群组简介、权限选择器、删除button（隐藏）、点击进入群组中的用户 -->

    <!-- 查看群组中的用户(查看群组元数组) -->
    <a-drawer
      width="420"
     
      @close="groupDrawer.groupUserVisible = false"
      :visible="groupDrawer.groupUserVisible"
    >
      <div v-loading="groupUserLoading" element-loading-text="请稍后">
        <div slot="title">
          <span>群组信息</span>
          <el-button-group style="float: right;margin-right:50px">
            <!-- 添加用户 -->
            <el-button
            disabled
              type="primary"
              icon="el-icon-circle-plus-outline"
              size="small"
              @click="groupDrawer.addUserVisible = true"
            >
              <span class="el-icon-s-custom"></span>
            </el-button>
            <!-- 删除用户 -->
            <el-button
              disabled
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="isDeleteGroupUserScene = !isDeleteGroupUserScene"
            >
              <span class="el-icon-s-custom"></span>
            </el-button>
            <!-- 编辑群组信息 -->
            <el-button
              type="info"
              icon="el-icon-edit"
              size="small"
              @click="groupDrawer.groupMetaVisible = true"
            >编辑</el-button>
          </el-button-group>
        </div>
        <el-divider></el-divider>
        <!-- <div> -->

        <!-- </div> -->
        <el-row style="margin-top: 10px;">
          <el-col :offset="1" :span="5" style="text-align: right;color: #9DA2B3;">群组名：</el-col>
          <el-col :offset="2" :span="16">
            <span
              v-if="groupList[groupClickedIndex]!=undefined"
            >{{groupList[groupClickedIndex].groupInfo.group_name}}</span>
          </el-col>
        </el-row>
        <!-- 			<el-row style="margin-top: 10px;">
			<el-col :offset="1" :span="5" style="text-align: right;">创建者：</el-col>
			<el-col :offset="2" :span="16">
				<span>{{docMeta.creator}}</span>
			</el-col>
        </el-row>-->
        <el-row style="margin-top: 10px;">
          <el-col :offset="1" :span="5" style="text-align: right;color: #9DA2B3;">创建时间：</el-col>
          <el-col :offset="2" :span="16">
            <span
              v-if="groupList[groupClickedIndex]!=undefined"
            >{{groupList[groupClickedIndex].groupInfo.created_at}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px;">
          <el-col :offset="1" :span="5" style="text-align: right;color: #9DA2B3;">简介：</el-col>
          <el-col :offset="2" :span="16">
            <span
              v-if="groupList[groupClickedIndex]!=undefined"
            >{{groupList[groupClickedIndex].groupInfo.group_desc}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px;">
          <el-col :offset="1" :span="5" style="text-align: right;color: #9DA2B3;">用户列表：</el-col>
          <el-col :offset="2" :span="16">
            <el-tag
              :closable="isDeleteGroupUserScene"
              @close="deleteGroupUser(index)"
              v-for="(groupUser, index) in groupUserList"
              :key="index"
              style="margin-right: 10px;"
            >{{groupUser.username}}</el-tag>
          </el-col>
        </el-row>
      </div>
      <el-divider></el-divider>

      <!-- 添加用户 -->
      <div
        class="showDrawerHere"
        v-if="groupDrawer.addUserVisible"
        style="wight:100%;margin-top:30px;"
      >
        <div style="height=30px">
          新增用户
          <el-button
            type="warning"
            size="mini"
            @click="groupDrawer.addUserVisible = false"
            style="float:right"
            icon="el-icon-close"
            circle
          ></el-button>
        </div>
        <el-input v-model="input_no_num" placeholder="请输入工号" style="margin-top:10px;"></el-input>
        <el-button type="primary" size="mini" @click="getUserId()" style="float:right">添加</el-button>
      </div>

      <!-- 修改群组数据 -->
      <a-drawer
        title="编辑群组信息"
        width="320"
        @close="groupDrawer.groupMetaVisible = false"
        :visible="groupDrawer.groupMetaVisible"
      >
        <div v-loading="changeGroupMetaLoading" element-loading-text="请稍后">
          <el-row style="margin-top: 10px;">
            <el-col :offset="1" :span="5" style="text-align: right;color: #9DA2B3;">群组名：</el-col>
            <el-col :offset="2" :span="16">
              <el-input type="text" v-model="changeGroupMeta.group_name" size="small"></el-input>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px;">
            <el-col :offset="1" :span="5" style="text-align: right;color: #9DA2B3;">简介：</el-col>
            <el-col :offset="2" :span="16">
              <el-input
                type="textarea"
                :rows="8"
                show-word-limit
                v-model="changeGroupMeta.group_desc"
                size="small"
              ></el-input>
            </el-col>
          </el-row>
          <el-button type="primary" size="mini" @click="UpdataGroupMeta" style="float:left">确认</el-button>
        </div>
      </a-drawer>
    </a-drawer>

    <!-- 添加群组 -->
    <a-drawer
      title="添加群组给它"
      width="320"
      @close="groupDrawer.addGroupVisible = false"
      :visible="groupDrawer.addGroupVisible"
    >
      <div v-loading="addGroupLoading" element-loading-text="请稍后">
        <div>
          <span v-if="newGroupList.length==0">请先新建群组 再来添加</span>
        </div>
        <el-row
          style="height: 120px; border-top: #e8e8e8 1px solid; cursor: pointer; padding: 10px;"
          v-for="(group, index) in newGroupList"
          :key="index"
        >
          <el-col :span="14" style="height: 100px">
            <h3>{{group.groupInfo.group_name}}</h3>
            <span
              style="color:rgba(0, 0, 0, 0.45); text-overflow: ellipsis; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden;"
            >{{group.groupInfo.group_desc}}</span>
          </el-col>
          <el-col
            :offset="2"
            :span="8"
            style="height: 100px; line-height: 100px; text-align: right;"
          >
            <span>{{permissionMap[group.permission]}}</span>
          </el-col>
          <div style="margin-top: 20px">
            <el-radio-group size="mini" v-model="pmModel" @change="selectPermission(pmModel,index)">
              <el-radio-button border label="100">可读</el-radio-button>
              <el-radio-button border label="010">可写</el-radio-button>
              <el-radio-button border label="110">可读可写</el-radio-button>
            </el-radio-group>
            <el-button
              type="primary"
              size="mini"
              style="float: right;"
              @click="addPermissionGrounp(index)"
            >确认</el-button>
          </div>
        </el-row>
      </div>
    </a-drawer>

    <!-- 新建群组 -->
    <a-drawer
      title="新建群组"
      width="320"
      @close="groupDrawer.newGroupVisible = false"
      :visible="groupDrawer.newGroupVisible"
    >
      <div v-loading="newGroupLoading" element-loading-text="请稍后">
        <el-row style="margin-top: 10px;">
          <el-col :offset="1" :span="5" style="text-align: right;color: #9DA2B3;">群组名：</el-col>
          <el-col :offset="2" :span="16">
            <el-input type="text" v-model="groupMeta.group_name" size="small"></el-input>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px;">
          <el-col :offset="1" :span="5" style="text-align: right;color: #9DA2B3;">简介：</el-col>
          <el-col :offset="2" :span="16">
            <el-input
              type="textarea"
              :rows="8"
              show-word-limit
              v-model="groupMeta.group_desc"
              size="small"
            ></el-input>
          </el-col>
        </el-row>
        <el-button
          type="primary"
          style="position: relative;margin: 10px 0 0 20px;"
          @click="newGroup()"
        >确认</el-button>
      </div>
    </a-drawer>
  </a-drawer>
</template>

<script>
// 此组件未完成
// 需要后台增添接口
import { mapState } from "vuex";
import * as DEFAULT from "../json/default";
import * as Api from "../api/api";
import { Message, Loading } from "element-ui";

export default {
  name: "GroupNPermission",
  data() {
    return {
      //加载动画
      GroupLoading: true,
      newGroupLoading: false,
      addGroupLoading: false,
      groupUserLoading: true,
      changeGroupMetaLoading: false,
      // 群组信息
      groupDrawer: {
        groupUserVisible: false,
        groupMetaVisible: false,
        newGroupVisible: false,
        addGroupVisible: false,
        addUserVisible: false
      },
      groupList: DEFAULT.gl,
      isCurrentResourceOwner: 1,
      isCurrentGroupOwner: 1,
      permissionMap: DEFAULT.pm,
      isDeleteScene: false,
      groupUserList: DEFAULT.ml,
      isDeleteGroupUserScene: false,
      //修改群组信息要用
      changeGroupMeta: {
        group_name: "",
        group_desc: ""
      },
      //新建群组要用
      groupMeta: {
        group_name: "",
        group_desc: ""
      },
      groupClickedIndex: 0,
      //已经新建的群组
      newGroupList: [],
      newGroupMsg: {
        permission: "",
        groupInfo: {}
      },
      groupsIdList: [""],
      //授权的model
      pmModel: "100",
      //输入的用户工号 获取用户id
      input_no_num: "",
      UserIdFromGet: [],
      currentGroupId: "",
      //没有群组
      TaNoGrounp: true
    };
  },
  props: ["clickedItemId", "clickedItemType"],

  watch: {
    //监听 权限弹窗groupVisible 它为false 删除按钮应该消失
    groupVisible() {
      if (this.$store.state.groupVisible == false) {
        this.isDeleteScene = false;
      } else {
        this.getGroupsOfResource();
        // console.log("长度 ： ",this.newGroupList.length);
      }
    }
  },
  computed: {
    ...mapState(["groupVisible", "currentResourceId"])
  },
  methods: {
    //删除群组
    deleteGroup(index) {
      let _this = this;
      _this.GroupLoading = true;
      Api.deleteGroup(this.groupList[index].groupInfo.group_id)
        .then(res => {
          if (res.data.status === 200) {
            _this.getGroupsOfResource();
          } else {
            _this.GroupLoading = false;
            alert(res.data.msg);
          }
        })
        .catch(err => {
          _this.GroupLoading = false;
          Message.error("删除失败 " + err.response.status);
          console.log(err);
        });
    },
    //新建群组
    newGroup() {
      let _this = this;
      _this.newGroupLoading = true;
      Api.newGroup(this.groupMeta.group_name, this.groupMeta.group_desc)
        .then(res => {
          if (res.data.status === 200) {
            console.log(res.data);
            // Message.success({})
            _this.$notify({
              type: "success",
              message: "新建成功",
              duration: 1500
            });
            _this.newGroupLoading = false;
            // _this.newGroupMsg.groupInfo = res.data.data;
            // _this.newGroupList.push(_this.newGroupMsg);
            _this.newGroupList.push({
              permission: "",
              groupInfo: res.data.data
            });

            // _this.groupsIdList.push(_this.newGroupMsg.groupInfo.group_id);
            console.log(_this.newGroupList);

            _this.groupDrawer.newGroupVisible = false;
          } else {
            _this.newGroupLoading = false;
            alert(res.data.msg);
          }
        })
        .catch(err => {
          _this.newGroupLoading = false;
          _this.$message.warning("新建失败 " + err.response.status);
          console.log(err);
        });
      //清空
      this.groupMeta.group_name = "";
      this.groupMeta.group_desc = "";
    },
    //获取群组的 用户
    showGroupUser(index) {
      let _this = this;
      _this.changeGroupMeta.group_name =
        _this.groupList[index].groupInfo.group_name;
      _this.changeGroupMeta.group_desc =
        _this.groupList[index].groupInfo.group_desc;
      _this.currentGroupId = _this.groupList[index].groupInfo.group_id;
      // console.log(this.groupList[index].groupInfo.group_id);
      Api.getUserOfGroup(this.groupList[index].groupInfo.group_id)
        .then(res => {
          if (res.data.status === 200) {
            // console.log("人: ", res.data.data);
            _this.groupUserLoading = false;
            _this.groupDrawer.groupUserVisible = true;
            _this.groupClickedIndex = index;
            _this.groupUserList = res.data.data.memberList;
            _this.isCurrentGroupOwner = res.data.data.isOwner;
          } else {
            _this.groupUserLoading = false;
            alert(res.data.msg);
          }
        })
        .catch(err => {
          _this.groupUserLoading = false;
          console.log(err);
        });
    },
    deleteGroupUser(index) {
      this.groupUserList.splice(index, 1);
    },
    //获取资源的群组
    getGroupsOfResource() {
      let _this = this;
      // console.log(this.clickedItemId);
      Api.getGroupOfResourceHadPermission(
        this.clickedItemId,
        this.clickedItemType
      )
        .then(res => {
          if (res.data.status === 200) {
            // console.log(res.data.data);
            // 取消动画
            _this.GroupLoading = false;
            _this.isCurrentResourceOwner = res.data.data.isOwner;
            // 返回的群组不是空的
            if (res.data.data.groupList.length != 0) {
              // Message.success(
              //   "获取" + res.data.data.groupList.length + "个群组"
              // );
              _this.TaNoGrounp = false;

              _this.groupList = res.data.data.groupList;
              // _this.groupDrawer.groupVisible = true;
            }
            // 返回的群组是空的 改目标没有群组
            else {
              Message.warning("没有群组 请先添加");
              //他没有群组
              _this.TaNoGrounp = true;

              _this.GroupLoading = false;
              _this.groupList = DEFAULT.gl;
            }
          } else {
            _this.GroupLoading = false;
            alert(res.data.msg);
          }
        })
        .catch(err => {
          _this.GroupLoading = false;
          Message.error("获取失败 " + err);
          console.log(err);
        });
    },
    //更新群组的数据
    UpdataGroupMeta() {
      let _this = this;
      _this.changeGroupMetaLoading = true;
      Api.updateGroupMeta(
        _this.groupList[_this.groupClickedIndex].groupInfo.group_id,
        _this.changeGroupMeta.group_name,
        _this.changeGroupMeta.group_desc
      )
        .then(res => {
          if (res.data.status === 200) {
            _this.$notify({
              type: "success",
              message: "修改成功",
              duration: 1500
            });
            //刷新数据
            _this.getGroupsOfResource();
            _this.changeGroupMetaLoading = false;
            _this.groupDrawer.groupMetaVisible = false;
          } else {
            _this.changeGroupMetaLoading = false;
            _this.$notify({
              type: "error",
              message: "修改失败" + res.data.status,
              duration: 1500
            });
          }
        })
        .catch(err => {
          _this.changeGroupMetaLoading = false;
          _this.$notify({
            type: "error",
            message: "修改失败" + err,
            duration: 1500
          });
          console.log(err);
        });
    },
    //赋予选择的权限
    selectPermission(pm, index) {
      // console.log("11: ", pm, " ", index);
      // console.log(index);
      this.newGroupList[index].permission = pm;
    },
    addPermissionGrounp(index) {
      // console.log(index);
      let _this = this;
      _this.addGroupLoading = true;
      _this.groupsIdList[0] = _this.newGroupList[0].groupInfo.group_id;
      Api.addPermission(
        _this.clickedItemId,
        _this.newGroupList[0].permission,
        _this.groupsIdList,
        _this.clickedItemType
      )
        .then(res => {
          // console.log(res);
          if (res.data.status === 200) {
            _this.addGroupLoading = false;
            _this.$notify({
              message: "添加群组成功",
              type: "success",
              duration: 1500
            });
            // _this.success("添加群组成功 ");
            _this.getGroupsOfResource();
          } else {
            _this.addGroupLoading = false;
            alert(res.data.msg);
          }
        })
        .catch(err => {
          _this.addGroupLoading = false;
          _this.$notify({
            message: "添加群组失败" + err.response.status,
            type: "warning",
            duration: 1500
          });
          console.log(err);
        });
    },
    //获取用户id
    getUserId() {
      let _this = this;
      // console.log(_this.input_no_num);
      Api.getUserId(_this.input_no_num)
        .then(res => {
          if (res.data.status === 200) {
            _this.UserIdFromGet.push(res.data.data.user_id);
            // console.log(_this.UserIdFromGet);

            _this.addUserToGrounp();
          } else {
            alert(res);
          }
        })
        .catch(err => {
          Message.warning("无法获取用户id： " + err);
          console.log(err);
        });
    },
    //有了用户id 就能调用 接口G5 添加群组用户
    addUserToGrounp() {
      let _this = this;
      Api.addUserToGroup(_this.currentGroupId, _this.UserIdFromGet)
        .then(res => {
          if (res.data.status === 200) {
            Message.success("成功添加用户");
          } else {
            alert(res);
          }
        })
        .catch(err => {
          Message.warning("无法添加： " + err);
          console.log(err);
        });
    },

    close() {
      this.$store.commit({
        type: "groupH"
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
