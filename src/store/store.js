import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		// 登陆获得的初始信息,仅存储
		userInformation: null,
		pathBackup: [],
		currentResourceBackup: null,

		// 各种抽屉的visible变量
		groupVisible: false,
		docMetaVisible: false,
		dirMetaVisible: false,
		fileMetaVisible: false,
		changeNameVisible: false,
		uploadVisiable: false,

		//这个值用于 从其他页面返回后 还能到达跳转前的界面
		idOfThePathJust: null,
		typeOfThePathJust: null,

		//这个值用于 从其他页面返回后 还能到是自己选的图标card大小
		whatSizeCard: "",

		//这个值用于 从其他页面返回后 还能到是自己选的列表或图标
		ListOrNot: true,

		//自定义右键菜单
		menu: {
			Show: false,
			Left: 0,
			Top: 0
		}
	},
	mutations: {
		setmenu(state, newMenu) {
			// console.log("vuex: ", newMenu)
			state.menu.Show = newMenu.Show;
			state.menu.Left = newMenu.Left;
			state.menu.Top = newMenu.Top;
		},
		setUserInforFromAppVue(state, infor) {
			state.userInformation = infor

		},
		setwhatSizeCard(state, size) {
			state.whatSizeCard = size;
		},
		setIdOfThePathJust(state, id) {
			state.idOfThePathJust = id;
		},
		setTypeOfThePathJust(state, type) {
			state.typeOfThePathJust = type;
		},

		setPathBackup(state, payload) {
			state.pathBackup = payload.pathBackup;
		},
		setCurrentResourceBackup(state, payload) {
			state.currentResourceBackup = payload.currentResourceBackup;
		},

		setListOrNot(state, yesno) {
			state.ListOrNot = yesno;
		},
		// visible
		groupV(state) {
			state.groupVisible = true;
		},
		// hidden
		groupH(state) {
			state.groupVisible = false;
		},

		docMetaV(state) {
			state.docMetaVisible = true;
		},
		docMetaH(state) {
			state.docMetaVisible = false;
		},

		dirMetaV(state) {
			state.dirMetaVisible = true;
		},
		dirMetaH(state) {
			state.dirMetaVisible = false;
		},

		fileMetaV(state) {
			state.fileMetaVisible = true;
		},
		fileMetaH(state) {
			state.fileMetaVisible = false;
		},

		changeNameV(state) {
			state.changeNameVisible = true;
		},
		changeNameH(state) {
			state.changeNameVisible = false;
		},

		uploadV(state) {
			state.uploadVisiable = true;
		},
		uploadH(state) {
			state.uploadVisiable = false;
		},
	}
});
