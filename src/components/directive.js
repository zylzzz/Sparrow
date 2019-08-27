//这里自定义v命令 v-noRight v-menus
//vnode: https://www.jianshu.com/p/3caf7c317cbf
let mydirective = {}
mydirective.install = function (Vue) {

	Vue.directive('noRight', {
		inserted: function (el, binding, vnode) {
			//阻止默认浏览器的右键菜单
			el.oncontextmenu = ((event) => {
				event.preventDefault();
			});
		}
	}),

	Vue.directive('menus', {
			inserted: function (el, binding, vnode) {
				//获取vue实例对象
				let vm = vnode.context;
				let showFlag = true;
				vnode = vnode.elm;
				//阻止默认浏览器的右键菜单
				el.oncontextmenu = ((event) => {
					event.preventDefault();
				});

				el.onmouseup = ((event) => {
					//2:右键
					if (event.button === 2) {
						vm.menuShow = true;
						showFlag = false;
						// let realTop = vm.getElementToPageTop(vnode);
						// let realLeft = vm.getElementToPageLeft(vnode);
						let top = event.pageY + 5;
						// let left = event.pageX + 5 + 'px';
						let left = event.pageX - 190 ;

						vm.menuLeft = left;
						vm.menuTop = top;
						// console.log("JS: ", left, top)
					}
				
				});
				document.onmouseup = (() => {
					if (showFlag) {
						vm.menuShow = false;
					}
					showFlag = true;
				});
			}
		}),
		Vue.directive('clickMenus', {
			inserted: function (el, binding, vnode) {
				//获取vue实例对象
				let vm = vnode.context;
				vnode = vnode.elm;
				el.onmouseup = ((event) => {
						vm.menuShow = true;
						let top = event.pageY + 5;
						let left = event.pageX - 190 ;

						vm.menuLeft = left;
						vm.menuTop = top;
						// console.log("JS: ", left, top)
				
				});
			}
		})

}
export default mydirective;
