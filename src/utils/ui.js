


export default{
    setTabs(){
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

     }
}