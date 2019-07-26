<template>
	<c-app  :needBgIm="false" :needFooter="false" :panelLeft="{drawer:false}" :needHeader="false">
		<div slot='second' class='overflow-hidden'>
			<v-card class='elevation-5'>
				<v-card-title ref="title" class='noPadding'>
					<h3 class="headline ml-2">{{$t("mainTabTitle")}}</h3> 
					<v-spacer/>
					<v-btn  class="mr-2"   color="accent"      @click="layoutsChange"  >    {{$t('texts.simple.labels.filter')}}     <v-icon dark right>filter_list</v-icon>   </v-btn>			
				</v-card-title>
				<div class='headMainTable' ref="headMainTable" id='headMainTable' :style="{ position: 'relative', left:-scrollLeft+'px' }">
					<div v-for="(header,i) in tabMainHeader" :key="header.code" :style="{width:i==0?cardShopWidth:cardDayWidth}">
						{{header.text}}
					</div>
				</div>
			</v-card>
			<v-card v-if="versInfo.days==undefined || shopCur.lenght==0" :style="{ marginTop:'10px', overflow: 'auto',}" class="text-xs-center" >
				<c-loading v-if="dataLoading" />
				{{$t(noDataMainText) }}
			</v-card>
			<div v-else :style="{ height:(layoutSizes['second'].height-68-5-10)+'px', width:(layoutSizes['second'].width-5)+'px',  marginTop:'10px', overflow: 'auto',     position: 'relative'}" id="scroll-target" >
				<div :style="{position: 'absolute', left:scrollLeft+'px', zIndex: 2}" id='scrolled' >
					<template v-for="shop in shopCur">
						<div :key="shop">
							<div  :class="{tabHead:true, primary:true, tabHeadShad:true}" :style="{ height:cardShopHeight, position: 'sticky',  top: 0, width:(layoutSizes['second'].width-15)+'px'}"  >
								<v-btn flat icon  dark @click="tabMainShopClick(shop)" :style="shopRuleBStyle[shop]"><v-icon>keyboard_arrow_down</v-icon> </v-btn>
								<b>{{shop}}</b>
							</div>	
							<template v-if="shopDetailsShowComp[shop]">
								<div  v-for="val in divValues[shop]"	:key="val.agr_code" :style="{width:cardShopWidth, height:shopDetailsShow[shop]?cardHeight:'0px' }" class='animateDropdown' >
									{{val.agr_name}}
								</div>		
							</template>				
						</div>
					</template>
				</div>
				<div v-for="(shop,i) in shopCur" :key="shop" v-scroll:#scroll-target="onScroll">
					<div  :class="{tabHead:true, primary:true}" :style="{ height:cardShopHeight}"/>
					<div v-for="val in divValues[shop]"	:key="val.agr_code" :style="{width:(mainMaxWidth+layoutSizes['second'].width-18)+'px', height:shopDetailsShow[shop]?cardHeight:'0px', left:cardShopWidth,}"  class='divDays animateDropdown' >
						<template v-if="shopDetailsShowComp[shop]">
							<div  v-for="(item, j) in daysMax"  :key="j" :style="{width:cardDayWidth, height:cardHeight}" class='divDay'>
								{{i}}
							</div>
						</template>	
					</div>
				</div>
			</div>
		</div>
	</c-app>
</template>

