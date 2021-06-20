<template>
<section id="container">
    <div id="content" class="service_admin detail">
        <section class="cont_header">
            <h2 class="page_title">
                관리자 수정
                <span class="page_path">HOME > 관리자 관리 > 관리자 수정</span>
            </h2>
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
                            <span>{{formData.admin_user_id}}</span>
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
                            <input type="text" ref="adminName" name="adminName" id="adminName" v-model="formData.admin_name" maxlength="50"/>
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
                <button class="white_btn" @click="cancleClick">취소</button>
                <button class="srch_btn" @click="saveClick">저장</button>
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
            formData: {
                auth: "0",
                admin_user_id: "",
                admin_name: "",
                tel: "",
                email: ""
            },
        };
    },
    created() {
        if(this.$route.params.admin_detail===undefined){
            alert("유효하지 않은 접근입니다.");
            this.$router.push({name:"serviceadminmain"});
        }
        else{
            this.formData=this.$route.params.admin_detail;
        }
        if(this.$store.getters.getAuthType!=="0"){
            alert("유효하지 않은 접근입니다.");
            this.$router.push({name:"serviceadminmain"});
        }
    },
    mounted() {
        this.$refs.adminName.focus();
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
        async saveClick() {
            const regEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
            const regTel = /^[0-9]{10,11}$/;
            if (this.formData.auth == "") {
                alert("유효하지 않은 권한 입니다.생성 규칙에 맞춰 다시 입력해주세요.");
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
                this.formData.password="emgram1234!!";
                CSNetwork.request_admin_update(this.formData)
                .then(()=>{
                    alert("관리자 수정을 완료했습니다.");
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
            this.$router.push({
                name: 'serviceadmindetail',
                query : {admin_user_id : this.$route.params.admin_detail.admin_user_id}
            })
        },
    },
};
</script>
