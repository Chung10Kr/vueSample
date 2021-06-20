<template>
<section id="container">
    <div id="content" class="user_general">
        <div class="cont_header">
            <h2 class="page_title">일반 회원</h2>
            <span class="page_path">HOME &gt; 회원관리 &gt; 일반 회원</span>
        </div>
        <div class="srch_box" v-on:keyup.enter="searchClick">
            <ul class="srch_option_list">
                <li class="colspan">
                    <strong>가입기간</strong>
                    <div class="opt_date">
                        <input type="text" id="dateFrom" class="datepicker" readonly autocomplete="off">
                        <span class="swung">~</span>
                        <input type="text" id="dateTo" class="datepicker" readonly autocomplete="off">
                    </div>
                </li>
                <li>
                    <strong>ID</strong>
                    <input type="text" maxlength="10" v-model="search.user_id">
                </li>
                <li>
                    <strong>이름</strong>
                    <input type="text" v-model="search.user_name" maxlength="10">
                </li>
            </ul>
            <button class="btn srch_btn" @click="searchClick"><i></i>검색</button>
        </div>
        <section class="cont_inner">
            <h3 class="cont_title">고객 목록</h3>
            <table>
                <colgroup>
                    <col>
                    <col>
                    <col>
                    <col>
                    <col >
                </colgroup>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>이름</th>
                        <th>연락처</th>
                        <th>가입일시</th>
                        <th>계정상태</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(list,item) in userList" :key="item" @click="trClick(list.USER_ID)" style="cursor:pointer">
                        <td>{{list.USER_ID}}</td>
                        <td>{{list.user_name}}</td>
                        <td>{{list.user_phone_num == '' ? '-'  :  telNumFormat(list.user_phone_num)}}</td>
                        <td>{{dateUtil.parser(list.CREATE_DATE)}}</td>
                        <td v-if="list.user_state === 'stop'" class="clr_red">휴면</td>
                        <td v-else-if="list.user_state === 'non_aprv'" class="clr_red">미승인</td>
                        <td v-else-if="list.user_state === 'delete'" class="clr_gray">탈퇴</td>
                        <td v-else class="clr_gr">정상</td>
                    </tr>
                    <tr v-if="this.flag === true">
                        <td colspan="10">검색 결과가 없습니다.</td>
                    </tr>
                </tbody>
            </table>
        </section>
    </div>
</section>
</template>

<script>
import CSNetwork from '@/utils/CSNetwork.js'
import dateUtil from "@/utils/date.js";
import businessUtils from "@/utils/BusinessUtils.js"
import localStorageUtils from "@/utils/localStorage.util.js"
import XLSX from 'xlsx';
import moment from 'moment';
const $ = window.$

export default {
    components: {
    },
    data() {
        return {
            flag: false         
            , userList : []
            , search: {
                start_dt    : localStorage.getItem('start_dt')
                , end_dt    : localStorage.getItem('end_dt')
                , user_id   : localStorage.getItem('user_id')
                , user_name : localStorage.getItem('user_name')
            }
        }
    },
    created() {
        this.dateUtil = dateUtil;
        this.userListHandler()
    },
    mounted() {
        $(function () {
            $('#dateFrom, #dateTo').datepicker({
                dateFormat: 'yy-mm-dd'
            });
        })
        if(this.search.start_dt === null) {
            this.search.start_dt = ''
        }
        if(this.search.end_dt === null) {
            this.search.end_dt = ''
        }
        if(this.search.user_id === null) {
            this.search.user_id = ''
        }
        if(this.search.user_name === null) {
            this.search.user_name = ''
        }
    },
    methods: {
        telNumFormat:function(telNum){
            return businessUtils.telNumFormat(telNum)
        },
        trClick(user_id) {
            this.$router.push({
                name: 'membergeneraldetail',
                params : {user_id : user_id}
            })
        },
        userListHandler(){
            CSNetwork.request_general_user_list(this.search)
            .then(res => {
                this.userList = res.body
                 if(this.userList[0] === undefined) {
                    this.flag = true
                } else {
                    this.flag = false
                }
            })
        },
        searchClick() {
            this.search.end_dt = $('#dateTo').val();
            this.search.start_dt = $('#dateFrom').val();
            if (!dateUtil.isValidDate(this.search.start_dt, this.search.end_dt)){
                alert("유효하지 않은 날짜입니다.\n날짜간격은 12개월 이내로, 시작일은 종료일보다 앞서서 설정해주세요.");
            }
            else{
                localStorageUtils.set_data(this.search)
            }
        },
    }
}
</script>
