<template>
	<c-app :curentSystem="$vuetify.t('$vuetify.texts.main.links.prodList.name')" :panelLeft="{show:true}">
	</c-app>
</template>

<script>
	import XApp from '../mixins/x-app'
	import XStore from '../mixins/x-store'
	export default {
		data: () => ({
		}),
		computed: {
		},
		components: {
		},
		mixins: [
			XApp,XStore
		],
		methods: {
		},
		created: function (){			
		},
		mounted(){
			let vm=this
        	vm.isMounted = true;
    	},
	}
</script>
<style>
</style>