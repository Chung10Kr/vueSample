<template>
<div>
    <section id="container">
        <div id="content" class="service_admin">
            <section class="cont_header">
                <h2 class="page_title">관리자 관리</h2>
                <span class="page_path">HOME &gt; 서비스 관리 &gt; 관리자 관리</span>
            </section>
            <section class="srch_box" v-on:keyup.enter="searchClick">
                <ul class="srch_option_list">
                    <li>
                        <strong>권한</strong>
                        <select v-model="search.admin_auth">
                            <option value="">전체</option>
                            <option value="0">슈퍼관리자</option>
                            <option value="1">관리자</option>
                        </select>
                    </li>
                    <li>
                        <strong>ID</strong>
                        <input type="text" v-model="search.admin_user_id" maxlength="10">
                    </li>
                    <li>
                        <strong>이름</strong>
                        <input type="text" v-model="search.admin_name" maxlength="10">
                    </li>
                    <li class="colspan">
                        <strong>등록기간</strong>
                        <div class="opt_date">
                            <input type="text" v-model="search.start_dt" id="dateFrom" class="datepicker" readonly autocomplete="off">
                            <span class="swung">~</span>
                            <input type="text" v-model="search.end_dt" id="dateTo" class="datepicker" readonly autocomplete="off">
                        </div>
                    </li>
                </ul>
                <button class="btn srch_btn" @click="searchClick"><i></i>검색</button>
            </section>
            <section class="cont_inner">
                <h3 class="cont_title">관리자 목록</h3>
                <button class="btn cont_btn ico_add" @click="addClick()" v-if="this.$store.getters.getAuthType==='0'"><i></i>신규 등록</button>
                <table>
                    <colgroup>
                        <col style="width: 80px;">
                        <col style="width:150px">
                        <col>
                        <col style="width:150px">
                        <col style="width:200px">
                        <col>
                        <col style="width:200px">
                        <col style="width:200px">
                    </colgroup>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>권한</th>
                            <th>ID</th>
                            <th>이름</th>
                            <th>연락처</th>
                            <th>이메일</th>
                            <th>등록일시</th>
                            <th>수정일시</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(list,index) in admin_list" :key="index" @click="trClick(list.admin_user_id)" style="cursor:pointer">
                            <td>{{ page.total - ((index + page.pageIdx) - 1) }}</td>
                            <td>{{ list.code_name }}</td>
                            <td class="txt_left ellipsis">{{ list.admin_user_id }}</td>
                            <td class="txt_left ellipsis">{{ list.admin_name }}</td>
                            <td>{{ telNumFormat(list.admin_phone_num) }}</td>
                            <td class="txt_left ellipsis">{{ list.admin_email }}</td>
                            <td>{{ dateUtil(list.create_dt) }}</td>
                            <td>{{ dateUtil(list.update_dt) }}</td>
                        </tr>
                        <tr v-if="admin_list.length === 0">
                            <td colspan="8">검색 결과가 없습니다.</td>
                        </tr>
                    </tbody>
                </table>
                <page-component :pageData="page"
                            @onPage="pageClick" 
                            v-if="this.admin_list.length !== 0"
                        />
            </section>
        </div>
    </section>
</div>
</template>

<script>
import CSNetwork from '@/utils/CSNetwork.js'
import dateUtils from "@/utils/date.js"
import localStorageUtils from "@/utils/localStorage.util.js"
import pageComponent from "@/components/board/page"
import businessUtils from "@/utils/BusinessUtils.js"

const $ = window.$

export default {
    name: "service-admin-main",
    components: {
        pageComponent
    },
    data() {
        return {
            page:{
                page  : localStorage.getItem('page'),
                total : localStorage.getItem('total'),
                count : 20
            },
            search: {
                admin_auth   : localStorage.getItem('admin_auth'),
                admin_user_id: localStorage.getItem('admin_user_id'),
                admin_name   : localStorage.getItem('admin_name'),
                start_dt     : localStorage.getItem('start_dt'),
                end_dt       : localStorage.getItem('end_dt'),
                page         : localStorage.getItem('page'),
                count        : localStorage.getItem('count')
            },
            admin_list: []
        }
    },
    created() {
        this.pageLoadHandler(this.page.page)
    },
    mounted() {
        $(function () {
            $('#dateFrom, #dateTo').datepicker({
                dateFormat: 'yy-mm-dd'
            });
        })
        if(this.search.start_dt === null){
            this.search.start_dt = ''
        }
        if(this.search.end_dt === null){
            this.search.end_dt = ''
        }
        if(this.search.admin_name === null){
            this.search.admin_name = ''
        }
        if(this.search.admin_user_id === null){
            this.search.admin_user_id = ''
        }
        if(this.search.admin_auth === null){
            this.search.admin_auth = ''
        }
    },
    methods: {
        dateUtil:function(date){
            return dateUtils.parser(date)
        },
        telNumFormat:function(telNum){
            return businessUtils.telNumFormat(telNum)
        },
        trClick(id) {
            this.$router.push({name: 'serviceadmindetail', query : {admin_user_id : id}})
        },
        addClick() {
            this.$router.push({name: 'serviceadminwrite'})
        },
        searchClick() {
            this.search.page = 1
            this.search.end_dt = $('#dateTo').val();
            this.search.start_dt = $('#dateFrom').val();
            if (!dateUtils.isValidDate(this.search.start_dt, this.search.end_dt)){
                alert("유효하지 않은 날짜입니다.\n날짜간격은 12개월 이내로, 시작일은 종료일보다 앞서서 설정해주세요.")
            }
            else{
                localStorageUtils.set_data(this.search)
                this.pageLoadHandler(this.page.page);
            }
        },
        pageClick(page) {
            this.search.page = page;
            localStorageUtils.set_data(this.search)
            this.pageLoadHandler(page);
        },
        pageLoadHandler(page){
            var params = {
                start_dt      : this.search.start_dt,
                end_dt        : this.search.end_dt,
                admin_name    : this.search.admin_name,
                admin_user_id : this.search.admin_user_id,
                admin_auth    : this.search.admin_auth,
                page          : page,
                count         : this.page.count
            }
            CSNetwork.request_admin_list(params).then((res) => {
                this.admin_list = res.body
                this.page = res.page
                localStorageUtils.set_data(res.page)
            })
        }
    }
}
</script>
