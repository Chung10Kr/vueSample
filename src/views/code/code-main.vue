<template>
<section id="container">
    <div id="content" class="user_client">
        <div class="cont_header">
            <h2 class="page_title">코드 관리</h2>
            <span class="page_path">HOME &gt; 코드관리</span>
        </div>
        
        <div class="srch_box" v-on:keyup.enter="searchClick">
        </div>

        <section class="cont_inner">
            <h3 class="cont_title">코드 등록</h3>
            <table id="table">
                <colgroup>
                    <col style="width: 30%;">
                    <col style="width: 30%;">
                    <col style="width: 30%;">
                    <col style="width: auto;">
                </colgroup>
                <thead>
                    <tr>
                        <th>정렬순서</th>
                        <th>코드값</th>
                        <th>코드명</th>
                        <th>비고</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <input type="text" ref="ordrNo" name="ordrNo" id="ordrNo" class="createForm" style="margin-right:10px" />
                        </td>
                        <td>
                            <input type="text" ref="code" name="code" id="code" class="createForm" style="margin-right:10px" />
                        </td>
                        <td>
                            <input type="text" ref="codeMm" name="codeMm" id="codeMm" class="createForm" style="margin-right:10px" />
                        </td>
                        <td>
                            <button class="bgClr_blue" style="margin-right:10px;" id="codeUpd" @click="createBtn()">등록</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <h3 class="cont_title">코드 목록</h3>
            <button class="btn srch_btn fr MgB5" @click="initSearchList"><i></i>초기화</button>
            <table>
                <colgroup>
                    <col style="width: 7%;">
                    <col style="width: 15%;">
                    <col style="width: 25%;">
                    <col style="width: 25%;">
                    <col style="width: 10%;">
                    <col style="width: auto;">
                </colgroup>
                <thead>
                    <tr>
                        <th>정렬순서</th>
                        <th>코드 타입</th>
                        <th>코드값</th>
                        <th>코드명</th>
                        <th>사용여부</th>
                        <th>비고</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(list,item) in formData" :key="item" >
                        <td>
                            <input type="hidden" class="item_code_id" :value="list.code_id" />
                            <input type="hidden" class="item_code_type" :value="list.code_type" />
                            <input type="text" class="item_ordr_no" :value="list.ordr_no" />
                        </td>
                        <td @click="innerClick(list.code_id)" >{{list.code_type}}</td>
                        <td @click="innerClick(list.code_id)" >{{list.code}}</td>
                        <td>
                            <input type="text" class="item_code_nm" :value="list.code_nm" />
                        </td>
                        <td>
                            <select v-model="list.use_yn" class="item_use_yn" >
                                <option v-for="(item2, index) in useYnList" :key="index" :value="item2.code">{{item2.code_nm}}</option>
                            </select>    
                        </td>
                        <td>
                            <button class="bgClr_blue" style="margin-right:10px;" id="codeUpd" @click="updClick(item)">수정</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            
        </section>
    </div>
</section>
</template>

<script>
import CSNetwork from '@/utils/CSNetwork.js'
import localStorageUtils from "@/utils/localStorage.util.js"
const $ = window.$

export default {
    cur_codeType:'',
    data() {
        return {
            useYnList:[],
            formData: {
                code_id:'',
                code_type:'',
                code:'',
                code_nm:'',
                ordr_no:'',
                use_yn:''
            },
            
        }
    },
    created() {
        this.pageLoadHandler( 'MAIN' );
        this.cur_codeType = 'MAIN';
        this.searchUserYn();
    },
    mounted() {
        $(function () {
            
        })
    },
    methods: {
        innerClick(code_id) {
            this.cur_codeType = code_id;
            this.pageLoadHandler(code_id);
        },
        pageLoadHandler(code_type){
            CSNetwork.request_code_list({code_type: code_type})
            .then(data=>{
                this.formData = data.body;
            })
        },
        initSearchList(){
            this.cur_codeType = 'MAIN'
            this.pageLoadHandler( 'MAIN' );
        },
        searchUserYn(){
            CSNetwork.request_code({code_type:'7'})
            .then(data=>{
                this.useYnList = data.body;
            })
        },
        updClick(index){
            var param = {
                mode : 'U' ,
                code : '',
                code_nm : $(".item_code_nm:eq("+index+")").val(),
                ordr_no : $(".item_ordr_no:eq("+index+")").val(),
                code_type : $(".item_code_type:eq("+index+")").val(),
                code_id : $(".item_code_id:eq("+index+")").val(),
                use_yn:  $(".item_use_yn:eq("+index+")").val(),
            };
            CSNetwork.request_code_modify(param)
            .then(data=>{
                this.formData = data.body;
            })
        },
        createBtn(){
            var param = {
                mode : 'C' ,
                code : $("#code").val(),
                code_nm : $("#codeMm").val(),
                ordr_no : $("#ordrNo").val(),
                code_type : this.cur_codeType,
                code_id : null,
                use_yn:'Y'
            };
            CSNetwork.request_code_modify(param)
            .then(data=>{
                this.formData = data.body;
                $(".createForm").val("");
            })
            
        }
    }
}
</script>