<script>
	import XApp from '../../../assets/js/mixins/x-app'
	import CTable from '../../../assets/js/components/c-table'
	import CLoading from '../../../assets/js/components/c-loading'
	import CDayCard from './c-day-card'
	export default {
		data: () => ({
			layoutsConfigs: [{ //'horizontal' - внутри будут строки,  'vertical' - внутри будут столбики; главный слой во vuex- main
				name: 'first',   width:'100%',	height:'100%',  layout: 'horizontal', resizable:true , data:[
					{  name: 'second',   width:'100%',	height:'100%',  layout: 'horizontal'},
				]},{ //'horizontal' - внутри будут строки,  'vertical' - внутри будут столбики; главный слой во vuex- main
				name: 'first',   width:'100%',	height:'100%',  layout: 'horizontal', resizable:true , data:[
					{  name: 'second',   width:'100%',	height:'75%',  layout: 'horizontal'},
					{  name: 'third',   width:'100%',	height:'25%',  layout: 'vertical', data:[
						{  name: 'fourth',   width:'50%',	height:'100%',  layout: 'horizontal'},
						{  name: 'fifth',   width:'50%',	height:'100%',  layout: 'horizontal'},
					]},
				]},
			],
			dataLoading:false,
			dataMainLoaded:false,
			cardShopHeight:'52px',
			cardHeight:'100px',
			cardShopWidth:'87px',
			cardDayWidth:'242px',
			scrollLeft:0,
			shopCur:['ЦГП','ЦХП','ЦТЛ','ЦТО'],
			shopDetailsShow:{},
			shopDetailsShowComp:{},
			dayInfo:[],//информация по каждомя дню агрегата			
			versInfo:{},
			opers:[],
			dicPlanOper:[],
			dicAgr:[],
		}),
		computed: {
			daysMax(){return nvl(this.versInfo.days)!=0?this.versInfo.days:10	},
			days(){return Array.apply(null, {length: this.daysMax}).map((item, i) => i); },
			daysFirst(){  let d =new Date(); d.setTime(Date.parse(nvl(this.versInfo.date_from)!=0?this.versInfo.date_from:'2019-01-01 00:00:00') ); return d},//секунды
			debug(){return nvl(getLocationParam('debug',''))=='Y' },
			mainMaxWidth(){return this.daysMax*parseFloat(this.cardDayWidth)+parseFloat(this.cardShopWidth)-this.layoutSizes['second'].width+18},
			tabMainHeader(){
				let vm = this
				return [{code:'agr',	text:vm.daysFirst.toLocaleString("ru", {month: 'long',}), 	type:'text', },	].concat(
					vm.days.map((item, i)=> { let d =new Date(); d.setDate(vm.daysFirst.getDate()+i); return {code:i ,text:d.toLocaleString("ru", {weekday: 'long',day: 'numeric',}), type:'int', } })
				)
			},
			noDataMainText(){
				return this.dataLoading?'dataLoadingText':this.versInfo.days==undefined?'mainTabNoVers':'$vuetify.noDataText'
			},
			tabValues(){
				let  vm = this
				if(vm.dataLoading)
					return[]
				let itog={}, 
					tmp = vm.dicAgr.filter(obj => vm.shopCur.indexOf(obj.shop)!=-1).map(obj => {
						return {...obj, ...vm.days.map(day=>{return {id:obj.name+' - '+day , } }), itog:false, }
					})
				if(tmp.length >0)
					vm.shopCur.forEach(shop=>{
						itog[shop]={shop, itog:true}
					})
				return tmp.concat(Object.keys(itog).map(key => itog[key]) ).sort( (a, b) =>{return sort(b, a, 'itog', 'itog')}).sort( (a, b) =>{return sort(a, b, 'shop', 'shop')})
			},
			divValues(){
				let  vm = this
				if(vm.dataLoading || vm.dicAgr.length==0 )
					return[]
				let itog={}, 
					tmp = vm.dicAgr.filter(obj => vm.shopCur.indexOf(obj.shop)!=-1)
				vm.shopCur.forEach(shop=>{
					itog[shop]= tmp.filter(obj => obj.shop==shop).sort( (a, b) =>{return sort(a, b, 'shop', 'shop')} )
				})
				return itog
			},
			shopRuleBStyle(){
				let vm=this,
					tmp={}
				for (let shop in vm.shopDetailsShow)
					tmp[shop]= vm.shopDetailsShow[shop]?{'-webkit-transform': 'rotate(-180deg)','transform': 'rotate(-180deg)'}:{}
				return tmp
			},
		},
		components: {
			CTable,CDayCard,CLoading,
		},
		mixins: [
			XApp,
		],
		methods: {
			layoutsChange(){
				let vm=this
				vm.layoutsCur= (vm.layoutsCur+1)%vm.layoutsConfigs.length
				vm.layoutInit({main:{...vm.layoutsConfigs[vm.layoutsCur], sizePx:vm.$vuetify.breakpoint}})
			},
			versionSet(versId){
				let vm=this
				vm.dataLoading=true
				sendReqToApp({args:"type=getInfoByVersion&versId="+versId, callback:'dataInit',})
			},
			dataInit(data){
				let vm=this
				vm.versInfo={...vm.versInfo, ...data.version}
				vm.dicAgr = data.dicAgr
				vm.dicPlanOper = data.dicPlanOper
				vm.opers = data.opers
				vm.dataLoading=false
			},
			tabMainShopClick(shop){
				let vm = this
				vm.shopDetailsShow[shop]=!vm.shopDetailsShow[shop]
				if(vm.shopDetailsShow[shop])
					vm.shopDetailsShowComp[shop]=true
				else
					setTimeout(()=>vm.shopDetailsShowComp[shop]=false, 200)

			},
			onScroll (e) {
				let vm = this				
				e.target.scrollLeft= Math.min(this.mainMaxWidth,e.target.scrollLeft)
				vm.scrollLeft =e.target.scrollLeft
			}
		},
		created: function (){
			let vm=this 
			vm.shopCur.forEach(item=>{vm.$set(vm.shopDetailsShow,item, true); vm.$set(vm.shopDetailsShowComp,item, true); } )
			if(vm.debug)
				setTimeout(()=>vm.versionSet(4), 1000)
		},
	}
</script>
<style>
	.tabHead				{color: white;         width: 1918.17px;}
	.tabHeadShad			{box-shadow: 0 -6px 6px -3px rgba(0,0,0,.2),0 -10px 14px 1px rgba(0,0,0,.14),0 -4px 18px 3px rgba(0,0,0,.12)!important;  }
	.headMainTable 			{display: -webkit-box;}
	.headMainTable>div		{border-collapse:collapse; box-sizing:border-box;	color:rgba(0, 0, 0, 0.54);	font-family:Roboto, sans-serif;	font-size:12px;	font-weight:500;	height:20px;	line-height:18px;	margin-bottom:0px;	margin-left:0px;	margin-right:0px;	margin-top:0px;	padding-bottom:2px;	padding-left:2px;	padding-right:2px;	padding-top:2px;	text-align:left;	text-rendering:optimizelegibility;	text-size-adjust:100%;	transition-delay:0s;	transition-duration:0.3s;	transition-property:all;	transition-timing-function:cubic-bezier(0.25, 0.8, 0.5, 1);	user-select:none;	vertical-align:middle;	white-space:nowrap;	width:246px;	-webkit-border-horizontal-spacing:0px;	-webkit-border-vertical-spacing:0px;	-webkit-font-smoothing:antialiased;	-webkit-tap-highlight-color:rgba(0, 0, 0, 0);}
	div.divAgrs				{overflow: hidden;}
	div.divDays				{display: -webkit-box;     position: relative;     overflow: hidden;}
	div.animateDropdown		{transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);}
</style>