let currentPage = 1;
let employees = [];

const onLoad = () => {
  document.getElementById("ngalan").innerText =
    sessionStorage.getItem("fullname");
  displayEmployee();
  getFileterBranch();
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
  paginationNumbers.style.display = "block";
  branchSelect.style.display = "block";
  searchInput.style.display = "block";
  prevBtn.style.display = "block";
  nextBtn.style.display = "block";
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
const getFileterBranch = () => {
  const branchSelect = document.getElementById("branch");
  var myUrl = "http://128.199.232.132/waterworks/admin/get_branch.php";

  axios({
    url: myUrl,
    method: "post",
  })
    .then((response) => {
      var positions = response.data;

      var options = `<option value="employee">Select Branch</option>`;
      positions.forEach((position) => {
        options += `<option value="${position.branch_name}">${position.branch_name}</option>`;
      });
      branchSelect.innerHTML = options;

      // Event listener for position change
      branchSelect.addEventListener("change", () => {
        const selectedBranch = branchSelect.value;
        // Call the appropriate display function based on the selected position
        if (selectedBranch === "Poblacion") {
          displayPoblacionEmployee();
        } else if (selectedBranch === "Molugan") {
          displayMuloganEmployee();
        } else {
          displayEmployee();
        }
        // Add more conditions as needed for other positions
      });
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
    });
};

const displayPoblacionEmployee = () => {
  var url = "http://128.199.232.132/waterworks/admin/get_employee_poblacion.php";

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
      sortPoblacionEmployeesByName();
      showPoblacionEmployeePage(currentPage);
    })
    .catch((error) => {
      alert("ERROR! - " + error);
    });
};

const sortPoblacionEmployeesByName = () => {
  employees.sort((a, b) => {
    const nameA = (a.firstname + " " + a.lastname).toUpperCase();
    const nameB = (b.firstname + " " + b.lastname).toUpperCase();
    return nameA.localeCompare(nameB);
  });
};

const showPoblacionEmployeePage = (page, employeesToDisplay = employees) => {
  var start = (page - 1) * 10;
  var end = start + 10;
  var displayedEmployees = employeesToDisplay.slice(start, end);
  PoblacionrefreshTables(displayedEmployees);
  showPaginationNumbers(page, Math.ceil(employeesToDisplay.length / 10));
};

