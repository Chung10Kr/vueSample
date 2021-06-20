<template>
<section id="container">
    <div id="content" class="">
        
        <div class="cont_header">
            <h2 class="page_title">게시글 조회</h2>
            <span class="page_path">HOME &gt; 게시글 조회 &gt;</span>
        </div>

        <section class="cont_inner">
            <ul class="dep_tab">
                <li><a href="#dep_tab1">게시글</a></li>
                <li><a href="#dep_tab2">댓글</a></li>
                <li><a href="#dep_tab3">첨부파일</a></li>
            </ul>
            <div id="dep_tab1" class="dep_content">

                <h3 class="cont_title">게시글</h3>
                <table>
                    <colgroup>
                        <col class="W20p"/>
                        <col class="W40p"/>
                        <col class="W20p"/>
                        <col />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>글쓴시간</th>
                            <td>{{boardData.create_by}} {{ dateFormat(boardData.create_date) }}</td>
                            <th>수정시간</th>
                            <td>{{boardData.update_by}} {{ dateFormat(boardData.update_date) }}</td>
                        </tr>
                        <tr>
                            <th>글 타입</th>
                            <td colspan="3">{{boardData.board_type}}</td>
                        </tr>
                        <tr>
                            <th>제목</th>
                            <td colspan="3">{{boardData.board_title}}</td> 
                        </tr>
                        <tr>
                            <th>내용</th>
                            <td colspan="3" v-html="boardData.board_content" ></td> 
                             
                        </tr>
                    </tbody>
                </table>
                <div class="btn_area">
                    
                </div>
            
            </div>


            <div id="dep_tab2" class="dep_content">
                <h3 class="cont_title">댓글</h3>
                <table>
                    <colgroup>
                        <col style="width:70%">
                        <col style="width:auto">
                    </colgroup>
                    <tbody>
                        <tr v-for="(list,item) in replyList" :key="item"  >
                            <td class="AL">{{list.reply_content}}</td>
                            <td class="AR">{{ dateFormat(list.create_date) }} by {{list.create_by}}</td>
                        </tr>
                    </tbody>
                </table>
                <page-component :pageData="replyData" @onPage="pageClick" v-if="this.replyList.length !== 0" />
            </div>
            <div id="dep_tab3" class="dep_content">
                <h3 class="cont_title">이미지 {{fileList.length}}건</h3>
                <div class="W100p AC">
                    <font-awesome-icon @click="preImg()" icon="angle-double-left" class="MgR5" style="font-size:3rem;cursor: pointer;"/>
                    <img id="slide-image" :src="fileData.imgSrc" class="W40p"/>
                    <font-awesome-icon @click="nextImg()" icon="angle-double-right" class="MgL5" style="font-size:3rem;cursor: pointer;"/>
                </div>
                <div class="MgT10 W100p AC">
                        <img 
                         v-for="(list,item) in fileList" :key="item" 
                        @click="setImg( item , list.FILE_PATH)"
                        :src="upload_svrIp+list.FILE_PATH" class="MgR3" style="width:5rem;cursor: pointer;"/>        
                </div>
            </div>

            <div class="btn_area">
                <button class="fr bgClr_blue"  @click="listClick()">목록</button>
            </div>

        </section>
    </div>
</section>
</template>

<script>
import CSNetwork from '@/utils/CSNetwork.js';
import pageComponent from "@/components/board/page";
import dateUtils from "@/utils/date.js";
import router from '@/router';
import ui from "@/utils/ui.js";



const $ = window.$;

export default {
    
    components: {
        pageComponent,
    },
    board_id: {type: String,required: true},
    data() {
        return {
            upload_svrIp :process.env.VUE_APP_API_BASE_URL+'/upload/',
            boardData:{
                page       :1,
                count      :10,
                total      :0,
                meet_id:'',
                board_id:'',
                board_type:'',
                board_title:'',
                board_content:'',
                create_by:'',
                create_date:'',
                update_by:'',
                update_date:'',
            },
            replyList:[],
            replyData:{
                page       :1,
                count      :10,
                total      :0,
                meet_id:'',
                board_id:'',
                reply_content:'',
                create_date:'',
                create_by:'',
            },
            fileList:[],
            fileData:{
                board_id:'',
                imgSrc:'',
                imgIndex:0
            },
            
        }
    },
    created() {
        this.boardData.board_id = this.$route.params.board_id;
        this.replyData.board_id = this.$route.params.board_id;
        this.fileData.board_id = this.$route.params.board_id;
        
    },
    mounted() {
        ui.setTabs();
        this.searchBoard();
        this.searchReply(1);
        this.searchFile(1);

    },
    methods: {
        getCodeData(code_type){
            CSNetwork.request_code({code_type:code_type})
                .then(data=>{
                    if( code_type =="76" ) this.typeList = data.body;
                })
        },
        dateFormat: function(date) {
            return dateUtils.parser(date)
        },
        listClick() {
            router.push({name: "ServiceMeetEdit"})
        },
        pageClick(page) {
            this.searchReply(page);
        },

        searchBoard(){
            CSNetwork.request_board_view(this.boardData)
            .then(data=>{
                this.boardData = data.body;
                this.boardData.board_content = (this.boardData.board_content).replace(/(?:\r\n|\r|\n)/g, '<br />');

            })
        },
        searchReply(page){
            this.replyData.page=page;
            CSNetwork.request_reply_view(this.replyData)
            .then(data=>{
                this.replyList = data.body.resultList;
                this.replyData.total = data.body.totalCnt;
            })
        },
        searchFile(){
            CSNetwork.request_file_view(this.fileData)
            .then(data=>{
                this.fileList = data.body.resultList;
                if(this.fileList.length != 0){
                    this.setImg( 0 , this.fileList[0].FILE_PATH);
                }
            })
        },
        setImg(index , filep){
            this.fileData.imgSrc = this.upload_svrIp+filep;
            this.fileData.imgIndex=index;
        },
        preImg(){
            this.fileData.imgIndex--;
            if( this.fileData.imgIndex < 0 ) this.fileData.imgIndex = this.fileList.length-1;
            this.fileData.imgSrc = this.upload_svrIp+this.fileList[this.fileData.imgIndex]["FILE_PATH"];
        },
        nextImg(){
            this.fileData.imgIndex++;
            if( this.fileData.imgIndex >= this.fileList.length ) this.fileData.imgIndex=0;
            this.fileData.imgSrc = this.upload_svrIp+this.fileList[this.fileData.imgIndex]["FILE_PATH"];
        }
       
    }
}
</script>


