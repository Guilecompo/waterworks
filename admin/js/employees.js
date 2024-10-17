let currentPage = 1;
let employees = [];
let selectedBranch = "all";
let selectedPosition = "all";

const onLoad = () => {
  var accountId = sessionStorage.getItem("accountId");
  if (!accountId || accountId === "0") {
    window.location.href = "/waterworks/";
  } else {
    document.getElementById("ngalan").innerText = sessionStorage.getItem("fullname");
    displayClerkEmployee();
    getFilterBranch();
    getFilterPosition();
    refreshFilters();
  }
};

const refreshFilters = () => {
  // Logic to refresh or reload filter data
  displayClerkEmployee(); // You can call your existing function or reload the data
  getFilterBranch();
  getFilterPosition();
};


const getFilterPosition = () => {
  const positionSelect = document.getElementById("position");
  var myUrl = "http://152.42.243.189/waterworks/admin/get_positions.php";

  axios({
    url: myUrl,
    method: "post",
  })
    .then((response) => {
      var positions = response.data;
      var options = `<option value="all">Select Position</option>`;
      positions.forEach((position) => {
        options += `<option value="${position.position_name}">${position.position_name}</option>`;
      });
      positionSelect.innerHTML = options;

      // Event listener for position change
      positionSelect.addEventListener("change", () => {
        selectedPosition = positionSelect.value;
        applyFilters();
      });
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
    });
};

const getFilterBranch = () => {
  const branchSelect = document.getElementById("branch");
  var myUrl = "http://152.42.243.189/waterworks/admin/get_branch.php";

  axios({
    url: myUrl,
    method: "post",
  })
    .then((response) => {
      var branches = response.data;
      var options = `<option value="all">Select Branch</option>`;
      branches.forEach((branch) => {
        options += `<option value="${branch.branch_name}">${branch.branch_name}</option>`;
      });
      branchSelect.innerHTML = options;

      // Event listener for branch change
      branchSelect.addEventListener("change", () => {
        selectedBranch = branchSelect.value;
        applyFilters();
      });
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
    });
};

const applyFilters = () => {
  if (selectedBranch === "all" && selectedPosition === "all") {
    displayClerkEmployee(); // If both filters are 'all', show all employees
  } else if (selectedBranch !== "all" && selectedPosition === "all") {
    displayClerkEmployeeBranch(selectedBranch); // Filter by branch only
  } else if (selectedBranch === "all" && selectedPosition !== "all") {
    displayClerkEmployeePosition(selectedPosition); // Filter by position only
  } else {
    displayClerkEmployeeByBranchAndPosition(selectedBranch, selectedPosition); // Filter by both
  }
};

const displayClerkEmployeePosition = (selectedPosition) => {
  const head = document.getElementById("head");
  const paginationNumbers = document.getElementById("paginationNumbers");
  const searchInput = document.getElementById("searchInput");
  head.style.display = "block";

  var url = "http://152.42.243.189/waterworks/admin/get_employee_position.php";

  const formData = new FormData();
  formData.append("accountId", sessionStorage.getItem("accountId"));
  formData.append("selectedPosition", selectedPosition); // Ensure this is correct
 

  axios({
    url: url,
    method: "post",
    data: formData,
  })
    .then((response) => {
      employees = response.data;

      if (!Array.isArray(employees) || employees.length === 0) {
        ClerkErrorTable();
      } else {
        ClerkrefreshTable(employees); // Refresh the table with filtered employees
      }
    })
    .catch((error) => {
      alert("ERROR! - " + error);
    });
};
const displayClerkEmployeeBranch = (selectedBranch) => {
  const head = document.getElementById("head");
  const paginationNumbers = document.getElementById("paginationNumbers");
  const searchInput = document.getElementById("searchInput");
  head.style.display = "block";

  var url = "http://152.42.243.189/waterworks/admin/get_employee_branch.php";

  const formData = new FormData();
  formData.append("accountId", sessionStorage.getItem("accountId"));
  formData.append("branchId", selectedBranch); // Ensure this is correct
 

  axios({
    url: url,
    method: "post",
    data: formData,
  })
    .then((response) => {
      employees = response.data;

      if (!Array.isArray(employees) || employees.length === 0) {
        ClerkErrorTable();
      } else {
        ClerkrefreshTable(employees); // Refresh the table with filtered employees
      }
    })
    .catch((error) => {
      alert("ERROR! - " + error);
    });
};