const PoblacionrefreshTables = (employeeList) => {
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

const displayMuloganEmployee = () => {
  var url = "http://128.199.232.132/waterworks/admin/get_employee_mulogan.php";

  const formData = new FormData();
  formData.append("accountId", sessionStorage.getItem("accountId"));

  axios({
    url: url,
    method: "post",
    data: formData,
  })
    .then((response) => {
      employees = response.data;
      sortMuloganEmployeesByName();
      showMuloganEmployeePage(currentPage);
    })
    .catch((error) => {
      alert("ERROR! - " + error);
    });
};

const sortMuloganEmployeesByName = () => {
  employees.sort((a, b) => {
    const nameA = (a.firstname + " " + a.lastname).toUpperCase();
    const nameB = (b.firstname + " " + b.lastname).toUpperCase();
    return nameA.localeCompare(nameB);
  });
};

const showMuloganEmployeePage = (page, employeesToDisplay = employees) => {
  var start = (page - 1) * 10;
  var end = start + 10;
  var displayedEmployees = employeesToDisplay.slice(start, end);
  MuloganrefreshTables(displayedEmployees);
  showPaginationNumbers(page, Math.ceil(employeesToDisplay.length / 10));
};

const MuloganrefreshTables = (employeeList) => {
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

// ---------------------------------------------FOR EDIT-----------------------------------------------------
const edit = (user_id) => {
  const head = document.getElementById("head");
  const paginationNumbers = document.getElementById("paginationNumbers");
  const branchSelect = document.getElementById("branch");
  const searchInput = document.getElementById("searchInput");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  head.style.display = "none";
  paginationNumbers.style.display = "none";
  branchSelect.style.display = "none";
  searchInput.style.display = "none";
  prevBtn.style.display = "none";
  nextBtn.style.display = "none";

  var myUrl = "http://128.199.232.132/waterworks/admin/getemployee.php";
  const formData = new FormData();
  formData.append("user_id", user_id);

  axios({
    url: myUrl,
    method: "post",
    data: formData,
  })
    .then((response) => {
      console.log(response.data);
      try {
        if (response.data.length === 0) {
          // Display a message indicating there are no billing transactions yet.
          var html = `<h2>No Records</h2>`;
        } else {
          var employee = response.data;
          console.log("Emplloyees : ", employee);
          var html = `
                <div class=" row  mt-1">
                  <div class="col-md-1 mt-3">
                    <button class="clear" onclick="displayEmployee()">Back</button>
                  </div>
                  <div class="col-md-11 mt-3">
                    <h4 style="text-align: center;">Edit Employee</h4>
                  </div>
                </div>
                <div class="container-fluid mt-3">
                    <form class="row g-3">
                        <label class="form-label mt-2 mb-0 underline-label">Personal Information</label>
                        <div class="col-md-4 mt-3" >
                          <label class="form-label">First Name</label>
                          <input type="text" class="form-control" id="firstname" value="${employee[0].firstname}" required>
                        </div>
                        <div class="col-md-4 mt-3">
                            <label class="form-label">Middle Name</label>
                            <input type="text" class="form-control" id="middlename" value="${employee[0].middlename}" required>
                          </div>
                        <div class="col-md-4 mt-3">
                          <label class="form-label">Last Name</label>
                          <input type="text" class="form-control" id="lastname" value="${employee[0].lastname}" required>
                        </div>
                        <div class="col-md-4 mt-3">
                            <label class="form-label">Phone</label>
                            <input type="text" class="form-control" id="phone" value="${employee[0].phone_no}" required>
                        </div>
                        <div class="col-md-4 mt-3">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-control" id="email_add" value="${employee[0].email}" required >
                        </div>
                        <div class="col-md-4 mt-3">
                            <label class="form-label">Username</label>
                            <input type="text" class="form-control" id="username" value="${employee[0].username}" required>
                        </div>
                        <label class="form-label mt-4 mb-0 underline-label">Address</label>
                        <div class="col-md-4 mt-3">
                            <label class="form-label">Province</label>
                            <input type="text" class="form-control" id="provinceName" value="${employee[0].provinceName}" required>
                        </div>
                        <div class="col-md-4 mt-3">
                            <label class="form-label">Municipality</label>
                            <input type="text" class="form-control" id="municipalityName" value="${employee[0].municipalityName}" required>
                        </div>
                        <div class="col-md-4 mt-3">
                            <label class="form-label">Barangay</label>
                            <input type="text" class="form-control" id="barangayName" value="${employee[0].barangayName}" required>
                        </div>
                        <label class="form-label  mb-0 underline-label mt-4">Workspace</label>
                            <div class="col-md-3 me-3 mt-3">
                                <label class="form-label">Branch</label>
                                <select id="edit_branch" class="form-select">
                                  <option value="${employee[0].branch_id}" selected>${employee[0].branch_name}</option>
                                </select>
                            </div>
                            <div class="col-md-3 mt-3">
                                <label class="form-label">Position</label>
                                <select id="position" class="form-select">
                                <option value="${employee[0].status_id}" selected>${employee[0].user_status}</option>
                                </select>
                                </select>
                            </div>                     
                        <div class="col-12 mt-4">
                              <button class="btn btn-primary" onclick="submit_edit_employee(event, ${employee[0].user_id})">Submit Edit</button>
                          </div>
                      </form>
                </div>
                `;
          document.getElementById("mainDiv").innerHTML = html;

          getBranch();
          getPosition();
        }
      } catch (error) {
        var html = `<h2>NO RECORD</h2>`;
      }
    })
    .catch((error) => {
      alert(`ERROR OCCURREDSSSSSSSSSSS! ${error}`);
    });
};
const submit_edit_employee = (event, user_id) => {
  event.preventDefault();
  const firstname = document.getElementById("firstname").value;
  const middlename = document.getElementById("middlename").value;
  const lastname = document.getElementById("lastname").value;
  const phone = document.getElementById("phone").value;

  const provinceName = document.getElementById("provinceName").value;
  const municipalityName = document.getElementById("municipalityName").value;
  const barangayName = document.getElementById("barangayName").value;

  const email_add = document.getElementById("email_add").value;
  const username = document.getElementById("username").value;
  const branchId = document.getElementById("edit_branch").value;
  const positionId = document.getElementById("position").value;

  if (
    firstname === "" ||
    middlename === "" ||
    lastname === "" ||
    phone === "" ||
    email_add === "" ||
    provinceName === "" ||
    municipalityName === "" ||
    barangayName === "" ||
    username === "" ||
    branchId === "" ||
    positionId === ""
  ) {
    alert("Fill in all fields");
    return;
  }

  const myUrl =
    "http://128.199.232.132/waterworks/admin/update_api/update_employee.php";
  const formData = new FormData();
  formData.append("user_id", user_id);
  formData.append("firstname", firstname);
  formData.append("middlename", middlename);
  formData.append("lastname", lastname);
  formData.append("phone", phone);
  formData.append("email_add", email_add);
  formData.append("provinceNames", provinceName);
  formData.append("municipalityNames", municipalityName);
  formData.append("barangayNames", barangayName);
  formData.append("username", username);
  formData.append("branchId", branchId);
  formData.append("positionId", positionId);
  console.log(
    user_id,
    firstname,
    middlename,
    lastname,
    phone,
    email_add,
    provinceName,
    municipalityName,
    barangayName,
    username,
    branchId,
    positionId
  );

  axios({
    url: myUrl,
    method: "post",
    data: formData,
  })
    .then((response) => {
      console.log("Responses : ", response);
      console.log("Responses status : ", response.data.status);

      if (response.data.status === 1) {
        success_update_modal();
        console.log("success update");
      } else if (response.data.status === 0) {
        // alert("Username or phone number already exists!");
        failed_update_modal();
      } else {
        // alert("Unknown error occurred.");
        error_modal();
        console.log(response);
      }
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
    });
};

const getBranch = () => {
  const propertySelect = document.getElementById("edit_branch");
  var myUrl = "http://128.199.232.132/waterworks/admin/get_branch.php";

  axios({
    url: myUrl,
    method: "post",
  })
    .then((response) => {
      var properties = response.data;

      var options = ``;
      properties.forEach((property) => {
        options += `<option value="${property.branch_id}">${property.branch_name}</option>`;
      });
      propertySelect.innerHTML = options;
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
    });
};
const getPosition = () => {
  const positionSelect = document.getElementById("position");
  var myUrl = "http://128.199.232.132/waterworks/admin/get_position.php";

  axios({
    url: myUrl,
    method: "post",
  })
    .then((response) => {
      var positions = response.data;

      var options = ``;
      positions.forEach((position) => {
        options += `<option value="${position.position_id}">${position.position_name}</option>`;
      });
      positionSelect.innerHTML = options;
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
    });
};

const success_update_modal = () => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");
  var html = `
      <h5 class="modal-title " style="color: limegreen; text-align:center;">Successfully Edited</h5>
  `;
  modalContent.innerHTML = html;
  modal.style.display = "block";
};

const failed_update_modal = () => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");
  var html = `
  <h5 class="modal-title " style="color: red; text-align:center;">Duplicate !</h5>
`;
  modalContent.innerHTML = html;
  modal.style.display = "block";
};
const error_modal = () => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");
  var html = `
      <h5 class="modal-title " style="color: red; text-align:center;">Unknown error occurred !</h5>
  `;
  modalContent.innerHTML = html;
  modal.style.display = "block";
};
const closeModal = () => {
  const modal = document.getElementById("myModal");
  modal.style.display = "none";

  const head = document.getElementById("head");
  const paginationNumbers = document.getElementById("paginationNumbers");
  const branchSelect = document.getElementById("branch");
  const searchInput = document.getElementById("searchInput");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  head.style.display = "block";
  paginationNumbers.style.display = "block";
  branchSelect.style.display = "block";
  searchInput.style.display = "block";
  prevBtn.style.display = "block";
  nextBtn.style.display = "block";
};
