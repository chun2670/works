var pname_audio=new Audio("http://www.monoame.com/awi_class/ballsound/click14.wav"); 

// 回復預設，把值設為"空值"即可
$(".i5").click(function(){
    $(".phone").css("width","")
    $(".screen").css("height","")  
    $(".phone_name").text($(this).text())
    pname_audio.play()
})

$(".i5s").click(function(){
    $(".phone").css("width","260px")
    $(".screen").css("height","380px")
    $(".phone_name").text($(this).text())
    pname_audio.play()
})

$(".i6").click(function(){
    $(".phone").css("width","290px")
    $(".screen").css("height","420px")
    $(".phone_name").text($(this).text())
    pname_audio.play()
})

$(".i6s").click(function(){
    $(".phone").css("width","330px")
    $(".screen").css("height","450px")
    $(".phone_name").text($(this).text())
    pname_audio.play()
})


//設定一個變數紀錄它現在到底在哪一頁,才不會連續一直往後跳
var screen_audio=new Audio("https://monoame.com/awi_class/ballsound/click18.wav");

var page=0;
$(".screen").click(function(){
  page+=1   //等於 page=page+1
  if(page>2){
    page=0; 
  }
  $(".pages").css("left", "-" + page*100 + "%")
                        //等於 -100%、-200%...
  screen_audio.play();
  // 音量 0靜音~1最大聲 
  screen_audio.volume=0.4
})


//主畫面鈕，跳回主畫面
// var btn_audio=new  Audio("https://monoame.com/awi_class/ballsound/click23.wav");
var btn_audio=new Audio("http://s80.youtaker.com/other/2013/12-21/mp336638498177bba8dc52b2421f9a53780599e477ad080.mp3");

$(".button").click(function(){
  page=0
  $(".pages").css("left", "-" + page*100 + "%")
    // btn_audio.play()
})


//震動 wiggle
var wiggle_audio=new Audio("https://monoame.com/awi_class/ballsound/phonevi.mp3");

$(".wiggle").click(function(){
    wiggle_time=0;
    wiggle_audio.play()
})

  var wiggle_time= 0
  setInterval( function(){
    if(wiggle_time<=20){
    // 設定來回10次就停止震動,否則會一直持續
      wiggle_time= wiggle_time+1
      console.log(wiggle_time)
        // 如果wiggle_time除以2的"餘數"等於0的話
        if(wiggle_time%2==0){
          $(".phone").css("left","-30px")    
        } else {
          $(".phone").css("left","30px")
        }
    
    //console結束時數字會在21,此時沒有回復到0的位置,因此設定...
    if(wiggle_time==21){
      $(".phone").css("left","")  
    }
  }
},60)


//旋轉 turn around。(這裡的設定只能轉一次)
// $(".turn").click(function(){
//   $(".phone").css("transform","rotate(360deg)")
// })

// 旋轉 turn around
var rotatetime=0
$('.turn').click(
  function(){
    rotatetime+=360
    $('.phone').css('transform','rotate('+rotatetime+'deg)')
  }
)