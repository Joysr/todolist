var ToDoList = (function(){
    var instance;

    function ToDoList() {
        this.newItem = document.getElementById("new-item");
        this.addBtn = document.getElementById("add-btn");
        this.todoList = document.getElementById("to-do-list").getElementsByTagName("ul")[0];
        this.doneList = document.getElementById("done-list").getElementsByTagName("ul")[0];


        if (window.localStorage && localStorage.todolist) {
            this.localList = JSON.parse(localStorage.todolist);
            this.init();
        } else {
            this.localList = {
                "todo": [],
                "done": []
            };
        }
        this.bindEvent();
    }

    ToDoList.prototype.init = function() {
        var todo = this.localList.todo;
        var done = this.localList.done;

        for (var i = 0; i < todo.length; i++) {
            this.createItem("todo", todo[i]);
        }
        for (var j = 0; j < done.length; j++) {
            this.createItem("done", done[j]);
        }
    };

    ToDoList.prototype.addToLocalList = function(list, item) {
        if (list.getAttribute("data-type") === "todo") {
           this.localList.todo.push(item);
        } else {
            this.localList.done.push(item);
        }
        if (window.localStorage) { // 只有在浏览器支持的时候才运行这里的代码
            localStorage.todolist = JSON.stringify(this.localList);
        }
    };

    ToDoList.prototype.removeFromLocalList = function(list, item) {
        if (list.getAttribute("data-type") === "todo") {
            if (this.localList.todo.indexOf(item) !== -1) {
                this.localList.todo.splice(this.localList.todo.indexOf(item), 1);
            }
        } else {
            if (this.localList.done.indexOf(item) !== -1) {
                this.localList.done.splice(this.localList.done.indexOf(item), 1);
            }
        }
        if (window.localStorage) { // 只有在浏览器支持的时候才运行这里的代码
            localStorage.todolist = JSON.stringify(this.localList);
        }
    };

    ToDoList.prototype.addNewItem = function() {
        if(this.newItem.value === "") {
            //TODO: tipso
            alert("内容不能为空");
        } else {
            var itemContent = this.newItem.value;
            this.createItem("todo", itemContent);
            this.newItem.value = "";
            this.localList.todo.push(itemContent);

            if (window.localStorage) { // 只有在浏览器支持的时候才运行这里的代码
                localStorage.todolist = JSON.stringify(this.localList);
            }
        }
    };

    ToDoList.prototype.delItem = function(delBtn) {
        var list = delBtn.parentNode;
        var itemContent = list.getAttribute("data-item");
        this.removeFromLocalList(list, itemContent);
        list.parentNode.removeChild(list);

    };

    ToDoList.prototype.editItem = function(_this, btn) {
        var list = btn.parentNode;
        var label = list.getElementsByTagName("label")[0];
        var editArea = list.querySelector("input[type='text']");
        var icon =btn.getElementsByTagName("i")[0];
        var fa = icon.getAttribute("class");
        var containsClassEdit = list.classList.contains("edit");

        if (containsClassEdit) {
            label.innerText = editArea.value;
            list.setAttribute("data-item", editArea.value);
            _this.addToLocalList(list, editArea.value);

            fa = fa.replace(/save/, "edit");
            icon.setAttribute("class", fa);

        } else {
            editArea.value = label.innerText;
            list.setAttribute("data-item", label.innerText);

            var itemContent = list.getAttribute("data-item");
            _this.removeFromLocalList(list, itemContent);

            fa = fa.replace(/edit/, "save");
            icon.setAttribute("class", fa);

        }
        list.classList.toggle("edit");
    };

    ToDoList.prototype.markAsDone = function(checkbox) {
        var _this = this;
        var list = checkbox.parentNode;
        var text = list.getAttribute("data-item");
        this.removeFromLocalList(list, text);
        list.setAttribute("data-type", "done");
        this.addToLocalList(list, text);

        list.parentNode.removeChild(list);
        this.doneList.appendChild(list);
        checkbox.removeEventListener("change", function() {
            _this.markAsDone(this);
        });
        checkbox.addEventListener("change", function() {
            _this.markAsTodo(this);
        });
    };

    ToDoList.prototype.markAsTodo = function(checkbox) {
        var _this = this;
        var list = checkbox.parentNode;
        var text = list.getAttribute("data-item");
        this.removeFromLocalList(list, text);
        list.setAttribute("data-type", "todo");
        this.addToLocalList(list, text);

        list.parentNode.removeChild(list);
        this.todoList.appendChild(list);
        checkbox.removeEventListener("change", function() {
            _this.markAsTodo(this);
        });
        checkbox.addEventListener("change", function() {
            _this.markAsDone(this);
        });
    };

    ToDoList.prototype.createItem = function(type, content) {
        var _this = this;
        var li = document.createElement("li");
        li.setAttribute("data-item", content);
        li.setAttribute("data-type", "todo");

        var checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.addEventListener("change", function() {
            _this.markAsDone(this);
        });

        var label = document.createElement("label");
        label.innerText = content;

        var text = document.createElement("input");
        text.setAttribute("type", "text");
        text.setAttribute("class", "edit-area");
        text.value = content;

        var editBtn = document.createElement("a");
        // editBtn.setAttribute("href", "#");
        editBtn.setAttribute("class", "edit-btn btn");

        editBtn.addEventListener("click", function() {
            _this.editItem(_this, editBtn);
        });

        var editIcon = document.createElement("i");
        editIcon.setAttribute("class", "fa fa-edit");
        editBtn.appendChild(editIcon);

        var delBtn = document.createElement("a");
        // delBtn.setAttribute("href", "#");
        delBtn.setAttribute("class", "del-btn btn");

        delBtn.addEventListener("click", function(e) {
            e.preventDefault();
            var delConfirm = confirm("确定要删除吗? 现在还没有回收站功能哦");
            if (delConfirm) {
                _this.delItem(this);
            }
        });
        var delIcon = document.createElement("i");
        delIcon.setAttribute("class", "fa fa-trash-o");
        delBtn.appendChild(delIcon);

        li.appendChild(checkbox);
        li.appendChild(label);
        li.appendChild(text);
        li.appendChild(editBtn);
        li.appendChild(delBtn);

        if (type === "todo") {
            this.todoList.appendChild(li);
        } else {
            this.doneList.appendChild(li);
        }

    };

    ToDoList.prototype.bindEvent = function() {
        var _this = this;
        this.addBtn.addEventListener("click", function() {
            _this.addNewItem();
        });

    };

    if (!instance) {
        instance = new ToDoList();
    }
    return instance;
})();