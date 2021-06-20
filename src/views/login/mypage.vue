<template>
<section id="container">
    <div id="content" class="mypage write">
        <div class="cont_header">
            <h2 class="page_title">설정</h2>
            <span class="page_path">HOME &gt; 설정</span>
        </div>
        <section class="cont_inner">
            <h3 class="cont_title">계정 정보</h3>
            <table>
                <colgroup>
                    <col style="width: 12%;">
                    <col>
                </colgroup>
                <tbody>
                    <tr>
                        <th>권한</th>
                        <td>{{loginStatus.code_name}}</td>
                    </tr>
                    <tr>
                        <th>ID</th>
                        <td>{{loginStatus.admin_user_id}}</td>
                    </tr>
                    <tr>
                        <th>비밀번호</th>
                        <td><button @click="changePW()">비밀번호 변경</button></td>
                    </tr>
                </tbody>
            </table>
            <h3 class="cont_title">사용자 정보</h3>
            <table>
                <colgroup>
                    <col style="width: 12%;">
                    <col>
                </colgroup>
                <tbody>
                    <tr>
                        <th>이름</th>
                        <td><input type="text" style="width: 540px;" ref="admin_name" :value="loginStatus.admin_name" maxlength="50"></td>
                    </tr>
                    <tr>
                        <th>연락처</th>
                        <td class="inp_tel">
                            <input type="text" ref="hp1" :value="telNumSplit(loginStatus.admin_phone_num,0)" maxlength='3'><span class="swung">-</span>
                            <input type="text" ref="hp2" :value="telNumSplit(loginStatus.admin_phone_num,1)" maxlength='4'><span class="swung">-</span>
                            <input type="text" ref="hp3" :value="telNumSplit(loginStatus.admin_phone_num,2)" maxlength='4'>
                        </td>
                    </tr>
                    <tr>
                        <th>이메일</th>
                        <td><input type="email" ref="admin_email" style="width: 540px;" :value="loginStatus.admin_email" maxlength="50"></td>
                    </tr>
                </tbody>
            </table>
            <div class="btn_area"><button @click="saveAdminClick()">저장</button>
            </div>
        </section>
    </div>

    <section id="popup_wrap" class="popup" v-if="passPop" @keyup.enter="savePop()">
        <div class="inner">
            <h1 class="tit">비밀번호 변경</h1>
            <div class="content">
                <table>
                    <tbody>
                        <tr>
                            <th>현재 비밀번호</th>
                            <td>
                                <input type="password" id="now_pwd" v-model="password.now_pwd" ref="password">
                                <span v-if="this.nowPw" class="clr_red">현재 비밀번호와 일치하지 않습니다.</span>
                            </td>
                        </tr>
                        <tr>
                            <th>새 비밀번호</th>
                            <td>
                                <input type="password" id="change_pwd" v-model="password.change_pwd">
                                <span v-if="this.newPw" class="clr_red">영문, 숫자를 포함 8자 이상으로 입력해주세요.</span>
                            </td>
                        </tr>
                        <tr>
                            <th>새 비밀번호 확인</th>
                            <td>
                                <input type="password" id="change_pwd_confirm" v-model="password.change_pwd_confirm">
                                <span v-if="this.confirmPw" class="clr_red">새 비밀번호와 일치하지 않습니다.</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="btns">
                    <button class="bgClr_gray" @click="closePop()" >취소</button>
                    <button class="bgClr_blue" @click="savePop()" >저장</button>
                </div>
            </div>
            <button class="btnClose" @click="closePop()">팝업닫기</button>
        </div>
    </section>
</section>
</template>

<script>
import {mapState} from 'vuex'
import businessUtils from "@/utils/BusinessUtils.js"
import CSNetwork from '@/utils/CSNetwork.js'
const $ = window.$;

