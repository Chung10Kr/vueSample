<template>
<section id="container">
    <div id="content" class="service_notice write">
        <section class="cont_header">
            <h2 class="page_title">공지사항 글쓰기</h2>
            <span class="page_path">HOME &gt; 서비스 관리 &gt; 공지사항 글쓰기</span>
        </section>
        <section class="cont_inner">
            <table style="margin-top: 30px;">
                <colgroup>
                    <col style="width:12%">
                    <col>
                    <col style="width:12%">
                    <col>
                </colgroup>
                <tbody>
                    <tr>
                        <th>공지 대상</th>
                        <td colspan="3">
                            <select name="" id="" v-model="formData.notice_target" style="width:240px;">
                                <option value="Common">공통</option>
                                <option value="NC">고객사</option>
                                <option value="NN">일반</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th>공지 언어</th>
                        <td colspan="3">
                            <select name="" id="" v-model="formData.notice_lang" style="width:240px;">
                                <option value="ko">한국어</option>
                                <option value="en">영어</option>
                                <option value="zh-CN">중국어</option>
                                <option value="ja">일본어</option>
                            </select>
                        </td>
                    </tr>   
                    <tr>
                        <th>공지 노출 구분</th>
                        <td>
                            <select name="" id="" v-model="formData.notice_type" style="width:240px;" @change="targetChange">
                                <option value="0">일반 공지</option>
                                <option value="1">중요 공지</option>
                            </select>
                        </td>
                        <th>중요 공지 노출 기간</th>
                        <td>
                            <div class="opt_date">
                                <input type="text" name="" id="dateFrom" class="datepicker" readonly autocomplete="off" :disabled="formData.notice_type!=='1'">
                                <span class="swung">~</span>
                                <input type="text" name="" id="dateTo" class="datepicker" readonly autocomplete="off" :disabled="formData.notice_type!=='1'">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>제목</th>
                        <td colspan="3"><input type="text" name="" id="" v-model="formData.notice_title" maxlength="50"></td>
                    </tr>
                    <tr>
                        <th>내용</th>
                        <td colspan="3">
                            <textarea name="" id="" cols="30" rows="10" style="height:500px;" v-model="formData.notice_content" maxlength="5000"></textarea>
                        </td>
                    </tr>
                    <tr>
                        <th>첨부파일</th>
                        <td colspan="3">
                            <input type="file" multiple name="" id="" @change="fileUpload($event)"><span class="refer">※ 첨부 파일은 최대 5개 등록 가능합니다. 첨부파일의 용량은 10MB를 초과할 수 없습니다.</span>
                            <div class="file_list" v-for="(list, index) in formData.fileList" :key="index">
                                <p>{{ list.name }} <button @click="fileDelete(index)">삭제</button></p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="btn_area">
                <button class="white_btn" @click="cancelClick">취소</button>
                <button class="srch_btn" @click="saveClick">저장</button>
            </div>
        </section>
    </div>
</section>
</template>

<script>
import CSNetwork from '@/utils/CSNetwork.js'
import dateUtil from "@/utils/date.js"
const $ = window.$

export default{
    data(){
        return{
            formData:{
                notice_target : "Common",
                notice_type : "0",
                notice_lang : "ko",
                notice_title : "",
                notice_content : "",
                notice_start_dt : "",
                notice_end_dt : "",
                creator_name : this.$store.getters.getAdminInfo.admin_name,
                creator_id : this.$store.getters.getAdminInfo.admin_user_id,
                fileList : [],
            }
        }
    },
    mounted() {
        $('#dateFrom').datepicker({
            dateFormat: 'yy-mm-dd',
            onSelect: this.setDateFromValue,
        });
        $('#dateTo').datepicker({
            dateFormat: 'yy-mm-dd',
            onSelect: this.setDateToValue,
        });
    },
    methods: {
        setDateFromValue(value){
            this.formData.notice_start_dt = value;
        },
        setDateToValue(value){
            this.formData.notice_end_dt = value;
        },
        targetChange(){
            $.datepicker._clearDate('#dateFrom');
            $.datepicker._clearDate('#dateTo');
        },
        fileUpload(event){
            for(let i=0; i<event.target.files.length; i++){
                if(this.formData.fileList.length<5 && event.target.files[i].size<=10485760){
                    this.formData.fileList.push(event.target.files[i]);
                }
            }
        },
        fileDelete(index){
            this.formData.fileList.splice(index, 1);
        },
        cancelClick(){
            this.$router.push({name : "servicenoticemain"})
        },
        saveClick(){
            if(this.formData.notice_title.length===0){
                alert("제목을 작성해주세요.")
            }
            else if(this.formData.notice_content.length===0){
                alert("내용을 작성해주세요.")
            }
            else if(this.formData.notice_target==="" || this.formData.notice_type==="" || this.formData.notice_lang===""){
                alert("구분을 확인해주세요.")
            }
            else if(this.formData.notice_type==="1" && (this.formData.notice_start_dt==="" || this.formData.notice_end_dt==="")){
                alert("중요 공지 노출 기간을 설정해주세요.")
            }
            else if(this.formData.notice_type==="1" && !dateUtil.isValidDate(this.formData.notice_start_dt, this.formData.notice_end_dt)){
                alert("중요 공지 노출 기간이 유효하지 않은 날짜입니다.\n시작일은 종료일보다 앞서서 설정해주세요.")
            }
            else{
                const form = new FormData();
                form.append("notice_type", this.formData.notice_type);
                form.append("notice_target", this.formData.notice_target);
                form.append("notice_lang", this.formData.notice_lang);
                form.append("notice_title", this.formData.notice_title);
                form.append("notice_content", this.formData.notice_content);
                form.append("notice_start_dt", this.formData.notice_start_dt);
                form.append("notice_end_dt", this.formData.notice_end_dt);
                form.append("creator_name", this.formData.creator_name);
                form.append("creator_id", this.formData.creator_id);
                for(let i=0; i<this.formData.fileList.length; i++) {
                    form.append("fileList", this.formData.fileList[i]);
                }

                CSNetwork.request_notice_write(form, {
                    headers: {
                        'Content-Type' : 'multipart/form-data'
                    }
                })
                .then(()=>{
                    alert("공지사항 작성이 완료되었습니다.")
                    this.$router.push({name : "servicenoticemain"})
                })
                .catch(err=>{
                    alert("작성 중 오류가 발생했습니다.")
                    console.log(err)
                })
            }
        }
    }
}
</script>
