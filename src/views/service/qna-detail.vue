<template>
<section id="container">
    <div id="content" class="service_qna detail">
        <section class="cont_header">
            <h2 class="page_title">고객 문의 상세</h2>
            <span class="page_path">HOME &gt; 서비스 관리 &gt; 고객 문의 상세</span>
        </section>
        <section class="cont_inner">
            <h3 class="cont_title">문의 내용</h3>
            <table>
                <colgroup>
                    <col style="width:12%">
                    <col style="width:21.3%">
                    <col style="width:12%">
                    <col style="width:21.3%">
                    <col style="width:12%">
                    <col>
                </colgroup>
                <tbody>
                    <tr>
                        <th>구분</th>
                        <td>일반</td>
                        <th>이름</th>
                        <td>{{ question.author_name }}</td>
                        <th>연락처</th>
                        <td>{{ telNumFormat(question.tel) }}</td>
                    </tr>
                    <tr>
                        <th>문의유형</th>
                        <td>{{ question.question_type }}</td>
                        <th>최초 문의 일시</th>
                        <td>{{ dateFormat(question.create_dt) }}</td>
                        <th>최종 문의 일시</th>
                        <td>{{ dateFormat(question.create_dt)}}</td>
                    </tr>
                    <tr>
                        <th>문의 제목</th>
                        <td colspan="5">{{ question.question_title }}</td>
                    </tr>
                    <tr>
                        <td colspan="6">
                        <div v-for="(listItem,index) in list" :key="listItem.board_id">
                            <div class="qna_textare" v-if="!isModifying.includes(index)">
                                <strong v-if="listItem.group_num === 0">[질의 - {{ listItem.author_name }}]<span class="refer fr">{{ dateFormat(listItem.create_dt) }}</span></strong>
                                <p class="qna_inner" v-if="listItem.group_num === 0" v-html="listItem.description.split('\n').join('<br />')"></p>
                                <strong v-if="listItem.group_num === 1" style="padding-top:20px;">[답변 - {{ listItem.author_name }}]<span class="refer fr">{{ dateFormat(listItem.create_dt) }}</span></strong>
                                <p class="answer_inner" v-if="listItem.group_num === 1" v-html="listItem.answer_content.split('\n').join('<br />')"></p>
                                <div class="btn_area" v-if="listItem.role ==='AS' && index===list.length-1">
                                    <div class="fr">
                                        <button class="white_btn clr_red" @click="answerDelete(listItem.board_id)">답변 삭제</button>
                                        <button class="white_btn clr_blue" @click="modifyClick(index)">답변수정</button>                    
                                    </div>
                                </div>
                            </div>
                            <div class="qna_textare" v-else>
                                <strong v-if="listItem.group_num === 1" style="padding-top:20px;">[답변 - {{ listItem.author_name }}]<span class="refer fr">{{ dateFormat(listItem.create_dt) }}</span></strong>
                                <textarea v-model="listItem.answer_content" placeholder="답변은 최대 1000자까지 등록 가능 합니다." maxlength="1000"></textarea>
                                <button style="display:block; margin:55px auto 10px auto;width:80px;height:40px"  @click="modifySave(index,listItem.board_id,listItem.answer_content)">저장</button>
                                <button style="display:block; margin:10px auto 40px auto;width:80px;height:40px"  @click="modifyCancel(index)">취소</button>
                            </div>
                        </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <h3 class="cont_title">답변 작성</h3>
            <table>
                <colgroup>
                    <col style="width:12%">
                    <col style="width:21.3%">
                    <col style="width:12%">
                    <col style="width:21.3%">
                    <col style="width:12%">
                    <col>
                </colgroup>
                <tbody>
                    <tr v-if="this.list.length===0 || this.list[this.list.length-1].group_num === 0">
                        <th>최종 답변 상태</th>
                        <td>미처리</td>
                        <th>최종 답변자</th>
                        <td>-</td>
                        <th>최종 답변 일시</th>
                        <td>-</td>
                    </tr>
                    <tr v-else>
                        <th>최종 답변 상태</th>
                        <td class="clr_blue">답변완료</td>
                        <th>최종 답변자</th>
                        <td>{{ this.list[this.list.length-1].author_name }}</td>
                        <th>최종 답변 일시</th>
                        <td>{{ dateFormat(this.list[this.list.length-1].create_dt) }}</td>
                    </tr>
                    <tr>
                        <th>답변 작성</th>
                        <td colspan="5">
                            <textarea v-model="answer_content" :placeholder="this.list.length===0 || this.list[this.list.length-1].group_num === 0?'답변은 최대 1000자까지 등록 가능 합니다.':'모든 질문에 대한 답변이 완료되었습니다.'" maxlength="1000" :disabled="!(this.list.length===0 || this.list[this.list.length-1].group_num === 0)"></textarea>
                            <button class="fr btn_answer" @click="writeClick()">답변하기</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="btn_area">
                <button class="fr bgClr_blue" @click="mainClick">목록</button>
                <button class="fl bgClr_red" @click="askAnserDelete()">문의글 삭제</button>
            </div>
        </section>
    </div>
