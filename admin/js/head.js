let currentPage = 1;
let employees = [];

const onLoad = () => {
  document.getElementById("ngalan").innerText =
    sessionStorage.getItem("fullname");
  displayHeadEmployee();
  // getFileterBranch();
};
const displayHeadEmployee = () => {
  const head = document.getElementById("head");
  const paginationNumbers = document.getElementById("paginationNumbers");
  const searchInput = document.getElementById("searchInput");
  head.style.display = "block";
  paginationNumbers.style.display = "block";
  searchInput.style.display = "block";
  var url = "http://128.199.232.132/waterworks/admin/get_head.php";

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
        HeadErrorTable();
      } else {
        sortHeadEmployeesByName();
        showHeadEmployeePage(currentPage);
      }
    })
    .catch((error) => {
      alert("ERROR! - " + error);
    });
};

const sortHeadEmployeesByName = () => {
  employees.sort((a, b) => {
    const nameA = (a.firstname + " " + a.lastname).toUpperCase();
    const nameB = (b.firstname + " " + b.lastname).toUpperCase();
    return nameA.localeCompare(nameB);
  });
};
const filterClerkEmployee = () => {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const filteredEmployees = employees.filter((employee) => {
    const fullName = (
      employee.firstname +
      " " +
      employee.lastname
    ).toLowerCase();
    return fullName.includes(searchInput);
  });
  showClerkFilteredEmployees(filteredEmployees);
};

const showClerkFilteredEmployees = (filteredEmployees) => {
  currentPage = 1;
  showHeadEmployeePage(currentPage, filteredEmployees);
};

const showNextPage = () => {
  const nextPage = currentPage + 1;
  const start = (nextPage - 1) * 10;
  const end = start + 10;
  const activitiesOnNextPage = employees.slice(start, end);

  if (activitiesOnNextPage.length > 0) {
    currentPage++;
    showHeadEmployeePage(currentPage);
  } else {
    alert("Next page is empty or has no content.");
    // Optionally, you can choose to disable the button here
    // For example, if you have a button element with id "nextButton":
    // document.getElementById("nextButton").disabled = true;
  }
};

const showPreviousPage = () => {
  if (currentPage > 1) {
    currentPage--;
    showHeadEmployeePage(currentPage);
  } else {
    alert("You are on the first page.");
  }
};
const showHeadEmployeePage = (page, employeesToDisplay = employees) => {
  var start = (page - 1) * 10;
  var end = start + 10;
  var displayedEmployees = employeesToDisplay.slice(start, end);
  ClerkrefreshTable(displayedEmployees);
  showPaginationNumbersHead(page, Math.ceil(employeesToDisplay.length / 10));
};
const showPaginationNumbersHead = (currentPage, totalPages) => {
  const paginationNumbersDiv = document.getElementById("paginationNumbers");
  let paginationNumbersHTML = "";

  const pagesToShow = 5; // Number of pages to display

  // Calculate start and end page numbers to display
  let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + pagesToShow - 1);

  // Adjust start and end page numbers if they are at the edges
  if (endPage - startPage + 1 < pagesToShow) {
    startPage = Math.max(1, endPage - pagesToShow + 1);
  }

  // Previous button
  paginationNumbersHTML += `<button  onclick="showPreviousPage()">Previous</button>`;

  // Generate page numbers
  for (let i = startPage; i <= endPage; i++) {
    if (i === currentPage) {
      paginationNumbersHTML += `<span class="active" onclick="goToPageHead(${i})">${i}</span>`;
    } else {
      paginationNumbersHTML += `<span onclick="goToPageHead(${i})">${i}</span>`;
    }
  }

  // Next button
  paginationNumbersHTML += `<button onclick="showNextPage()">Next</button>`;

  paginationNumbersDiv.innerHTML = paginationNumbersHTML;
};

const goToPageHead = (pageNumber) => {
  showHeadEmployeePage(pageNumber);
};

const HeadErrorTable = () => {
  var html = `
            
            <table class="tab table">
              <thead>
                <tr>
                  <th scope="col">Full Name</th>
                  <th scope="col">Position</th>
                  <th scope="col">Branch</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              </table>`;

  document.getElementById("mainDiv").innerHTML = html;
};

