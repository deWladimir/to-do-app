//
let taskArray = [];
let counter = 0;
let completedTasksArray = [];

const elementWithClassId = (element, className, id, type) => {
    const result = document.createElement(element);
    if(id) {
        result.setAttribute('id', id);
    }
    if(className) {
        result.className= className;
    }
    if(type) {
        result.setAttribute('type', type);
    }
    return result;
}

const elementWithTextNode = (element, textNode) => {
    const text = document.createTextNode(textNode);
    element.appendChild(text);
    return element;
}

const render = () => {
    if(document.getElementById('taskTable') == null) {
        const taskTable = elementWithClassId('div', null, 'taskTable')
        taskTable.style.display = 'none';
        document.body.appendChild(taskTable);
    }
}

const deleteTask = (task_Id) => {
    taskArray = taskArray.filter(obj => {
        if(obj.id == task_Id) {
            return false;
        } else {
            return true;
        }
    });
}

const deleteRow = (event) => {
    const parent_id = event.target.parentNode.id;

    deleteTask(parent_id);

    if(taskArray.length == 0) {
        document.getElementById('taskTable').style.display = 'none';
    }

    document.getElementById('taskTable').removeChild(document.getElementById(parent_id));
}

const addRow = (taskTitle) => {
    const id_str = 'taskTableRow_';

    if(taskArray.length < 1) {
        document.getElementById('taskTable').style.display = 'flex';
    }

    taskArray.push({
        title: taskTitle,
        id: id_str + String(counter)
    });

    const row = elementWithClassId('div', 'row', id_str + String(counter));

    const check = elementWithClassId('label', 'checkContainer');
    const checkBox = elementWithClassId('input', null, null, 'checkbox');
    const span = elementWithClassId('span', 'checkMark', 'checkMark_' + id_str + String(counter));
    check.appendChild(checkBox);
    check.appendChild(span);
    row.appendChild(check);

    check.addEventListener('click', (event) => {
        const parent_id = event.target.parentNode.parentNode.id;

        const task = taskArray.filter( obj => {
            if(obj.id == parent_id) {
                return true;
            }
        })[0];

        console.log(task);

        const date = new Date();
        let dd = String(date.getDate());
        dd = dd.length > 1 ? dd : '0' + dd;
        let mm = String(date.getMonth() + 1);
        mm = mm.lenght > 1 ? mm : '0' + mm;
        let yyyy = date.getFullYear();

        console.log(dd, mm, yyyy);

        addCompletedRow(completedTasksArray.length + 1, task.title, dd + '.' + mm + '.' + yyyy);

        setTimeout(() => {
            event.target.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode);
        }, 200);

        deleteTask(parent_id);
    })

    const p = elementWithTextNode(elementWithClassId('p', null, null), taskTitle);
    row.appendChild(p);

    const button = elementWithTextNode(elementWithClassId('button', null, null), 'Delete');
    button.addEventListener('click', deleteRow);
    row.appendChild(button);

    document.getElementById('taskTable').appendChild(row);

    counter++;
}



const saveBtnClick = () => {
    textBoxValue = document.getElementById('modal-input').value;

    const taskAddedDiv = elementWithClassId('div', null, 'task-added');

    const taskAddedParag = elementWithTextNode(elementWithClassId('p', null, null), 'New Task Created');
    taskAddedDiv.appendChild(taskAddedParag);

    const modalWindow = document.getElementById('modal-window');
    modalWindow.appendChild(taskAddedDiv);
    taskAdded(taskAddedDiv, modalWindow, taskAddedDisappear, textBoxValue);
    
}

//animate functions

const taskAdded = (element, parent, func, text) => {
    let timer = setInterval(() => {
        if(element.style.opacity == 1) {
            clearInterval(timer);
            func(element, parent, text);
        } else {
            element.style.opacity++;
        }
    }, 200);
}

const taskAddedDisappear = (child, parent, text) => {
    let timer = setInterval(() => {
        if(child.style.opacity == 0) {
            clearInterval(timer);
            addRow(text);
            document.body.removeChild(parent);
            addBtn.disabled = false;
            return;
        } else {
            child.style.opacity--;
        }
    }, 200);
}

const crossName = (element, parent_id) => {
    parent = document.getElementById(parent_id);
    element = parent.querySelector('p');


}

// end of animate functions

const resetBtnClick = () => {
    document.getElementById('modal-input').value = '';
}


