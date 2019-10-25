<template>
  <div id="app">
		<keep-alive>
			<router-view v-if="$route.meta.keepAlive">
			<!-- 这里是会被缓存的视图组件 -->
			</router-view>
		</keep-alive>
		<!-- 这里是不被缓存的视图组件 -->
		<router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  	name: "App",
	provide(){
		return{
			reload:this.reload
		}
	},
	data(){
		return{
			isRouterAlive:true
		}
	},
	created() {
		this.getUserInfo()
		
	},
	
	methods: {
		reload(){
			this.isRouterAlive=false;
			this.$nextTick(function(){
				this.isRouterAlive=true;
			})
		},
		/**
		 * 得到用户信息
		 */
		getUserInfo() {
			this.$resetAjax({
				type: 'POST',
				url: '/NewA/Public/get_u',
				success: (res) => {
					this.$root.qxlist = JSON.parse(res).qxlist || [];
					// console.log(this.$root.qxlist);
					this.$root.userData = {
						name: JSON.parse(res).username,
						iconUrl: JSON.parse(res).icon,
						userid:JSON.parse(res).userid
					}
					this.user();
				}
			})
		},
		user(){
            var websocket = new WebSocket('wss://sw.xmvogue.com');
            var content='{"user_id":"' + this.$root.userData.userid + '","user_name":"' + this.$root.userData.name + '"}';
            websocket.onopen = function (evt) {
                websocket.send(JSON.stringify({
                    class:'Newoa',
                    action:'connect',
                    content:content
                }));
			};
			setInterval(function () {
				websocket.send(JSON.stringify({
                    class:'Newoa',
                    action:'keep',
                    content:""
                }));
			}, 50000); 
			
		},
		
	}
}
</script>

<style>
	#app {
	font-family: "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	}
	.ivu-notice{
		margin-left: 50%;
		left: -175px;
		z-index: 110000 !important;
	}
	.ivu-message{
		top:50% !important;
		font-size: 16px !important;
	}
	.ivu-carousel-dots-inside {
		bottom: -10px !important;
	}
	
</style>
