<template>
	<c-app :curentSystem="$vuetify.t('$vuetify.texts.main.links.mainPage.name')" :panelLeft="{show:true}">
		<v-layout align-center justify-center >
			<v-flex xs12 ma-2>
				<v-card class="elevation-12" >
					<v-toolbar :height="80" >
						<v-bottom-nav  :active.sync="tabSelected" :color="colorForm" :value="true" absolute shift :height="80" >
							<v-btn  large v-for="link in links" :key="link.id" class='primary-color'  >	<span>{{$vuetify.t(link.title )}}</span>			<v-icon large >{{link.icon}}</v-icon>		</v-btn>
						</v-bottom-nav>
					</v-toolbar>
				</v-card>
				<v-card class="elevation-12 ">
					<v-card-text >
						<c-loading v-if="dataLoading" />
						<v-form v-else v-model="inputsValid" :ref="paramForm"  > 
							<c-input-cols v-if="['aboutMe'].indexOf(paramForm)!=-1" :inputs="inputs" :dialogId="dialogId"  :paramsForm="paramForm" :maxInputCountInCol="getMaxColumn"  />
							<div  v-if="['myPrj'].indexOf(paramForm)!=-1">
								<v-layout row v-for="(prj,idx) in prj.data" :key="prj.id"  >
									<v-container :class="getClassForRow">
										<c-input-cols :inputs="getInputsForPrj(prj)" :dialogId="dialogId"  :paramsForm="paramForm+prj.id" :maxInputCountInCol="1"  />
									</v-container>
									<v-container :class="getClassForRow+ ($vuetify.breakpoint.name=='xs'?' no-height':'')" style="flex: 0;">
										<v-btn fab dark small class='primary' @click="delPrj(idx)">
											<v-icon dark>clear</v-icon>
										</v-btn>
									</v-container>
								</v-layout>
								<v-layout row  >
									<v-container :class="getClassForRow">
										<c-input-cols :inputs="getInputsForPrj({})" :dialogId="dialogId"  :paramsForm="paramForm" :maxInputCountInCol="1"  />
									</v-container>
									<v-container :class="getClassForRow+ ($vuetify.breakpoint.name=='xs'?' no-height':'')" style="flex: 0;">
										<v-btn fab dark small class='accent' @click="addPrj()">
											<v-icon dark>add</v-icon>
										</v-btn>
									</v-container>
								</v-layout>
							</div>
						</v-form>						
					</v-card-text>
				</v-card>
				<v-toolbar slot='header' dense  >		
					<v-spacer/>
					<v-btn class='accent' @click="formSave"  :loading="sendingData"><v-icon>done</v-icon>&nbsp;{{$vuetify.t('$vuetify.texts.simple.actions.save')}}</v-btn>
				</v-toolbar>
			</v-flex>
		</v-layout>
	</c-app>
</template>

