<template>
    <section id="container" class="login">
        <div class="loginBox">
            <h2 class="login_logo">Highgroup<br>관리자 시스템</h2>
            <form @submit.prevent="onSubmit">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <strong class="login_tit" >아이디</strong>
                                <input type="text" id="user_id"  v-model="loginInfo.user_id" maxlength="50">
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong class="login_tit">비밀번호</strong>
                                <input type="password" id="user_pwd" v-model="loginInfo.user_pwd" >
                            </td>
                        </tr>
                        <tr>
                            <td><input type="submit" value="로그인" class="login_btn bgClr_blue"></td>
                        </tr>
                        <tr>
                            <td class="login_txt">신규 계정 발급 또는 기존 계정의 비밀번호를 잊은 경우,<br>담당 관리자에게 문의바랍니다</td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    </section>
</template>

<script>
import {mapActions} from "vuex";
const $ = window.$;

export default{
    data(){
        return{
            loginInfo:{
                user_id : "ht2641",
                user_pwd : "kimbomin2"
            }
        }
    },
    created(){
        
        if(this.$store.getters.getAccessToken !== ""){
            this.$router.push({name:"main"})
        }
    },
    methods:{
        onSubmit(){
            if(this.loginInfo.user_id.length === 0){
                alert("아이디를 입력해주세요.");
            } else if( this.loginInfo.user_pwd.length === 0 ){
                alert("비밀번호를 입력해주세요.")
            } else{
                this.login(this.loginInfo)
            }
        },
        ...mapActions(['login'])
   }
}
</script>