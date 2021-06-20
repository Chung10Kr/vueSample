import networkUtils from '@/utils/NetworkUtils.js'

export default {
    //vuex - 로그인 관리
    request_admin_login: function(params) {
        return networkUtils.POST('/admin/login', params);
    },
    request_admin_info: function(params) {
        return networkUtils.GET('/admin/info', params);
    },

    //회원관리
    request_general_user_list: function(params) {
        return networkUtils.GET('/user/generallist', params);
    },
    request_general_user_detail: function(params) {
        return networkUtils.GET('/user/info', params);
    },
    request_general_user_delete: function(params) {
        return networkUtils.GET('/user/delete', params);
    },
    //회원상태변경
    request_state: function(params){
        return networkUtils.POST('/user/approve_state', params);
    },

    //Code 관리

    //코드 가저오기
    request_code: function(params) {
        return networkUtils.GET('/code/getCode',params);
    },
    //코드 리스트 가져오기
    request_code_list: function(params) {
        return networkUtils.GET('/code/getList',params)
    },
    //코드 수정
    request_code_modify: function(params) {
        return networkUtils.POST('/code/modify',params)
    },

    request_meet_list: function(params){
        return networkUtils.GET('/meet/getList',params)
    },
    request_meet_detail:function(params){
        return networkUtils.GET('/meet/detail',params)
    },
    request_meet_update:function(params){
        return networkUtils.POST('/meet/updateMeet',params)
    },
    request_meet_memList:function(params){
        return networkUtils.GET('/meet/memList',params)
    },
    request_meet_memUpdate:function(params){
        return networkUtils.POST('/meet/updateMem',params)
    },
    request_meet_boardList:function(params){
        return networkUtils.POST('/meet/boardList',params)
    },
    request_board_view:function(params){
        return networkUtils.GET('/board/view',params)
    },
    request_reply_view:function(params){
        return networkUtils.GET('/board/replyList',params)
    },
    request_file_view:function(params){
        return networkUtils.GET('/board/fileList',params)
    },
    
    //Chat get Room List
    request_chat_list:function(params){
        return networkUtils.GET('/chat/rooms',params)
    },
    request_create_room:function(params){
        return networkUtils.GET('/chat/create',params)
    },
    request_chat_user:function(params){
        return networkUtils.GET('/chat/user',params)
    },

}