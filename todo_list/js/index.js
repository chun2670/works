var app = new Vue({
  el: '#app',
  data: {
    newTodo: '', 
    todos: [{ 
      // 2-1 id對應title，用意是點擊title也能連動勾選id的checkbox
      id: '',
      title: '',
      // 2-1 清單裡的"已完成未完成"
      completed: false
    },
    // { 2-3 this.todos.push的東西會動態放到這裡來 },
    ],
    // 4-2 切換頁籤功能。visibility=目前呈現的是哪一個頁籤
    visibility: 'all',
    // 5-1 暫時存放todo的地方
    cacheTodo: {},
    // 5-1 編輯標題時，預存的地方
    cacheTitle: '',

  },

  methods: { 
    // 2-3 新增點擊事件，push物件進todos裡
    addTodo: function(){
      // 2-3 先把newTodo新增的內容設一個變數儲存下來
      // 3-1 新增一個.trim()，功能是在input裡的文字前後有空白鍵的話，會自動刪除掉
      var value = this.newTodo.trim();
      // 2-3 需要一個隨機的id。(把時間轉為數字格式) math.floor=轉為正整數(在這有或沒有都沒差)
      var timestamp = Math.floor(Date.now())
      // 3-1若input裡沒有內容，就不能新增。  !value代表value不存在時，就會執行
      if(!value){
        return;
      }
      // console.log(value, timestamp)
      // 2-4 將綁定todos裡的物件的資料: id, title..push新增成一個新的物件進todos裡

      this.todos.push({
        id: timestamp,
        title: value,
        completed: false
      })
      localStorage.setItem('listData', JSON.stringify(this.todos));
      // 2-5新增完後，input裡的內容清空
      this.newTodo=''
    },

    // 3-2 點XX刪除事件 (原本單純的刪除事件，下方6-1修正後的刪除事件取代)
    // removeTodo: function(key){
    //   this.todos.splice(key,1)
    //   },

    
    // 6-1 刪除在已完成及未完成的索引bug修正
    // 6-1 這裡的 todo = item(todos 個別的物件)，也就是 @click="removeTodo(item)" 帶入的 item
    // 因為使用 v-for 將 filteredTodos(等於 todos)的值一 一帶入 item(v-for="(item, key) in filteredTodos")
    removeTodo: function(todo){
      // 待會使用 forEach撈出來資料的 "索引" 存放在newIndex裡
      var newIndex=''
      var vm=this;
      // 6-1 此迴圈代表，我們要刪除的物件(todo)，跟所有item的id要相符合，若符合，就把key索引值取代到newIndex裡
      // forEach() 跟 v-for 有點像，可以把陣列內的每個元素、物件，皆傳入並執行給定的函式一次
      // 這裡的 todos 是 data 中的 todos 資料。所以這裡的 item = todos 個別的物件，而這裡的 key 也就是 todos 個別的物件的索引
      vm.todos.forEach(function(item,key){
        // forEach 跑第一次假設-→item={id: 123}，然後 key= 0，假設todo.id(12345) === item.id(123) 條件不成成立..以此類推
        if(todo.id===item.id){
          // forEach跑到條件 "成立"的狀態下，將其key帶入 newIndex ，這樣 newIndex 就是正確的索引了
          newIndex=key
        }
      })
      
      this.todos.splice(newIndex,1)
      localStorage.setItem('listData', JSON.stringify(this.todos));
      },
      // 6-1 精簡寫法
      // removeTodo: function(todo){
      // var vm=this;
      // var newIndex= vm.todos.findIndex(function(item,key){
      //  return todo.id === item.id;
      // })
      // this.todos.splice(newIndex,1)
      // },
      
      // 清除所有清單
      cleanAll: function(){
      // 讓 todos 資料變成空的
      this.todos = [];
      localStorage.setItem('listData', JSON.stringify(this.todos));
    },


    // 5-1 雙擊滑鼠修改li內容
      // 5-1 須把item另外存起來，以便知道哪一筆資料為目前正在編輯中的
    editTodo: function(item){
      this.cacheTodo = item;
      this.cacheTitle = item.title
    },
    
    
    // 5-3 按ESC鍵，取消編輯
    cancelEdit: function(){
      this.cacheTodo={}
    },
    
    // 5-4 按enter鍵，完成編輯。把這個item的title指向剛才預存的標題。再把預存的標題清空。最後將cacheTodo替換回來，enter鍵完才能顯示回已編輯過的li
    doneEdit: function(item){
      item.title= this.cacheTitle;
      this.cacheTitle= "";
      this.cacheTodo={}
    },
  },

  
  // 4-3 過濾"進行中"與"已完成"功能
  // computed功能不會動到原本的資料(todos的資料)，作呈現用
  computed: {
    filteredTodos: function(){
      this.todos = JSON.parse(localStorage.getItem('listData')) || [];
      if(this.visibility=='all'){
        return this.todos
      }else if(this.visibility=='todoing'){
        // 4-3 設一個空陣列變數來接收todo沒有完成的資料內容(compeleted=false的)
        // 4-3 item=每一個todo清單.  !item如果這清單內容的completed=false(未打勾)，則執行..
        var processingTodos = [];
        this.todos.forEach( function(item){
          if( !item.completed ){
            processingTodos.push(item);
          }
        } )
        return processingTodos;
      }else if(this.visibility=='done'){
        var doneTodos = [];
        this.todos.forEach( function(item){
          if( item.completed ){
            doneTodos.push(item);
          }
        } )
        return doneTodos;
      }
    },
    
    
    // 計算未完成的數量
    notDoneTodo: function(){
      // 設一個空陣列，等等篩選出來的資料(completed= false) 放這裡
      var newTodo = [];
       // forEach() 會將陣列內的每個元素、物件，皆傳入並執行給定的函式一次。
        // 所以這裡 item 為 todos 內個別的物件
      this.todos.forEach(function(item){
        if(item.completed==false){
          // 將成立條件 todos 內個別的物件，加到 變數 newTodo(陣列) 中
          newTodo.push(item);
        }
      })
      var num = newTodo.length;
      return num;
    }
  },
  
  updated(){
      localStorage.setItem('listData', JSON.stringify(this.todos));
    }
  
})