const displayClerkEmployeeByBranchAndPosition = (branch, position) => {
  const head = document.getElementById("head");
  head.style.display = "block";
  
  var url = "http://152.42.243.189/waterworks/admin/get_employee_by_branch_and_position.php";

  const formData = new FormData();
  formData.append("accountId", sessionStorage.getItem("accountId"));
  formData.append("branchId", branch);
  formData.append("selectedPosition", position);

  axios({
    url: url,
    method: "post",
    data: formData,
  })
    .then((response) => {
      employees = response.data;

      if (!Array.isArray(employees) || employees.length === 0) {
        ClerkErrorTable();
      } else {
        ClerkrefreshTable(employees);
      }
    })
    .catch((error) => {
      alert("ERROR! - " + error);
    });
};

const displayClerkEmployee = () => {
  const head = document.getElementById("head");
  head.style.display = "block";

  var url = "http://152.42.243.189/waterworks/admin/get_employee.php";

  const formData = new FormData();
  formData.append("accountId", sessionStorage.getItem("accountId"));

  axios({
    url: url,
    method: "post",
    data: formData,
  })
    .then((response) => {
      employees = response.data;

      if (!Array.isArray(employees) || employees.length === 0) {
        ClerkErrorTable();
      } else {
        ClerkrefreshTable(employees);
      }
    })
    .catch((error) => {
      alert("ERROR! - " + error);
    });
};

const ClerkErrorTable = () => {
  var html = `
    <table id="example" class="table table-striped table-bordered" style="width:100%">
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
    <table id="example" class="table table-striped table-bordered" style="width:100%">
      <thead>
        <tr>
          <th class="text-center">Full Name</th>
          <th class="text-center">Position</th>
          <th class="text-center">Branch</th>
          <th class="text-center">Action</th>
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
          <button style="background-color: #0275d8; border: none; padding: 5px; border-radius: 12%; color:white;" class="clear" onclick="view_clerk(${employee.user_id})">View</button>
          <button style="background-color: #0275d8; border: none; padding: 5px; border-radius: 12%; color:white;" class="clear" onclick="edit_clerk(${employee.user_id})">Edit</button>
        </td>
      </tr>`;
  });

  html += `</tbody></table>`;

  document.getElementById("mainDiv").innerHTML = html;

  // Initialize DataTable after populating the HTML
  $('#example').DataTable({
    "ordering": false // Disable sorting for all columns
  });
};

