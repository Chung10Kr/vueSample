<template>
<section id="container">
    <div id="content" class="service_notice">
        <section class="cont_header">
            <h2 class="page_title">공지사항</h2>
            <span class="page_path">HOME &gt; 서비스 관리 &gt; 공지사항</span>
        </section>
        <section class="srch_box" v-on:keyup.enter="searchClick">
            <ul class="srch_option_list option4">
                <li>
                    <strong>구분</strong>
                    <select v-model="search.notice_target">
                        <option value="ALL">전체</option>
                        <option value="Common">공통</option>
                        <option value="NC">고객사</option>
                        <option value="NN">일반</option>
                    </select>
                </li>
                <li>
                    <strong>언어</strong>
                    <select v-model="search.notice_lang">
                        <option value="AllLang">전체</option>
                        <option value="ko">한국어</option>
                        <option value="en">영어</option>
                        <option value="zh-CN">중국어</option>
                        <option value="ja">일본어</option>
                    </select>
                </li>
                <li style="width: 40%">
                    <strong>제목 or 내용</strong>
                    <input v-model="search.notice_title" type="text" autocomplete="off" maxlength="10">
                </li>
            </ul>
            <button class="btn srch_btn" @click="searchClick"><i></i>검색</button>
        </section>
        <section class="cont_inner">
            <h3 class="cont_title">공지사항 목록</h3>
            <button class="btn cont_btn ico_add" @click="writeClick"><i></i>글쓰기</button>
            <table>
                <colgroup>
                    <col style="width: 80px">
                    <col style="width:100px">
                    <col style="width:100px">
                    <col>
                    <col style="width:200px">
                    <col style="width:200px">
                    <col style="width:150px">
                    <col style="width:80px">
                    <col style="width:100px">
                </colgroup>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>구분</th>
                        <th>언어</th>
                        <th>제목</th>
                        <th>중요공지 노출기간</th>
                        <th>작성일시</th>
                        <th>작성자</th>
                        <th>조회수</th>
                        <th>게시상태</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(list, item) in noticeList" :key="list.notice_id" @click="trClick(list.notice_id)">
                        <td>{{page.total - ((item + page.pageIdx) - 1)}}</td>
                        <td>{{list.notice_target | typeToTarget}}</td>
                        <td>{{list.notice_lang | typeToLang}}</td>
                        <td class="txt_left ellipsis"><span class="badge import" v-if="list.notice_type==='1'">중요</span>{{list.notice_title}}</td>
                        <td><p v-if="list.notice_type==='1'">{{dateUtil.parseDate(list.notice_start_dt)}} ~ {{dateUtil.parseDate(list.notice_end_dt)}}</p></td>
                        <td>{{dateUtil.parser(list.create_dt)}}</td>
                        <td>{{list.creator_name}}</td>
                        <td>{{list.view_count}}</td>
                        <td v-if="list.close_dt === undefined">
                            게시 중
                        </td>
                        <td v-else-if="list.close_dt !== undefined">
                            게시 중단
                        </td>
                    </tr>
                    <tr>
                        <td v-if="noticeList.length==0" colspan="7">검색 결과가 없습니다.</td>
                    </tr>
                </tbody>
            </table>
            <page-component :pageData="page" @onPage="pageClick"></page-component>
        </section>
    </div>
</section>
</template>
<script>
import CSNetwork from '@/utils/CSNetwork.js'
import pageComponent from "@/components/board/page"
import dateUtil from "@/utils/date.js"
import businessUtils from "@/utils/BusinessUtils.js"

const $ = window.$

export default{
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
            search:{
                notice_target:"ALL",
                notice_lang : "AllLang",
                notice_content : "",
                notice_title : "",
                page: 1,
                count: 20,
            },
            noticeList : []
        }
    },
    created(){
        this.pageLoadHandler();
        this.dateUtil=dateUtil;
    },
    mounted() {
        $(function () {
            $('#dateFrom, #dateTo').datepicker({
                dateFormat: 'yy-mm-dd'
            });
        })
    },
    filters:{
        typeToTarget(type){
            return businessUtils.getNoticeTarget(type)
        },
        typeToLang(type){
            return businessUtils.getNoticeLang(type)
        }
    },
    methods : {
        indexCalculator(index){
            const result=this.page.total-(this.page.count)*(this.page.page-1)-index
            if(result>0){
                return result
            }
            else{
                return ""
            }
        },
        searchClick() {
            this.search.page = 1
            this.search.notice_content=this.search.notice_title;
            this.pageLoadHandler();
        },
        pageClick(pageNum) {
            this.page.page=pageNum;
            console.log(pageNum)
            this.pageLoadHandler();
        },
        trClick(id){
            this.$router.push({name:'servicenoticedetail', params:{notice_id : id}})
        },
        writeClick(){
            this.$router.push({name:'servicenoticewrite'})
        },
        pageLoadHandler(){
            CSNetwork.request_notice_list({
                    notice_lang  : this.search.notice_lang,
                    notice_target    : this.search.notice_target,
                    notice_title    : this.search.notice_title,
                    notice_content  : this.search.notice_content,
                    page            : this.page.page,
                    count           : this.page.count
            })
            .then(data => {
                    this.noticeList=data.body;
                    this.page=data.page;
                    console.log(data);
            })
            .catch(err=>{
                console.log(err);
                alert("문제가 발생했습니다.");
            })
        }
    }

}
</script>
