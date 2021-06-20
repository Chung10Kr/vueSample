<template>
<section id="container">
    <div id="content" class="service_admin detail">
        <section class="cont_header">
            <h2 class="page_title">관리자 상세</h2>
            <span class="page_path">HOME &gt; 서비스 관리 &gt; 관리자 상세</span>
        </section>
        <section class="cont_inner">
            <h3 class="cont_title">계정 정보</h3>
            <table>
                <colgroup>
                    <col style="width: 12%;" />
                    <col style="width: 38%;" />
                    <col style="width: 12%;" />
                    <col />
                </colgroup>
                <tbody>
                    <tr>
                        <th>권한</th>
                        <td colspan="3">{{ admin_detail.code_name }}</td>
                    </tr>
                    <tr>
                        <th>ID</th>
                        <td colspan="3">{{ admin_detail.admin_user_id }}</td>
                    </tr>
                    <tr>
                        <th>비밀번호</th>
                        <td colspan="3" @click="initClick">
                            <button id="pwReset">비밀번호 초기화</button><span class="refer clr_red"> ※ 비밀번호 초기화 시 “ emgram1234!! “로 설정됩니다. 비밀번호 변경 후 사용 안내바랍니다.</span>
                        </td>
                    </tr>
                    <tr>
                        <th>등록 일시</th>
                        <td>{{ dateUtil.parser(admin_detail.create_dt) }}</td>
                        <th>수정 일시</th>
                        <td>{{ dateUtil.parser(admin_detail.update_dt) }}</td>
                    </tr>
                </tbody>
            </table>
            <h3 class="cont_title">사용자 정보</h3>
            <table>
                <colgroup>
                    <col style="width: 12%;" />
                    <col />
                </colgroup>
                <tbody>
                    <tr>
                        <th>이름</th>
                        <td>{{ admin_detail.admin_name }}</td>
                    </tr>
                    <tr>
                        <th>연락처</th>
                        <td>{{ telNumFormat(admin_detail.admin_phone_num) }}</td>
                    </tr>
                    <tr>
                        <th>이메일</th>
                        <td>{{ admin_detail.admin_email }}</td>
                    </tr>
                </tbody>
            </table>
            <div class="btn_area">
                <button class="fl bgClr_blue" @click="listClick()">목록</button>
                <div class="fr" v-if="this.$store.getters.getAuthType==='0'">
                    <button class="bgClr_red" @click="deleteClick()">삭제</button>
                    <button class="" @click="updateClick()">수정</button>
                </div>
            </div>
        </section>
    </div>
</section>
</template>

<script>
import CSNetwork from '@/utils/CSNetwork.js'
import dateUtil from "@/utils/date.js"
import businessUtils from "@/utils/BusinessUtils.js"
import router from '@/router'

export default {
    data(){
        return{
            admin_detail:{}
        }
    },
    created() {
        this.dateUtil = dateUtil;
        var params = {
            admin_user_id : this.$route.query.admin_user_id
        }
        CSNetwork.request_admin_detail(params)
        .then((res) => {
            this.admin_detail = res.body;
        })
    },
    methods: {
        telNumFormat:function(telNum){
            return businessUtils.telNumFormat(telNum)
        },
        listClick() {
            router.push({name: "serviceadminmain"})
        },
        initClick() {
            if(confirm("비밀번호를 초기화 하시겠습니까?")){
                var params = {
                    admin_user_id : this.admin_detail.admin_user_id,
                    admin_pwd     : "emgram1234!!",
                }
                CSNetwork.request_admin_pass_init(params)
                .then(()=>{
                    alert("초기화가 완료되었습니다.\n비밀번호는 emgram1234!!로 초기화 됩니다.\n비밀번호 변경 후 사용해주시기 바랍니다.");
                })
            }
        },
        deleteClick() {
            if (confirm("삭제하시겠습니까?")) {
                var params = {
                    admin_user_id : this.admin_detail.admin_user_id,
                }
                CSNetwork.request_admin_delete(params)
                .then( ()=>{
                    alert("삭제되었습니다.")
                    router.push({name:"serviceadminmain"})
                })
            }
        },
        updateClick() {
            router.push({
                name: "serviceadminupdate",
                params:{
                    admin_detail:{
                    ...this.admin_detail
                    }
                }
            })
        }
    }
}
</script>