const createModalWindow = () => {
    if(document.getElementById('modal-window') == null) {


        const modalDiv = elementWithClassId('div', 'modal-window', 'modal-window');
        const div_header = elementWithClassId('div', 'modal-header', null);
        modalDiv.appendChild(div_header);

        const p = elementWithTextNode(elementWithClassId('p', null, null), 'Add a task');
        div_header.appendChild(p);

        const closeModal = elementWithTextNode(elementWithClassId('button', null, null), 'X');

        closeModal.addEventListener('click', () => {
            document.body.removeChild(document.getElementById('modal-window'));
        });

        div_header.appendChild(closeModal);

        const inputTitle = document.createElement('input');
        inputTitle.setAttribute('type', 'text');
        inputTitle.setAttribute('id', 'modal-input');
        inputTitle.setAttribute('placeholder', 'Add a task');
        modalDiv.appendChild(inputTitle);

        const buttons_foot = elementWithClassId('div', 'modal-footer', null);
        modalDiv.appendChild(buttons_foot);

        const saveBtn = elementWithTextNode(elementWithClassId('button', null, 'saveBtn'), 'Save');
        saveBtn.disabled = true;
        saveBtn.addEventListener('click', saveBtnClick);
        buttons_foot.appendChild(saveBtn);

        const resetBtn = elementWithTextNode(elementWithClassId('button', null, 'resetBtn'), 'Reset');
        resetBtn.disabled = true;
        resetBtn.addEventListener('click', resetBtnClick);
        buttons_foot.appendChild(resetBtn);

        inputTitle.addEventListener('input', () => {
            if(inputTitle.value !=null && inputTitle.value != '') {
                saveBtn.disabled = false;
                resetBtn.disabled = false;
            } else {
                saveBtn.disabled = true;
                resetBtn.disabled = true;
            }
            console.log(inputTitle.value);
        });

        addBtn.disabled = true;
        document.body.appendChild(modalDiv);
    }
}

const createHeaderForCompleted = () => {
    const div_completed = elementWithClassId('div', 'completed-tasks', 'completed-tasks');
        const header = elementWithClassId('div', 'completed-header');
        const completedHeader = elementWithTextNode(elementWithClassId('p'), 'Completed Tasks');
        

        const checkBox = elementWithClassId('label', 'compl-label-check', 'compl-label-check');
        const input = elementWithClassId('input');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('checked', 'true');
        input.addEventListener('click', (event) => {
            if(event.target.checked) {
                checkBox.style.backgroundColor = 'rgb(111, 111, 228)';
                setTimeout(() => {
                    completedTasksArray.forEach(obj => {
                        itearateCompletedArrayView(obj.rowNum, obj.name, obj.date);
                    });
                }, 200);
            }
            else if(!event.target.checked) {
                checkBox.style.backgroundColor = 'rgb(179, 179, 179)';
                parent = document.getElementById('completed-tasks');
                elements = document.getElementsByClassName('div-compl-task');
                while(elements.length > 0) {
                    console.log(elements[0]);
                    parent.removeChild(elements[0]);
                }
            }
        });
        const span = elementWithClassId('span');
        checkBox.appendChild(input);
        checkBox.appendChild(span);

        header.appendChild(completedHeader);
        header.appendChild(checkBox);

        div_completed.appendChild(header);

        document.body.appendChild(div_completed);
}

const addCompletedRow = (rowNum, name, date) => {
    if(completedTasksArray.length == 0) {
        createHeaderForCompleted();
    }

    itearateCompletedArrayView(rowNum, name, date);

    completedTasksArray.push({
        rowNum: rowNum,
        name: name,
        date: date
    });
}

const itearateCompletedArrayView = (rowNum, name, date) => {
    const parent = document.getElementById('completed-tasks');
    const div_task = elementWithClassId('div', 'div-compl-task');
    const number = elementWithTextNode(elementWithClassId('p', 'rowNum'), rowNum + '.');
    const title = elementWithTextNode(elementWithClassId('p', 'compl-title'), name);
    const P_date = elementWithTextNode(elementWithClassId('p', 'compl-date'), date);

    div_task.appendChild(number);
    div_task.appendChild(title);
    div_task.appendChild(P_date);

    parent.appendChild(div_task);
}


render();

const addBtn = document.getElementById("add_new_task");
addBtn.addEventListener('click', createModalWindow);