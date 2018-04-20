//Storage controller

//Item Controller
const ItemCtrl = (function () {
    //Item constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //data structure
    const data = {
        items: [{
                id: 0,
                name: 'Dinner',
                calories: 300
            },
            {
                id: 1,
                name: 'Eggs',
                calories: 400
            },
            {
                id: 2,
                name: 'Cookies',
                calories: 600
            },
        ],
        currentItem: null,
        totalCalories: 0
    }

    //make it public
    return {
        getData: function () {
            return data.items;
        },
        logData: function () {
            return data;
        },
        addItem: function(name, calories){
            let ID;
            let newItem;
            //create Id
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            //Calories to number
            calories = parseInt(calories);

            //Now create new item - we have constructor at no 6
            newItem = new Item(ID, name, calories);

            //push this new item to array
            data.items.push(newItem);
            //we need to return this because we are using this newitem in app controller
            return newItem;
        },
        getTotalCalories: function(){
            let total = 0;
            data.items.forEach(function(item){
                total += item.calories;
            })
            //setting the total calories on data array
            data.totalCalories = total;
            return total;
        },
        getItemById: function(id){
            let found = null;
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            })
            return found;
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(item){
            return data.currentItem;
        },
        updateItem: function(name, calories){
            //Calorie to number
            calories = parseInt(calories);
            let found = null;
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id){
            //get ids
            const ids = data.items.map(function(item){
                return item.id;
            });
            //get Index
            const index = ids.indexOf(id);

            //remove item
            data.items.splice(index, 1);
        },
        clearAllItemsData: function(){
            data.items = [];
        }

    }
})();
//UI Controller
const UICtrl = (function () {
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        listitems: '#item-list li',
        clearBtn: '.clear-btn'
    }
    return {
        populateItems: function (items) {
            let html = '';
            items.forEach(function (item) {
                html += `
                <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
                </li>`
            });
            //insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getSelectors: function(){
            return UISelectors;
        },
        getInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            //create li element
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`
            //insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
        },
        showEditState: function(){
            document.querySelector(UISelectors.addBtn).style.display = 'none';
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listitems);
            //Above gives node lists - we can not loop through the node list hence needs to convert to array
            listItems = Array.from(listItems);
            //now looop through
            listItems.forEach(function(listItem){
                let itemId = listItem.getAttribute('id');
                if(itemId === `item-${item.id}`){
                    document.querySelector(`#${itemId}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                      <i class="edit-item fa fa-pencil"></i>
                    </a>`
                }
                listItem
            })
        },
        deleteListItem: function(id){
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listitems);
            listItems = Array.from(listItems);
            listItems.forEach(function(item){
                item.remove();
            })
        }
    }
})();

//App Controller
const App = (function (ItemCtrl, UICtrl) {
    //Load Event Listeners
    const loadEventListeners = function(){
        //Select all the selectors
        const UISelectors = UICtrl.getSelectors();
        //add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        //edit icon click
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
        //update item submit
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
        //Delete button function
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
        //back button clearing out edit state
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
        //Clear all btn action
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItems);
    }
    //Item add submit function
    const itemAddSubmit = function(e){
        //Get the data from input field
        const input = UICtrl.getInput();
        //check if input fields are filled
        if(input.name !== '' && input.calories !== ''){
            //add the item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            //add item to UI list
            UICtrl.addListItem(newItem);
            //clear the input fields
            UICtrl.clearInput();
            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories()
            //Now that we have received the total - lets show in UI
            UICtrl.showTotalCalories(totalCalories);
        }
        e.preventDefault();
    }
    //Click edit item
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            //Get the list item ID
            const listId = e.target.parentNode.parentNode.id
            //now collect it in array
            const listIdArr = listId.split('-');
            //Get the Id from arry
            const id = parseInt(listIdArr[1]);
            //get the item of perticular ID
            const itemToEdit = ItemCtrl.getItemById(id);
            //set the current item
            ItemCtrl.setCurrentItem(itemToEdit);
            //Add item to form
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }
    const itemUpdateSubmit = function(e){
        //get item input
        let input = UICtrl.getInput();
        //updated item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
        //update the UI
        UICtrl.updateListItem(updatedItem);
        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories()
        //Now that we have received the total - lets show in UI
        UICtrl.showTotalCalories(totalCalories);
        //clear edit state
        UICtrl.clearEditState();
        e.preventDefault();
    }
    //delete function
    const itemDeleteSubmit = function(e){
        //Get current Item
        const currentitem = ItemCtrl.getCurrentItem()

        //delete from data strcture
        ItemCtrl.deleteItem(currentitem.id);
        //delete from UI
        UICtrl.deleteListItem(currentitem.id);
        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories()
        //Now that we have received the total - lets show in UI
        UICtrl.showTotalCalories(totalCalories);
        //clear edit state
        UICtrl.clearEditState();
        e.preventDefault();
    }
    //clear all items on clear all btn
    const clearAllItems = function(){
        //delete all items from data structre
        ItemCtrl.clearAllItemsData();
        //delete from UI
        UICtrl.removeItems();
        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories()
        //Now that we have received the total - lets show in UI
        UICtrl.showTotalCalories(totalCalories);
    }


    //initialize the app
    return {
        init: function () {
            console.log('initializing the App...');
            //clear edit state
            UICtrl.clearEditState();
            UICtrl.populateItems(ItemCtrl.getData());
            loadEventListeners()
            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories()
            //Now that we have received the total - lets show in UI
            UICtrl.showTotalCalories(totalCalories);
        }
    }
})(ItemCtrl, UICtrl);

//calling the init function.
App.init();

//***Practice***//

//Item Controller
// const itemCtrl = (function () {
//     //now we are getting the data upon click.. lets make constructor to add new items
//     const Item = function (id, name, calories) {
//         this.id = id;
//         this.name = name;
//         this.calories = calories;
//     }

//     const data = {
//         items: [{
//                 ID: 0,
//                 name: 'Bread',
//                 calories: '500'
//             },
//             {
//                 ID: 1,
//                 name: 'Milk',
//                 calories: '600'
//             },
//             {
//                 ID: 2,
//                 name: 'Orange Juice',
//                 calories: '800'
//             }
//         ]
//     }

//     //make it public
//     return {
//         getData: function () {
//             return data.items;
//         },
//         addItem: function (name, calories) {
//             //create ID
//             let ID = 522;
//             //convert calories into number
//             calories = parseInt(calories);
//             //initiate the constructor
//             let newItem;
//             newItem = new Item(ID, name, calories)
//             data.items.push(newItem);
//             return newItem;
//         }
//     }

// })();

// //UI Controller
// const UICtrl = (function () {
//     const UISelectors = {
//         itemList: '#item-list',
//         name: '#item-name',
//         calories: '#item-calories'
//     }

//     return {
//         populateData: function (items) {
//             let html = '';
//             items.forEach(function (item) {
//                 html += `
//                             <li class="collection-item" id="item-${item.id}">
//                             <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
//                             <a href="#" class="secondary-content">
//                                 <i class="fa fa-pencil"></i>
//                             </a>
//                             </li>
//                         `
//             });
//             //insert into DOM
//             document.querySelector(UISelectors.itemList).innerHTML = html;
//         },
//         getSelectors: function () {
//             return UISelectors;
//         },
//         getValue: function () {
//             return {
//                 name: document.querySelector(UISelectors.name).value,
//                 calories: document.querySelector(UISelectors.calories).value
//             }
//         },
//         clearInput: function () {
//             document.querySelector(UISelectors.name).value = '';
//             document.querySelector(UISelectors.calories).value = '';
//         }
//     }

// })();

// //App Controller
// const appCtrl = (function (itemCtrl, UICtrl) {
//     //creating load event listeners
//     const loadEventListener = function () {
//         document.querySelector('.add-btn').addEventListener('click', itemAddSubmit);
//     }
//     const itemAddSubmit = function (e) {
//         // Get the data from input field
//         const input = UICtrl.getValue();

//         //check if the input is filled...
//         if (input.name !== '' && input.value !== '') {
//             // add the new item
//             const newItem = itemCtrl.addItem(input.name, input.calories)
//             //Adding this new item to UI
//             UICtrl.populateData(itemCtrl.getData());
//             //After adding - clear the input value
//             UICtrl.clearInput();
//         }
//         e.preventDefault();
//     }
//     return {
//         init: function () {
//             //utilise the data from Item ctrl
//             UICtrl.populateData(itemCtrl.getData());
//             //event listener initialized
//             loadEventListener();
//         }
//     }
// })(itemCtrl, UICtrl);

// appCtrl.init();