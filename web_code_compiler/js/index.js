$(".code-container").hide(); 						//把container預設的寬度隱藏起來
$("#css-code").css("margin-left", "-350px");		//寬度仍然還有一些在裡面,因此設定位移
$("#js-code").css("margin-left", "-350px");


// 最後一節163_讓iframe調整高度，去適應用戶的resize觸發事件
	var $result= $("result-frame");		//定義 $result為整個iframe
	var $window= $(window).on("resize", function(){	
				//window=整個瀏覽器, on添加resize調整瀏覽器大小的一個動作時,執行一系列的function. 換句話說,當使用者有resize的時候,會重新定義.
		var height= $(this).height()-530	
				//首先需要獲得ifram更新後的高度. 所以定義一個新的高度=視窗的高度this=window減去所有(menu,accordion,footer..的高度 )
	$result.height(height);		//重新用剛才計算後的新的高度定義result的高度				
	}).trigger("resize");		//以上都只是定義處理的方法, 在此由trigger去觸發執行動作


// 1. 先設定收合動作
$(".tab").click(function(event){	//*點擊tab,讓width變為0. 指向tab點按下去會觸發一個function的一個event事件
								//指向這個tab的下一個"全部的原素"帶有code-container的,去作一個時間的間隔(animate)
	$(this).nextAll(".code-container").animate(		//在此用css會沒有動畫效果，因此用animate
		{ width: "0px"}, 
		{ duration: 1500, queue: false}
	);
	$(this).nextAll(".tab").css("margin-left","-170px");	//不作此設定的話,tab整個跑往左跑到負值(太左邊)

// 2. 設定展開動作
	$(this).next().animate(
		{ backgroundColor: "#1D1E22", borderRadius:"15px"},
		);

// 3. 當重複點展開後,會有其它欄收不回width 0px的問題,因為tab的左欄加其它原素已經有大於680px的container了
	var letOffset= $(this).offset().left;		//指向tab的左邊間距,運用offset的一個方法,另一個是top(到頂端的距離)

		if (letOffset > 680) {					//當展開後的左欄位大於680px時..

				$(this).next().animate( 
					{ width: "680px"},
					{ duration: 2000, queue: false}
				);

				$(this).prevAll(".code-container").animate(		//上面的一個全部的原素
					{ width: "0px"},
					{ duration: 1000, queue: false}
				);

				//先點JS再點CSS再點JS會出現tab往左移的一種bug, 因此...
				$(this).prevAll(".tab").animate(
					{ marginLeft: "-170px", },
					{ duration: 700, queue: false}
				);

		} else {			// 2. 設定點開動作

				$(this).next().animate(
					{ width: "680px"},
					{ duration: 2000, queue: false}
				);
				}
});


// 4. 設定點按"運行代碼"按鈕, 將執行結果顯示在iframe結果裡
		//先將html,css的內容添加到iframe裡, iframe本身就是有html,head,body..完整的結構, 我們只要直接將html,css的內容添加到body的tag裡.
$("#runCode").click(function(){

		//首先先用contents這個方法讀取iframe裡面的內容. 接下來用find去查body, 找到以後修改裡面html的內容、指向textarea裡面的值(value)..
		//!因為在body裡面#html-code 設定了兩個!所以要特意先指向在textarea那個的#html-code才行.

  //html tab對照iframe的body
	$("#result-frame").contents().find("body").html( $("textarea#html-code").val() );			

  //CSS tab對照iframe的head
	$("#result-frame").contents().find("head").html( "<style>" + $("textarea#css-code").val() + "</style>");	

	//JS tab對照iframe的body則無法用以上jQuery, 必須用javascript. 指向result-frame裡面的內容(在JS裡面contentWindow等於jQuery的contents), eval=執行指向js-code的值.
	document.getElementById("result-frame").contentWindow.eval( $("textarea#js-code").val() );

});