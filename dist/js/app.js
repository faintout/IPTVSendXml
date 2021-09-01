new Vue({
    el:"#app",
    data:{
        liveEPGList:[],
        liveChannelList:[],
        times:null
        // seleLiveEPGIndexList:[],
    },
    components:{

    },
    wathch:{
    },
    methods:{
        //获取列表
        async getLievEPGList(){
            let liveList = await this.getLiveList()
            let LivePlayIdList = await this.getLivePlayIdList()
            //无播放ID列表则直接赋值频道清单
            if(!LivePlayIdList){
                this.liveEPGList = liveList
            }else{
                // 分别过滤两个列表数据
                this.liveEPGList = liveList.filter(EPG=>!LivePlayIdList.split(',').some(id=>EPG.ID==id))
                this.liveChannelList = liveList.filter(EPG=>LivePlayIdList.split(',').some(id=>EPG.ID==id))
            }
            layer.msg('更新成功', {icon: 1}); 
        },
        //拼接发送列表
        makeSendLiveXML(){
            var xmlTitle = `<?xml version="1.0" encoding="GB2312" standalone="yes"?>
            <Msg Version="2" MsgID="-2" Type="MonDown" DateTime="2021-03-04 09:06:08" SrcCode="10000" DstCode="10000" SrcURL="http://192.168.15.81:8302" Priority="1">
            <Request Type="SetAutoRecordChannel">`
            this.liveChannelList.map((live,index)=>{
                let channelText = `    <Channel ID="${live.ID}" ChannelID="${live.ChannelIndex}" ChannelName="" IP="231.10.10.${index+1}" Port="7001" IptvURL="${live.URL}" />
`
                xmlTitle+=channelText
            })
            xmlTitle+=`</Request>
            </Msg>`
            return xmlTitle
        },
        //拼接发送列表
        makeSendLivePlayIdList(){
            return this.liveChannelList.map(channel=>{
                return channel.ID
            })
        },
        //发送按钮-调用接口发送
        sendLiveChannelBtn(){
            // if(!this.liveChannelList.length){
            //     alert('请先添加拉流频道表!')
            //     return
            // }
            let xmlData = this.makeSendLiveXML()
            let playIdList = this.makeSendLivePlayIdList().join(',')
            let params = {
                xml:xmlData,
                playIdList,
            }
            $.ajax({
                url: '/sendXml',
                type:'post',
                data:params,
                success: function(data) {//请求成功完成后要执行的方法 
                    layer.msg('发送成功', {icon: 1}); 
                },
                error:function (error) {
                    layer.msg('发送失败', {icon: 2}); 
                }
            })
        },
        //获取拉流频道表()
        getLivePlayIdList(){
            return new Promise((res,rej)=>{
                $.ajax({
                    url: '/getLivePlayIdList',
                    type:'post',
                    success: function(data) {
                       data.success&&res(data.data)
                    },
                    error:function (error) {
                        rej(error)
                        layer.msg('获取拉流频道表失败', {icon: 2}); 
                    }
                })
            })
        },
        //获取节目清单()
        getLiveList(){
            return new Promise((res,rej)=>{
                $.ajax({
                    url: '/getLiveList',
                    type:'post',
                    success: function(data) {
                       data.success&&res(data.data)
                    },
                    error:function (error) {
                        rej(error)
                        layer.msg('获取拉流频道表失败', {icon: 2}); 
                    }
                })
            })
        },
        //穿梭框
        transfer(type){
            //右
            if(type){
                if(!this.$refs.multipleTable.selection.length){
                    layer.msg('请勾选节目清单', {icon: 2}); 
                    return 
                }
                //选中的数组
                this.liveChannelList.push(...this.$refs.multipleTable.selection)
                this.liveEPGList = this.liveEPGList.filter(EPG=>!this.liveChannelList.some(channel=>channel.ID==EPG.ID))
                this.liveChannelList = this.liveChannelList.sort((a,b)=>a.ID-b.ID)
            }else{
                if(!this.$refs.multipleTable1.selection.length){
                    layer.msg('请勾选拉流频道表', {icon: 2}); 
                    return 
                }
                this.liveEPGList.push(...this.$refs.multipleTable1.selection)
                this.liveChannelList = this.liveChannelList.filter(EPG=>!this.liveEPGList.some(channel=>channel.ID==EPG.ID))
                this.liveEPGList = this.liveEPGList.sort((a,b)=>a.ID-b.ID)
            }
        },
        refreshTimes(){
           setTimeout(()=>{
               let dt = new Date()
                this.times = (dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()).replace(/([\-\: ])(\d{1})(?!\d)/g, '$10$2'); 
                console.log(this.times);
                this.refreshTimes()
           },1000)
        }
    },
    mounted() {
        // this.liveEPGList = LiveEPG
        this.refreshTimes()
        this.getLievEPGList()
    },
})