<template>
<section id="container">
    <div id="content" class="user_general detail">
        <div class="cont_header">
            <h2 class="page_title">일반 회원 상세</h2>
            <span class="page_path">HOME &gt; 회원관리 &gt; 일반 회원 &gt; 일반회원 상세</span>
        </div>
        <section class="cont_inner">
            <h3 class="cont_title">계정 정보</h3>
            <table>
                <colgroup>
                    <col style="width: 20%;">
                    <col style="width: 38%;">
                    <col style="width: 12%;">
                    <col>
                </colgroup>
                <tbody>
                    <tr>
                        <th>ID</th>
                        <td colspan="3">{{userDetail.user_id}}</td>
                    </tr>
                    <tr>
                        <th>이름</th>
                        <td colspan="3">{{userDetail.user_name}}</td>
                    </tr>
                    <tr>
                        <th>연락처</th>
                        <td colspan="3">{{userDetail.user_phone_num == '' ? '-'  :  telNumFormat(userDetail.user_phone_num)}}</td>
                    </tr>
                    <tr>
                        <th>가입 일시</th>
                        <td>{{dateUtil.parser(userDetail.create_date)}}</td>
                        <th>계정 상태</th>
                        <td v-if="userDetail.user_state === 'stop'" class="clr_red">휴면<button class="bgClr_blue"  @click="approveClcik">승인</button></td>
                        <td v-else-if="userDetail.user_state === 'non_aprv'" class="clr_red">미승인<button class="bgClr_blue"  @click="approveClcik">승인</button></td>
                        <td v-else-if="userDetail.user_state === 'delete'" class="clr_gray">탈퇴</td>
                        <td v-else class="clr_gr">정상<button class="bgClr_red"  @click="stopClcik">휴면처리</button></td>

                        
                    </tr>
                </tbody>
            </table>
            <div class="btn_area">
                <button class="bgClr_blue" id="userDel" @click="deleteClick">회원 탈퇴 처리</button>
            </div>
        </section>
    </div>
</section>
</template>
<script>
import businessUtils from "@/utils/BusinessUtils.js"
import CSNetwork from '@/utils/CSNetwork.js'
import dateUtil from "@/utils/date.js";

export default{
    data(){
        return{
            userDetail:{}
        }
    },
    props: {
        user_id: {
            type: String,
            required: true
        }
    },
    created(){
        this.dateUtil = dateUtil;
        CSNetwork.request_general_user_detail({
            user_id : this.$route.params.user_id
        })
        .then(res => {
            this.userDetail = res.body
        })
    },
    methods:{
        telNumFormat:function(telNum){
            return businessUtils.telNumFormat(telNum)
        },
        deleteClick(){
            if(confirm("선택한 회원을 탈퇴 처리하시겠습니까?\n회원 탈퇴 후 회원 정보가 삭제됩니다.")){
                var params = {
                    user_id : this.$route.params.user_id,
                    user_state     : "delete",
                }
                CSNetwork.request_state(params)
                .then(() => {
                    alert("탈퇴처리 되었습니다.")
                    this.$router.push({name:"membergeneralmain"});
                })
            }
        },
        approveClcik(){
            if(confirm("선택한 회원을 승인하시겠습니까?\n")){
                var params = {
                    user_id : this.$route.params.user_id,
                    user_state     : "normal",
                }
                CSNetwork.request_state(params)
                .then(() =>{
                    alert("승인처리 되었습니다.")
                    this.$router.push({name:"membergeneralmain"});
                })
            }
        },
        stopClcik(){
            if(confirm("선택한 회원을 정지시겠습니까?\n")){
                var params = {
                    user_id : this.$route.params.user_id,
                    user_state     : "stop",
                }
                CSNetwork.request_state(params)
                .then(() =>{
                    alert("해당회원이 정지되었습니다.")
                    this.$router.push({name:"membergeneralmain"});
                })
            }
        },

    }
}
</script>

