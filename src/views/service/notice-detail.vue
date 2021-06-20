<template>
<section id="container">
    <div id="content" class="service_notice detail">
        <section class="cont_header">
            <h2 class="page_title">공지사항 상세</h2>
            <span class="page_path">HOME &gt; 서비스 관리 &gt; 공지사항 상세</span>
        </section>
        <section class="cont_inner">
            <table style="margin-top: 30px;">
                <colgroup>
                    <col style="width:12%">
                    <col>
                    <col style="width:12%">
                    <col>
                    <col style="width:12%">
                    <col>
                    <col style="width:12%">
                    <col>
                </colgroup>
                <tbody>
                    <tr>
                        <th>공지 대상</th>
                        <td>{{noticeDetail.notice_target | typeToTarget}}</td>
                        <th>공지노출 구분</th>
                        <td>{{noticeDetail.notice_type | typeToString}}</td>
                        <th>중요공지 노출기간</th>
                        <td>
                            <p v-if="noticeDetail.notice_type==='1'">{{dateUtil.parseDate(noticeDetail.notice_start_dt)}} ~ {{dateUtil.parseDate(noticeDetail.notice_end_dt)}}</p>
                        </td>
                        <th>게시상태</th>
                        <td v-if="noticeDetail.close_dt === undefined">
                            게시 중
                        </td>
                        <td v-else-if="noticeDetail.close_dt !== undefined">
                            게시 중단
                        </td>
                    </tr>
                    <tr>
                        <th>제목</th>
                        <td colspan="7"><span class="badge import" v-if="noticeDetail.notice_type==='1'">중요</span>{{noticeDetail.notice_title}}</td>
                    </tr>
                    <tr>
                        <th>작성자</th>
                        <td>{{noticeDetail.creator_name}}</td>
                        <th>등록일시</th>
                        <td>{{dateUtil.parser(noticeDetail.create_dt)}}</td>
                        <th>수정일시</th>
                        <td>{{dateUtil.parser(noticeDetail.update_dt)}}</td>
                        <th>조회수</th>
                        <td>{{noticeDetail.view_count}}</td>
                    </tr>
                    <tr>
                        <th>내용</th>
                        <td colspan="7" class="form_inp">
                            <p class="qna_textare" v-html="noticeDetail.notice_content"></p>
                        </td>
                    </tr>
                    <tr>
                        <th>첨부파일</th>
                        <td colspan="7">
                            <button class="ico_down" v-if="noticeDetail.add_file1_url!=null" @click="fileDownload(noticeDetail.add_file1_url)"><i></i>{{noticeDetail.add_file1_url.split('/')[2]}}</button>
                            <button class="ico_down" v-if="noticeDetail.add_file2_url!=null" @click="fileDownload(noticeDetail.add_file2_url)"><i></i>{{noticeDetail.add_file2_url.split('/')[2]}}</button>
                            <button class="ico_down" v-if="noticeDetail.add_file3_url!=null" @click="fileDownload(noticeDetail.add_file3_url)"><i></i>{{noticeDetail.add_file3_url.split('/')[2]}}</button>
                            <button class="ico_down" v-if="noticeDetail.add_file4_url!=null" @click="fileDownload(noticeDetail.add_file4_url)"><i></i>{{noticeDetail.add_file4_url.split('/')[2]}}</button>
                            <button class="ico_down" v-if="noticeDetail.add_file5_url!=null" @click="fileDownload(noticeDetail.add_file5_url)"><i></i>{{noticeDetail.add_file5_url.split('/')[2]}}</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="btn_area">
                <button class="fl bgClr_blue" @click="listClick">목록</button>
                <div class="fr">
                    <button class="btn bgClr_red" @click="deleteClick">삭제</button>
                    <button class="btn bgClr_blue" @click="postCloseClick">게시중단</button>
                    <button class="btn " @click="updateClick">수정</button>
                </div>
            </div>
        </section>
    </div>
</section>
</template>
<script>
import dateUtil from '@/utils/date'
import CSNetwork from '@/utils/CSNetwork.js'

