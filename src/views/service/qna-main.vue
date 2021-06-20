<template>
<section id="container">
    <div id="content" class="service_qna">
        <section class="cont_header">
            <h2 class="page_title">고객 문의</h2>
            <span class="page_path">HOME &gt; 서비스 관리 &gt; 고객 문의</span>
        </section>
        <section class="srch_box">
            <ul class="srch_option_list option5">
                <li class="half">
                    <strong>구분</strong>
                    <select v-model="search.role" @change="changeSearchCateg">
                        <option value="">전체</option>
                        <option value="NQ">일반</option>
                        <option value="DQ">기사</option>
                        <option value="CQ">고객사</option>
                    </select>
                </li>
                <li class="half">
                    <strong>문의유형</strong>
                    <select v-model="search.question_type">
                        <option value="">전체</option>
                        <option v-for="(item, index) in categList" :key="index" :value="item.code_id">{{item.code_name}}</option>
                    </select>
                </li>
                <li class="colspan">
                    <strong>조회 기간</strong>
                    <div class="opt_date">
                        <input type="text" id="dateFrom" class="datepicker" autocomplete="off" v-model="search.start_dt">
                        <span class="swung">~</span>
                        <input type="text" id="dateTo" class="datepicker" autocomplete="off" v-model="search.end_dt">
                    </div>
                </li>
                <li class="colspan">
                    <strong>문의 제목</strong>
                    <input type="text" autocomplete="off" v-model="search.question_title">
                </li>
                <li class="half">
                    <strong>답변 유무</strong>
                    <select v-model="search.answer_status">
                        <option value="">전체</option>
                        <option value="1">답변완료</option>
                        <option value="0">미처리</option>
                    </select>
                </li>
            </ul>
            <button class="btn srch_btn" @click="searchClick()"><i></i>검색</button>
        </section>
        <section class="cont_inner">
            <h3 class="cont_title">문의 목록</h3>
            <button class="btn cont_btn srch_btn ico_exsel" @click="excelDownload()"><i>엑셀</i>다운로드</button>
                <table>
                <colgroup>
                    <col style="width: 80px">
                    <col style="width:100px">
                    <col style="width:120px">
                    <col>
                    <col style="width:190px">
                    <col style="width:190px">
                    <col style="width:120px">
                    <col style="width:100px">
                    <col style="width:120px">
                    <col style="width:190px">
                </colgroup>
                <thead>
                    <tr>
                        <th rowspan="2">번호</th>
                        <th rowspan="2">구분</th>
                        <th colspan="5">문의 정보</th>
                        <th colspan="3">최종 답변 정보</th>
                    </tr>
                    <tr>
                        <th>문의유형</th>
                        <th>제목</th>
                        <th>최초 문의 일시</th>
                        <th>최종 문의 일시</th>
                        <th>고객명</th>
                        <th>답변유무</th>
                        <th>답변자</th>
                        <th>답변 일시</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(list,item) in qnaList" :key="list.board_id" @click="trClick(list.board_id)">
                        <td>{{indexCalculator(item)}}</td>
                        <td>{{ qaRoleFormat(list.role) }}</td>
                        <td>{{ list.question_type}}</td>
                        <td class="txt_left ellipsis">{{ list.question_title}}</td>
                        <td>{{ dateUtil(list.create_dt) }}</td>
                        <td>{{ dateUtil(list.latest_dt) }}</td>
                        <td>{{ list.author_name }}</td>
                        <td v-if="list.answer_status === 1" class="clr_blue">답변 완료</td>
                        <td v-else>미처리</td>
                        <td v-if="list.answer_status === 1" >{{ list.answer_name }}</td>
                        <td v-else>-</td>
                        <td v-if="list.answer_status === 1" >{{ dateUtil(list.answer_dt) }}</td>
                        <td v-else>-</td>
                    </tr>
                    <tr v-if="qnaList.length === 0">
                        <td colspan="10">검색 결과가 없습니다.</td>
                    </tr>
                </tbody>
                </table>
                <!-- 엑셀 다운로드용 테이블  -->
                <table id="table" style="display : none">
                    <colgroup>
                        <col style="width: 80px">
                        <col style="width:100px">
                        <col style="width:120px">
                        <col>
                        <col style="width:190px">
                        <col style="width:190px">
                        <col style="width:120px">
                        <col style="width:100px">
                        <col style="width:120px">
                        <col style="width:190px">
                    </colgroup>
                    <thead>
                        <tr>
                            <th rowspan="2">번호</th>
                            <th rowspan="2">구분</th>
                            <th colspan="5">문의 정보</th>
                            <th colspan="3">최종 답변 정보</th>
                        </tr>
                        <tr>
                            <th>문의유형</th>
                            <th>제목</th>
                            <th>최초 문의 일시</th>
                            <th>최종 문의 일시</th>
                            <th>고객명</th>
                            <th>답변유무</th>
                            <th>답변자</th>
                            <th>답변 일시</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(list,item) in excelList" :key="list.board_id">
                            <td>{{indexCalculator(item)}}</td>
                            <td>{{ qaRoleFormat(list.role) }}</td>
                            <td>{{ list.question_type}}</td>
                            <td>{{ list.question_title}}</td>
                            <td>{{ dateUtil(list.create_dt) }}</td>
                            <td>{{ dateUtil(list.latest_dt) }}</td>
                            <td>{{ list.author_name }}</td>
                            <td v-if="list.answer_status === 1" class="clr_blue">답변 완료</td>
                            <td v-else>미처리</td>
                            <td v-if="list.answer_status === 1" >{{ list.answer_name }}</td>
                            <td v-else>-</td>
                            <td v-if="list.answer_status === 1" >{{ dateUtil(list.answer_dt) }}</td>
                            <td v-else>-</td>
                        </tr>
                    </tbody>
                </table>
                <!--// 엑셀 다운로드용 테이블  -->
            <page-component :pageData="page" @onPage="pageClick" ></page-component>
        </section>
    </div>
