// evt=event事件參數
$(window).scroll(function(evt){
  // 判斷滑動高度 navbar-top已經加class了,所以不需.句號
  if($(window).scrollTop()>0)
    $(".navbar,.explore").removeClass("navbar-top")
  else
    $(".navbar,.explore").addClass("navbar-top")
})


// 抓滑鼠位置, 移動時觸發事件
$(window).mousemove(function(evt){
  var pagex= evt.pageX
  var pagey= evt.pageY
  
   //座標x,y由#section_about的左上角開始計算
  var x = pagex-$("section#section_about").offset().left;
  var y = pagey-$("section#section_about").offset().top;

// 滑鼠往左，物件就往右
// 除以-20，代表滑鼠往左20=物件往-1(右)移動。再加上50是讓物件再往右一點，不然右邊角會跑出來
  $(".index_mountain,.rocks").css("transform", "translateX("+(pagex/-20+50)+"px)")
  $(".tri").css("transform", "translateX("+(pagex/-40)+"px)")
  
  $(".r1_text").css("transform", "translateX("+(y/-5)+"px)")
  $(".r2_text").css("transform", "translateX("+(y/-12)+"px)")
  $(".r3_text").css("transform", "translateX("+(y/-10)+"px)")


  // 叉叉跟著滑鼠跑
  $("#cross").css("left",x+"px")
  $("#cross").css("top",y+"px") 
  
  // 讓叉叉位置只在#about範圍內顯示   || =或者 
  if (y<0 || y> $("#section_about").outerHeight())
    $("#cross").css("opacity",0)
  else
    $("#cross").css("opacity",1)
 
  // 抓取貓的中央左右位置。offset相對位置左座標+cat本體一半的寬度
  var catplace=$("#cat").offset().left+$("#cat").width()/2
  // 抓取貓的上方位置。
  var cattop=$("#cat").offset().top
  var img_url="http://awiclass.monoame.com/catpic/"
   //左方 / 右方 / 上方
  if (pagex<catplace - 50)
    $("#cat").attr("src",img_url+"cat_left.png");
  else if (pagex>catplace  + 50)
    $("#cat").attr("src",img_url+"cat_right.png");
  else
    $("#cat").attr("src",img_url+"cat_top.png");

  //左上 / 右上
  if (pagex<catplace - 50 && pagey< cattop)
    $("#cat").attr("src",img_url+"cat_lefttop.png");
  
  if (pagex>catplace + 50 && pagey< cattop)
    $("#cat").attr("src",img_url+"cat_righttop.png");
  
  
// 三隻貓
// 偵測進入貓咪範圍就站起來
function detect_cat(cat_id,x){
  var catplace = $(cat_id).offset().left+$(cat_id).width()/2;
  if (Math.abs(x-catplace)<80)
    $(cat_id).css("bottom","0px");
  else
    $(cat_id).css("bottom","-50px");
}  
  
  // 站起來的貓咪
  // console.log(x);
  detect_cat("#cat_yellow",pagex);
  detect_cat("#cat_blue",pagex);
  detect_cat("#cat_grey",pagex);
})