export default{
    data(){
        return{
            noticeDetail:{}
        }
    },
    computed:{
        isAuthor(){
            if(this.$store.getters.getAuthType === "0" || this.noticeDetail.creator_id===this.$store.getters.getAdminInfo.admin_user_id){
                return true;
            } else{
                return false;
            }
        }
    },
    created(){
        this.dateUtil=dateUtil;
        this.notice_id=this.$route.params.notice_id;

        CSNetwork.request_notice_detail({notice_id : this.notice_id})
        .then(data=>{
            this.noticeDetail = this.changeLinkUrl(data);
        })
        .catch(err=>{
            alert("공지사항 조회 중 오류가 발생했습니다!")
            console.log(err)
            this.$router.push({name:"servicenoticemain"})
        })
    },
    filters:{
        typeToTarget(type){
            switch(type){
                case 'Common' :
                    return "공통"
                case 'NC' :
                    return "고객사"
                case 'NN' :
                    return "일반"
            }
        },
        typeToString(type){
            switch(type){
                case '0' :
                    return "일반 공지"
                case '1' :
                    return "중요 공지"
            }
        }
    },
    methods:{
        checkUrlregexp(){
            let re = /(http(s)?:\/\/|www.)([a-z0-9\w]+\.*)+[a-z0-9]{2,4}([\\/a-z0-9-%#?&=\w])+(\.[a-z0-9]{2,4}(\?[\\/a-z0-9-%#?&=\w]+)*)*/gi
            return re;
        },
        changeLinkUrl(data){
            let linkUrl=[];
            data.body.notice_content.replace(this.checkUrlregexp(), function(n){
                let checkLinkUrl = true;
                for(let i=0; i<linkUrl.length; i++) {
                    if(n === linkUrl[i]){
                        checkLinkUrl = false;
                        break;
                    }
                }
                if(checkLinkUrl === true) {
                    linkUrl.push(n)
                }
            });

            let stringContent = JSON.stringify(data.body.notice_content);
            if(linkUrl.length!=0){
                for(let i=0; i<linkUrl.length; i++) {
                    stringContent = stringContent.replace(new RegExp(linkUrl[i], "gi"), `<a href="${linkUrl[i]}">${linkUrl[i]}</a>`);
                }
                stringContent = stringContent.replace(/\\n/g, '<br/>');
                stringContent = stringContent.slice(1, stringContent.length-1);
                data.body.notice_content = stringContent;
            }

            return data.body;
        },
        fileDownload(fileUrl){
          console.log(fileUrl)
            CSNetwork.request_notice_file_download({
                fileUrl : fileUrl,
            })
            .then(response=>{
                console.log(response)
                const url = window.URL.createObjectURL(new Blob([response.data], {type: response.headers['content-type']}));
                const link = document.createElement('a');
                link.href=url;
                link.setAttribute('download', fileUrl.split('/')[2]);
                document.body.appendChild(link);
                link.click();
            })
        },
        listClick(){
            this.$router.push({name:"servicenoticemain"})
        },
        postCloseClick(){
            if(!this.isAuthor){
                alert("게시중단은 작성자만 가능합니다.")
            }
            else if(confirm("게시중단 하시겠습니까?")){
                CSNetwork.request_notice_close({notice_id : this.notice_id})
                .then( () => {
                    alert("게시중단 되었습니다.")
                    this.$router.push({name:"servicenoticemain"})
                })
                .catch(err=>{
                    alert("게시중단 중 오류가 발생했습니다.")
                    console.log(err)
                })
            }
        },
        deleteClick(){
            if(!this.isAuthor){
                alert("삭제는 작성자만 가능합니다.")
            }
            else if(confirm("삭제하시겠습니까?")){
                CSNetwork.request_notice_delete({notice_id : this.notice_id})
                .then( () => {
                    alert("삭제되었습니다.")
                    this.$router.push({name:"servicenoticemain"})
                })
                .catch(err=>{
                    alert("삭제 중 오류가 발생했습니다.")
                    console.log(err)
                })
            }
        },
        updateClick(){
            if(this.isAuthor){
                this.$router.push({name:'servicenoticeupdate', params:{notice_id : this.notice_id}})
            }
            else{
                alert("수정은 작성자만 가능합니다.")
            }
        }
    }
}
</script>