const ClerkrefreshTable = (employeeList) => {
  var html = `
      
            <table class="tab table mb-0 mt-0">
              <thead>
                <tr>
                  <th scope="col">Full Name</th>
                  <th scope="col">Position</th>
                  <th scope="col">Branch</th>
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
                <td>
                  <button class="clear" onclick="view_head(${employee.user_id})">View</button>  
                  <button class="clear" onclick="edit_head(${employee.user_id})">Edit</button>  
                </td>
              </tr>
            `;
  });

  html += `</tbody></table>`;

  document.getElementById("mainDiv").innerHTML = html;
};
const view_head = (user_id) => {
  console.log("USER ID :", user_id);
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");

  var myUrl = "http://128.199.232.132/waterworks/gets/get_employee.php";
  const formData = new FormData();
  formData.append("accId", user_id);

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
          const close_butt = document.getElementById("close_butt");
          close_butt.style.display = "none";

          var html = `
                            <div class="mt-1 text-center">
                                <i class="fas fa-user fa-5x mt-0"></i>
                            </div>
                            <hr class="badge-primary mt-3 mb-2">
                            <div class="container-fluid mt-3">
                                <form class="row g-3">
                                    <label class="form-label mb-0 " style="font-size: large;">Personal Information</label>
                                    <hr class="badge-primary mt-2">
                                    <div class="col-md-4 mt-1">
                                        <label class="form-label">First Name</label>
                                        <h6 class="text-muted" >${employee[0].firstname}</h6>
                                    </div>
                                    <div class="col-md-4 mt-1">
                                        <label class="form-label">Middle Name</label>
                                        <h6 class="text-muted" >${employee[0].middlename}</h6>
                                    </div>
                                    <div class="col-md-4 mt-1">
                                        <label class="form-label">Last Name</label>
                                        <h6 class="text-muted" >${employee[0].lastname}</h6>
                                    </div>
                                    <div class="col-md-4 mt-3">
                                        <label class="form-label">Phone</label>
                                        <h6 class="text-muted" >${employee[0].phone_no}</h6>
                                    </div>
                                    <div class="col-md-4 mt-3"></div>
                                    <div class="col-md-4 mt-3">
                                        <label class="form-label">Email</label>
                                        <h6 class="text-muted" >${employee[0].email}</h6>
                                    </div>
                                    <hr class="badge-primary mt-2 mb-2">
                                    <label class="form-label mt-0 mb-0 " style="font-size: large;">Address</label>
                                    <hr class="badge-primary mt-2">
                                    <div class="col-md-4 mt-1">
                                        <label class="form-label">Barangay</label>
                                        <h6 class="text-muted" >${employee[0].barangayName}</h6>
                                    </div>
                                    <div class="col-md-4 mt-1">
                                        <label class="form-label">Municipality</label>
                                        <h6 class="text-muted" >${employee[0].municipalityName}</h6>
                                    </div>
                                    <div class="col-md-4 mt-1">
                                        <label class="form-label">Province</label>
                                        <h6 class="text-muted" >${employee[0].provinceName}</h6>
                                    </div>
                                    <hr class="badge-primary mt-2 mb-2">
                                    <label class="form-label mb-0 mt-0 " style="font-size: large;">Workspace</label>
                                    <hr class="badge-primary mt-2">
                                    <div class="col-md-4 mt-1">
                                        <label class="form-label">Branch</label>
                                        <h6 class="text-muted" >${employee[0].branch_name}</h6>
                                    </div>
                                    <div class="col-md-4 mt-1">
                                        <label class="form-label">Position</label>
                                        <h6 class="text-muted" >${employee[0].position_name}</h6>
                                    </div>
                                    <div class="row mt-4">
                                      <div class="col-sm-12">
                                        <button type="button" class="btn btn-primary w-100 " data-bs-dismiss="modal" onclick="closeModal()">Close</button>
                                      </div>
                                    </div>
                                </form>
                            </div>
                                              
                            `;
        }
      } catch (error) {
        // Handle any errors here
        var html = `<h2>NO RECORD</h2>`;
        console.log(error);
      }

      modalContent.innerHTML = html;
      modal.style.display = "block";
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
    });
};

