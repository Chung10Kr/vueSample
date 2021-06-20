<template>
<section id="container">
    <div id="content" class="">
        <div class="cont_header">
            <h2 class="page_title">채팅 관리</h2>
            <span class="page_path">HOME &gt; 채팅관리 &gt; 채팅방</span>
        </div>

        <div class="srch_box">
            <input type="text" class="form-control" v-model="message" v-on:keypress.enter="sendMessage('TALK')" placeholder="메세지">
        </div>
        <div class="btn_area">
            <button class="fr bgClr_blue" type="button" @click="sendMessage('TALK')">메세지 전송</button>
        </div>
        
        <ul id="logs">
            <li v-for="message in messages" v-bind:key="message.id"  class="log">
                {{message.sender}} - {{message.message}}
            </li>
        </ul>

    </div>
</section>
</template>

<script>
import router from '@/router';
import CSNetwork from '@/utils/CSNetwork.js'
import Stomp from 'webstomp-client';
import SockJS from 'sockjs-client';

var basUri = "http://localhost:11411/v1/ws"; 


var sock = null;
var ws = null;
export default {
    components: {
        
    },
    data() {
        return {
            status:null,
            roomId: '',
            roomName: '',
            message: '',
            messages: [],
            token: '',
            userCount: 0,
        }
    },
    created() {
        var roomId = localStorage.getItem('roomId')||this.$route.params.roomId||'';
        var roomName = localStorage.getItem('roomName')||this.$route.params.roomName||'';
        this.roomId = roomId;
        this.roomName = roomName;
        this.token = sessionStorage.getItem('accessToken');
        this.sender = "안협소";
        sock = new SockJS( basUri+"/ws-stomp");
        ws = Stomp.over(sock);
        this.connect();

    },
    mounted() {
    },
    destroyed(){

    },
    methods: {
        listClick() {
            router.push({name: "ServiceChatList"})
        },
        connect() {
            var _this = this;
            
            ws.connect({ "token":_this.token }, function(frame) {
                ws.subscribe("/v1/ws/sub/chat/room/"+_this.roomId, function(message) {
                    var recv = JSON.parse(message.body);
                    _this.recvMessage(recv);
                });
            }, function(error) {
                console.log(error)
                alert("서버 연결에 실패 하였습니다. 다시 접속해 주십시요.");
                router.push({name: "ServiceChatList"})
            });
            
        },
        sendMessage: function(type) {
            var param = {
                "type":type,
                "roomId":this.roomId,
                "message":this.message,
                "sender" : this.sender
            };
            param = JSON.stringify(param);
            ws.send("/v1/ws/pub/chat/message", param );
            this.message = '';
        },
        recvMessage: function(recv) {
            this.userCount = recv.userCount;
            this.messages.unshift({"type":recv.type,"sender":recv.sender,"message":recv.message})
        }

    }
}
</script>

 