</section>
</template>

<script>
import pageComponent from "@/components/board/page"
import businessUtils from "@/utils/BusinessUtils.js"
import CSNetwork from '@/utils/CSNetwork.js'
import dateUtil from "@/utils/date.js"
import XLSX from 'xlsx';
import moment from 'moment';

const $ = window.$

export default {
    components: {
        pageComponent
    },
    data() {
        return {
            page:{
                page:1,
                total:1,
                count:20
            },
            categList:[],
            qnaList : [],
            excelList : [],
            search: {
                page:"",
                total:"",
                count:"",
                role:"",
                question_type: "",
                question_title : "",
                answer_status: "",
                start_dt: "",
                end_dt: ""
            }
        }
    },
    created(){
        this.changeSearchCateg();
        this.pageLoadHandler(this.page.page);
    },
    mounted(){
        $(function(){
            $('#dateFrom, #dateTo').datepicker({
                dateFormat: 'yy-mm-dd'
            });
        })
    },
    methods: {
        changeSearchCateg(){
            CSNetwork.request_syscode_list({code_categ: this.$syscode.TYPE_QNA, code_id: "QA_" + this.search.role})
            .then(data=>{
                this.categList = data.body;
            })
        },
        qaRoleFormat(role) {
            return businessUtils.getQnaRole(role)
        },
        indexCalculator(index){
            const result=this.page.total-(this.page.count)*(this.page.page-1)-index
            if(result>0){
                return result
            }
            else{
                return ""
            }
        },
        dateUtil:function(date){
            return dateUtil.parser(date)
        },
        telNumFormat:function(telNum){
            return businessUtils.telNumFormat(telNum)
        },
        searchClick() {
            this.search.page = 1
            this.search.end_dt = $('#dateTo').val();
            this.search.start_dt = $('#dateFrom').val();
            if (!dateUtil.isValidDate(this.search.start_dt, this.search.end_dt)){
                alert("유효하지 않은 날짜입니다.\n날짜간격은 12개월 이내로, 시작일은 종료일보다 앞서서 설정해주세요.")
            }
            else{
                this.pageLoadHandler(1);
            }
        },
        pageClick(page) {
            this.search.page = page;
            this.pageLoadHandler(page);
        },
        trClick(board_id) {
            this.$router.push({
                name: 'serviceqnadetail',
                params : {board_id : board_id}
            })
        },
        pageLoadHandler(){
            this.search.page = this.page.page;
            this.search.total = this.page.total;
            this.search.count = this.page.count;
            CSNetwork.request_qna_list(this.search)
            .then(data=>{
                this.qnaList = data.body
                this.page = data.page
                this.page.pageIdx = data.page.pageIdx
            })
            .catch(err=>{
                console.log(err);
            })
        },
        excelDownload: function(type, fn, dl) {
            CSNetwork.request_qna_list_excel(this.search)
            .then(data=>{
                    this.excelList = data.body;
                    return this.$nextTick()
            })
            .then(() => {
                this.title = 'Q&A 목록'+moment().format('YYYYMMDDHHMMSS')+'.'
                var elt = document.getElementById('table');
                var wb = XLSX.utils.table_to_book(elt, {sheet:"Sheet JS"});
                return dl ?
                XLSX.write(wb, {bookType:type, bookSST:true, type: 'base64'}) :
                XLSX.writeFile(wb, fn || (this.title + (type || 'xlsx')));
            })
            .catch(err=>{
                console.log(err);
            })
        }
    }
}
</script>
