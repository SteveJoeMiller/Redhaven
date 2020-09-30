// View Controller
let UICtrl = (function () {

  let DOMstrings = {
    inputBtn: '#input-btn',
    toDo: '#text-input',
    date: '#date-input',
    listContainer: '#to-do-list',
    iconRemove: '.icon-remove'
  };

  return {
    getInput: function() {
        return {
            item: document.querySelector(DOMstrings.toDo).value,
            date: document.querySelector(DOMstrings.date).value 
        };
    },

  addListItem: function(obj) {
      let html, newHtml, element;
      // Create HTML string with placeholder text
     
      element = DOMstrings.listContainer;
      
      let date = new Date(obj.date);
      date.setMinutes(date.getTimezoneOffset());
      let newDate = date.toLocaleDateString("en-US");
              
      if(obj.toDo) {} 
      else {
        return
      };
      
      if (obj.date) {
        html = '<li name= "list-item-task" id= "list-item-%id%" class="list-item-task">%toDo% by %date%<ion-icon id="icon-remove" name="close-circle-outline" class="icon-remove animate__animated"></ion-icon></li>';
      } else { 
        html = '<li name= "list-item-task" id= "list-item-%id%" class="list-item-task">%toDo%<ion-icon id="icon-remove" name="close-circle-outline" class="icon-remove animate__animated"></ion-icon></li>';
      }

      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%toDo%', obj.toDo);
      newHtml = newHtml.replace('%date%', newDate);
      
      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
  },
  
  jQueryDelete: function() {

    //hover to expose delete icon
        $(".list-item-task").hover(
            function () {
              $(this).children(".icon-remove").addClass("animate__fadeIn");
            },
            function () {
              $(this).children(".icon-remove").removeClass("animate__fadeIn");
        });
      },
  
  jQueryComplete: function() {
    
     //click list items to add strikethrough
        $("#to-do-list").on('click','.list-item-task', function () {
        
          $(this).toggleClass("task-complete")

        });
  },

  deleteListItem: function(selectorID) {
            
    let el = document.getElementById(selectorID);
    el.parentNode.removeChild(el);
    
},

  clearInputs: function() {
    let fields, fieldsArr
    //returns input fields as a list
    fields = document.querySelectorAll(DOMstrings.toDo + ',' + DOMstrings.date);
    //convert list of fields to array
    fieldsArr = Array.prototype.slice.call(fields);

    fieldsArr.forEach(function(curr) {
          curr.value = '';
    });

    fieldsArr[0].focus();
  
  },

    getDOMstrings: function() {
      return DOMstrings;

    }
  };
  })();

let listCtrl = (function (){

  let toDoList = [];
  console.log(toDoList);

    let Item = function(id, toDo, date) {
    this.id = id;
    this.toDo = toDo;
    this.date = date;
};

  
  return {
    addItem: function(toDo, date) {
      let newItem, ID;
      let localListStorage = localStorage    
      // Create new ID
      if (toDoList.length > 0) {
        ID = toDoList.length;
    } else {
        ID = 0;
    }
    
    newItem = new Item(ID, toDo, date)
    
    toDoList.push(newItem);

    localListStorage.setItem('list', JSON.stringify(toDoList))
    return newItem;
  
  },
    deleteItem: function(id) {
      let ids, index;
      let localListStorage = localStorage
    
      ids = toDoList.map(function(current) {
          return current.id;
      });

      index = ids.indexOf(id);
      console.log(index);

      if (index !== -1) {
          toDoList.splice(index, 1);
          localListStorage.setItem('list', JSON.stringify(toDoList))
          console.log(localStorage);
      }
    
    },
  }
})(); 


let controller = (function (UICtrl, listCtrl) { 
    let DOM = UICtrl.getDOMstrings();

    let setupEventListeners = function() {
      
      document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
      document.querySelector(DOM.listContainer).addEventListener('click', ctrlDeleteItem);

    };

    let ctrlAddItem = function () {
    
      let input, newItem;  
    
      input = UICtrl.getInput();
      newItem = listCtrl.addItem(input.item, input.date);
      UICtrl.addListItem(newItem);
      UICtrl.clearInputs();

    };

    var ctrlDeleteItem = function(event) {
      let itemID, splitID, ID;
      
      itemID = event.target.parentNode.id;
      
      if (itemID != 'to-do-list') {
          
          //inc-1
          splitID = itemID.split('-');
          ID = parseInt(splitID[2]);
                    
          // 1. delete the item from the data structure
          listCtrl.deleteItem(ID);
          
          // 2. Delete the item from the UI
          UICtrl.deleteListItem(itemID);
          
      }
  };

    return {
      init: function() {
          console.log('Application has started.');
          setupEventListeners();
          UICtrl.jQueryDelete();
          UICtrl.jQueryComplete();

          let localList = localStorage.getItem("list");
          let parseList = JSON.parse(localList);
          
          for (i=0; i<parseList.length; i++) {
          console.log(parseList[i].toDo,parseList[i].date)
          newItem = listCtrl.addItem(parseList[i].toDo,parseList[i].date);
          UICtrl.addListItem(newItem);
          }

      }
  };

  })(UICtrl, listCtrl);
  
controller.init();
