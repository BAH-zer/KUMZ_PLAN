<script>
	import CApp from '../components/c-app';
	import XStore from '../mixins/x-store'
	export default {
		data: () => ({
			curentSystem: '',
			layoutsCur:0,
		}),
		computed: {
			layoutSizes(){return this.layoutSizePxByHead('main')},
		},
		components: {
			CApp,
		},
		mixins: [
			XStore,
		],
		created: function (){
			let vm=this
			if(vm.layoutsConfigs!=undefined && vm.layoutsCur!=undefined && vm.layoutsConfigs[vm.layoutsCur]!=undefined)
				vm.layoutInit({main:{...vm.layoutsConfigs[vm.layoutsCur], sizePx:vm.$vuetify.breakpoint}})
				/*{ //'horizontal' - внутри будут строки,  'vertical' - внутри будут столбики; главный слой во vuex- main
				name: 'first',   width:'100%',	height:'100%',  layout: 'vertical', resizable:false , data:[
					{  name: 'second',   width:'50%',	height:'100%',  layout: 'horizontal'},
					{  name: 'third',   width:'100%',	height:'100%',  layout: 'horizontal'},
				]}*/
		},
	}
</script>