<script>
	import XApp from '../mixins/x-app'
	import XStore from '../mixins/x-store'
	import CInputCols from '../components/c-input-cols'
	import CLoading from '../components/c-loading'
	export default {
		data: () => ({
			tabSelected: 0,
			prjCnt:1000,
			inputsValid:false,
			sendingData:false,
			dialogId:getNewId(),
			colors:['white', 'white',],
			forms:['aboutMe', 'myPrj',],
			maxColumn:[3, 1,],
			saveFormTypes:['user.info.save', 'user.prj.save', ],
			user:{href:"/socet_command", event:"user.info.by.id", data:{}, loaded:false},
			prj:{href:"/socet_command", event:"prj.info.by.user", data:[], loaded:false},
		}),
		computed: {
			links(){
				let vm=this,
					tmp = [{id:1, title:'$vuetify.texts.userPage.links.aboutMe', 		icon:'info', 			}]
				if(vm.user.data.role=='Разработчик' )
					tmp.push( {id:2, title:'$vuetify.texts.userPage.links.myPrj', 		icon:'language', 		})
				return tmp
			},
			dataLoading(){return !(this.user.loaded && this.prj.loaded)},
			colorForm () {return this.colors[this.tabSelected]},
			paramForm () {return this.dataLoading?'':this.forms[this.tabSelected]},
			saveFormType () {return this.saveFormTypes[this.tabSelected]},
			getMaxColumn(){return  ['xs','sm'].indexOf(this.$vuetify.breakpoint.name)!=-1 ?100: this.maxColumn[this.tabSelected]},
			getClassForRow(){return   ['xs','sm'].indexOf(this.$vuetify.breakpoint.name)!=-1 ? 'no-padding': 'fix-padding'},
			inputs() {
				let vm=this
				let data= [	
					{id:1, form:'aboutMe', 		code:'firstName', 		name:'Имя', 						value:nvl(vm.user.data.firstName,null),														type:'INPUT', 		nullable:0, column_size:30, sort_seq:1, mask_fin:'^[A-Za-zА-Яа-я]+$', error:'$vuetify.texts.errors.onlyLetters.text' },
					{id:2, form:'aboutMe', 		code:'lastName', 		name:'Фамилия', 					value:nvl(vm.user.data.lastName,null),														type:'INPUT', 		nullable:0, column_size:30, sort_seq:2, mask_fin:'^[A-Za-zА-Яа-я]+$', error:'$vuetify.texts.errors.onlyLetters.text' },
					{id:3, form:'aboutMe', 		code:'role', 			name:'Роль',	 					value_arr:nvl(vm.user.data.role,null)==null?null:[vm.user.data.role],						type:'LIST', 		nullable:0, column_size:30, sort_seq:3, table_values:[{value:'Разработчик'},{value:'Аналитик'},{value:'Инвестр (директор)'},{value:'Эксперт'},] },
				]
				return data.filter(row =>  row.form == vm.paramForm ).sort( (a, b) =>{return sort(a, b, 'sort_seq', 'sort_seq')})
			},
		},
		components: {
			CInputCols,CLoading,
		},
		mixins: [
			XApp,XStore
		],
		methods: {
			formSave(){
				let vm=this,tmp=[],tmp1={},todo={}
				if (!vm.$refs[vm.paramForm].validate())
					return;
				if(['aboutMe'].indexOf(vm.paramForm)!=-1)
					todo=vm.paramTodo(vm.paramForm)
				else
					todo=vm.prj.data.map((row)=>{
						return vm.paramTodo(vm.paramForm+row.id)
					})
				if(vm.paramForm=='aboutMe'){
					todo={...todo, ...vm.paramTodo(vm.paramForm+'Bio')}
					vm.user.data.firstName = todo.firstName.value
					vm.user.data.lastName = todo.lastName.value
					vm.user.data.role = todo.role.value
				}
				vm.sendingData=true
				sendRequest({href:"/data_command", type:vm.saveFormType, data:{ todo, }, default: getErrDesc('requestFaild'), mustHandler:() => {vm.sendingData=false},handler:()=>{showMsg({...getMsgDesc('saveDoing')}); top.location.reload(); },  })
			},
			getData(){
				let vm=this
				vm.getUserInfo() 
				vm.getPrjInfo() 
			},
			getUserInfo(){
				let vm=this
				sendRequest({href:vm.user.href, type:vm.user.event, data:{userId: vm.profileUserId()}, handler:(response) => {
					vm.user = Object.assign({}, vm.user, {data:response.data})
					vm.user.loaded=true
				}})
			},
			getPrjInfo(){
				let vm=this
				sendRequest({href:vm.prj.href, type:vm.prj.event, data:{userId: vm.profileUserId()}, handler:(response) => {
					vm.prj.data= response.data
					vm.prj.loaded=true
					vm.prj.data.forEach((row)=>{
						vm.paramInit( {num: 'myPrj'+row.id })
					})
				}})
			},
			getInputsForPrj(prj){
				let vm=this
				return [	
					{id:1, code:'id', 			name:'id', 					value:nvl(prj.id,''),				type:'HIDDEN', 			nullable:nvl(prj.id)==0, 	editable:nvl(prj.id)!=0, column_size:30, 	sort_seq:1, 	},
					{id:1, code:'name', 		name:'Проект', 				value:nvl(prj.name,''),				type:'INPUT', 			nullable:nvl(prj.id)==0, 	editable:nvl(prj.id)!=0, column_size:30, 	sort_seq:1, 	},
					{id:2, code:'link', 		name:'Ссылка', 				value:nvl(prj.link,''),				type:'INPUT', 			nullable:true, 				editable:nvl(prj.id)!=0, column_size:256, 	sort_seq:2,  	},
					{id:2, code:'description', 	name:'Описание', 			value:nvl(prj.description,''),		type:'TEXT', 			nullable:nvl(prj.id)==0, 	editable:nvl(prj.id)!=0, column_size:256, 	sort_seq:3, 	}
				]
			},
			addPrj(){
				let vm=this
				vm.prj.data.push({id:vm.prjCnt*-1, name:null, link:null, code:null})
				vm.paramInit( {num: vm.paramForm+(vm.prjCnt*-1) })
				vm.prjCnt++
			},
			delPrj(idx){
				let vm=this, tmp = 0 
				vm.prj.data.splice(idx,1)
			},
		},
		created: function (){
			let vm=this
			vm.forms.forEach((row,idx)=>{
				vm.paramInit( {num: row })
				if (idx <2)
					vm.$root.$on('dialog'+row+'Send', ()=>{
						vm.formSave()
					});
			})
			setTimeout(vm.getData,100);//что бы параметры успели подгрузится в store		
		},
		mounted(){
			let vm=this
        	vm.isMounted = true;
    	},
	}
</script>
<style>
.fix-padding,
.fix-padding>div {padding: 0px 34px 0px 34px;}
.no-height {width:50px;}
.no-padding,
.no-padding>div {padding: 0px;}
</style>