<template>
    <section id="container">
    <div id="content" class="system">
        <div class="cont_header">
            <h2 class="page_title">시스템 관리</h2>
            <span class="page_path">HOME &gt; 시스템 관리</span>
        </div>
        <article>
            <h1 class="cont_title">서버 사용률 현황</h1>
            <div class="refer">업데이트 : <span>2020-05-27 10:30</span></div>
            <ul class="system_list">
                <li>
                    <h2>CPU</h2>
                    <div class="graph_bg">
                        <span class="graph_progress cpu" :style="systemUsestyle.cpu"></span>
                    </div>
                    <span>{{serverSystem.cpu_use_percent}}%</span>
                </li>
                <li>
                    <h2>메모리</h2>
                    <div class="graph_bg">
                        <span class="graph_progress memory" :style="systemUsestyle.memory"></span>
                    </div>
                    <span>{{serverSystem.memory_use_percent}}%</span>
                </li>
                <li>
                    <h2>디스크</h2>
                    <div class="graph_bg">
                        <span class="graph_progress disk" :style="systemUsestyle.disk"></span>
                    </div>
                    <span>{{serverSystem.directory_use_percent}}%</span>
                </li>
                <li>
                    <h2>외부 연동 API 상태</h2>
                    <ul class="depth_list">
                        <li>
                            <h3>통역</h3>
                            <span class="clr_gr"><i></i> 정상</span>
                        </li>
                        <li>
                            <h3>지도</h3>
                            <span class="clr_gr"><i></i> 정상</span>
                        </li>
                        <li>
                            <h3>인포디오</h3>
                            <span class="clr_red"><i></i> 오류</span>
                        </li>
                    </ul>
                </li>
            </ul>
        </article>
        <h3 class="cont_title">로그 조회</h3>
        <div class="srch_box">
            <ul class="srch_option_list">
                <li>
                    <strong>로그 구분</strong>
                    <select name="" id="">
                        <option selected>전체</option>
                    </select>
                </li>
                <li class="colspan">
                    <strong>조회 기간</strong>
                    <div class="opt_date">
                        <input type="text" name="" id="dateFrom" class="datepicker" readonly autocomplete="off">
                        <span class="swung">~</span>
                        <input type="text" name="" id="dateTo" class="datepicker" readonly autocomplete="off">
                    </div>
                </li>
                <li class="colspan">
                    <strong>메시지</strong>
                    <input type="text" name="" id="">
                </li>
            </ul>
            <button class="btn srch_btn"><i></i>검색</button>
        </div>
        <section class="cont_inner">
            <h3 class="cont_title">검색 결과</h3>
            <table>
                <colgroup>
                    
                    <col style="width:200px">
                    <col style="width:150px">
                    <col style="width:250px">
                    <col>
                </colgroup>
                <thead>
                    <tr>
                        <th>로그 시간</th>
                        <th>로그 구분</th>
                        <th>ID</th>
                        <th>메시지</th>
                    </tr>
                </thead>
                <tbody>
                    <tr @click="trClick()">
                        <td>yyyy-mm-dd hh:mm:ss</td>
                        <td>접속 상태</td>
                        <td>v_01_01</td>
                        <td class="txt_left">RequestId: 2019-10-28T12:13:21.145+0000 | d1dv03-d304-8460-29dj39fj39 | lqror3874729-1233 | GET/aai/util/echoldoienfk | COMPLETE | INFO | 10.45.24.215 | 1 | aai-resouces message: co=hee…..</td>
                    </tr>
                    <tr>
                        <td colspan="4">검색 결과가 없습니다.</td>
                    </tr>
                </tbody>
            </table>
            <page-component :pageData="pageContainer" @onPage="pageClick"></page-component>
        </section>
    </div>
    <section id="popup_wrap" class="popup system_log"  v-if="isShow">
        <div class="inner">
            <h1 class="tit">로그 상세</h1>
            <div class="content">
                RequestId: 2019-10-28T12:13:21.145+0000 | d1dv03-d304-8460-29dj39fj39 | lqror3874729-1233 | GET/aai/util/echoldoienfk | COMPLETE | INFO | 10.45.24.215 | 1 | aai-resouces message: co=hee…..RequestId: 2019-10-28T12:13:21.145+0000 | d1dv03-d304-8460-29dj39fj39 | lqror3874729-1233 | GET/aai/util/echoldoienfk | COMPLETE | INFO | 10.45.24.215 | 1 | aai-resouces message: co=hee…..RequestId: 2019-10-28T12:13:21.145+0000 | d1dv03-d304-8460-29dj39fj39 | lqror3874729-1233 | GET/aai/util/echoldoienfk | COMPLETE | INFO | 10.45.24.215 | 1 | aai-resouces message: co=hee…..RequestId: 2019-10-28T12:13:21.145+0000 | d1dv03-d304-8460-29dj39fj39 | lqror3874729-1233 | GET/aai/util/echoldoienfk | COMPLETE | INFO | 10.45.24.215 | 1 | aai-resouces message: co=hee…..
            </div>
            <button class="btnClose" @click="closePop()">팝업닫기</button>
        </div>
    </section>
</section>
</template>

<script>
import CSNetwork from '@/utils/CSNetwork.js'
import pageComponent from "@/components/board/page"

const $ = window.$

export default {
    components: {
        pageComponent
    },
    data() {
        return {
            isShow: false,
            pageContainer:{
                page:1,
                total:1,
                count:20
            },
            serverSystem: {
                cpu_use_percent: 0,
                memory_use_percent: 0,
                directory_use_percent: 0
            },
            systemUsestyle: {
                cpu: {
                    width: ''
                },
                memory: {
                    width: ''
                },
                disk: {
                    width: ''
                }
            },
            serviceInterval: ''
        }
    },
    mounted() {
        $(function () {
            $('#dateFrom, #dateTo').datepicker({
                dateFormat: 'yy-mm-dd'
            });
        }),
        this.requestComputerInfo()
        this.serviceInterval=setInterval(this.requestComputerInfo, 3000)
    },
    destroyed() {
        clearInterval(this.serviceInterval)
    },
    methods: {
        requestComputerInfo() {
            CSNetwork.request_system_computer_info()
                .then(data => {
                    this.serverSystem = data.body;
                    this.systemUsestyle.cpu.width = this.serverSystem.cpu_use_percent + '%'
                    this.systemUsestyle.memory.width = this.serverSystem.memory_use_percent + '%'
                    this.systemUsestyle.disk.width = this.serverSystem.directory_use_percent + '%'
                })
                .catch(err=>{
                    console.log(err);
                })
        },
        trClick() {
            this.isShow = true
        },        
        // 팝업 닫기 클릭
        closePop() {
            this.isShow = false
        }
    }
}
</script>