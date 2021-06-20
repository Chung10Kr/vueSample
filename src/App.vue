<template>
<div id="app">
    <!-- <router-view name="header"></router-view> -->
    <router-view name="left"></router-view>
    <router-view class="W95p" />
    <!-- <router-view name="footer"></router-view> -->
</div>
</template>

<script>
export default {
    name: 'App',
    mounted() {
      $(function () {
        //tab 메뉴 초기 세팅
        $(".dep_content").hide(); //Hide all content
        $("ul.dep_tab li:first").find("a").addClass("on");
        $(".dep_content:first").show(); //Show first tab content
        
        //tab 메뉴 클릭 이벤트
        $("ul.dep_tab li a").click(function() {
            $("ul.dep_tab li a").removeClass("on"); //Remove any "active" class
            $(this).addClass("on"); //Add "active" class to selected tab
            $(".dep_content").hide(); //Hide all tab content
            var activeTab = $(this).attr("href"); //Find the rel attribute value to identify the active tab + content
            $(activeTab).fadeIn(); //Fade in the active content
            return false;
        });
      })
  },
}
</script>

<style>
@import '../src/assets/css/reset.css';
@import '../src/assets/css/common.css';
@import '../src/assets/css/content.css';
@import '../src/assets/css/BasicSet.css';
@import '../src/assets/css/vue-sidebar-menu.css';
@import '../src/assets/css/vue-sidebar-menu-tmass.css';

</style>