export default {
    data: () => {
        return {
            passPop: false,
            nowPw: false,
            newPw: false,
            confirmPw: false,
            password: {
                now_pwd: "",
                change_pwd: "",
                change_pwd_confirm: ""
            }
        }
    },
    computed:{
        ...mapState(['loginStatus'])
    },
    methods: {
        telNumSplit(telNum,index) {
            return businessUtils.telNumSplit(telNum,index)
        },
        saveAdminClick() {
            if(this.$refs.admin_name.value === ""){
                alert("이름을 입력해 주세요")
                this.$refs.admin_name.focus()
            } else if(this.$refs.hp1.value === ""){
                alert("전화번호 첫번째 자리를 입력해 주세요")
                this.$refs.hp1.focus()
            } else if(this.$refs.hp2.value === ""){
                alert("전화번호 두번째 자리를 입력해 주세요")
                this.$refs.hp2.focus()
            } else if(this.$refs.hp3.value === ""){
                alert("전화번호 세번째 자리를 입력해 주세요")
                this.$refs.hp3.focus()
            } else if(this.$refs.admin_email.value === ""){
                alert("이메일을 입력해 주세요")
                this.$refs.admin_email.focus()
            } else {
                this.updateAdminInfo()
            }
        },
        updateAdminInfo() {
            this.loginStatus.admin_name = this.$refs.admin_name.value;
            var params = {
                admin_user_id   : this.loginStatus.admin_user_id,
                admin_name      : this.$refs.admin_name.value,
                admin_phone_num : this.$refs.hp1.value + this.$refs.hp2.value + this.$refs.hp3.value,
                admin_email     : this.$refs.admin_email.value
            }
            CSNetwork.request_mypage_update(params)
            .then(()=>{
                alert("수정이 완료되었습니다.");
                this.reload()
            }).catch(res => (
                alert(res)
            ))
        },
        // 비밀번호 변경클릭
        changePW() {
            this.passPop = true;
        },
        // 비밀번호 변경 팝업 닫기
        closePop() {
            this.passPop = false;
            this.password.now_pwd = ""
            this.password.change_pwd = ""
            this.password.change_pwd_confirm = ""
        },
        // 비밀번호 저장 클릭
        savePop() {
            if(this.password.now_pwd !== ""){
                if(this.password.change_pwd !== ""){
                    if(this.password.change_pwd_confirm !== ""){
                        this.pwdCheckValidaion()
                    }else {
                        alert("변경할 새비밀번호 확인을 입력해 주세요.")
                        $("#change_pwd_confirm").focus();
                    }
                } else {
                    alert("변경할 새비밀번호를 입력해 주세요.")
                    $("#change_pwd").focus();
                }
            } else {
                alert("현재 비밀번호를 입력해 주세요.")
                $("#now_pwd").focus();
            }
        },
        pwdCheckValidaion() {
            // 비밀번호 유효성(영문, 숫자를 포함 8자 이상) 검사
            if(this.checkPassword(this.password.change_pwd)){
                this.newPw = false
                if(this.password.change_pwd === this.password.change_pwd_confirm){
                    this.confirmPw = false
                    this.updatePwd()
                } else {
                    this.confirmPw = true
                }
            } else {
                this.newPw = true
            }
        },
        updatePwd(){
            var params = {
                admin_user_id : this.loginStatus.admin_user_id,
                admin_pwd     : this.password.now_pwd,
                change_pwd    : this.password.change_pwd
            }
            CSNetwork.request_admin_passupdate(params).then(()=>{
                alert("비밀번호가 변경되었습니다.")
                this.passPop = false
                this.password.now_pwd = ""
                this.password.change_pwd = ""
                this.password.change_pwd_confirm = ""
            }).catch(res => (
                alert(res)
            ))
        },
        checkPassword(upw) {
            if (!/^[a-zA-Z0-9]{8,45}$/.test(upw)){
                return false;
            }
            var chk_num = upw.search(/[0-9]/g);
            var chk_eng = upw.search(/[a-z]/ig);
            if (chk_num < 0 || chk_eng < 0) {
                return false;
            }
            return true;
        },
        reload(){
            CSNetwork.request_admin_info().then()
            .catch(res => (
                alert(res)
            ))
        }
    }
}
</script>