const view_clerk = (user_id) => {
  console.log("USER ID :", user_id);
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");

  var myUrl = "http://152.42.243.189/waterworks/gets/get_employee.php";
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
                          <div class="col-md-8 mt-3">
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
const edit_clerk = (user_id) => {
  var myUrl = "http://152.42.243.189/waterworks/admin/getemployee.php";
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
          var html = `<h2>No Records</h2>`;
        } else {
          var employee = response.data;
          console.log("Employees : ", employee);
          var html = `
            <div class="container-fluid mt-3">
              <form class="row g-3">
                <label class="form-label mt-2 mb-0 underline-label">Personal Information</label>
                <div class="col-md-6 mt-2">
                  <label class="form-label">First Name</label>
                  <input type="text" class="form-control" id="firstname" value="${employee[0].firstname}" required>
                </div>
                <div class="col-md-6 mt-2">
                  <label class="form-label">Middle Name</label>
                  <input type="text" class="form-control" id="middlename" value="${employee[0].middlename}" required>
                </div>
                <div class="col-md-6 mt-2">
                  <label class="form-label">Last Name</label>
                  <input type="text" class="form-control" id="lastname" value="${employee[0].lastname}" required>
                </div>
                <div class="col-md-6 mt-2">
                  <label class="form-label">Suffix</label>
                  <select id="suffix" class="form-select">
                    <option value="${employee[0].suffix_id}" selected>${employee[0].suffix_name}</option>
                  </select>
                </div>
                <div class="col-md-6 mt-2">
                  <label class="form-label">Phone</label>
                  <input type="text" class="form-control" id="phone" value="${employee[0].phone_no}" required>
                </div>
                <div class="col-md-6 mt-2">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" id="email_add" value="${employee[0].email}" required >
                </div>
                <label class="form-label mt-3 mb-0 underline-label">Address</label>
                <div class="col-md-6 mt-2">
                  <label class="form-label">Province</label>
                  <input type="text" class="form-control" id="provinceName" value="${employee[0].provinceName}" required>
                </div>
                <div class="col-md-6 mt-2">
                  <label class="form-label">Municipality</label>
                  <input type="text" class="form-control" id="municipalityName" value="${employee[0].municipalityName}" required>
                </div>
                <div class="col-md-6 mt-2">
                  <label class="form-label">Barangay</label>
                  <input type="text" class="form-control" id="barangayName" value="${employee[0].barangayName}" required>
                </div>
                <label class="form-label mb-0 underline-label mt-3">Workspace</label>
                <div class="col-md-6 mt-2">
                  <label class="form-label">Branch</label>
                  <select id="branch" class="form-select">
                    <option value="${employee[0].branch_id}" selected>${employee[0].branch_name}</option>
                  </select>
                </div>
                <div class="col-md-6 mt-2">
                  <label class="form-label">Position</label>
                  <select id="position" class="form-select">
                    <option value="${employee[0].position_id}" selected>${employee[0].position_name}</option>
                  </select>
                </div>                     
                <div class="col-12 mt-3">
                  <button class="btn btn-primary w-100" onclick="submit_edit_employee(event, ${employee[0].user_id})">Submit Edit</button>
                </div>
              </form>
            </div>
          `;

          // Insert the HTML into the modal's body
          document.getElementById("modalContents").innerHTML = html;

          // Trigger the modal
          var myModal = new bootstrap.Modal(document.getElementById('myModals'), {});
          myModal.show();

          // Load additional dropdown options if necessary
          getSuffix();
          getBranch();
          getPosition();
        }
      } catch (error) {
        document.getElementById("modalContents").innerHTML = `<h2>No Record</h2>`;
      }
    })
    .catch((error) => {
      alert(`Error occurred! ${error}`);
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
    "http://152.42.243.189/waterworks/admin/update_api/update_employee.php";
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
//------------------------------------------------------------------------------
const add_employee = () => {
  const html = `
      <div class="container-fluid mt-3">
            <form class="row g-3" id="employeeForm">
                <label class="form-label mt-2 mb-0 underline-label">Personal Information</label>
                <div class="col-md-6 mt-2">
                    <label class="form-label">First Name</label>
                    <input type="text" class="form-control" id="firstname" required>
                </div>
                <div class="col-md-6 mt-2">
                    <label class="form-label">Middle Name</label>
                    <input type="text" class="form-control" id="middlename" required>
                </div>
                <div class="col-md-6 mt-2">
                    <label class="form-label">Last Name</label>
                    <input type="text" class="form-control" id="lastname" required>
                </div>
                <div class="col-md-6 mt-2">
                    <label class="form-label">Suffix</label>
                    <select id="suffix" class="form-select">
                        <option value="" disabled selected>Select Suffix</option>
                        <!-- You can add suffix options here -->
                    </select>
                </div>
                <div class="col-md-6 mt-2">
                    <label class="form-label">Phone</label>
                    <input type="text" class="form-control" id="phone" required>
                </div>
                <div class="col-md-6 mt-2">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" id="email_add" required>
                </div>
                <label class="form-label mt-3 mb-0 underline-label">Address</label>
                <div class="col-md-6 mt-2">
                    <label class="form-label">Province</label>
                    <input type="text" class="form-control" id="provinceName" required>
                </div>
                <div class="col-md-6 mt-2">
                    <label class="form-label">Municipality</label>
                    <input type="text" class="form-control" id="municipalityName" required>
                </div>
                <div class="col-md-6 mt-2">
                    <label class="form-label">Barangay</label>
                    <input type="text" class="form-control" id="barangayName" required>
                </div>
                <label class="form-label mb-0 underline-label mt-3">Workspace</label>
                <div class="col-md-6 mt-2">
                    <label class="form-label">Branch</label>
                    <select id="branch" class="form-select">
                        <option value="" disabled selected>Select Branch</option>
                        <!-- You can add branch options here -->
                    </select>
                </div>
                <div class="col-md-6 mt-2">
                    <label class="form-label">Position</label>
                    <select id="position" class="form-select">
                        <option value="" disabled selected>Select Position</option>
                        <!-- You can add position options here -->
                    </select>
                </div>                     
                <div class="col-12 mt-3">
                    <button type="submit" class="btn btn-primary w-100" onclick="submit_employee(event)">Submit</button>
                </div>
            </form>
        </div>
  `;
  
  // Insert the HTML into the modal body
  document.getElementById("modalContents").innerHTML = html;

  // Show the modal
  const myModal = new bootstrap.Modal(document.getElementById('myModals'));
  myModal.show();

  // Populate the dropdowns
  getSuffix();
  getBranch();
  getPosition();
};

const submit_employee = (event) => {
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
  
    const inputs = [
      { id: "firstname", element: document.getElementById("firstname") },
      { id: "middlename", element: document.getElementById("middlename") },
      { id: "lastname", element: document.getElementById("lastname") },
      { id: "suffix", element: document.getElementById("suffix") },
      { id: "phone", element: document.getElementById("phone") },
      { id: "email_add", element: document.getElementById("email_add") },
      { id: "provinceName", element: document.getElementById("provinceName") },
      { id: "municipalityName", element: document.getElementById("municipalityName") },
      { id: "barangayName", element: document.getElementById("barangayName") },
      { id: "branch", element: document.getElementById("branch") },
      { id: "position", element: document.getElementById("position") }
  ];
  
  console.log(inputs); // Log the inputs array
  
  // Check validity of each input
  inputs.forEach(input => {
      if (!input.element.validity.valid) {
          input.element.classList.add('invalid');
      } else {
          input.element.classList.remove('invalid'); // Remove 'invalid' class if input is valid
      }
  });
  
  // If any input is invalid, prevent form submission
  if (document.querySelector('.invalid')) {
      alert('Fill in all fields correctly');
      return;
  }
  
  
    const myUrl = "http://152.42.243.189/waterworks/admin/add_employees.php";
    const formData = new FormData();
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
  
    axios({
      url: myUrl,
      method: "post",
      data: formData,
    })
      .then((response) => {
        console.log(response);
        if (response.data.status === 1) {
          success_modal();
          // window.location.reload();
          clearForm();
          // window.location.href = "./addemployee.html";
        } else if (response.data.status === 0) {
          // alert("Username or phone number already exists!");
          failed_modal();
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
      paginationNumbersHTML += `<span class="active" onclick="goToPage(${i})">${i}</span>`;
    } else {
      paginationNumbersHTML += `<span onclick="goToPage(${i})">${i}</span>`;
    }
  }

  // Next button
  paginationNumbersHTML += `<button onclick="showNextPage()">Next</button>`;

  paginationNumbersDiv.innerHTML = paginationNumbersHTML;
};

const goToPage = (pageNumber) => {
  showActivityPage(pageNumber);
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
};
const getSuffix = () => {
  const suffixSelect = document.getElementById("suffix");
  var myUrl = "http://152.42.243.189/waterworks/gets/get_suffix.php";

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
  var myUrl = "http://152.42.243.189/waterworks/admin/get_branch.php";
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
  var myUrl = "http://152.42.243.189/waterworks/admin/get_position.php";

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
