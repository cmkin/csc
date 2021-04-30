<template>
	<div id="app">
		当前最新期数:{{now_term}}

		<p>
			{{longTop}}
		</p>

	</div>
</template>

<script>
	
	//跟5把以上的长龙模式
	
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
				this.getdata()
			}, 1000 * 30)
		},
		methods: {
			getdata() {
				axios.post("m/php/action.php?action=lotterycharts", {
					pcmn: '6026-172-1',
					game_type: 'keno28',
					count_term: '50',
					version: '200'
				}).then(res => {
					this.now_term = Number(res.data.data.list.reverse()[0][0])
					let longTop = res.data.data.longTop
					this.longTop = longTop

					/* let hasArr = longTop.filter(item => item.indexOf("特码") != -1)
					if (hasArr.length) {
						hasArr = hasArr.map(item => {
							return item.split(",")[1].split("|")
						})

						hasArr = hasArr.filter(item => {
							return Number(item[1]) >= 5
						})

					}
					if (hasArr.length) {
						//存在长龙-大小单双5把
						hasArr.map(item => {
							this.touzhu(item[0])
						})
					} */

					// 大小单双	

					let qArr = longTop.map(item => {
						return [item.split(",")[0], ...item.split(",")[1].split("|")]
					})
					
					if (qArr.length) {
						qArr = qArr.filter(item => {
							return Number(item[2]) >= 5
						})
					}
					
					qArr.map(item => {
						this.touzhu(item[0], item[1])
					})

					

				}, error => {
					console.log(error)
				}).catch(err => {
					console.log(err)
				})
			},

			touzhu(type, value) {
				
				if (this.flag || type == "定位球") {
					return
				}
				//  [{"msg":"第一球小1","type":"first_small","money":1,"num":"","odds":"1.97","odds_1314":""}]
				let json = {
					pcmn: '6026-172-1',
					game_type: 'keno28',
					content: [],
					now_term: this.now_term + 1,
					oid: 'a15dd8149604760cf6d1a4a2f5c09794',
					room_id: '661',
					table_id: '1900',
					client_name: '191237311',
				}
				
				if (type == "特码") {
					switch (value) {
						case '大':
							json.content = [{
								"msg": value + this.money,
								"type": "big",
								"money": this.money,
								"num": "",
								"odds": "2",
								"odds_1314": "1.85"
							}]
							break;
						case '小':
							json.content = [{
								"msg": value + this.money,
								"type": "small",
								"money": this.money,
								"num": "",
								"odds": "2",
								"odds_1314": "1.85"
							}]
							break;
						case '单':
							json.content = [{
								"msg": value + this.money,
								"type": "odd",
								"money": this.money,
								"num": "",
								"odds": "2",
								"odds_1314": "1.85"
							}]
							break;
						case '双':
							json.content = [{
								"msg": value + this.money,
								"type": "even",
								"money": this.money,
								"num": "",
								"odds": "2",
								"odds_1314": "1.85"
							}]
							break;
					}
				} else {
					let obj = {
						"大":"big",
						"小":"small",
						"单":"odd",
						"双":"even"
					}
					switch (type){
						case '第一球':
							json.content = [{"msg":`第一球${value}${this.money}`,"type":'first_'+obj[value],"money":this.money,"num":"","odds":"1.97","odds_1314":""}] 
						break;
						case '第二球':
							json.content = [{"msg":`第二球${value}${this.money}`,"type":"second_"+obj[value],"money":this.money,"num":"","odds":"1.97","odds_1314":""}] 
						break;
						case '第三球':
							json.content = [{"msg":`第三球${value}${this.money}`,"type":"first_"+obj[value],"money":this.money,"num":"","odds":"1.97","odds_1314":""}] 
						break;
					}
					
				}
				console.log(type,value, new Date().getHours()+"时" + new Date().getMinutes()+"分" )
				json.content = JSON.stringify(json.content)
				
				axios.post("m/php/web.php?action=bet", json)
				this.flag = true
			}
		}
	}
</script>

<style>

</style>
