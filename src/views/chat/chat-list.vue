<template>
<section id="container">
    <div id="content" class="">
        <div class="cont_header">
            <h2 class="page_title">채팅 관리</h2>
            <span class="page_path">HOME &gt; 채팅관리 &gt; 채팅조회</span>
        </div>

        <div class="srch_box" v-on:keyup.enter="searchClick(1)">
            <input type="text" class="form-control" v-model="room_name" v-on:keyup.enter="createRoom" placeholder="방제목">
        </div>
        <div class="btn_area">
            <button class="fr bgClr_blue" type="button" @click="createRoom">채팅방 개설</button>
        </div>

        <h3 class="cont_title">모임 목록</h3>
        <table>
            <colgroup>
                <col style="width: 70%;">
                <col style="width: auto;">
            </colgroup>
            <thead>
                <tr>
                    <th class="AC">방 제목</th>
                    <th class="AC">참여 인원수</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(list,item) in chatrooms" :key="item" @click="enterRoom(list.roomId , list.name)" style="cursor:pointer">
                    <td class="AC">{{list.name}}</td>
                    <td class="AC">{{list.userCount}}</td>
                 </tr>
            </tbody>
        </table>
    </div>
</section>
</template>

<script>
import CSNetwork from '@/utils/CSNetwork.js'
import router from '@/router'
const $ = window.$;

export default {
    components: {
        
    },
    data() {
        return {
            room_name : '',
            chatrooms: []
        }
    },
    created() {
        this.findAllRoom();
    },
    methods: {
        findAllRoom: function() {
             CSNetwork.request_chat_list()
            .then(data=>{
                if(Object.prototype.toString.call(data.body.resultList) === "[object Array]")
                this.chatrooms = data.body.resultList;
            });

        },
        createRoom: function() {
            if("" === this.room_name) {
                alert("방 제목을 입력해 주십시요.");
                return;
            } else {
                var params = {
                    roomNm : this.room_name
                };
                CSNetwork.request_create_room(params)
                .then(data=>{
                    alert(data.body.result.name+"방 개설에 성공하였습니다.")
                    this.room_name = '';
                    this.findAllRoom();
                });
            }
        },
        enterRoom: function(roomId, roomName) {
            localStorage.setItem('roomId',roomId);
            localStorage.setItem('roomName',roomName);
            
            var param = {
                roomId : roomId,
                roomName : roomName,
            }
            router.push({name: 'ServiceChatEnter', params : param })
            
        }
    }
}
</script>

