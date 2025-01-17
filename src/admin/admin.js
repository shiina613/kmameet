var departmentData;
var employeeData;
var positionData;

const position_new = document.getElementById("position_new")

var new_employee_name
var new_employee_idEmployee

var new_employee_degree
var new_employee_dob
var new_employee_data;

var new_room_name;
var new_room_capacity;
var new_room_description;
var new_room_data;
var row_edit_room;


var row_edit_role;
var new_role_data;

var row_edit_department;
var new_department_data;


const new_employee_department = document.getElementById("new_employee_department")
const new_employee_position = document.getElementById("new_employee_position")
document.getElementById("account").classList.add('active');
function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

function toggleSubMenu(subMenuId) {
    const subMenu = document.getElementById(subMenuId);
    subMenu.style.display = subMenu.style.display === 'block' ? 'none' : 'block';
}