<template>
	<div class="yece">
		<div style="padding: 20px;text-align: center;">
			{{countYuceInfo}}
		</div>
		
		<div style="padding: 20px;text-align: center;">
			期号：{{qihao}}
		</div>
		
		
	</div>
</template>

<script>
	
	//根据 网址 https://28xiaomi.com/ 的预测投注
	
	import axios from 'axios'
	import qs from 'qs'

	axios.defaults.baseURL = ''
	axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';

	// 请求拦截器
	axios.interceptors.request.use(
		config => {
			config.data = qs.stringify(config.data) // 转为formdata数据格式
			return config
		},
		error => Promise.error(error)
	)


	export default {
		name: 'App',
		components: {

		},
		data() {
			return {
				countYuceInfo:'',
				qihao:''
			}
		},
		watch: {
			
		},
		mounted() {
			
			//单双
			axios.get("yc/api/yuce/lianZhongs?gameId=5&yuceInfoId=2").then(res=>{
				let data = res.data.data
				let arr = []
					for(let i in data){
						arr.push({
							id:i,
							bfb:parseFloat(data[i]) 
						})
					}
					arr = arr.sort((a,b)=>{
						return  b.bfb - a.bfb
					})
						
					console.log(arr)
					
					axios.post("yc/api/yuce/indexYuce",{
						gameId:5,
						yuceInfoId:2,
						suanfaId:arr[0].id
					}).then(res2=>{
						let datas = res2.data.data
							console.log(datas)
							this.countYuceInfo = datas.countYuceInfo
						    this.qihao = datas.suanfaYuceInfos[0].qihao
							this.yucejg = datas.suanfaYuceInfos[0]
							
					})
					
					
				
			})
			
			
			
			
			
		},
		methods: {
		
		}
	}
</script>

<style>

</style>
