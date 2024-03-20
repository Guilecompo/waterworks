let currentPage = 1;
let employees = [];


const onLoad = () => {
  var accountId = sessionStorage.getItem("accountId");
  if (!accountId || accountId === "0") {
      window.location.href = "/waterworks/";
  } else {
    document.getElementById("ngalan").innerText = sessionStorage.getItem("fullname");
    displayEmployee();
    // getFileterBranch();
  }
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
    const searchInput = document.getElementById("searchInput");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    head.style.display = "block";
    paginationNumbers.style.display = "block";
    searchInput.style.display = "block";
    prevBtn.style.display = "block";
    nextBtn.style.display = "block";
    var url = "http://128.199.232.132/waterworks/head/get_employee.php";
    
    const formData = new FormData();
    formData.append("branchId", sessionStorage.getItem("branchId"));
    formData.append("accountId", sessionStorage.getItem("accountId"));
    console.log(sessionStorage.getItem("branchId"));
    
    axios({
      url: url,
      method: "post",
      data: formData
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
      const nameA = (a.firstname + ' ' + a.lastname).toUpperCase();
      const nameB = (b.firstname + ' ' + b.lastname).toUpperCase();
      return nameA.localeCompare(nameB);
    });
    };
    const filterEmployee = () => {
      const searchInput = document.getElementById("searchInput").value.toLowerCase();
      const filteredEmployees = employees.filter((employee) => {
        const fullName = (employee.firstname + ' ' + employee.lastname + ' ' + employee.position_name).toLowerCase();
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

    const errorTable = () =>{
        var html = `
        
        <table class="table">
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
      }
      
      
      
      const refreshTable = (employeeList) => {
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
              <button class="clear" onclick="edit(${employee.user_id})">Edit</button>  
              
            </td>
          </tr>
        `;
      });
      
      html += `</tbody></table>`;
      
      document.getElementById("mainDiv").innerHTML = html;
      };

//----------------------------DISPLAY READER'S--------------------------------------
const displayReaderEmployee = () => {
  const head = document.getElementById("head");
  const paginationNumbers = document.getElementById("paginationNumbers");
  const searchInput = document.getElementById("searchInput");
  const filterPosition = document.getElementById("position");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  head.style.display = "block";
  paginationNumbers.style.display = "block";
  filterPosition.style.display = "block";
  searchInput.style.display = "block";
  prevBtn.style.display = "block";
  nextBtn.style.display = "block";
  var url = "http://128.199.232.132/waterworks/head/get_reader.php";
  
  const formData = new FormData();
  formData.append("branchId", sessionStorage.getItem("branchId"));
  formData.append("accountId", sessionStorage.getItem("accountId"));
  console.log(sessionStorage.getItem("branchId"));
  
  axios({
    url: url,
    method: "post",
    data: formData
  })
    .then((response) => {
      employees = response.data;
      console.log(employees);
  
      if (!Array.isArray(employees) || employees.length === 0) {
        ReadererrorTable();
      } else {
        sortReaderEmployeesByName();
        showReaderEmployeePage(currentPage);
      }
    })
    .catch((error) => {
      alert("ERROR! - " + error);
    });  
  };
  
  const sortReaderEmployeesByName = () => {
  employees.sort((a, b) => {
    const nameA = (a.firstname + ' ' + a.lastname).toUpperCase();
    const nameB = (b.firstname + ' ' + b.lastname).toUpperCase();
    return nameA.localeCompare(nameB);
  });
  };
  const filterReaderEmployee = () => {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const filteredEmployees = employees.filter((employee) => {
      const fullName = (employee.firstname + ' ' + employee.lastname + ' ' + employee.position_name).toLowerCase();
      return fullName.includes(searchInput);
    });
    showReaderFilteredEmployees(filteredEmployees);
    };
    
    const showReaderFilteredEmployees = (filteredEmployees) => {
    currentPage = 1;
    showReaderEmployeePage(currentPage, filteredEmployees);
    };
  
  
  const showReaderEmployeePage = (page, employeesToDisplay = employees) => {
  var start = (page - 1) * 10;
  var end = start + 10;
  var displayedEmployees = employeesToDisplay.slice(start, end);
  ReaderrefreshTable(displayedEmployees);
  showPaginationNumbers(page, Math.ceil(employeesToDisplay.length / 10));
  };

  const ReadererrorTable = () =>{
      var html = `
      
      <table class="table">
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
    }
    
    
    
    const ReaderrefreshTable = (employeeList) => {
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
            <button class="clear" onclick="edit_reader(${employee.user_id})">Edit</button>  
            <button class="butt" onclick="view_assigned(${employee.user_id})">Assign</button>
          </td>
        </tr>
      `;
    });
    
    html += `</tbody></table>`;
    
    document.getElementById("mainDiv").innerHTML = html;
    };


    const edit_reader = (user_id) => {
      const head = document.getElementById("head");
      const paginationNumbers = document.getElementById("paginationNumbers");
      const searchInput = document.getElementById("searchInput");
      const filterPosition = document.getElementById("position");
      const prevBtn = document.getElementById("prevBtn");
      const nextBtn = document.getElementById("nextBtn");
      head.style.display = "none";
      paginationNumbers.style.display = "none";
      filterPosition.style.display = "none";
      searchInput.style.display = "none";
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
  
    var myUrl = "http://128.199.232.132/waterworks/head/getemployee.php";
    const formData = new FormData();
    formData.append("user_id", user_id);
  
    axios({
        url: myUrl,
        method: "post",
        data: formData,
    }).then((response) => {
      console.log(response.data);
        try {
            if (response.data.length === 0) {
                // Display a message indicating there are no billing transactions yet.
                var html = `<h2>No Records</h2>`;
            } else {
                var employee = response.data;
                console.log("Emplloyees : ",employee);
                var html = `
                  <div class=" row  mt-1">
                    <div class="col-md-1 mt-3">
                      <button class="clear" onclick="displayReaderEmployee()">Back</button>
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
                                  <select id="positions" class="form-select">
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
              getPositions();
            }
        } catch (error) {
          var html = `<h2>NO RECORD</h2>`;
        }
  
      }).catch((error) => {
        alert(`ERROR OCCURREDSSSSSSSSSSS! ${error}`);
    });
  }
//----------------------------------------------------------------------------------
//----------------------------VIEW ASSIGNED START---------------------------------------------
const view_assigned  = (user_id) => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");


  var myUrl = "http://128.199.232.132/waterworks/head/reader_assigned_arrea.php";
  const formData = new FormData();
  formData.append("accId", user_id);
  console.log("Consumer ID : ", user_id);

  axios({
      url: myUrl,
      method: "post",
      data: formData,
  }).then((response) => {
    console.log(response.data);
      try {
        
          if (response.data.length === 0) {
              // Display a message indicating there are no billing transactions yet.
              
              html = `No Records`;
          } else {
              var records = response.data;
              // Add a single "Connected Meter" heading
              html = `
              <div class="car-block text-center">
                <i class="fas fa-user fa-3x mt-1"></i>
                <h5 class="font-weight-bold mt-2">${records[0].firstname} ${records[0].middlename} ${records[0].lastname} </h5>
                <p >${records[0].position_name}</p>
                <button class="butt" onclick="add_assigned(${user_id})"><i class="far fa-add"></i>  Assign</button>
              </div>
              `;
              html += 
              `
                <table class=" table">
                  <thead>
                    <tr>
                      <th scope="col">Zone Assigned</th>
                      <th scope="col">Branch</th>
                    </tr>
                  </thead>
                  <tbody>
              `;
              
              records.forEach((record) => {
                  html += 
                  `
                      <tr>
                          <td>${record.zone_name}</td>
                          <td>${record.branch_name}</td>
                      </tr>
                  `;
              });
              

              html += `</tbody></table><br/><br/>`;
              
              
          }
          
      } catch (error) {
          // Handle any errors here
          html = `
          <div class="car-block text-center">
            <i class="fas fa-user fa-3x mt-1"></i>
            <h5 class="font-weight-bold mt-2"></h5>
            <p </p>
            <button class="butt" onclick="add_assigned(${user_id})"><i class="far fa-add"></i>  Assign</button>
          </div>
          `;
              
              html += 
              `
              <table class=" table">
                <thead>
                  <tr>
                    <th scope="col">Zone Assigned</th>
                    <th scope="col">Branch</th>
                  </tr>
                </thead>
                <tbody>
                <tr>
                  <td>NO RECORDS</td>
                  <td>NO RECORDS</td>
                </tr>
              `;
              html += `</tbody></table><br/><br/>`;
              console.log(error);
      }
      
      modalContent.innerHTML = html;
      modal.style.display = "block";
      
      
  }).catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
  });
};
//---------------------------VIEW ASSIGNED END--------------------------------------


//----------------------------ADD ASSIGNED START---------------------------------------------
const add_assigned  = (user_id) => {
  const modal = document.getElementById("myModal");
      const modalContent = document.getElementById("modalContent");
  
      var myUrl = "http://128.199.232.132/waterworks/head/get_readers.php";
      const formData = new FormData();
      formData.append("accId", user_id);
      console.log("USER ID : ",user_id);
  
      axios({
          url: myUrl,
          method: "post",
          data: formData,
      }).then((response) => {
          console.log(response.data);
          try {
              if (response.data.length === 0) {
                  // Display a message indicating there are no billing transactions yet.
                  var html = `<h2>No Records</h2>`;
              } else {
                  var employee = response.data;
                  var html = `
                  <button class="butt" onclick="view_assigned(${user_id})"> Back</button>
                      <div class="forms">
                          <div class="car-block text-center">
                            <i class="fas fa-user fa-3x mt-1"></i>
                            <h5 class="font-weight-bold mt-2">${employee[0].firstname} ${employee[0].middlename} ${employee[0].lastname} </h5>
                            <p >${employee[0].position_name}</p>
                          </div>
                          <div class="container-fluid mt-3">
                            <form class="row g-2 mt-4">
                              <div class="col-md-12">
                                <label class="form-label" for="numZones">Number of Zones to Assign</label>
                                <input type="number" class="form-control" id="numZones" min="1" value="1" onchange="generateSelectBoxes()" required>
                              </div>
                              <div class="col-md-6">
                                  <label class="form-label" for="municipality">Municipality</label><br>
                                  <select id="municipality" onchange="getBarangay()" class="form-select" required>
                                      <option value="">Select Municipality</option>
                                  </select>
                              </div>
                              <div class="col-md-6">
                                  <label class="form-label" for="barangay">Barangay</label><br>
                                  <select id="barangay" onchange="getZones()" class="form-select">
                                      <option value="">Select Barangay</option>
                                  </select>
                              </div>
                              <div class="col-md-6">
                                  <label class="form-label">Zone Assign</label><br>
                                  <div id="selectBoxesContainer" ></div>
                              </div>
      
                              <div style="margin-top: 20px; ">
                                  <button class="prevBtn" onclick="submit_assigned(event,${user_id},${employee[0].branchId})">Submit</button>
                              </div>
                            </form>
                          </div>
                      </div>
                  `;
              }
          } catch (error) {
              // Handle any errors here
              var html = `<h2>NO RECORD</h2>`;
          }
  
          modalContent.innerHTML = html;
          modal.style.display = "block";
          getMunicipality();
          generateSelectBoxes(); // Call getZones to populate initial data
      }).catch((error) => {
        console.error("Error in assigned function (HTTP request):", error);
        alert(`ERROR OCCURRED! ${error.message}`);
      });
};
const submit_assigned = (event,user_id, branchId) => {

  console.log("USER ID: ",user_id);
  event.preventDefault();
  const municipalityId = document.getElementById("municipality").value;
  const barangayId = document.getElementById("barangay").value;

  const numZones = parseInt(document.getElementById("numZones").value, 10);

  if (isNaN(numZones) || numZones <= 0) {
      alert("Please enter a valid number of zones.");
      return;
  }

  // Initialize an array to store zone IDs
  const zoneIds = [];

  // Loop through zones based on the selected number in numZones
  for (let i = 0; i < numZones; i++) {
      const zoneId = document.getElementById("zone" + i).value;

      // Check if a zone is selected for each iteration
      if (!zoneId) {
          alert("Please select a zone for each entry.");
          return;
      }

      // Push the selected zoneId to the array
      zoneIds.push(zoneId);
  }

  const myUrl = "http://128.199.232.132/waterworks/head/add_assigned.php";
  const formData = new FormData();
  formData.append("municipalityId", municipalityId);
  formData.append("barangayId", barangayId);
  formData.append("accId", user_id);
  formData.append("branchId", branchId);

  console.log(municipalityId);
  console.log(barangayId);
  console.log(user_id);
  console.log(branchId);

  // Append each zoneId to the form data
  zoneIds.forEach((zoneId, index) => {
      formData.append(`zoneId[${index}]`, zoneId);
  });

  axios({
      url: myUrl,
      method: "post",
      data: formData,
  })
  .then((response) => {
    console.log(response); 
    console.log(response.data);  

    // Check the status property in the response
    if (response.data.status === 1) {
        // alert("Record Successfully Saved!");
        success_update_modal();
        // window.location.href = "./employee_list.html";
    } else if (response.data.status === 0) {
    } else {
        error_modal();
    }
  })
  .catch((error) => {
    console.error("Error in submit_assigned function:", error);
    alert(`ERROR OCCURRED! ${error.message}`);
  });
};
//---------------------------ADD ASSIGNED END--------------------------------------

function generateSelectBoxes() {
  var numZones = document.getElementById("numZones").value;
  var selectBoxesContainer = document.getElementById("selectBoxesContainer");
  selectBoxesContainer.innerHTML = ""; // Clear previous content

  for (let i = 0; i < numZones; i++) {
      var zoneDiv = document.createElement("div");
      zoneDiv.id = "zoneDiv" + i;

      var selectZone = document.createElement("select");
      selectZone.id = "zone" + i;
      selectZone.innerHTML = '<option value="">Select Zone</option>';

      // Append the select element to the zoneDiv
      zoneDiv.appendChild(selectZone);

      // Append the zoneDiv to the selectBoxesContainer
      selectBoxesContainer.appendChild(zoneDiv);

      // Add a line break for better spacing
      selectBoxesContainer.appendChild(document.createElement("br"));
  }

  // Call getZones to populate all dropdowns with data
  getZones();
}
const getZones = () => {
  const selectedBarangayId = document.getElementById("barangay").value;

  // Check if numZones is a valid number
  var numZones = document.getElementById("numZones").value;
  if (isNaN(numZones) || numZones <= 0) {
      alert("Please enter a valid number of zones.");
      return;
  }

  const zoneUrl = "http://128.199.232.132/waterworks/head/get_zone.php";

  const formData = new FormData();
  formData.append("barangayId", selectedBarangayId);

  axios({
      url: zoneUrl,
      method: "post",
      data: formData,
  })
  .then((response) => {
      console.log("Response data:", response.data);

      for (let i = 0; i < numZones; i++) {
          const zoneSelect = document.getElementById("zone" + i);

          if (!zoneSelect) {
              console.warn(`Element with id 'zone${i}' not found.`);
              continue;
          }

          zoneSelect.innerHTML = '<option value="">Select Zone</option>';

          for (let j = 0; j < response.data.length; j++) {
              const zone = response.data[j];

              if (!zone || typeof zone !== 'object' || !('zone_id' in zone) || !('zone_name' in zone)) {
                  console.error(`Invalid zone data at index ${j}. Expected an object with 'zone_id' and 'zone_name'.`);
                  continue;
              }

              const option = document.createElement("option");
              option.value = zone.zone_id;
              option.textContent = zone.zone_name;
              zoneSelect.appendChild(option);
          }
      }
  })
  .catch((error) => {
      alert(`ERROR OCCURRED while fetching zones! ${error.message}`);
  });
};
const getMunicipality = () => {
  const municipalitySelect = document.getElementById("municipality");
  var myUrl = "http://128.199.232.132/waterworks/gets/get_municipality.php";
  
  axios({
    url: myUrl,
    method: "post",
  })
    .then((response) => {
      var municipalities = response.data;
  
      var options = ``;
      municipalities.forEach((municipality) => {
        options += `<option value="${municipality.municipality_id}">${municipality.municipality_name}</option>`;
      });
      municipalitySelect.innerHTML = options;
  
      getBarangay();
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
    });
  };
  
  const getBarangay = () => {
  const selectedMunicipalityId = document.getElementById("municipality").value;
  const barangayName = sessionStorage.getItem("branchId");
  
  // Fetch barangays based on the selected municipality
  // Replace this URL with your actual API endpoint
  const barangayUrl = `http://128.199.232.132/waterworks/head/get_barangay.php`;
  const formData = new FormData();
  
  // Use selectedMunicipalityId directly
  formData.append("barangayId", barangayName);
  formData.append("municipalityId", selectedMunicipalityId);
  
  axios({
    url: barangayUrl,
    method: "post",
    data: formData
  })
    .then((response) => {
      const barangaySelect = document.getElementById("barangay");
      const barangays = response.data;
  
      // Clear existing options
      barangaySelect.innerHTML = '<option value="">Select Barangay</option>';
  
      // Populate options for barangays
      barangays.forEach((barangay) => {
        const option = document.createElement("option");
        option.value = barangay.barangay_id;
        option.textContent = barangay.barangay_name;
        barangaySelect.appendChild(option);
      });
    })
    .catch((error) => {
      alert(`ERROR OCCURRED while fetching barangays! ${error}`);
    });
  };
  
//----------------------------DISPLAY CLERK'S--------------------------------------
const displayClerkEmployee = () => {
  const head = document.getElementById("head");
  const paginationNumbers = document.getElementById("paginationNumbers");
  const searchInput = document.getElementById("searchInput");
  const filterPosition = document.getElementById("position");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  head.style.display = "block";
  paginationNumbers.style.display = "block";
  filterPosition.style.display = "block";
  searchInput.style.display = "block";
  prevBtn.style.display = "block";
  nextBtn.style.display = "block";
  var url = "http://128.199.232.132/waterworks/head/get_clerk.php";
  
  const formData = new FormData();
  formData.append("branchId", sessionStorage.getItem("branchId"));
  formData.append("accountId", sessionStorage.getItem("accountId"));
  console.log(sessionStorage.getItem("branchId"));
  
  axios({
    url: url,
    method: "post",
    data: formData
  })
    .then((response) => {
      employees = response.data;
      console.log(employees);
  
      if (!Array.isArray(employees) || employees.length === 0) {
        ClerkerrorTable();
      } else {
        sortClerkEmployeesByName();
        showClerkEmployeePage(currentPage);
      }
    })
    .catch((error) => {
      alert("ERROR! - " + error);
    });  
  };
  
  const sortClerkEmployeesByName = () => {
  employees.sort((a, b) => {
    const nameA = (a.firstname + ' ' + a.lastname).toUpperCase();
    const nameB = (b.firstname + ' ' + b.lastname).toUpperCase();
    return nameA.localeCompare(nameB);
  });
  };
  const filterClerkEmployee = () => {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const filteredEmployees = employees.filter((employee) => {
      const fullName = (employee.firstname + ' ' + employee.lastname + ' ' + employee.position_name).toLowerCase();
      return fullName.includes(searchInput);
    });
    showClerkFilteredEmployees(filteredEmployees);
    };
    
    const showClerkFilteredEmployees = (filteredEmployees) => {
    currentPage = 1;
    showClerkEmployeePage(currentPage, filteredEmployees);
    };
  
  
  const showClerkEmployeePage = (page, employeesToDisplay = employees) => {
  var start = (page - 1) * 10;
  var end = start + 10;
  var displayedEmployees = employeesToDisplay.slice(start, end);
  ClerkrefreshTable(displayedEmployees);
  showPaginationNumbers(page, Math.ceil(employeesToDisplay.length / 10));
  };

  const ClerkrerrorTable = () =>{
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
    }
    
    
    
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
            <button class="clear" onclick="edit_clerk(${employee.user_id})">Edit</button>  
          </td>
        </tr>
      `;
    });
    
    html += `</tbody></table>`;
    
    document.getElementById("mainDiv").innerHTML = html;
    };

    const edit_clerk = (user_id) => {
      const head = document.getElementById("head");
      const paginationNumbers = document.getElementById("paginationNumbers");
      const searchInput = document.getElementById("searchInput");
      const filterPosition = document.getElementById("position");
      const prevBtn = document.getElementById("prevBtn");
      const nextBtn = document.getElementById("nextBtn");
      head.style.display = "none";
      paginationNumbers.style.display = "none";
      filterPosition.style.display = "none";
      searchInput.style.display = "none";
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
  
    var myUrl = "http://128.199.232.132/waterworks/head/getemployee.php";
    const formData = new FormData();
    formData.append("user_id", user_id);
  
    axios({
        url: myUrl,
        method: "post",
        data: formData,
    }).then((response) => {
      console.log(response.data);
        try {
            if (response.data.length === 0) {
                // Display a message indicating there are no billing transactions yet.
                var html = `<h2>No Records</h2>`;
            } else {
                var employee = response.data;
                console.log("Emplloyees : ",employee);
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
                                  <select id="positions" class="form-select">
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
              getPositions();
            }
        } catch (error) {
          var html = `<h2>NO RECORD</h2>`;
        }
  
      }).catch((error) => {
        alert(`ERROR OCCURREDSSSSSSSSSSS! ${error}`);
    });
  }
//----------------------------------------------------------------------------------
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
          var myUrl = "http://128.199.232.132/waterworks/head/get_branch.php";
          const formData = new FormData();
          formData.append("branchId", sessionStorage.getItem("branchId"));
        
          axios({
            url: myUrl,
            method: "post",
            data: formData,
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
                if (selectedBranch === branchSelect.value) {
                  displayPoblacionEmployee();
                } else{
                  displayEmployee();
                }
                // Add more conditions as needed for other positions
              });
            })
            .catch((error) => {
              alert(`ERROR OCCURREDsss! ${error}`);
            });
        };

    const displayPoblacionEmployee = () => {
          var url = "http://128.199.232.132/waterworks/head/get_employee_poblacion.php";
          
          const formData = new FormData();
          formData.append("accountId", sessionStorage.getItem("accountId"));
          formData.append("branchName", sessionStorage.getItem("branchName"));
          
          axios({
            url: url,
            method: "post",
            data: formData
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
            const nameA = (a.firstname + ' ' + a.lastname).toUpperCase();
            const nameB = (b.firstname + ' ' + b.lastname).toUpperCase();
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
            var url = "http://128.199.232.132/waterworks/head/get_employee_mulogan.php";
            
            const formData = new FormData();
            formData.append("accountId", sessionStorage.getItem("accountId"));
            
            axios({
              url: url,
              method: "post",
              data: formData
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
              const nameA = (a.firstname + ' ' + a.lastname).toUpperCase();
              const nameB = (b.firstname + ' ' + b.lastname).toUpperCase();
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
    const searchInput = document.getElementById("searchInput");
    const filterPosition = document.getElementById("position");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    head.style.display = "none";
    paginationNumbers.style.display = "none";
    filterPosition.style.display = "none";
    searchInput.style.display = "none";
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";

  var myUrl = "http://128.199.232.132/waterworks/head/getemployee.php";
  const formData = new FormData();
  formData.append("user_id", user_id);

  axios({
      url: myUrl,
      method: "post",
      data: formData,
  }).then((response) => {
    console.log(response.data);
      try {
          if (response.data.length === 0) {
              // Display a message indicating there are no billing transactions yet.
              var html = `<h2>No Records</h2>`;
          } else {
              var employee = response.data;
              console.log("Emplloyees : ",employee);
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
                                <select id="positions" class="form-select">
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
            getPositions();
          }
      } catch (error) {
        var html = `<h2>NO RECORD</h2>`;
      }

    }).catch((error) => {
      alert(`ERROR OCCURREDSSSSSSSSSSS! ${error}`);
  });
}
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
      firstname === '' ||
      middlename === '' ||
      lastname === '' ||
      phone === '' ||
      email_add === '' ||
      provinceName === '' ||
      municipalityName === '' ||
      barangayName === '' ||
      username === '' ||
      branchId === '' ||
      positionId === ''
    ) {
      alert('Fill in all fields');
      return;
    }
  
    const myUrl = "http://128.199.232.132/waterworks/head/update_api/update_employee.php";
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
    console.log(user_id, firstname, middlename, lastname, phone, email_add, provinceName, municipalityName, barangayName,username,branchId, positionId);
  
    axios({
      url: myUrl,
      method: "post",
      data: formData,
    })
      .then((response) => {
        console.log("Responses : ",response);
        console.log("Responses status : ",response.data.status);
        
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
  var myUrl = "http://128.199.232.132/waterworks/head/get_branch.php";
  const formData = new FormData();
  formData.append("branchId", sessionStorage.getItem("branchId"));

  axios({
    url: myUrl,
    method: "post",
    data: formData
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
const getPositions = () => {
  const positionSelect = document.getElementById("positions");
  var myUrl = "http://128.199.232.132/waterworks/head/get_position.php";
  
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
  //-----------------------------------------------------------------------------

  const getFileterPosition = () => {
    const positionSelect = document.getElementById("position");
    var myUrl = "http://128.199.232.132/waterworks/head/get_position.php";
  
    axios({
      url: myUrl,
      method: "post",
    })
      .then((response) => {
        var positions = response.data;
  
        var options = `<option value="employee">Select Position</option>`;
        positions.forEach((position) => {
          options += `<option value="${position.position_name}">${position.position_name}</option>`;
        });
        positionSelect.innerHTML = options;
  
        // Event listener for position change
        positionSelect.addEventListener("change", () => {
          const selectedPosition = positionSelect.value;
          // Call the appropriate display function based on the selected position
          if (selectedPosition === "Meter Reader") {
            displayReaderEmployee();
          }else if (selectedPosition === "Clerk") {
            displayClerkEmployee();
          } else{
            displayEmployee();
          }
          // Add more conditions as needed for other positions
        });
      })
      .catch((error) => {
        alert(`ERROR OCCURRED! ${error}`);
      });
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
    const filterPosition = document.getElementById("position");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    head.style.display = "block";
    paginationNumbers.style.display = "block";
    filterPosition.style.display = "block";
    searchInput.style.display = "block";
    prevBtn.style.display = "block";
    nextBtn.style.display = "block";
};