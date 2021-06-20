<template>
<section id="container">
    <div id="content" class="">
        
        <div class="cont_header">
            <h2 class="page_title">모임 관리</h2>
            <span class="page_path">HOME &gt; 모임관리 &gt; 모임조회</span>
        </div>

        <section class="cont_inner">
            <ul class="dep_tab">
                <li><a href="#dep_tab1">모임 정보</a></li>
                <li><a href="#dep_tab2">모임원 목록</a></li>
                <li><a href="#dep_tab3">게시글 목록</a></li>
            </ul>
            <div id="dep_tab1" class="dep_content">

                <h3 class="cont_title">모임 정보</h3>
                <table class="">
                    <colgroup>
                        <col class="W10p">
                        <col class="W22p">
                        <col class="W10p">
                        <col class="W22p">
                        <col class="W10p">
                        <col>
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>분류</th>
                            <td>
                                <select v-model="formData.meet_type">
                                    <option v-for="(list,item) in typeList" :key="item" :value="list.code">
                                        {{list.code_nm}}
                                    </option>
                                </select>
                            </td>
                            <th>카테고리</th>
                            <td>
                                <select v-model="formData.meet_cate">
                                    <option v-for="(list,item) in cateList" :key="item" :value="list.code">
                                        {{list.code_nm}}
                                    </option>
                                </select>
                            </td>
                            <th>모임 상태</th>
                            <td>
                                <select v-model="formData.meet_status">
                                    <option v-for="(list,item) in stateList" :key="item" :value="list.code">
                                        {{list.code_nm}}
                                    </option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>모임명</th>
                            <td>
                                <input type="text" name="meet_name" id="meet_name" v-model="formData.meet_name" value="formData.meet_nm"  maxlength="15"/>
                            </td>
                            <th>생성 일자</th>
                            <td class="AL">{{ dateFormat(formData.create_date) }} </td>
                            <th>수정 일자</th>
                            <td class="AL">{{ dateFormat(formData.update_date) }} </td>
                        </tr>
                    </tbody>
                </table>

                <div class="btn_area">
                    <button class="btn fr" @click="updateMeet()" >수정</button>
                </div>
            
            </div>


            <div id="dep_tab2" class="dep_content">
                <h3 class="cont_title">모임원 목록</h3>
                <table class="">
                    <colgroup>
                        <col style="width: 10%;">
                        <col style="width: 15%;">
                        <col style="width: 15%;">
                        <col style="width: 15%;">
                        <col style="width: 15%;">
                        <col style="width: 15%;">
                        <col style="width: auto;">
                    </colgroup>
                    <thead>
                        <tr>
                            <th class="AC">아이디</th>
                            <th class="AC">이름</th>
                            <th class="AC">권한</th>
                            <th class="AC">상태</th>
                            <th class="AC">가입일</th>
                            <th class="AC">수정일</th>
                            <th class="AC">비고</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(list,item) in memberList" :key="item">
                            <td class="AC">
                                <input type="hidden" class="p_user_id" :value="list.user_id"/>
                                {{list.user_id}}
                            </td>
                            <td class="AC">{{list.user_nickname}}</td>
                            <td class="AC">
                                <select v-model="list.user_auth" class="p_member_auth">
                                    <option v-for="(item2, index) in memAuthList" :key="index" :value="item2.code">{{item2.code_nm}}</option>
                                </select>    
                            </td>
                            <td class="AC">
                                <select v-model="list.member_status" class="p_member_status">
                                    <option v-for="(item2, index) in memStateList" :key="index" :value="item2.code">{{item2.code_nm}}</option>
                                </select>    
                            </td>
                            <td class="AC">{{list.create_date}}</td>
                            <td class="AC">{{list.update_date}}</td>
                            <td class="AC">
                                <button class="bgClr_blue" style="margin-right:10px;" id="codeUpd" @click="updClick(item)">수정</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <page-component :pageData="memData" @onPage="pageClick" v-if="this.memberList.length !== 0" />
            
            </div>
            <div id="dep_tab3" class="dep_content">
                <h3 class="cont_title">게시글 목록</h3>
                <table class="">
                    <colgroup>
                        <col style="width: 25%;">
                        <col style="width: 25%;">
                        <col style="width: 25%;">
                        <col style="width: auto;">
                    </colgroup>
                    <thead>
                        <tr>
                            <th class="AC">글 타입</th>
                            <th class="AC">타이틀</th>
                            <th class="AC">글쓴이</th>
                            <th class="AC">생성일자</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(list,item) in boardList" :key="item"  @click="innerBoardClick(list.board_id)"  >
                            <td class="AC">{{list.board_type_nm}}</td>
                            <td class="AC">{{list.board_title}}</td>
                            <td class="AC">{{list.create_by}}</td>
                            <td class="AL">{{ dateFormat(list.create_date) }} </td>
                        </tr>
                    </tbody>
                </table>
                <page-component :pageData="boardData" @onPage="pageClick2" v-if="this.boardList.length !== 0" />

            </div>
            <div class="btn_area">
                <button class="fr bgClr_blue"  @click="listClick()">목록</button>
            </div>
        </section>
    </div>
