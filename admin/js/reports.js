let currentPage = 1;
let employees = [];

const onLoad = () => {
  document.getElementById("ngalan").innerText =
    sessionStorage.getItem("fullname");

  // displayEmployee();
};

const showNextPage = () => {
  currentPage++;
  showEmployeePage(currentPage);
};

const showPreviousPage = () => {
  if (currentPage > 1) {
    currentPage--;
    showEmployeePage(currentPage);
  } else {
    alert("You are on the first page.");
  }
};

const displayEmployee = () => {
  const head = document.getElementById("head");
  const paginationNumbers = document.getElementById("paginationNumbers");
  const branchSelect = document.getElementById("branch");
  const searchInput = document.getElementById("searchInput");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  head.style.display = "block";
  branchSelect.style.display = "block";
  var url = "http://128.199.232.132/waterworks/admin/get_employee.php";

  const formData = new FormData();
  formData.append("accountId", sessionStorage.getItem("accountId"));

  axios({
    url: url,
    method: "post",
    data: formData,
  })
    .then((response) => {
      employees = response.data;
      console.log(employees);

      if (!Array.isArray(employees) || employees.length === 0) {
        errorTable();
      } else {
        sortEmployeesByName();
        showEmployeePage(currentPage);
      }
    })
    .catch((error) => {
      alert("ERROR! - " + error);
    });
};

const sortEmployeesByName = () => {
  employees.sort((a, b) => {
    const nameA = (a.firstname + " " + a.lastname).toUpperCase();
    const nameB = (b.firstname + " " + b.lastname).toUpperCase();
    return nameA.localeCompare(nameB);
  });
};
const filterEmployee = () => {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const filteredEmployees = employees.filter((employee) => {
    const fullName = (
      employee.firstname +
      " " +
      employee.lastname +
      " " +
      employee.position_name
    ).toLowerCase();
    return fullName.includes(searchInput);
  });
  showFilteredEmployees(filteredEmployees);
};

const showFilteredEmployees = (filteredEmployees) => {
  currentPage = 1;
  showEmployeePage(currentPage, filteredEmployees);
};

const showEmployeePage = (page, employeesToDisplay = employees) => {
  var start = (page - 1) * 10;
  var end = start + 10;
  var displayedEmployees = employeesToDisplay.slice(start, end);
  refreshTable(displayedEmployees);
  showPaginationNumbers(page, Math.ceil(employeesToDisplay.length / 10));
};

const errorTable = () => {
  var html = `
        
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Full Name</th>
              <th scope="col">Phone No</th>
              <th scope="col">Position</th>
              <th scope="col">Branch</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          </table>`;

  document.getElementById("mainDiv").innerHTML = html;
};

const refreshTable = (employeeList) => {
  var html = `
  
        <table class="table mb-0 mt-0">
          <thead>
            <tr>
              <th scope="col">Full Name</th>
              <th scope="col">Position</th>
              <th scope="col">Branch</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
      `;
  employeeList.forEach((employee) => {
    html += `
          <tr>
            <td>${employee.firstname} ${employee.lastname}</td>
            <td>${employee.position_name}</td>
            <td>${employee.branch_name}</td>
            <td>${employee.user_status}</td>
            <td>
              <button class="clear" onclick="edit(${employee.user_id})">Edit</button>  
            </td>
          </tr>
        `;
  });

  html += `</tbody></table>`;

  document.getElementById("mainDiv").innerHTML = html;
};

const showPaginationNumbers = (currentPage, totalPages) => {
  const paginationNumbersDiv = document.getElementById("paginationNumbers");
  let paginationNumbersHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      paginationNumbersHTML += `<span class="active" onclick="goToPage(${i})">${i}</span>`;
    } else {
      paginationNumbersHTML += `<span onclick="goToPage(${i})">${i}</span>`;
    }
  }

  paginationNumbersDiv.innerHTML = paginationNumbersHTML;
};

const goToPage = (page) => {
  currentPage = page;
  showEmployeePage(currentPage);
};
