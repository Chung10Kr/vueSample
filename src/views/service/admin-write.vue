<template>
<section id="container">
    <div id="content" class="service_admin write">
        <section class="cont_header">
            <h2 class="page_title">관리자 신규 등록</h2>
            <span class="page_path">HOME &gt; 서비스 관리 &gt; 관리자 신규 등록</span>
        </section>
        <section class="cont_inner">
            <h3 class="cont_title">계정 정보</h3>
            <table>
                <colgroup>
                    <col style="width: 12%;" />
                    <col />
                </colgroup>
                <tbody>
                    <tr>
                        <th>권한</th>
                        <td>
                            <select name="auth" id="auth" v-model="formData.admin_auth">
                                <option value="0">슈퍼관리자</option>
                                <option value="1">관리자</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th>ID</th>
                        <td>
                            <input type="text" ref="adminUserId" name="adminUserId" id="adminUserId" value="test" v-model="formData.admin_user_id" style="margin-right:10px" />
                            <button @click="duplicateClick">중복확인</button><span class="refer">※영문, 숫자 사용 5자 이상 생성 가능</span>
                        </td>
                    </tr>
                    <tr>
                        <th>초기 비밀번호</th>
                        <td>
                            <span class="refer clr_red" style="padding-left:0">초기 비밀번호는 'emgram1234!!'로 설정됩니다. 최초 로그인 시,
                                비밀번호 변경 후 사용하시기 바랍니다.</span>
                        </td>
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
                        <td>
                            <input type="text" ref="adminName" name="adminName" id="adminName" v-model="formData.admin_name" maxlength="50" />
                        </td>
                    </tr>
                    <tr>
                        <th>연락처</th>
                        <td>
                            <input type="text" name="tel" id="tel" v-model="formData.admin_phone_num"  maxlength="15" /><span class="refer">※-없이 입력해 주세요.</span>
                        </td>
                    </tr>
                    <tr>
                        <th>이메일</th>
                        <td>
                            <input type="text" name="email" id="email" v-model="formData.admin_email" maxlength="50" />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="btn_area">
                <button class="bgClr_gray" @click="cancleClick()">취소</button>
                <button class="bgClr_blue" @click="saveClick()">저장</button>
            </div>
        </section>
    </div>
</section>
</template>

<script>
import CSNetwork from '@/utils/CSNetwork.js'

export default {
    data() {
        return {
            dupCheck : false,
            formData: {
                admin_auth: "0",
                admin_user_id: "",
                admin_name: "",
                admin_phone_num: "",
                admin_email: ""
            },
        };
    },
    created(){
        if(this.$store.getters.getAuthType!=="0"){
            alert("유효하지 않은 접근입니다.");
            this.$router.push({name:"serviceadminmain"});
        }
    },
    mounted() {
        this.$refs.adminUserId.focus();
    },
    computed:{
        admin_user_id(){
            return this.formData.admin_user_id;
        }
    },
    watch:{
        admin_user_id(){
            this.dupCheck=false;
        }
    },
    methods: {
        duplicateClick() {
            const regId = /^[a-zA-Z0-9]{5,45}$/;
            if (this.formData.admin_user_id === "") {
                alert("아이디를 입력해주세요.");
            } 
            else if (regId.test(this.formData.admin_user_id) === false) {
                alert(
                    "유효하지 않은 아이디 입니다.생성 규칙에 맞춰 다시 입력해주세요."
                );
            } 
            else {
                CSNetwork.request_duplicate_result({admin_user_id: this.formData.admin_user_id})
                .then((data)=>{
                    if (data.body === false) {
                        if ( confirm(this.formData.admin_user_id + "는 사용 가능한 아이디입니다. 사용 하시겠습니까?")){
                            this.dupCheck=true;
                            this.$refs.adminName.focus();
                        } 
                        else {
                            this.$refs.adminUserId.focus();
                        }
                    } else {
                        alert("이미 사용중인 아이디입니다. 확인 후 다시 입력해주세요.");
                        this.$refs.adminUserId.focus();
                    }
                })
                .catch(err=>{
                    console.log(err);
                    alert(err);
                })
            }
        },
        async saveClick() {
            const regId = /^[a-zA-Z0-9]{5,45}$/;
            const regEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
            const regTel = /^[0-9]{10,11}$/;
            if(this.dupCheck===false){
                alert("아이디 중복확인을 다시해주세요!");
            }
            else if (this.formData.auth == ""  ) {
                alert("유효하지 않은 권한 입니다.생성 규칙에 맞춰 다시 입력해주세요.");
            } 
            else if (this.formData.admin_user_id === ""  || regId.test(this.formData.admin_user_id) === false) {
                alert(
                    "유효하지 않은 아이디 입니다.생성 규칙에 맞춰 다시 입력해주세요."
                );
            } 
            else if (this.formData.admin_name === "") {
                alert("유효하지 않은 이름 입니다.생성 규칙에 맞춰 다시 입력해주세요.");
            } 
            else if (this.formData.admin_phone_num === "" || !regTel.test(this.formData.admin_phone_num)) {
                alert("유효하지 않은 전화번호 입니다.생성 규칙에 맞춰 다시 입력해주세요.");
            } 
            else if ( this.formData.admin_email === "" || !regEmail.test(this.formData.admin_email)){
                alert("이메일 입력정보를 확인해주세요.");
            } 
            else {
                CSNetwork.request_admin_register(this.formData)
                .then(()=>{
                        alert("관리자 등록을 완료했습니다.");
                        this.$router.push({
                        name: "serviceadminmain"
                        })
                })
                .catch((err)=>{
                    alert("관리자 등록 중 오류가 발생했습니다.");
                    console.log(err);
                })
            }
        },
        cancleClick() {
            this.$router.go(-1);
        },
    },
};
</script>
