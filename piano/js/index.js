//定義soundpack一包一包的資料給audio用，包含number:音符號碼  跟url:音檔來源
var soundpack=[]
//要載入的音符號碼的陣列
var soundpack_index= [1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,8,8.5,9,9.5,10,11,11.5,12,12.5,13,13.5,14,15];

// 1. 把音樂檔用vue載入
// 推一組物件(soundpack_index裡的每一個資料)推進去soundpack裡.
for(var i=0; i<soundpack_index.length; i++){
  soundpack.push({
        //物件=有名字的資料
    number: soundpack_index[i],
    url: "http://awiclass.monoame.com/pianosound/set/"+soundpack_index[i]+".wav"
  })
}

// 1. 把音樂檔用vue載入
// 整個頁面的Vue物件
var vm= new Vue({
  el: "#app",
  data: {
    sounddata: soundpack,
    //觸發一組音符串。在時間105的時候，播放num: 3這個音樂檔...
    notes:[{num:3,time:105},{num:3,time:223},{num:4,time:331},{num:5,time:482},{num:5,time:565},{num:4,time:673},{num:3,time:782},{num:2,time:893},{num:1,time:1006},{num:1,time:1113},{num:2,time:1220},{num:3,time:1337},{num:3,time:1456},{num:2,time:1623},{num:2,time:1680},{num:3,time:1883},{num:3,time:1988},{num:4,time:2107},{num:5,time:2218},{num:5,time:2337},{num:4,time:2446},{num:3,time:2555},{num:2,time:2664},{num:1,time:2771},{num:1,time:2880},{num:2,time:2992},{num:3,time:3103},{num:2,time:3220},{num:1,time:3395},{num:1,time:3449}],
    // 記錄現在播到哪裡
    now_note_id: 0,
    // 正在執行的播放的"時間"
    playing_time: 0,
    // 正在執行的錄音的"時間"
    record_time: 0,
    // 下一個播放的音樂檔
    next_note_id: 0,
    // 清除=空值
    player: null,
    // 9. -1=沒有按按鍵的狀態
    now_press_key: -1,
    // 10. 錄音 settimeout回傳的計時物件
    recorder: null,
    // 設定鋼琴鍵盤相對值, 上網查ascii keyboard
    //所有顯示的鍵盤，num: 播放聲音的號碼/ key: 對應的鍵盤ASCII/ type黑鍵或白鑑
    display_keys: [
      {num: 1,key: 90  ,type:'white'},
      {num: 1.5,key: 83  ,type:'black'},
      {num: 2,key: 88  ,type:'white'},
      {num: 2.5,key: 68  ,type:'black'},
      {num: 3,key: 67  ,type:'white'},
      {num: 4,key: 86  ,type:'white'},
      {num: 4.5,key: 71  ,type:'black'},
      {num: 5,key: 66  ,type:'white'},
      {num: 5.5,key: 72  ,type:'black'},
      {num: 6,key: 78  ,type:'white'},
      {num: 6.5,key: 74  ,type:'black'},
      {num: 7,key: 77  ,type:'white'},
      {num: 8,key: 81  ,type:'white'},
      {num: 8.5,key: 50  ,type:'black'},
      {num: 9,key: 87  ,type:'white'},
      {num: 9.5,key: 51,type:'black'},
      {num: 10,key: 69  ,type:'white'},
      {num: 11,key: 82  ,type:'white'},
      {num: 11.5,key: 53  ,type:'black'},
      {num: 12,key: 84  ,type:'white'},
      {num: 12.5,key: 54  ,type:'black'},
      {num: 13,key: 89  ,type:'white'},
      {num: 13.5,key: 55  ,type:'black'},
      {num: 14,key: 85  ,type:'white'},
      {num: 15,key: 73  ,type:'white'}
    ]
  },
  
  methods: {
    //2. 播放音樂檔(id音符號碼，volume(0~1)音量)
    playnote: function(id,volume){
      //抓到audio中data-num=id的那個聲音物件
      if(id>0) {
        // "+id+"因為小數點的問題，會在對應黑鍵的時候出錯，因此在前後加上單引號，讓它知道這X.5是一筆資料，不是要拆開的物件
        //抓到audio中data-num=id的那個聲音DOM物件
        var audio_obj=$("audio[data-num='"+id+"']")[0];
            //調整音量/播放聲音
        audio_obj.volume=volume;
            //預設音樂整段播完才能進行下一段音樂，設定為回到開頭重新播放
        audio_obj.currentTime=0;
        audio_obj.play();
      }
    },
  
    //3. 抓取音樂檔播放到哪，並觸發下一組音符串(依次播放下去)
    playnext: function(volume){
        //從notes(樂譜)裡面抓出第now_note_id(記錄現在播到哪)筆資料的數字
      var play_note=this.notes[this.now_note_id].num;    
          //播放音符，引數有音符號碼、音量
      this.playnote(play_note,volume);      
          //播放完把指標移到下一個音符
          //把現在正在播放的音符位置移動到下一個
      this.now_note_id+=1;
          // 播完後跳回開頭
      if(this.now_note_id >= this.notes.lenght){
        // 偵測到播完了，就把這整個音樂停止掉
        //清除正在驅動的player計時器
        clearInterval(this.player);
        //現在播放時間歸零
        this.playing_time=0;
        //停止播放
        this.stopplay(); 
      }
    },   
    //4. 連續播放曲子→根據時間來執行playnext
      startplay: function(){
        this.now_note_id=0
        // 產生一個新的計時器，一直累加playing_time(播放的時間)
        this.playing_time=0
        this.next_note_id=0
        // 產生計時器。不斷的累計時間
        var vobj=this;
        // this.player→為設定清除用
        this.player=setInterval(function(){
          // 數字跑大於下一個音符的時間的時候，就把下一個音符播放出來
          // 如果正在執行的時間大於我的音樂檔裡的[下一個音樂檔的時間]的話..
          if(vobj.playing_time>=vobj.notes[vobj.next_note_id].time){
            // 就播放下一個音符
            vobj.playnext(1);
            // 下一個音符指定為再下一個音符
            vobj.next_note_id++;
          }
          // 若寫成this.playing_time，是抓到setInterval本身的this=無效，我們要抓vue object裡面的this才會有效。因此將this用var vobj定義
          // 播放時間+1
          vobj.playing_time+=1;  
        // 電腦沒辦法跑那麼快，所以給間隔時間
        },2)
      },
    //5. 停止播放
    stopplay: function(){
      //清除正在驅動的player計時器
      clearInterval(this.player)
      // 把stopplay重新指向0，以下三個歸零
      this.now_note_id=0;
      this.playing_time=0;
      this.next_note_id=0;
      setTimeout(function(){
        //現在播放時間歸零
        this.playing_time=-1;       
    },20)
    },
    //- 8. 顯示音譜。播放時同步音譜跟琴鍵顏色
    // 傳入音符id，看現在是否正在播放他，有的回傳true，沒有回傳false
    // 判斷這個鍵是不是正在被按下，如果樂譜長度=0的話，回傳不成立
    // 定義cur_id為"正在播放的音的上一個"。如果cur_id<0
    // 定義num為抓取現在要顯示的位置(現正播放的音)
    // 如果音符一樣回傳ture, 不然就回傳fals
    get_current_highlight: function(id){
      //如果譜沒有長度就直接跳出去
      if (this.notes.length==0)
        return false
      //cur_id 上一個播放的音符id
      var cur_id=this.now_note_id-1
      //如果cur_id<0會發生錯誤，歸零
      if (cur_id<0) cur_id=0
      //取得現在的播放音符
      var num=this.notes[cur_id].num
      // 如果播放的跟傳進來的音符一樣，回傳true，不然就會執行到最後回傳false
      if(num==id) return true
      return false
  },
    // 10.錄音
    start_record: function(){
     this.record_time=0
     this.recorder=setInterval(function(){
       vm.record_time++
     })
    },
    stop_record: function(){
     clearInterval(this.recorder)
     this.record_time=0
    },
   // 10.把新增的音符加進notes裡面
    //加入音符到樂譜(如果現在正在錄製中)，然後播放
    addnote: function(id){
      // >0→表示錄音時間一定大於0。如果現在正在錄音的話...
      if(this.record_time>0)
        this.notes.push({num: id, time: this.record_time})
        this.playnote(id,1);
    },
    load_sample: function(){
      var vobj=this
      $.ajax({
        url: "https://awiclass.monoame.com/api/command.php?type=get&name=music_dodoro",
        success: function(res){
          vobj.notes=JSON.parse(res)
        }
      })
    }
  }
});

// 7.設定鍵盤對應音樂檔
// keydown=按下鍵盤的時候。觸發事件...
$(window).keydown(function(e){
  // e.which=事件參數的哪一個屬性(搜尋jquery的keydown找得到)
  var key= e.which
  // 9. 記錄現在正在按的鍵盤a scii值，顯示用
  vm.now_press_key=key
  console.log(key);
  // console.log(key)
  // i剛開始為0，把每一個display_keys的資料都跑過一次
  for(var i=0; i<vm.display_keys.length; i++){
    // 第一個key為區域變數↑(e.which)。後面的key為display_keys裡面的key值。兩者不同!
    // 如果觸發事件參數的那個屬性=鍵盤key的相對值...就執行相對應的音樂檔
    if (key==vm.display_keys[i].key)
      vm.addnote(vm.display_keys[i].num)
  }
})

// 9. 離開鍵盤時
$(window).keyup(function(e){
  // 讓設定在vue裡面正在按的鍵為-1，清空
  vm.now_press_key=-1;
})