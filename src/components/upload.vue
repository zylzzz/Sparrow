<template>
	<a-drawer title="上传文件" width="400" :closable="false" @close="close" :visible="uploadVisiable">
		<el-upload style="text-align: center;" drag multiple action="" :http-request="uploadProcess">
			<i class="el-icon-upload"></i>
			<div>
				将文件拖到此处，或
				<span class="em">点击上传</span>
			</div>
		</el-upload>
	</a-drawer>
</template>

<script>
	import {
		mapState
	} from "vuex";
	import * as Api from "../api/api";
	import * as DEFAULT from "../json/default";
	import {
		Message
	} from "element-ui";


	export default {
		name: "Upload",
		computed: {
			...mapState(["uploadVisiable"])
		},
		props: ["currentResourceId"],
		data() {
			return {
				// 上传
			};
		},
		methods: {
			beforeUpload(params, uploadData) {
				let _this = this;
				uploadData.fileExtension = params.file.name.split(".")[
					params.file.name.split(".").length - 1
				];

				// 从服务器获取一个URL
				this.policy(params, uploadData);
			},
			// 从服务器获取一个URL
			policy(params, uploadData) {
				let _this = this;

				var data = JSON.stringify({
					ext: uploadData.fileExtension,
					cur_id: this.currentResourceId
				});
				$.ajax({
					type: "post",
					url: Api.baseUrl + "/files/url",
					data: data,
					async: false,
					contentType: "application/json",
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					success: function(datas) {
						uploadData.url = datas.data.url;
						uploadData.currentUserId = datas.data.creator;

						let strings = uploadData.url.split("/");
						uploadData.objectName = "";
						for (var i = 4; i < strings.length - 1; i++) {
							uploadData.objectName += strings[i] + "/";
						}
						uploadData.file_id = strings[strings.length - 1].split("?")[0];
						// 存储在oss里的key
						uploadData.objectName += uploadData.file_id;

						// 上传文件
						_this.uploadFile(params, uploadData);
					},
					// error: _this.handleError() 有点忘了是不是这个函数。。
				});
			},
			uploadProcess(params) {
				// 通用变量 初始化
				let uploadData = {
					url: "",
					objectName: "",
					file_id: "",
					fileExtension: "",
					currentUserId: "",
				}

				this.beforeUpload(params, uploadData);
			},
			//覆盖默认的上传行为，可以自定义上传的实现
			uploadFile(params, uploadData) {
				// 临时变量
				let _this = this;
				let file = params.file;
				let xhr = new XMLHttpRequest();

				// 监听上传进度 中间函数计算已经上传的进度 大小/总量
				//
				xhr.upload.addEventListener(
					"progress",
					function(evt) {
						var percentComplete = Math.round((evt.loaded * 100) / evt.total);
						if (percentComplete > 50) {
							percentComplete -= 2;
						}
						params.onProgress({
							//减少1 永不显示100% 避免后端响应太慢产生100%误会 
							percent: percentComplete
						});
					},
					false
				);
				xhr.open("PUT", uploadData.url, true);
				xhr.send(file);
				xhr.onload = () => {
					if (xhr.status == 200) {
						// console.log("uploadFile ",xhr.status);
						// 调用afterUpload
						params.onSuccess("上传成功");

						// 上传成功
						_this.afterUpload(params, uploadData);
					} else {
						_this.handleError();
					}
				};
			},
			afterUpload(params, uploadData) {
				let _this = this;
				let file = params.file;
				// 上传成功后更新meta
				let data = JSON.stringify({
					title: file.name.substring(0, file.name.lastIndexOf(".")),
					store_key: uploadData.objectName,
					doc_id: this.currentResourceId,
					parentId: "",
					ext: uploadData.fileExtension,
					creator: uploadData.currentUserId,
					size: Math.floor(file.size.toFixed(1))
				});

				$.ajax({
					type: "post",
					url: Api.baseUrl +
						"/files/" +
						uploadData.file_id.substring(0, uploadData.file_id.lastIndexOf(".")),
					data: data,
					contentType: "application/json",
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					//关闭上传组件显示
					success: function(datas) {
						_this.$parent.itemDBClicked(-1);
						setTimeout(function() {
							_this.close();
						}, 500);
					},
					// error: _this.handleError() 有点忘了是不是这个函数。。
				});
			},
			close() {
				this.$store.commit({
					type: "uploadH"
				});
			},
			handleError(err) {
				console.log(err);
				Message.warning(DEFAULT.defaultNetwordError);
			},
		}
	};
</script>

<style>
	.em {
		color: #409eff;
		font-style: normal;
	}
</style>
