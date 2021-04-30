<template>
	<div>
		

	</div>
</template>

<script>
	
	//跟5把以上的长龙模式
	
	import axios from 'axios'
	import qs from 'qs'

	axios.defaults.baseURL = 'https://pc.qf2802.com/'
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
				now_term: 0,
				money: 50,
				flag: true,
				longTop: []
			}
		},
		watch: {
			'now_term'() {
				this.flag = false
			}
		},
		mounted() {
		
			this.getdata()

			setInterval(() => {
				//this.getdata()
			}, 1000 * 30)
		},
		methods: {
			getdata() {
				axios.post("m/php/action.php?action=lotterycharts", {
					pcmn: '6026-172-1',
					game_type: 'fastbtb28',
					count_term: '200',
					version: '200'
				}).then(res => {
					let resData = res.data.data.list.reverse()
					this.now_term = Number(resData[0][0])
					let datas = resData.map(item=>{
						return Number(item[2].split(",")[3]) 
					})
					
					console.log(datas)
					
					let lastNums = [] 
					
					datas.map((item,index)=>{
						if(item==datas[0]){
							index-1 >=0 ? lastNums.push(datas[index-1]) : '' 
						}
					})
					console.log(lastNums)
					let obj =[
						{
							type:0,
							num:0
						},
						{
							type:1,
							num:0
						},
						{
							type:2,
							num:0
						},
						{
							type:3,
							num:0
						}
					] 
					
					lastNums.map(item=>{
						if(item>13){
							obj[0].num++
						}else{
							obj[1].num++
						}
						if(item%2==0){
							obj[3].num++
						}else{
							obj[2].num++
						}
					})
					
					console.log(obj)
					
					var maxData  = obj[0];
					var minData  = obj[0];
					for (var i = 0; i < obj.length; i++) {
						if (obj[i].num>maxData.num) {
							maxData = obj[i];  // 最大值
						};
						if (obj[i].num<minData.num) {
							minData = obj[i];  // 最小值
						}
					}
					
					if(maxData.num!=minData.num){
						this.touzhu(maxData.type)
					}
					console.log(maxData,minData)
				
					

					
				}, error => {
					console.log(error)
				}).catch(err => {
					console.log(err)
				})
			},

			touzhu(type) {
				if(this.flag){
					return
				}
				//  [{"msg":"第一球小1","type":"first_small","money":1,"num":"","odds":"1.97","odds_1314":""}]
				let json = {
					pcmn: '6026-172-1',
					game_type: 'fastbtb28',
					content: [],
					now_term: this.now_term + 1,
					oid: 'a15dd8149604760cf6d1a4a2f5c09794',
					room_id: '661',
					table_id: '1900',
					client_name: '191237311',
				}
				
				switch (type) {
					case 0:
						json.content = [{
							"msg": "大" + this.money,
							"type": "big",
							"money": this.money,
							"num": "",
							"odds": "2",
							"odds_1314": "1.85"
						}]
						break;
					case 1:
						json.content = [{
							"msg": "小" + this.money,
							"type": "small",
							"money": this.money,
							"num": "",
							"odds": "2",
							"odds_1314": "1.85"
						}]
						break;
					case 2:
						json.content = [{
							"msg": "单" + this.money,
							"type": "odd",
							"money": this.money,
							"num": "",
							"odds": "2",
							"odds_1314": "1.85"
						}]
						break;
					case 3:
						json.content = [{
							"msg": "双" + this.money,
							"type": "even",
							"money": this.money,
							"num": "",
							"odds": "2",
							"odds_1314": "1.85"
						}]
						break;
				}
				
				console.log(json)
				json.content = JSON.stringify(json.content)
				
				axios.post("m/php/web.php?action=bet", json)
				this.flag = true
			}
		}
	}
</script>

<style>

</style>