</section>
</template>
<script>
import CSNetwork from '@/utils/CSNetwork.js'
import businessUtils from "@/utils/BusinessUtils.js"
import dateUtils from "@/utils/date.js"
import router from '@/router'

export default {
    data() {
        return {
            list : [],
            question : [],
            answer : [],
            answer_content : '',
            index : 0,
            isModifying : []
        }
    },
    props: {
        board_id: {
            required: true
        }
    },
    computed:{
        allowedIndex (){
            const temp=[]
            let latest_question_index=0
            this.list.forEach((item,index)=>{
                if(item.group_num === 0 ){
                    latest_question_index=index
                }
            })
            for(let i=latest_question_index+1;i<this.list.length;i++){
                temp.push(i)
            }
            return temp;
        }
    },
    created() {
        this.main()
    },
    methods: {
        main: function(){
            CSNetwork.request_qna_detail({board_id: this.board_id})
            .then(data => {
                this.list = data.body
                this.question = this.list[0]
            })
            .catch(err => {
                alert("문제가 발생했습니다.")
                console.log(err)
            })
        },
        dateFormat: function(date) {
            return dateUtils.parser(date)
        },
        modifyClick: function(index){
            this.isModifying.push(index);
        },
        telNumFormat: function(telNum){
            return businessUtils.telNumFormat(telNum)
        },
        mainClick(){
            router.push({name: "serviceqnamain"})
        },
        modifyCancel:function(index){
            if(confirm("수정을 취소하시겠습니까?")){
                this.isModifying = this.isModifying.filter( value => {return index !== value} )
            }
        },
        modifySave(index, board_id, answer_content){
            if(confirm("저장하시겠습니까?")){
                CSNetwork.request_qna_modify({board_id,answer_content})
                .then(() => {
                    this.isModifying=this.isModifying.filter( value => {return index !== value} )
                })
            }
        },
        // 답변 삭제
        answerDelete(board_id) {
            if (confirm("삭제하시겠습니까?")) {
                var params = {
                    group_id : this.list[0].board_id,
                    board_id : board_id
                }
                CSNetwork.request_board_delete(params).then(() => {
                    alert("삭제되었습니다.")
                    this.main()
                })
            }
        },
        // 문의글 삭제
        askAnserDelete() {
            if (confirm("삭제하시겠습니까?")) {
                var params = {
                    board_id : this.list[0].board_id
                }
                CSNetwork.request_group_delete(params).then(() => {
                    alert("삭제되었습니다.")
                    router.push({name: "serviceqnamain"})
                })
            }
        }, 
        writeClick() {
            if(this.list.length===0 || this.list[this.list.length-1].group_num === 0){
                this.adminInfo = this.$store.getters.getAdminInfo
                CSNetwork.request_qna_answer({
                    role           : "AS"
                    , question_type  : this.question.question_type
                    , author_id      : this.adminInfo.admin_user_id
                    , author_name    : this.adminInfo.admin_name
                    , tel            : this.adminInfo.admin_phone_num
                    , answer_content : this.answer_content
                    , group_num      : this.list[0].group_num
                    , group_id       : this.board_id
                })
                .then(() => {
                    alert("정상적으로 등록되었습니다.")
                    this.main()
                    this.answer_content = ''
                })
            }
        }
    }
}
</script>