export const gl = [{
	// "permission": "100",
	// "groupInfo": {
	// 	"group_id": "75895fa6-9054-49cf-8db2-08312f1766d8",
	// 	"group_name": "巴萨球迷",
	// 	"group_desc": "巴萨是最菜的",
	// 	"creator_id": "e1f5f562-2e96-4b3e-a6ff-e3f953c5b368",
	// 	"created_at": "2019-07-09T17:05:39.321+0000",
	// 	"personal": 0
	// }
	"permission": "",
	"groupInfo": {
		"group_id": "",
		"group_name": "",
		"group_desc": "",
		"creator_id": "",
		"created_at": "",
		"personal": 0
	}
}]
export const pm = {
	'100': "可读",
	'010': "可写",
	'110': "可读可写"
}
export const ml = [{
	"user_id": "e1f5f562-2e96-4b3e-a6ff-e3f953c5b368",
	"work_no": "0001",
	"username": "张三"
}]

export const docs = [{
	"id": "573d9b62-9e07-430c-b2a0-4825fbccc785", // 资源id
	"title": "返回", // 资源名称
	"thumbnail_url": require("../assets/back.png"), //缩略图
	"resource_type": "doc", // 资源类型
	"creator": "", // 创建者id
	"created_time": "" // 创建时间
}];

export const dirMetaI = {
	"title": "",
	"created_time": ""
}

export const defaultResource = {
	"id": null,
	"title": "",
	"thumbnail_url": require("../assets/back.png"),
	"type": "dir",
	"creator": "",
	"created_time": ""
}

export const fm = {
	"id": "image_10432347",
	"title": "默认",
	"desc": "#######################",
	"creator": "green",
	"doc_id": "1",
	"type": "image",
	"ext": "jpg",
	"size": 1024,
	"categories": [
		0,
		1,
		6
	],
	"tags": [
		6,
		133,
		137,
		2552,
		2697,
		2998,
		22409,
		24310
	],
	"store_key": "http://douban-test.oss-cn-beijing.aliyuncs.com/img/10432347.jpeg",
	"thumbnail_url": "http://douban-test.oss-cn-beijing.aliyuncs.com/img/10432347.jpeg",
	"derived_files": [],
	"created_time": "2017-07-01 21:34:16",
	"modified_time": "2017-07-06 21:34:16",
	"version": 0,
	"original_id": "10432347",
	"parent_id": null
}

export const tg = [{
	"id": 137,
	"title": "算法",
	"desc": "......"
}]

export const extOptions = [{
		"key": "jpg",
		"doc_count": 50
	},
	{
		"key": "png",
		"doc_count": 30
	},
	{
		"key": "gif",
		"doc_count": 20
	}
];
export const timeOptions = [{
		"key": "全部",
		"doc_count": 100
	},
	{
		"key": "三天内",
		"doc_count": 6
	},
	{
		"key": "一周内",
		"doc_count": 15
	},
	{
		"key": "一个月内",
		"doc_count": 23
	},
	{
		"key": "三个月内",
		"doc_count": 25
	},
	{
		"key": "半年内",
		"doc_count": 27
	},
	{
		"key": "一年内",
		"doc_count": 50
	},
	{
		"key": "一年前",
		"doc_count": 50
	}
];
export const typeOptions = [{
	value: '全部',
	command: 'all'
}, {
	value: '图片',
	command: 'image'
}, {
	value: '文档',
	command: 'doc'
}, {
	value: '视频',
	command: 'video'
}, {
	value: '音频',
	command: 'audio'
}, {
	value: '其他文件',
	command: 'others'
}, {
	value: '全文搜索',
	command: 'doc_content'
}];
export const cate = [{
		"id": 6,
		"title": "科技"
	},
	{
		"id": 1,
		"title": "文学"
	},
	{
		"id": 2,
		"title": "流行"
	},
	{
		"id": 3,
		"title": "文化"
	},
	{
		"id": 4,
		"title": "生活"
	},
	{
		"id": 5,
		"title": "经管"
	}
];

export const defaultNetwordError = "好像网络有点问题呢";
