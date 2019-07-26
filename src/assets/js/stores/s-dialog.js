export default {
	namespaced: true,
	state: {	//= data
		dialogs:[],
	},
	getters: { // computed properties
		getById: state => id => {
			return nvl(state.dialogs.find(dialog =>dialog.config.id===id ),0)
		},
		getByName: state => name => {
			return nvl(state.dialogs.find(dialog =>dialog.config.name===name ),0)
		},
		getDilog: (state,getters) => ({id,name}) => {
			return id>0? getters.getById(id) :nvl(name)!=''? getters.getByName(name) : null
		},
		getConfig: (state, getters) => id =>{
			return nvl(getters.getById(id).config)
		},
		getIsShow: (state, getters) => id =>{
			return nvl(getters.getById(id).isShow)
		},
		getParams: (state, getters) => id =>{
			return nvl(getters.getById(id).params)
		},
	},
	actions:{	
		async doInit({commit,getters,state},{config, params, }){
			if(config==undefined || config.id==undefined)
				showError(getErrDesc('noDialogInitId') );
			if (getters.getById(config.id)!=0)
				return
			config.persistent=config.persistent||true
			commit('adding',{config, params})
		},
		async doShowChange({commit,getters,state},{id,name, isShow}){
			let dialog=getters.getDilog({id,name})
			if ( dialog==0)
				return;
			commit('showSetting',{dialog, isShow})
		},
		async doSetAllParams({commit,getters,state},{id,name, params}){
			let dialog=getters.getDilog({id,name})
			if ( dialog==0)
				return;
			commit('allParamSetting',{dialog, params})
		},
		async doSetAllParamsAndShow({dispatch,commit,getters,state},{id,name, params}){
			await dispatch('doSetAllParams',{id,name, params}) 
			await dispatch('doShowChange',{id,name, isShow:true}) 
		},
		async doSetParamByName({commit,getters,state},{id,name, params }){
			let dialog=getters.getDilog({id,name})
			if ( dialog==0)
				return;
			for( let paramsName in params )
				commit('paramSetting',{dialog, paramsName, paramsVal:params[paramsName] })
		},
		async doSetParamByNameAndShow({dispatch,commit,getters,state},{id,name, params}){
			await dispatch('doSetParamByName',{id,name,params}) 
			await dispatch('doShowChange',{id,name, isShow:true}) 
		},
	},
	mutations:{
		adding(state, {config, params,}){
			state.dialogs.push({config, params, isShow:false,})
		},
		showSetting(state, {dialog, isShow}){
			dialog.isShow =isShow
		},
		allParamSetting(state, {dialog, params}){
			dialog.params =params
		},
		paramSetting(state, {dialog, paramsName, paramsVal}){
			dialog.params[paramsName] =paramsVal
		},
	},
}