<template>
<v-card
    class="mx-auto"
    color="#26c6da"
    dark
    max-width="400"
  >
    <v-card-title>
      <v-icon
        large
        left
      >
        mdi-twitter
      </v-icon>
      <span class="title font-weight-light">Twitter</span>
    </v-card-title>

    <v-card-text class="headline font-weight-bold">
      "Turns out semicolon-less style is easier and safer in TS because most gotcha edge cases are type invalid as well."
    </v-card-text>

    <v-card-actions>
      <v-list-tile class="grow">
        <v-list-tile-avatar color="grey darken-3">
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title>Evan You</v-list-tile-title>
        </v-list-tile-content>

        <v-layout
          align-center
          justify-end
        >
          <v-icon class="mr-1">mdi-heart</v-icon>
          <span class="subheading mr-2">256</span>
          <span class="mr-1">·</span>
          <v-icon class="mr-1">mdi-share-variant</v-icon>
          <span class="subheading">45</span>
        </v-layout>
      </v-list-tile>
    </v-card-actions>
  </v-card>
</template>
 
<script>
	export default {
		name:'c-day-card',
		data: () => ({
			snackbar:true,
			timeoutCur:6000,
			visibility:false,
		}),
		props:{
		},
		computed: {
			traceAble(){return this.msg.trace!=''}
		},
		watch: {
			// эта функция запускается при любом изменении вопроса
			snackbar: function (newsnackbar) {        
			},
		},
		components: {
		},
		methods: {
			snackClcik(){
				let vm=this		
			}
		},
		created: function (){
			let vm=this
		},
	}
</script>