const edit_head = (user_id) => {
  const head = document.getElementById("head");
  const paginationNumbers = document.getElementById("paginationNumbers");
  const searchInput = document.getElementById("searchInput");
  head.style.display = "none";
  paginationNumbers.style.display = "none";
  searchInput.style.display = "none";

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
                            <button class="clear" onclick="displayClerkEmployee()">Back</button>
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
                                <div class="col-md-4">
                                  <label class="form-label">Suffix</label>
                                  <select id="suffix" class="form-select">
                                      <option value="${employee[0].suffix_id}" selected>${employee[0].suffix_name}</option>
                                  </select>
                                </div>
                                <div class="col-md-4 mt-3">
                                    <label class="form-label">Phone</label>
                                    <input type="text" class="form-control" id="phone" value="${employee[0].phone_no}" required>
                                </div>
                                <div class="col-md-4 mt-3">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-control" id="email_add" value="${employee[0].email}" required >
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
                                        <select id="branch" class="form-select">
                                          <option value="${employee[0].branch_id}" selected>${employee[0].branch_name}</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3 mt-3">
                                        <label class="form-label">Position</label>
                                        <select id="position" class="form-select">
                                            <option value="${employee[0].position_id}" selected>${employee[0].position_name}</option>
                                        </select>
                                    </div>                     
                                <div class="col-12 mt-4">
                                      <button class="btn btn-primary" onclick="submit_edit_employee(event, ${employee[0].user_id})">Submit Edit</button>
                                  </div>
                              </form>
                        </div>
                        `;
          document.getElementById("mainDiv").innerHTML = html;

          getSuffix();
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
//------------------------------------------------------------------------------
const submit_edit_employee = (event, user_id) => {
  event.preventDefault();
  const firstname = document.getElementById("firstname").value;
  const middlename = document.getElementById("middlename").value;
  const lastname = document.getElementById("lastname").value;
  const suffixId = document.getElementById("suffix").value;
  const phone = document.getElementById("phone").value;

  const provinceName = document.getElementById("provinceName").value;
  const municipalityName = document.getElementById("municipalityName").value;
  const barangayName = document.getElementById("barangayName").value;

  const email_add = document.getElementById("email_add").value;
  const branchId = document.getElementById("branch").value;
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
    suffixId === "" ||
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
  formData.append("suffixId", suffixId);
  formData.append("branchId", branchId);
  formData.append("positionId", positionId);
  formData.append("employee_Id", sessionStorage.getItem("accountId"));
  console.log(
    user_id,
    firstname,
    middlename,
    lastname,
    suffixId,
    phone,
    email_add,
    provinceName,
    municipalityName,
    barangayName,
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
        window.location.reload();
      } else if (response.data.status === 0) {
        // alert("Username or phone number already exists!");
        failed_update_modal();
        console.log(response.data);
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

// ------------------------------------------------------------------------------
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
//-----------------------------------------------------------------------------

const success_update_modal = () => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");
  var html = `
      <h5 class="modal-title " style="color: limegreen; text-align:center;">Successfully</h5>
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
  const searchInput = document.getElementById("searchInput");
  head.style.display = "block";
  paginationNumbers.style.display = "block";
  searchInput.style.display = "block";
};

const getSuffix = () => {
  const suffixSelect = document.getElementById("suffix");
  var myUrl = "http://128.199.232.132/waterworks/gets/get_suffix.php";

  axios({
    url: myUrl,
    method: "post",
  })
    .then((response) => {
      var suffixes = response.data;

      var options = ``;
      suffixes.forEach((property) => {
        options += `<option value="${property.suffix_id}">${property.suffix_name}</option>`;
      });
      suffixSelect.innerHTML = options;
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
    });
};
const getBranch = () => {
  const propertySelect = document.getElementById("branch");
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
      console.log(error);
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
