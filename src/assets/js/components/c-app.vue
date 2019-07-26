<template>
    <v-app light >
		<c-head ref="head" :curentSystem='curentSystem' :showLeft="panelLeftDrawer" :showRight="panelRightDrawer" :needLabel="needLabel" v-if="needHeader"/>
		<v-navigation-drawer dark v-if="panelLeftDrawer" fixed app v-model="panelLeftShowen" left   :class="panelLeft.class" :width="panelLeftWidth">
			<slot name="panelLeft">
				<v-list dense>
					<v-list-tile avatar >
						<v-list-tile-avatar>
							<img :src="currentAvatar">
						</v-list-tile-avatar>
						<v-list-tile-content>
							<v-list-tile-title>{{profileUserName()==''?$vuetify.t('$vuetify.texts.simple.labels.guest'):profileUserName()}}</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
					<v-list-tile class="pt-2" v-for="item in authItems" :key="item.title" :title="$vuetify.t(item.link+'.title')"  :href="item.href" >
						<v-list-tile-action>
							<v-icon large>{{ item.icon }}</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title>{{$vuetify.t(item.link+'.name') }}</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
					<v-list-tile class="pt-2" @click="authChange" >
						<v-list-tile-action>
							<v-icon large>{{ authAva }}</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title>{{profileUserName()==''?$vuetify.t('$vuetify.texts.simple.actions.auth'):$vuetify.t('$vuetify.texts.simple.actions.authEnd')}}</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
				</v-list>
				<v-divider style='padding-bottom: 10px;'/>
				<v-list dense>
					<v-divider/>
					<v-list-tile class="pt-2" v-for="item in items" :key="item.title" :title="$vuetify.t(item.link+'.title')"  :href="item.href" >
						<v-list-tile-action>
							<v-icon large>{{ item.icon }}</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title>{{$vuetify.t(item.link+'.name') }}</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
				</v-list>
			</slot>
		</v-navigation-drawer>
		<v-navigation-drawer dark v-if="panelRightDrawer" fixed app v-model="panelRightShowen" right   :class="panelRight.class" :width="panelRightWidth">
			<slot name="panelRight"/>
		</v-navigation-drawer>
		<v-content ref='content' :style="getContentStyles" >
			<div ref='scrollArea'/>
			<slot v-if="!mainLayoutConfig" />
			<c-layouts v-else :name="layoutName" :size="$vuetify.breakpoint">
				<div  v-for="(slotName, index) in slotNames" :key="index"   :slot="slotName" >
					<slot :name="slotName" />
				</div>
			</c-layouts>
		</v-content>
		<c-footer v-if="needFooter"/>
		<c-msg-list />
		<slot name="dialogs" />
		<component v-bind:is="dialogModule" v-if="dialogIsShowen(dialogIdOpened)" :dialogId="dialogIdOpened"/>
    </v-app>
</template>

<script>	
	import XStore from '../mixins/x-store'
	import XDialog from '../mixins/x-dialog'
    import CHead from '../components/c-head'
	import CFooter from '../components/c-footer'
	import CMsgList from '../components/c-msg-list'
    export default {
		name:'c-app',
		data:() => ({
			dialogsConfig: {
				auth:{id: getNewId(),  module:'m-input-fields',  name:"auth-login", title:"$vuetify.texts.modals.auth.title", 	params:{ socetHref:"/login", socetEvent:"auth.login"}, }
			},
			panelLeftShowen: false,
			panelRightShowen: false,
			needLabel: true,
            items: [
                { link: '$vuetify.texts.main.links.headPage', 			icon: 'stars', 				href:'\\' },
            ], 
		}),
		props:{
			curentSystem: {type:  String, default: ''},	
			layoutName : {type:  String, default: 'main'},	
			needFooter: {type:  Boolean, default: true},	
			needHeader: {type:  Boolean, default: true},	
			needBgIm: {type:  Boolean, default: true},	
			panelLeft:{type: Object,  default: () => {return{ drawer:true, show:false, class:'', width:270, filter:false,} }}	,
			panelRight:{type: Object,  default: () => {return{ drawer:false, show:false, class:'', width:300, filter:false,} }}	,
		},
		computed:{
			mainLayoutConfig(){
				return this.layoutByName(this.layoutName)
			},
			slotNames(){
				let vm=this
				if(vm.mainLayoutConfig==null)
					return[]
				return Object.keys(vm.layoutDescByHead(this.layoutName))
			},
			currentAvatar(){
				let vm=this
				return nvl(vm.profileAvatar(),"https://randomuser.me/api/portraits/men/85.jpg")
			},
			getContentStyles(){
				let vm=this//финт ушами, что бы основная область не прокручивалась
				return {
					height: vm.oneScreen?'100px':null, 
					background:vm.needBgIm?"url('storage/bg.jpg')":null , 
					backgroundAttachment: 'fixed',
				}
			},
			panelLeftDrawer(){ return this.panelLeft.drawer || this.panelLeft.show || this.panelLeft.filter	},
			panelRightDrawer(){ return this.panelRight.drawer || this.panelRight.show || this.panelLeft.filter	},
			panelLeftWidth(){ return this.panelLeft.filter? 358 : nvl(this.panelLeft.width,270)  },
			panelRightWidth(){ return this.panelRight.filter? 358 : nvl(this.panelRight.width,300)  },
			mainPanelReq(){ return this.mainLayoutConfig!=null},
			authAva () {return this.profileUserName()==''?'account_circle':'launch'},
			authItems(){
					return this.profileUserName()==''?null: [
					{ link: '$vuetify.texts.main.links.mainPage', 			icon: 'home', 					href:'\\user' },
					{ link: '$vuetify.texts.main.links.prodList', 			icon: 'library_books', 			href:'\\prodList'  },
				]
			},
		},
        components: {
			CHead, CFooter,CMsgList, 
			MInputFields: (resolve) => require(['../modules/m-input-fields.vue'], resolve),
			CLayouts: (resolve) => require(['./c-layouts.vue'], resolve),
		},
		mixins: [
			XStore,XDialog,
		],
		methods: {
			authChange(){
				let vm=this
				if (vm.profileUserName()=='')
					vm.$root.$emit('systemLogin')
				else
					vm.$root.$emit('systemLogout')
			},
		},
		created: function (){
			let vm=this
			vm.panelLeftShowen= ['xs','sm'].indexOf(vm.$vuetify.breakpoint.name)!=-1? false: nvl(vm.panelLeft.show,false)
			vm.panelRightShowen=['xs','sm'].indexOf(vm.$vuetify.breakpoint.name)!=-1? false: nvl(vm.panelRight.show,false)
			vm.$root.$on('headDrawerLeftClick', (obj)=>{
				vm.panelLeftShowen=!vm.panelLeftShowen
			}); 
			vm.$root.$on('headDrawerRightClick', (obj)=>{
				vm.panelRightShowen=!vm.panelRightShowen
			});
			vm.$root.$on('openAuthDialog', (obj)=>{
				vm.dialogSelect(vm.dialogsConfig.auth.id)
				vm.dialogShowChange({name:"auth-login", isShow:true})
			});				
		},
		mounted() {
			let vm=this
			vm.observer =  new IntersectionObserver(entries=>vm.needLabel= entries[0].intersectionRatio > 0);
			vm.observer.observe(vm.$refs.scrollArea);
		},
    }
</script>

<style lang="scss">
</style>