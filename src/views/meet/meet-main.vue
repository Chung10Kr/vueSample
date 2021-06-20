<template>
<section id="container">
    <div id="content" class="">
        <div class="cont_header">
            <h2 class="page_title">모임 관리</h2>
            <span class="page_path">HOME &gt; 모임관리</span>
        </div>
        
        <div class="srch_box" v-on:keyup.enter="searchClick(1)">
            <ul class="srch_option_list">
                <li>
                    <strong>분류</strong>
                    <select v-model="search.p_meet_type">
                        <option value="">전체</option>
                        <option v-for="(list,item) in typeList" :key="item" :value="list.code">
                            {{list.code_nm}}
                        </option>
                    </select>
                </li>
                <li>
                    <strong>카테고리</strong>
                    <select v-model="search.p_meet_cate">
                        <option value="">전체</option>
                        <option v-for="(list,item) in cateList" :key="item" :value="list.code">
                            {{list.code_nm}}
                        </option>
                    </select>
                </li>
                <li>
                    <strong>모임 상태</strong>
                    <select v-model="search.p_meet_status">
                        <option value="">전체</option>
                        <option v-for="(list,item) in stateList" :key="item" :value="list.code">
                            {{list.code_nm}}
                        </option>
                    </select>
                </li>
                <li>
                    <strong>모임명</strong>
                    <input type="text" v-model="search.p_meet_nm" maxlength="10">
                </li>
            </ul>
            <button class="btn srch_btn"  @click="searchClick(1)"><i></i>검색</button>

        </div>
                  
        <h3 class="cont_title">모임 목록</h3>
        <table>
            <colgroup>
                <col style="width: 10%;">
                <col style="width: 15%;">
                <col style="width: 40%;">
                <col style="width: 15%;">
                <col style="width: auto;">
            </colgroup>
            <thead>
                <tr>
                    <th class="AC">타입</th>
                    <th class="AC">카테고리</th>
                    <th class="AC">모임명</th>
                    <th class="AC">상태</th>
                    <th class="AC">생성일자</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(list,item) in meetList" :key="item" @click="viewDetail(list.meet_id)" style="cursor:pointer">
                    <td class="AC">{{list.meet_type_nm}}</td>
                    <td class="AC">{{list.meet_cate_nm}}</td>
                    <td class="AC">{{list.meet_name}}</td>
                    <td class="AC">{{list.meet_status_nm}}</td>
                    <td class="AC">{{list.create_date}}</td>
                </tr>
            </tbody>
        </table>
        <page-component :pageData="search"
                        @onPage="pageClick"
                        v-if="this.meetList.length !== 0"
                    />
        
    </div>
</section>
</template>

<script>
import CSNetwork from '@/utils/CSNetwork.js'
import localStorageUtils from "@/utils/localStorage.util.js"
import pageComponent from "@/components/board/page"
import router from '@/router'

const $ = window.$;

export default {
    components: {
        pageComponent
    },
    data() {
        return {
            cateList:[],
            typeList:[],
            meetList:[],  
            stateList:[],
            search:{
                page       :1,
                count      :10,
                total      :0,
                p_meet_type: localStorage.getItem('p_meet_type')||'',
                p_meet_cate: localStorage.getItem('p_meet_cate')||'',
                p_meet_status: localStorage.getItem('p_meet_status')||'',
                p_meet_nm: localStorage.getItem('p_meet_nm')||''
            },
                     
        }
    },
    created() {
        this.getCodeData( '16' ); //분류
        this.getCodeData( '43' ); //카테고리
        this.getCodeData( '71' ); //모임상태
        
        this.pageLoadHandler( localStorageUtils.get_data("page") || 1 );
    },
    mounted() {
        $(function () {
            
        })
    },
    methods: {
        getCodeData(code_type){
            CSNetwork.request_code({code_type:code_type})
                .then(data=>{
                    if( code_type =="43" ) this.cateList = data.body;
                    if( code_type =="16" ) this.typeList = data.body;
                    if( code_type =="71" ) this.stateList = data.body;
                })
        },
        searchClick(){
            this.pageLoadHandler(1);
        },
        pageClick(page) {
            
            this.pageLoadHandler(page);
        },
        pageLoadHandler(page){
            this.search.page = page;
            
            CSNetwork.request_meet_list( this.search )
            .then(data=>{
                this.meetList = data.body.resultList;
                this.search.total = data.body.totalCnt;
            })
        },
        viewDetail(meetId){
            localStorageUtils.set_data(this.search)
            router.push({name: 'ServiceMeetEdit', params : {meet_id : meetId}})
        }
    }
}
</script>