</section>
</template>

<script>
import CSNetwork from '@/utils/CSNetwork.js'
import localStorageUtils from "@/utils/localStorage.util.js"
import pageComponent from "@/components/board/page"
import dateUtils from "@/utils/date.js"
import router from '@/router'
import ui from "@/utils/ui.js"

const $ = window.$;

export default {
    components: {
        pageComponent
    },
    data() {
        return {
            cateList:[],
            typeList:[],
            stateList:[],

            memAuthList:[],
            memStateList:[],

            formData:{
                meet_type:'',
                meet_cate:'',
                meet_status:'',
                meet_name:'',
                meet_id:'',
                create_date:'',
                update_date:''
            },

            memberList:[],  
            memData:{
                page       :1,
                count      :10,
                total      :0,
                meet_id    : '',
                member_auth : '',
                member_status : '',
                user_id : '',
            },
            
            boardList:[],
            boardData:{
                page       :1,
                count      :10,
                total      :0,
                meet_id:'',
                board_id:'',
            }
        }
    },
    created() {
        

        var meet_id = localStorage.getItem('meet_id')||this.$route.params.meet_id||'';
        
        this.formData.meet_id = meet_id;
        this.memData.meet_id = meet_id;
        this.boardData.meet_id = meet_id;

    },
    mounted() {
        ui.setTabs();
        
        this.getCodeData( '16' ); //분류
        this.getCodeData( '43' ); //카테고리
        this.getCodeData( '71' ); //모임상태

        this.getCodeData( '28' ); //멤버 권한
        this.getCodeData( '65' ); //멤버 상태
        
        this.search(); //모임 불러오기
        this.searchMem(1); //모임원 불러오기
        this.searchBoard(1); //모임원 불러오기
    },
    methods: {
        getCodeData(code_type){
            CSNetwork.request_code({code_type:code_type})
                .then(data=>{
                    if( code_type =="43" ) this.cateList = data.body;
                    if( code_type =="16" ) this.typeList = data.body;
                    if( code_type =="71" ) this.stateList = data.body;
                    if( code_type =="28" ) this.memAuthList = data.body;
                    if( code_type =="65" ) this.memStateList = data.body;
                    
                })
        },
        dateFormat: function(date) {
            return dateUtils.parser(date)
        },
        listClick() {
            router.push({name: "ServiceMeetMn"})
        },
        search(){
            CSNetwork.request_meet_detail(this.formData)
            .then(data=>{
                this.formData = data.body;
            })
        },
        updateMeet(){
            CSNetwork.request_meet_update(this.formData)
            .then(data=>{
                if(data.resultCode == 0 ){
                    alert("수정 되었습니다.")
                    this.formData = data.body;
                }else{
                    alert("수정 실패")
                }
            })
        },
        pageClick(page) {
            this.searchMem(page);
        },
        pageClick2(page){
            this.searchBoard(page);
        },
        searchMem(page){
            this.memData.page = page;
            CSNetwork.request_meet_memList(this.memData)
            .then(data=>{
                this.memberList = data.body.resultList;
                this.memData.total = data.body.totalCnt;
            })
        },
        updClick(index){
            this.memData.member_auth = $(".p_member_auth:eq("+index+")").val();
            this.memData.member_status = $(".p_member_status:eq("+index+")").val();
            this.memData.user_id = $(".p_user_id:eq("+index+")").val();
            
            CSNetwork.request_meet_memUpdate(this.memData)
            .then(data=>{
                if(data.resultCode == 0 ){
                    alert("수정 되었습니다.")
                    this.memberList = data.body.resultList;
                    this.memData.total = data.body.totalCnt;
                }else{
                    alert("수정 실패")
                }
            });
        },
        searchBoard(page){
            this.boardData.page = page;
            CSNetwork.request_meet_boardList(this.boardData)
            .then(data=>{
                this.boardList = data.body.resultList;
                this.boardData.total = data.body.totalCnt;
            })
        },
        innerBoardClick(board_id){
            this.boardData.board_id=board_id;
            localStorageUtils.set_data(this.boardData)
            router.push({name: 'ServiceBoardView', params : { board_id : board_id }})
        }

       
    }
}
</script>


