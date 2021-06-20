<template>
<div class="nav" id="menu"  @mouseover="clickEvent(false)"  @mouseleave="clickEvent(true)" >
    <span class="menuIcon">+</span>
    <sidebar-menu class="nav-list"
        :menu="treeData"
        :relative=true
        :hideToggle=true
        :showOneChild=true
        @item-click="reset()"/>
</div>
</template>

<script>
const $ = window.$
export default {
    name: "Left",
    
    data: () => ({
        menuExpanded : false,
        message: "Left 컴포넌트",
        treeData: [{
                title: "MAIN",
                href: "",
                child: [{
                        title: "- MAIN",
                        href: "/main"
                    }
                ]
            },
            {
                title: "회원 관리",
                href: "",
                child: [{
                        title: "- 일반 회원",
                        href: "/member/general"
                    },
                ]
            },
             {
                title: "모임 관리",
                href: "",
                child: [{
                        title: "- 모임 관리",
                        href: "/meet/list"
                    },
                ]
            },
             {
                title: "채팅 관리",
                href: "",
                child: [{
                        title: "- 채팅 관리",
                        href: "/chat/list"
                    },
                ]
            },
            {
                title: "서비스 관리",
                href: "",
                child: [{
                        title: "- 관리자 관리",
                        href: "/service/admin"
                    },
                    {
                        title: "- 문의 관리",
                        href: "/service/qna"
                    },
                    {
                        title: "- 공지사항 관리",
                        href: "/service/notice"
                    },
                    {
                        title: "- 코드 관리",
                        href: "/service/code"
                    }

                ]
            }
        ]
    }),
    mounted(){
        $(".nav-list").hide();
    },
    methods: {
        reset: function() {
            localStorage.clear()
        },
        clickEvent: function( type ){
            if( type == false){
                $("#menu").addClass('expanded');
                $(".nav-list").show(200);
                $(".menuIcon").html("-");
            }else{
                $("#menu").removeClass('expanded');
                $(".nav-list").hide(200);
                $(".menuIcon").html("+");
            }
        },
    }
}
</script>
