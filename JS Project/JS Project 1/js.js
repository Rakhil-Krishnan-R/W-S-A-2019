// submit function
function submitForm() {
    name = document.getElementById('itemName').value;
    category = document.getElementById('category').value;
    priority = document.getElementById('priority').value;
    startDate = document.getElementById('startDate').value;
    endDate = document.getElementById('endDate').value;

    // calling uniqFun() for uniqe id
    var uniq = uniqFun();

    // calling validate function
    dateValidate(startDate, endDate, uniq);
}


// unique id generator function
function uniqFun() {
    var date = new Date();
    var uniq = date.getFullYear() + "" + date.getMonth() + "" + date.getDate() + "" + date.getTime();
    return uniq;
}

// data validation function
function dateValidate(startDate, endDate, uniq) {
    if (name.length < 1) {
        alert('name')
        return false;
    }
    if (startDate.length < 1 || endDate.length < 1) {
        alert("dates cant be empty")
        return false
    }

    var SD = (startDate.split("-")).join("");
    var ED = (endDate.split("-")).join("");
    if (SD > ED) {
        alert('incorrect format');
        return false;
    } else {
        objPush(uniq);
    }
}

// function to push data into local storage
function objPush(uniq) {
    var obj = {
        'name': name,
        'category': category,
        'priority': priority,
        'startDate': startDate,
        'endDate': endDate
    };
    localStorage.setItem(uniq, JSON.stringify(obj));
    var len = Object.keys(localStorage).length;

    // calling disptable() to display the particular table row
    dispTable(uniq);
    window.location.reload()
}

// function to loadTable at the start
function loadTable() {
    var dataKeys = Object.keys(localStorage);
    for (let i = 0; i < dataKeys.length; i++) {
        dispTable(dataKeys[i]);
    }
}

// globally declared array
a = [];

// Table display function
function dispTable(uniq) {
    var rootElement = document.getElementById('tbody');
    rootElement.value = " ";
    var data = JSON.parse(localStorage.getItem(uniq));
    var tr = document.createElement('tr');
    tr.id = uniq;
    tr.style.fontSize = '12px'

    var tdData = document.createElement('td');
    tdData.style.textTransform = 'uppercase';
    var tdDatatxt = document.createTextNode(data.name);
    tdData.appendChild(tdDatatxt);
    tr.appendChild(tdData);

    var tdCategory = document.createElement('td');
    var tdCategorytxt = document.createTextNode(data.category);
    tdCategory.appendChild(tdCategorytxt);
    tr.appendChild(tdCategory);

    var tdPriority = document.createElement('td');
    var tdPrioritytxt = document.createTextNode(data.priority);
    tdPriority.appendChild(tdPrioritytxt);
    tr.appendChild(tdPriority);

    var tdStartDate = document.createElement('td');
    var tdStartDatetxt = document.createTextNode(data.startDate);
    tdStartDate.appendChild(tdStartDatetxt);
    tr.appendChild(tdStartDate);

    var tdEndDate = document.createElement('td');
    var tdEndDatetxt = document.createTextNode(data.endDate);
    tdEndDate.appendChild(tdEndDatetxt);
    tr.appendChild(tdEndDate);

    var state = document.createElement('td');
    var checkBtn = document.createElement('input');
    checkBtn.type = 'checkbox';

    // status check function
    checkBtn.onclick = function stateCheck() {
        var check = checkBtn.checked;
        if (check == true) {
            editBtn.disabled = true;
            editBtn.style.background = "gray";
            tr.style.color = "red";
            tr.style.fontSize = '10px';
        } else {
            editBtn.disabled = false;
            editBtn.style.background = "black";
            tr.style.color = "black";
            tr.style.fontSize = '12px';
        }

        // calling updat function to add check status
        updateState(tr.id, check);
    }
    if (data.checkState == true) {
        checkBtn.checked = true;
    }
    if (data.checkState == null) {
        updateState(tr.id, false)
    }
    state.appendChild(checkBtn);
    var editBtn = document.createElement('button');
    editBtn.style.backgroundColor = 'black';
    editBtn.style.color = 'white';
    editBtn.style.fontSize = '10px';
    editBtn.style.margin = '5px'
    var editTxt = document.createTextNode('Edit');
    editBtn.appendChild(editTxt);

    // function to edit the table form
    editBtn.onclick = function editBtn() {
        var editItem = JSON.parse(localStorage.getItem(tr.id));
        document.getElementById('updateButton').style.display = 'inline-block';
        document.getElementById('submitButton').style.display = "none";
        document.getElementById('itemName').value = editItem.name;
        document.getElementById('category').value = editItem.category;
        document.getElementById('startDate').value = editItem.startDate;
        document.getElementById('endDate').value = editItem.endDate;
        rowid = tr.id;
    }
    if (data.checkState == true) {
        editBtn.disabled = true;
        editBtn.style.background = "gray";
        tr.style.color = "red";
        tr.style.fontSize = '10px';
    }
    state.appendChild(editBtn);
    var delBtn = document.createElement('button');
    delBtn.style.backgroundColor = 'black';
    delBtn.style.color = 'white';
    delBtn.style.fontSize = '10px';
    delBtn.style.margin = '5px'
    var delTxt = document.createTextNode('Delete');
    delBtn.appendChild(delTxt);
    state.appendChild(delBtn);

    // delete function to delete row from table
    delBtn.onclick = function aa() {
        localStorage.removeItem(tr.id);
        window.location.reload()
    }
    tr.appendChild(state);
    tr.style.textAlign = 'center'
    tr.style.padding = '0px'
    rootElement.appendChild(tr);
}

// updatestate function for status
function updateState(trId, check) {
    var data = JSON.parse(localStorage.getItem(trId));
    data.checkState = check;
    localStorage.setItem(trId, JSON.stringify(data));
}

// function to update form
function updateForm() {
    name = document.getElementById('itemName').value;
    category = document.getElementById('category').value;
    priority = document.getElementById('priority').value;
    startDate = document.getElementById('startDate').value;
    endDate = document.getElementById('endDate').value;
    dateValidate(startDate, endDate, rowid);
}

// function to search the localstorage
function search() {
    var arr = [];
    var pattern = document.getElementById('search').value;
    var patternReg = new RegExp(pattern, "i");
    var dataKeys = Object.keys(localStorage);
    document.getElementById('tbody').innerHTML = " ";
    for (let i = 0; i < dataKeys.length; i++) {
        var uniq = dataKeys[i];
        var data = JSON.parse(localStorage.getItem(uniq));
        var objKeys = Object.keys(data);
        for (let j = 0; j < objKeys.length; j++) {
            if (patternReg.test(data[objKeys[j]])) {
                if (arr[i] == uniq) {
                    continue;
                } else {
                    arr[i] = uniq
                    document.getElementById('tbody').value = dispTable(uniq);
                }
            }
        }
    }
}

// function to display the compleated tasks
function stateCompleated() {
    document.getElementById('tbody').innerHTML = " ";
    var dataKeys = Object.keys(localStorage);
    for (let i = 0; i < dataKeys.length; i++) {
        var uniq = dataKeys[i];
        var data = JSON.parse(localStorage.getItem(uniq));
        if (data.checkState == true) {
            dispTable(uniq);
        }
    }
}


// function to display the uncompleated task
function stateInCompleated() {
    document.getElementById('tbody').innerHTML = " ";
    var dataKeys = Object.keys(localStorage);
    for (let i = 0; i < dataKeys.length; i++) {
        var uniq = dataKeys[i];
        var data = JSON.parse(localStorage.getItem(uniq));
        if (data.checkState == false) {
            dispTable(uniq);
        }
    }
}