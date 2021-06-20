import Vue from 'vue'
import VueRouter from 'vue-router'
import Header from '@/components/layout/Header'
import Left from '@/components/layout/Left'

// 로그인
import Login from '@/views/login/login'

// 마이페이지(설정)
import MyPage from '@/views/login/mypage'

// 메인페이지
import main from '@/views/main/main-main'

// 회원관리
// 일반 회원
import MemberGeneralMain from '@/views/member/general-main'
import MemberGeneralDetail from '@/views/member/general-detail'

// 서비스 관리
// 관리자 관리
import ServiceAdminMain from '@/views/service/admin-main'
import ServiceAdminDetail from '@/views/service/admin-detail'
import ServiceAdminWrite from '@/views/service/admin-write'
import ServiceAdminUpdate from '@/views/service/admin-update'
// 고객 문의
import ServiceQnaMain from '@/views/service/qna-main'
import ServiceQnaDetail from '@/views/service/qna-detail'
// 공지사항
import ServiceNoticeMain from '@/views/service/notice-main'
import ServiceNoticeDetail from '@/views/service/notice-detail'
import ServiceNoticeWrite from '@/views/service/notice-write'
import ServiceNoticeUpdate from '@/views/service/notice-update'

//코드 관리
import ServiceCodeMn from '@/views/code/code-main'

//모임 관리
import ServiceMeetMn from '@/views/meet/meet-main'
import ServiceMeetEdit from '@/views/meet/meet-edit'
import ServiceBoardView from '@/views/board/board-view'

//채팅 관리
import ServiceChatList from '@/views/chat/chat-list'
import ServiceChatEnter from '@/views/chat/chat-enter'


// 시스템 관리
import System from '@/views/system/system-main'

Vue.use(VueRouter)

const routes = [
    // 로그인
    {
        path: '/login',
        name: 'login',
        component: Login
    },

    // 로그인 후 설정
    {
        path: '/mypage',
        name: 'mypage',
        components: {
            header: Header,
            left: Left,
            default: MyPage
        }
    },

    // 서비스 관제
    {
        path: '/main',
        name: 'main',
        components: {
            header: Header,
            left: Left,
            default: main
        }
    },

    // 회원관리 : 일반 회원
    {
        path: '/member/general',
        name: 'membergeneralmain',
        components: {
            header: Header,
            left: Left,
            default: MemberGeneralMain
        }
    },
    {
        path: '/member/general/detail/:user_id',
        name: 'membergeneraldetail',
        components: {
            header: Header,
            left: Left,
            default: MemberGeneralDetail
        },
        props: {
            default: true
        }
    },
    // 서비스 관리 : 관리자 관리
    {
        path: '/service/admin',
        name: 'serviceadminmain',
        components: {
            header: Header,
            left: Left,
            default: ServiceAdminMain
        }
    },
    {
        path: '/service/admin/detail/',
        name: 'serviceadmindetail',
        components: {
            header: Header,
            left: Left,
            default: ServiceAdminDetail,
        }
    },
    {
        path: '/service/admin/write',
        name: 'serviceadminwrite',
        components: {
            header: Header,
            left: Left,
            default: ServiceAdminWrite
        }
    },
    {
        path: '/service/admin/update',
        name: 'serviceadminupdate',
        components: {
            header: Header,
            left: Left,
            default: ServiceAdminUpdate
        }
    },

    // 서비스 관리 : 고객 문의
    {
        path: '/service/qna',
        name: 'serviceqnamain',
        components: {
            header: Header,
            left: Left,
            default: ServiceQnaMain,
        }
    },
    {
        path: '/service/qna/detail/:board_id',
        name: 'serviceqnadetail',
        components: {
            header: Header,
            left: Left,
            default: ServiceQnaDetail,
        },
        props: {
            default: true
        }
    },

    // 서비스 관리 : 공지사항
    {
        path: '/service/notice',
        name: 'servicenoticemain',
        components: {
            header: Header,
            left: Left,
            default: ServiceNoticeMain
        }
    },
    {
        path: '/service/notice/detail/:notice_id',
        name: 'servicenoticedetail',
        components: {
            header: Header,
            left: Left,
            default: ServiceNoticeDetail
        },
        props: {
            default: true
        }
    },
    {
        path: '/service/notice/write',
        name: 'servicenoticewrite',
        components: {
            header: Header,
            left: Left,
            default: ServiceNoticeWrite
        }
    },
    {
        path: '/service/notice/update/:notice_id',
        name: 'servicenoticeupdate',
        components: {
            header: Header,
            left: Left,
            default: ServiceNoticeUpdate
        },
        props: {
            default: true
        }
    },
    // 코드 관리
    {
        path: '/service/code',
        name: 'ServiceCodeMn',
        components: {
            header: Header,
            left: Left,
            default: ServiceCodeMn
        }
    },
    {
        path: '/meet/list',
        name: 'ServiceMeetMn',
        components: {
            header: Header,
            left: Left,
            default: ServiceMeetMn
        }
    },
    {
        path: '/meet/edit',
        name: 'ServiceMeetEdit',
        components: {
            header: Header,
            left: Left,
            default: ServiceMeetEdit
        }
    },
    {
        path: '/board/view',
        name: 'ServiceBoardView',
        components: {
            header: Header,
            left: Left,
            default: ServiceBoardView
        },
        props: {
            default: true
        }
    },
    {
        path: '/chat/list',
        name: 'ServiceChatList',
        components: {
            header: Header,
            left: Left,
            default: ServiceChatList
        },
        props: {
            default: true
        }
    },
    {
        path: '/chat/enter',
        name: 'ServiceChatEnter',
        components: {
            header: Header,
            left: Left,
            default: ServiceChatEnter
        },
        props: {
            default: true
        }
    },
    
    
    
    //system : 시스템 관리
    {
        path: '/System',
        name: 'system',
        components: {
            header: Header,
            left: Left,
            default: System
        }
    },
    //기본 경로
    {
        path: '*',
        beforeEnter: (to, from, next) => {
            next('/login')
        }
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

// router.beforeEach((to, from, next) => {
//     next()
//     if (to.matched.components !== undefined) {
//         if (to.matched.some((item) => item.components.meta.superAdmin)) {
//             if (myAuth === authType.SUPERADMIN) {
//                 next();
//             } else {
//                 alert("권한이 없습니다.");
//                 next(-1);
//             }
//         } else {
//             next()
//         }
//     } else {
//         next()
//     }
// })


export default router