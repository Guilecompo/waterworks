let currentPage = 1;
let consumers = [];
let isEditMode = false;

const onLoad = () => {
  var accountId = sessionStorage.getItem("accountId");
  if (!accountId || accountId === "0") {
      window.location.href = "/waterworks/";
  } else {
    document.getElementById("ngalan").innerText =
    sessionStorage.getItem("fullname");
  displayConsumer();
  getFilterBranch();
  }
  
};
const refreshFilters = () => {
  displayConsumer();
  getFilterBranch();
};

const displayConsumer = () => {
  const head = document.getElementById("head");
  const paginationNumbers = document.getElementById("paginationNumbers");
  const branchSelect = document.getElementById("branch");
  const searchInput = document.getElementById("searchInput");
  head.style.display = "block";
  // paginationNumbers.style.display = "block";
  // branchSelect.style.display = "block";
  // searchInput.style.display = "block";

  var url = "http://152.42.243.189/waterworks/admin/get_consumers.php";
  const formData = new FormData();
  formData.append("accountId", sessionStorage.getItem("accountId"));
  axios({
    url: url,
    method: "post",
    data: formData,
  })
    .then((response) => {
      console.log(response.data);
      consumers = response.data;
      if (!Array.isArray(consumers) || consumers.length === 0) {
        errorTable();
      } else {
        consumerRefreshTables(consumers);
      }
    })
    .catch((error) => {
      console.log("ERROR! - " + error);
    });
};

const errorTable = () => {
  var html = `
        <table id="example" class="table table-striped table-bordered" style="width:100%">
          <thead>
            <tr>
                <th class="text-center">Meter No</th>
                <th class="text-center">Full Name</th>
                <th class="text-center">Branch</th>
                <th class="text-center">Action</th>
            </tr>
          </thead>
          </table>`;

  document.getElementById("mainDiv").innerHTML = html;
};
const consumerRefreshTables = (consumers) => {
  var html = `
        <table id="example" class="table table-striped table-bordered" style="width:100%">
          <thead>
            <tr>
              <th class="text-center">Meter No</th>
              <th class="text-center">Full Name</th>
              <th class="text-center">Branch</th>
              <th class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
        `;
    consumers.forEach((consumer) => {
    html += `
            <tr>
              <td class="text-center">${consumer.meter_no}</td>
              <td class="text-center">${consumer.firstname} ${consumer.lastname} </td>
              <td class="text-center">${consumer.branch_name}</td>
              <td class="text-center">
                <button style="background-color: #0275d8; border: none; padding: 5px; border-radius: 12%; color:white;"  onclick="edit(${consumer.user_id})">Edit</button>
                  <button style="background-color: #0275d8; border: none; padding: 5px; border-radius: 12%; color:white;" class="dropdown dropdown-toggle" type="button" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <span >View</span>
                  </button>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><a class="dropdown-item" onclick="information(${consumer.user_id})">Information</a></li>
                        <li><a class="dropdown-item" onclick="newBill(${consumer.user_id})">New Bill</a></li>
                        <li><a class="dropdown-item" onclick="billingHis(${consumer.user_id})">Billing History</a></li>
                        <li><a class="dropdown-item" onclick="paymentHis(${consumer.user_id})">Payment History</a></li>
                    </ul>
                  <button style="background-color: #0275d8; border: none; padding: 5px; border-radius: 12%; color:white;" class="dropdown dropdown-toggle" type="button" id="navbarDropdown1" data-bs-toggle="dropdown" aria-expanded="false">
                    <span >More</span>
                  </button>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown1">
                        <li><a class="dropdown-item" onclick="change(${consumer.user_id})">Change Meter</a></li>
                        <li><a class="dropdown-item" onclick="add(${consumer.user_id})">Add Connected</a></li>
                        <li><a class="dropdown-item" onclick="more(${consumer.user_id})">View Connected</a></li>
                    </ul>
              </td>
            </tr>
            `;
  });
  html += `</tbody></table>`;
  document.getElementById("mainDiv").innerHTML = html;
  $('#example').DataTable({
    "ordering": false // Disable sorting for all columns
  });
};

const add_consumer = () => {
  var html = `
        <div class="mb-1 mt-3">
            <h4 style="text-align: center;">Add Consumer</h4>
        </div>
        <div class="container-fluid mt-3">
            <form class="row g-3">
                <label class="form-label mb-0 underline-label">Personal Information</label>
                <div class="col-md-4">
                    <label class="form-label">First Name</label>
                     <input type="text" class="form-control" id="firstname" required>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Middle Name</label>
                    <input type="text" class="form-control" id="middlename" required>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Last Name</label>
                    <input type="text" class="form-control" id="lastname" required>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Suffix</label>
                    <select id="suffix" class="form-select"></select>
                  </div>
                <div class="col-md-4">
                    <label class="form-label">Phone</label>
                    <input type="text" class="form-control" id="phone" required>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" id="email_add" required>
                </div>

                <label class="form-label mb-0 underline-label">Address</label>
                <div class="col-md-4 ">
                    <label class="form-label">Municipality</label>
                    <select id="municipality" class="form-select" onchange="getBarangays()" ></select>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Barangay</label>
                    <select id="barangay" class="form-select" onchange="getZones()" required>
                        <option value="">Select Barangay</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Zone</label>
                    <select id="zoneId" class="form-select" required>
                        <option value="">Select Zone</option>
                    </select>
                </div>
                <label class="form-label mb-0 underline-label mt-4">Register Account</label>
                <div class="col-md-4 ">
                    <label class="form-label">Branch</label>
                    <select id="branch" class="form-select"></select>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Property Type</label>
                    <select id="property" class="form-select"></select>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Consumer Type</label>
                    <select id="consumer" class="form-select"></select>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Meter Number</label>
                    <input type="text" class="form-control" id="meter_no" required>
                </div>   
                <div class="col-md-4">
                    <label class="form-label">House Number</label>
                    <input type="number" class="form-control" id="house_no">
                </div>
                <div class="col-12 mt-5">
                    <button type="submit" class="btn btn-primary w-100" onclick="submit_consumer(event)">Submit form</button>
                </div>
            </form>
        </div>
                          
        `;
        document.getElementById("modalContents").innerHTML = html;

        // Show the modal
        const myModal = new bootstrap.Modal(document.getElementById('myModals'));
        myModal.show();
        getSuffix();
        getBranchs();
        getConsumerType();
        getProperty();
        getMunicipalitys();
}
const submit_consumer = (event) => {
  event.preventDefault();
    const firstname = document.getElementById("firstname").value;
    const middlename = document.getElementById("middlename").value;
    const lastname = document.getElementById("lastname").value;
    const suffixId = document.getElementById("suffix").value;

    const phone = document.getElementById("phone").value;
    const email_add = document.getElementById("email_add").value;
    const propertyId = document.getElementById("property").value;
    const municipalityId = document.getElementById("municipality").value;
    const barangayId = document.getElementById("barangay").value;
    const zoneId = document.getElementById("zoneId").value;
    const branchId = document.getElementById("branch").value;

    const consumer = document.getElementById("consumer").value;
    const meter_no = document.getElementById("meter_no").value;
    const house_no = document.getElementById("house_no").value;
    console.log(
      firstname,
      middlename,
      lastname,
      suffixId,
      phone,
      email_add,
      propertyId,
      municipalityId,
      barangayId,
      zoneId,
      branchId,
      consumer,
      meter_no,
      house_no
    );
    const inputs = [
      { id: "firstname", element: document.getElementById("firstname") },
      { id: "middlename", element: document.getElementById("middlename") },
      { id: "lastname", element: document.getElementById("lastname") },
      { id: "suffix", element: document.getElementById("suffix") },
      { id: "phone", element: document.getElementById("phone") },
      { id: "email_add", element: document.getElementById("email_add") },
      { id: "property", element: document.getElementById("property") },
      { id: "municipality", element: document.getElementById("municipality") },
      { id: "barangay", element: document.getElementById("barangay") },
      { id: "zone", element: document.getElementById("zoneId") },
      { id: "branch", element: document.getElementById("branch") },
      { id: "consumer", element: document.getElementById("consumer") },
      { id: "meter_no", element: document.getElementById("meter_no") }
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

  const myUrl = "http://152.42.243.189/waterworks/admin/add_consumer.php";
  const formData = new FormData();
  formData.append("firstname", firstname);
  formData.append("middlename", middlename);
  formData.append("lastname", lastname);
  formData.append("suffixId", suffixId);
  formData.append("phone", phone);
  formData.append("email_add", email_add);
  formData.append("propertyId", propertyId);
  formData.append("municipalityId", municipalityId);
  formData.append("barangayId", barangayId);
  formData.append("zoneId", zoneId);
  formData.append("branchId", branchId);
  formData.append("consumer", consumer);
  formData.append("meter_no", meter_no);
  formData.append("house_no", house_no);
  formData.append("employee_Id", sessionStorage.getItem("accountId"));
  
    axios({
      url: myUrl,
      method: "post",
      data: formData,
    })
      .then((response) => {
        console.log(response);
        if (response.data.status === 1) {
          success_modals();
          displayConsumer();
          // window.location.href = "./addconsumer.html";
        } else if (response.data.status === 0) {
          // alert("Username or phone number already exists!");
          failed_modals();
        } else {
          // alert("Unknown error occurred.");
          error_modals();
          console.log(response);
        }
      })
      .catch((error) => {
        console.log(`ERROR OCCURRED! ${error}`);
        console.log(error);
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
      var positions = response.data;

      var options = `<option value="employee">Select Branch</option>`;
      positions.forEach((position) => {
        options += `<option value="${position.branch_name}">${position.branch_name}</option>`;
      });
      branchSelect.innerHTML = options;

      // Event listener for position change
      branchSelect.addEventListener("change", () => {
        const selectedBranch = branchSelect.value;
        if (selectedBranch !== "employee") {
          displayConsumerBranch(selectedBranch);
        } else {
          displayConsumer();
        }
        // Add more conditions as needed for other positions
      });
    })
    .catch((error) => {
      console.log(`ERROR OCCURRED! ${error}`);
    });
};
// ----------------------------------FILTER POBLACION------------------------------------------------
const displayConsumerBranch = (selectedBranch) => {
  var url = "http://152.42.243.189/waterworks/admin/get_consumers_poblacion.php";
  const formData = new FormData();
  formData.append("accountId", sessionStorage.getItem("accountId"));
  formData.append("selectedBranch", selectedBranch);
  axios({
    url: url,
    method: "post",
    data: formData,
  })
    .then((response) => {
      console.log(response.data);
      consumers = response.data;
      branchRefreshTables(consumers);
    })
    .catch((error) => {
      console.log("ERROR! - " + error);
    });
};
const branchRefreshTables = (consumers) => {
  var html = `
        <table id="example" class="table table-striped table-bordered" style="width:100%">
          <thead>
            <tr>
              <th class="text-center">Meter No</th>
              <th class="text-center">Full Name</th>
              <th class="text-center">Branch</th>
              <th class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
        `;
    consumers.forEach((consumer) => {
    html += `
            <tr>
              <td class="text-center">${consumer.meter_no}</td>
              <td class="text-center">${consumer.firstname} ${consumer.lastname}</td>
              <td class="text-center">${consumer.branch_name}</td>
              <td class="text-center">
                <button style="background-color: #0275d8; border: none; padding: 5px; border-radius: 12%; color:white;"  onclick="edit(${consumer.user_id})">Edit</button>
                  <button style="background-color: #0275d8; border: none; padding: 5px; border-radius: 12%; color:white;" class="dropdown dropdown-toggle" type="button" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <span >View</span>
                  </button>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><a class="dropdown-item" onclick="information(${consumer.user_id})">Information</a></li>
                        <li><a class="dropdown-item" onclick="newBill(${consumer.user_id})">New Bill</a></li>
                        <li><a class="dropdown-item" onclick="billingHis(${consumer.user_id})">Billing History</a></li>
                        <li><a class="dropdown-item" onclick="paymentHis(${consumer.user_id})">Payment History</a></li>
                    </ul>
                  <button style="background-color: #0275d8; border: none; padding: 5px; border-radius: 12%; color:white;" class="dropdown dropdown-toggle" type="button" id="navbarDropdown1" data-bs-toggle="dropdown" aria-expanded="false">
                    <span >More</span>
                  </button>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown1">
                        <li><a class="dropdown-item" onclick="change(${consumer.user_id})">Change Meter</a></li>
                        <li><a class="dropdown-item" onclick="add(${consumer.user_id})">Add Connected</a></li>
                        <li><a class="dropdown-item" onclick="more(${consumer.user_id})">View Connected</a></li>
                    </ul>
              </td>
            </tr>
            `;
  });
  html += `</tbody></table>`;
  document.getElementById("mainDiv").innerHTML = html;
  $('#example').DataTable({
    "ordering": false // Disable sorting for all columns
  });
};
// ---------------------------------------------FOR EDIT-----------------------------------------------------
const edit = (user_id) => {
  const head = document.getElementById("head");
  head.style.display = "none";

  var myUrl = "http://152.42.243.189/waterworks/admin/getconsumer.php";
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
          var consumer = response.data;
          console.log("Consumer : ", consumer[0].user_id);

          var html = `
              <div class=" row  mt-1">
                <div class="col-md-11 mt-3">
                  <h4 style="text-align: center;">Edit Consumer</h4>
                </div>
              </div>
              <div class="container-fluid mt-3">
                  <form class="row g-3">
                      <label class="form-label mt-2 mb-0 underline-label">Personal Information</label>
                      <div class="col-md-4 mt-3">
                          <label class="form-label">First Name</label>
                          <input type="text" class="form-control" id="firstname" value="${consumer[0].firstname}" required>
                      </div>
                      <div class="col-md-4 mt-3">
                          <label class="form-label">Middle Name</label>
                          <input type="text" class="form-control" id="middlename" value="${consumer[0].middlename}" required>
                      </div>
                      <div class="col-md-4 mt-3">
                          <label class="form-label">Last Name</label>
                          <input type="text" class="form-control" id="lastname" value="${consumer[0].lastname}" required>
                      </div>
                      <div class="col-md-4">
                        <label class="form-label">Suffix</label>
                        <select id="suffix" class="form-select">
                            <option value="${consumer[0].suffix_id}" selected>${consumer[0].suffix_name}</option>
                        </select>
                      </div>
                      <div class="col-md-4 mt-3">
                          <label class="form-label">Phone</label>
                          <input type="text" class="form-control" id="phone" value="${consumer[0].phone_no}" required>
                      </div>
                      <div class="col-md-4 mt-3">
                          <label class="form-label">Email</label>
                          <input type="email" class="form-control" id="email_add" value="${consumer[0].email}" required>
                      </div>
                      <label class="form-label mt-3 mb-0 underline-label">Address</label>
                      <div class="col-md-4 mt-3">
                          <label class="form-label">Municipality</label>
                          <select id="municipality" class="form-select" onchange="getBarangay()">
                            <option value="${consumer[0].municipality_id}" selected>${consumer[0].municipality_name}</option>
                          </select>
                      </div>
                      <div class="col-md-4 mt-3">
                          <label class="form-label">Barangay</label>
                          <select id="barangay" class="form-select" onchange="getZone()">
                          <option value="${consumer[0].barangay_id}" selected>${consumer[0].barangay_name}</option>
                          </select>
                      </div>
                      <div class="col-md-4 mt-3">
                          <label class="form-label">Zone</label>
                          <select id="zoneId" class="form-select" >
                            <option value="${consumer[0].zone_id}" selected>${consumer[0].zone_name}</option>
                          </select>
                      </div>
                      <label class="form-label mt-3 mb-0 underline-label mt-4">Register Account</label>
                      <div class="col-md-4 mt-3">
                          <label class="form-label">Branch</label>
                          <select id="edit_branch" class="form-select">
                            <option value="${consumer[0].branch_id}" selected>${consumer[0].branch_name}</option>
                          </select>
                      </div>
                      <div class="col-md-4 mt-3">
                          <label class="form-label">Property Type</label>
                          <select id="property" class="form-select">
                            <option value="${consumer[0].property_id}" selected>${consumer[0].property_name}</option>
                          </select>
                      </div> 
                      <div class="col-md-4 mt-3">
                          <label class="form-label">Consumer Type</label>
                          <select id="consumer" class="form-select">
                            <option value="${consumer[0].consumertype_id }" selected>${consumer[0].consumertype}</option>
                          </select>
                      </div>
                      <div class="col-md-4 mt-3">
                          <label class="form-label">Meter Number</label>
                          <input type="text" class="form-control" id="meter_no" value="${consumer[0].meter_no}" required>
                      </div>  
                      <div class="col-md-4 mt-3">
                          <label class="form-label">House Number</label>
                          <input type="number" class="form-control" id="house_no" value="${consumer[0].house_no}">
                      </div>                     
                      <div class="col-12 mt-4">
                          <button type="submit" class="btn btn-primary w-100" onclick="submit_edit_consumer(event, ${consumer[0].user_id})">Submit form</button>
                      </div>
                  </form>
              </div>
                                
              `;

              document.getElementById("modalContents").innerHTML = html;

              // Trigger the modal
              var myModal = new bootstrap.Modal(document.getElementById('myModals'), {});
              myModal.show();
          getSuffix();
          getBranch();
          getProperty();
          getConsumerType();
          getMunicipality();
        }
      } catch (error) {
        document.getElementById("modalContents").innerHTML = `<h2>No Record</h2>`;
      }
    })
    .catch((error) => {
      console.log(`ERROR OCCURREDSSSSSSSSSSS! ${error}`);
    });
};
const submit_edit_consumer = (event, user_id) => {
  event.preventDefault();
  const firstname = document.getElementById("firstname").value;
  const middlename = document.getElementById("middlename").value;
  const lastname = document.getElementById("lastname").value;

  const phone = document.getElementById("phone").value;
  const email_add = document.getElementById("email_add").value;
  const propertyId = document.getElementById("property").value;
  const consumertypeId = document.getElementById("consumer").value;

  const municipalityId = document.getElementById("municipality").value;
  const barangayId = document.getElementById("barangay").value;
  const zoneId = document.getElementById("zoneId").value;

  const branchId = document.getElementById("edit_branch").value;
  const meter_no = document.getElementById("meter_no").value;
  const house_no = document.getElementById("house_no").value;

  if (
    firstname === "" ||
    middlename === "" ||
    lastname === "" ||
    phone === "" ||
    email_add === "" ||
    propertyId === "" ||
    consumertypeId === "" ||
    municipalityId === "" ||
    barangayId === "" ||
    zoneId === "" ||
    branchId === "" ||
    meter_no === "" 
  ) {
    alert("Fill in all fields");
    return;
  }

  const myUrl =
    "http://152.42.243.189/waterworks/admin/update_api/update_consumer.php";
  const formData = new FormData();
  formData.append("userid", user_id);
  formData.append("firstname", firstname);
  formData.append("middlename", middlename);
  formData.append("lastname", lastname);
  formData.append("phone", phone);
  formData.append("email_add", email_add);
  formData.append("propertyId", propertyId);
  formData.append("consumertypeId", consumertypeId);
  formData.append("municipalityId", municipalityId);
  formData.append("barangayId", barangayId);
  formData.append("zoneId", zoneId);
  formData.append("branchId", branchId);
  formData.append("meter_no", meter_no);
  formData.append("house_no", house_no);
  formData.append("employee_Id", sessionStorage.getItem("accountId"));
  console.log(
    user_id,
    firstname,
    middlename,
    lastname,
    phone,
    email_add,
    municipalityId,
    barangayId,
    zoneId,
    house_no,
    meter_no,
    branchId,
    propertyId,
    consumertypeId
  );

  axios({
    url: myUrl,
    method: "post",
    data: formData,
  })
    .then((response) => {
      console.log(response);
      if (response.data.status === 1) {
        success_modals();
        console.log("success update");
        displayConsumer();
      } else if (response.data.status === 0) {
        // alert("Username or phone number already exists!");
        failed_modals();
        console.log(response);
      } else {
        // alert("Unknown error occurred.");
        error_modals();
        console.log(response);
      }
    })
    .catch((error) => {
      console.log(`ERROR OCCURRED! ${error}`);
    });
};
const updateBillStatus = () => {
  const myUrl =
    "http://152.42.243.189/waterworks/admin/update_api/update_billstatus.php";
  const formData = new FormData();
  formData.append("employee_Id", sessionStorage.getItem("accountId"));
  axios({
    url: myUrl,
    method: "post",
    data: formData,
  })
    .then((response) => {
      console.log(response);
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
      console.log(`ERROR OCCURRED! ${error}`);
    });
};
const getSuffix = () => {
  const propertySelect = document.getElementById("suffix");
  var myUrl = "http://152.42.243.189/waterworks/gets/get_suffix.php";

  axios({
    url: myUrl,
    method: "post",
  })
    .then((response) => {
      var properties = response.data;

      var options = ``;
      properties.forEach((property) => {
        options += `<option value="${property.suffix_id}">${property.suffix_name}</option>`;
      });
      propertySelect.innerHTML = options;
    })
    .catch((error) => {
      console.log(`ERROR OCCURRED! ${error}`);
    });
};
const getProperty = () => {
  const propertySelect = document.getElementById("property");
  var myUrl = "http://152.42.243.189/waterworks/gets/get_property.php";

  axios({
    url: myUrl,
    method: "post",
  })
    .then((response) => {
      var properties = response.data;

      var options = ``;
      properties.forEach((property) => {
        options += `<option value="${property.property_id}">${property.property_name}</option>`;
      });
      propertySelect.innerHTML = options;
    })
    .catch((error) => {
      console.log(`ERROR OCCURRED! ${error}`);
    });
};
const getBranchs = () => {
  // const barangayId = document.getElementById("barangay").value;
  const propertySelect = document.getElementById("branch");
  var myUrl = "http://152.42.243.189/waterworks/admin/get_branch.php";
  // const formData = new FormData();
  // formData.append("barangayId", barangayId);
  //   console.log(barangaySelect);
  axios({
    url: myUrl,
    method: "post",
    // data: formData
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
      console.log(`ERROR OCCURRED! ${error}`);
    });
};
const getBranch = () => {
  const propertySelect = document.getElementById("edit_branch");
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
      console.log(`ERROR OCCURRED! ${error}`);
    });
};

// ----------------------------------FILTER MOLUGAN------------------------------------------------
const displayConsumerMulogan = () => {
  var url = "http://152.42.243.189/waterworks/admin/get_consumers_mulogan.php";
  const formData = new FormData();
  formData.append("accountId", sessionStorage.getItem("accountId"));
  axios({
    url: url,
    method: "post",
    data: formData,
  })
    .then((response) => {
      console.log(response.data);
      consumers = response.data;
      sortConsumersMuloganByName();
      showConsumerMuloganPage(currentPage);
    })
    .catch((error) => {
      console.log("ERROR! - " + error);
    });
};

const sortConsumersMuloganByName = () => {
  consumers.sort((a, b) => {
    const nameA = (a.firstname + " " + a.lastname).toUpperCase();
    const nameB = (b.firstname + " " + b.lastname).toUpperCase();
    return nameA.localeCompare(nameB);
  });
};

const showConsumerMuloganPage = (page, consumersToDisplay = consumers) => {
  var start = (page - 1) * 10;
  var end = start + 10;
  var displayedConsumers = consumersToDisplay.slice(start, end);
  MuloganrefreshTables(displayedConsumers);
  showPaginationNumbersMolugan(page, Math.ceil(consumersToDisplay.length / 10));
};
const showPaginationNumbersMolugan = (currentPage, totalPages) => {
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
      paginationNumbersHTML += `<span class="active" onclick="goToPageMolugan(${i})">${i}</span>`;
    } else {
      paginationNumbersHTML += `<span onclick="goToPageMolugan(${i})">${i}</span>`;
    }
  }

  // Next button
  paginationNumbersHTML += `<button onclick="showNextPage()">Next</button>`;

  paginationNumbersDiv.innerHTML = paginationNumbersHTML;
};

const goToPageMolugan = (pageNumber) => {
  showConsumerMuloganPage(pageNumber);
};
const MuloganrefreshTables = (consumerList) => {
  var html = `
      <table  id="example" class="table table-striped table-bordered" style="width:100%">
        <thead>
          <tr>
            <th scope="col">Full Name</th>
            <th scope="col">Meter No</th>
            <th scope="col">Branch</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
      `;
  consumerList.forEach((consumer) => {
    html += `
          <tr>
            <td>${consumer.firstname} ${consumer.lastname}</td>
            <td>${consumer.meter_no}</td>
            <td>${consumer.branch_name}</td>
            <td>
            <button class="clear" onclick="edit(${consumer.user_id})">Edit</button>
            </td>
          </tr>
          `;
  });
  html += `</tbody></table>`;
  document.getElementById("mainDiv").innerHTML = html;
};
const getConsumerType = () => {
  const propertySelect = document.getElementById("consumer");
  var myUrl = "http://152.42.243.189/waterworks/gets/get_consumertype.php";

  axios({
    url: myUrl,
    method: "post",
  })
    .then((response) => {
      var properties = response.data;

      var options = ``;
      properties.forEach((property) => {
        options += `<option value="${property.consumertype_id }">${property.consumertype}</option>`;
      });
      propertySelect.innerHTML = options;
    })
    .catch((error) => {
      console.log(`ERROR OCCURRED! ${error}`);
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
      console.log(`ERROR OCCURRED! ${error}`);
    });
  };
const getMunicipality = () => {
  const municipalitySelect = document.getElementById("municipality");
  var myUrl = "http://152.42.243.189/waterworks/gets/get_municipality.php";

  axios({
    url: myUrl,
    method: "post",
  })
    .then((response) => {
      var municipalities = response.data;
      console.log("success municipality");

      var options = `<option value="${municipalities[0].municipality_id}" selected>${municipalities[0].municipality_name}</option>`;
      municipalities.forEach((municipality) => {
        options += `<option value="${municipality.municipality_id}">${municipality.municipality_name}</option>`;
      });
      municipalitySelect.innerHTML = options;

      getBarangay();
    })
    .catch((error) => {
      console.log(`ERROR OCCURRED! ${error}`);
    });
};

const getBarangay = () => {
  const selectedMunicipalityId = document.getElementById("municipality").value;

  const barangayUrl = `http://152.42.243.189/waterworks/gets/get_barangay.php`;
  const formData = new FormData();

  // Use selectedMunicipalityId directly
  formData.append("municipalityId", selectedMunicipalityId);

  axios({
    url: barangayUrl,
    method: "post",
    data: formData,
  })
    .then((response) => {
      const barangaySelect = document.getElementById("barangay");
      const barangays = response.data;
      console.log("success barangay");
      // Clear existing options
      barangaySelect.innerHTML = ``;
      barangaySelect.innerHTML = '<option value="">Select Barangay</option>';

      // Populate options for barangays
      barangays.forEach((barangay) => {
        const option = document.createElement("option");
        option.value = barangay.barangay_id;
        option.textContent = barangay.barangay_name;
        barangaySelect.appendChild(option);
      });
      getZone();
    })
    .catch((error) => {
      console.log(`ERROR OCCURRED while fetching barangays! ${error}`);
    });
};

const getZone = () => {
  const selectedBarangayId = document.getElementById("barangay").value;

  const zoneUrl = `http://152.42.243.189/waterworks/gets/get_zone.php`;
  const formData = new FormData();

  // Use selectedMunicipalityId directly
  formData.append("barangayId", selectedBarangayId);
  console.log('barangayId: ',selectedBarangayId);
  axios({
    url: zoneUrl,
    method: "post",
    data: formData,
  })
    .then((response) => {
      const zoneSelect = document.getElementById("zoneId");
      const zones = response.data;
      console.log("success zone");
      console.log("Zones data from server:", zones);

      // Clear existing options
      zoneSelect.innerHTML = `<option value="${zones[0].zone_id}" selected>${zones[0].zone_name}</option>`;

      // Sort zones numerically
      zones.sort((a, b) => {
        const aNumber = parseInt(a.zone_name.match(/\d+/)[0]);
        const bNumber = parseInt(b.zone_name.match(/\d+/)[0]);
        return aNumber - bNumber;
      });

      // Populate options for zones
      zones.forEach((zone) => {
        const option = document.createElement("option");
        option.value = zone.zone_id;
        option.textContent = zone.zone_name;
        zoneSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.log(`ERROR OCCURRED while fetching zones! ${error}`);
    });
};

const getMunicipalitys = () => {
  const municipalitySelect = document.getElementById("municipality");
  var myUrl = "http://152.42.243.189/waterworks/gets/get_municipality.php";
  
  axios({
    url: myUrl,
    method: "post",
  })
    .then((response) => {
      var municipalities = response.data;
      console.log("success municipality");
  
      var options = ``;
      municipalities.forEach((municipality) => {
        options += `<option value="${municipality.municipality_id}">${municipality.municipality_name}</option>`;
      });
      municipalitySelect.innerHTML = options;
  
       getBarangays();
    })
    .catch((error) => {
      console.log(`ERROR OCCURRED! ${error}`);
    });
  };
  
  const getBarangays = () => {
  const selectedMunicipalityId = document.getElementById("municipality").value;
  
  const barangayUrl = `http://152.42.243.189/waterworks/gets/get_barangay.php`;
  const formData = new FormData();
  
  // Use selectedMunicipalityId directly
  formData.append("municipalityId", selectedMunicipalityId);
  
  axios({
    url: barangayUrl,
    method: "post",
    data: formData
  })
    .then((response) => {
      const barangaySelect = document.getElementById("barangay");
      const barangays = response.data;
      console.log("success barangay");
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
      console.log(`ERROR OCCURRED while fetching barangays! ${error}`);
    });
  };
  
  
  const getZones = () => {
    const selectedBarangayId = document.getElementById("barangay").value;
  
    const zoneUrl = `http://152.42.243.189/waterworks/gets/get_zone.php`;
    const formData = new FormData();
  
    // Use selectedMunicipalityId directly
    formData.append("barangayId", selectedBarangayId);
    axios({
      url: zoneUrl,
      method: "post",
      data: formData
    })
      .then((response) => {
        const zoneSelect = document.getElementById("zoneId");
        const zones = response.data;
  
        // Clear existing options
        zoneSelect.innerHTML = '<option value="">Select Zone</option>';
  
        // Sort zones numerically
        zones.sort((a, b) => {
          // Extract numeric part from the zone name and compare
          const aNumber = parseInt(a.zone_name.match(/\d+/)[0]);
          const bNumber = parseInt(b.zone_name.match(/\d+/)[0]);
          return aNumber - bNumber;
        });
  
        // Populate options for zones
        zones.forEach((zone) => {
          const option = document.createElement("option");
          option.value = zone.zone_id;
          option.textContent = zone.zone_name;
          zoneSelect.appendChild(option);
        });
      })
      .catch((error) => {
        console.log(`ERROR OCCURRED while fetching zones! ${error}`)
      });
  };

const success_update_modal = () => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");
  var html = `
            <h5 class="modal-title " style="color: limegreen; text-align:center;">Success</h5>
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
  head.style.display = "block";
};

// -------------------------------------------------VIEW START ---------------------------------------------------
const information = (user_id) => {
  console.log("USER ID :", user_id);
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");

  var myUrl = "http://152.42.243.189/waterworks/gets/get_consumer.php";
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
                              <label class="form-label">Zone</label>
                              <h6 class="text-muted" >${employee[0].zone_name}</h6>
                          </div>
                          <div class="col-md-4 mt-1">
                              <label class="form-label">Barangay</label>
                              <h6 class="text-muted" >${employee[0].barangay_name}</h6>
                          </div>
                          <div class="col-md-4 mt-1">
                              <label class="form-label">Municipality</label>
                              <h6 class="text-muted" >${employee[0].municipality_name}</h6>
                          </div>
                          <hr class="badge-primary mt-2 mb-2">
                          <label class="form-label mb-0 mt-0 " style="font-size: large;">Registered Account</label>
                          <hr class="badge-primary mt-2">
                          <div class="col-md-4 mt-1">
                              <label class="form-label">Branch</label>
                              <h6 class="text-muted" >${employee[0].branch_name}</h6>
                          </div>
                          <div class="col-md-4 mt-1">
                              <label class="form-label">Property Type</label>
                              <h6 class="text-muted" >${employee[0].property_name}</h6>
                          </div> 
                          <div class="col-md-4 mt-1">
                              <label class="form-label">Meter Number</label>
                              <h6 class="text-muted" >${employee[0].meter_no}</h6>
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
      console.log(`ERROR OCCURRED! ${error}`);
    });
};
const newBill = (user_id) => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");

  var myUrl = "http://152.42.243.189/waterworks/gets/get_bill.php";
  const formData = new FormData();
  formData.append("accId", user_id);

  axios({
    url: myUrl,
    method: "post",
    data: formData,
  })
    .then((response) => {
      try {
        if (response.data.length === 0) {
          // Display a message indicating there are no billing transactions yet.
          var html = `<h6>No Records</h6>`;
        } else {
          var records = response.data;
          console.log(records);
          html = `
                  <div class="wrapper mb-0">
                    <div class="container mt-0 mb-0">
                        <div class="row ">
                                <div class="row ">
                                    <div class="text-center ">
                                      <h4 class="mb-3" style="text-align:center;">Current Bill</h4>
                                      <hr class="badge-primary mt-3 mb-4">
                                    </div>
                                    <div class="mt-1 text-center">
                                      <i class="fas fa-user fa-3x mt-0"></i>
                                      <h5 class="font-weight-bold mt-2">${records[0].con_firstname} ${records[0].con_middlename} ${records[0].con_lastname} </h5>
                                      <p class="text-muted" >${records[0].zone_name}, ${records[0].barangay_name}, ${records[0].municipality_name}</p>
                                      <p class="text-muted" >${records[0].meter_no}</p>
                                  </div>
                                </div>
                                <div class="row">
                                    
                                    </span>
                                    <table class="tab table table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th class="text-center">Previous</th>
                                                <th class="text-center">Present</th>
                                                <th class="text-center">Consumed</th>
                                                <th class="text-center">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class="col-md-3 text-center">${records[0].previous_meter}</td>
                                                <td class="col-md-3 text-center">${records[0].present_meter}</td>
                                                <td class="col-md-3 text-center">${records[0].cubic_consumed}</td>
                                                <td class="col-md-3 text-center">${records[0].bill_amount}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table class="tabb1 table table-hover table-fixed">
                                        <tbody>
                                            <tr>
                                                <td class="col-md-5 text-start border-0 ">
                                                    <p>
                                                        <strong style="font-size: small">ARREARS </strong>
                                                    </p>
                                                    <p>
                                                        <strong style="font-size: small">AMOUNT UNTIL DUE DATE </strong>
                                                    </p>
                                                </td>
                                                <td class="col-md-1 border-0"></td>
                                                <td class="col-md-3 border-0"></td>
                                                <td class="col-md-3 text-center border-0">
                                                    <p>
                                                        <strong>${records[0].arrears}</strong>
                                                    </p>
                                                    <p>
                                                        <strong>${records[0].total_bill}</strong>
                                                    </p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>                                                     
                                    <table class="tabb2 table table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th class="text-center">Reading Date</th>
                                                <th class="text-center">Due Date</th>
                                                <th class="text-center">FOR THE MONTH OF</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class="col-md-4 text-center">${records[0].reading_date}</td>
                                                <td class="col-md-4 text-center">${records[0].due_date}</td>
                                                <td class="col-md-4 text-center">${records[0].formatted_reading_date2}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                        </div>
                    </div>
                </div>
                `;
        }
      } catch (error) {
        // Handle any errors here
        html = `<h4 class="text-center ">Don't Have Current Bill</h4>`;
      }

      modalContent.innerHTML = html;
      modal.style.display = "block";
    })
    .catch((error) => {
      console.log(`ERROR OCCURRED! ${error}`);
    });
};

const billingHis = (user_id) => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");

  var myUrl = "http://152.42.243.189/waterworks/gets/consumer_billing_history.php";
  const formData = new FormData();
  formData.append("accId", user_id);

  axios({
    url: myUrl,
    method: "post",
    data: formData,
  })
    .then((response) => {
      try {
        if (response.data.length === 0) {
          // Display a message indicating there are no billing transactions yet.
          var html = `<h6>No Records</h6>`;
        } else {
          var records = response.data;

          // Add a single "Connected Meter" heading
          html = `
                <div class="text-center ">
                  <h4 class="mb-3" style="text-align:center;">Bill History</h4>
                  <hr class="badge-primary mt-3 mb-4">
                </div>
                <div class="mt-1 text-center">
                  <i class="fas fa-user fa-3x mt-0"></i>
                  <h5 class="font-weight-bold mt-2">${records[0].con_firstname} ${records[0].con_middlename} ${records[0].con_lastname} </h5>
                  <p class="text-muted" >${records[0].zone_name}, ${records[0].barangay_name}, ${records[0].municipality_name}</p>
                  <p class="text-muted" >${records[0].meter_no}</p>
                </div>
              `;

          html += `
                  <table id="example" class="table table-striped table-bordered" style="width:100%">
                      <thead>
                        <tr>
                          <th class="text-center">Reading Date</th>
                          <th class="text-center">Total Bill</th>
                          <th class="text-center">Reader Name</th>
                          <th class="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
              `;

          records.forEach((record) => {
            html += `
                    <tr>
                      <td class="text-center">${record.reading_date}</td>
                      <td class="text-center">${record.total_bill}</td>
                      <td class="text-center">${record.emp_firstname} ${record.emp_lastname}</td>
                      <td class="text-center"><button class="butts" style="background-color: #0275d8; border: none; padding: 5px; border-radius: 12%; color:white;" onclick="bill_receipt(${record.billing_id})">View</button></td>
                    </tr>
                  `;
          });

          html += `</tbody></table><br/><br/>`;
        }
      } catch (error) {
        // Handle any errors here
        html = `<h4 class="text-center ">Don't Have Billing History</h4>`;
      }

      modalContent.innerHTML = html;
      modal.style.display = "block";
      $('#example').DataTable({
        "ordering": false // Disable sorting for all columns
      });
    })
    .catch((error) => {
      console.log(`ERROR OCCURRED! ${error}`);
    });
};
const bill_receipt = (billing_id) => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");

  var myUrl = "http://152.42.243.189/waterworks/gets/consumer_billing_history1.php";
  const formData = new FormData();
  formData.append("billing_id", billing_id);
  console.log("billing_id  : ", billing_id);

  axios({
    url: myUrl,
    method: "post",
    data: formData,
  })
    .then((response) => {
      try {
        console.log(response.data);
        if (response.data.length === 0) {
          // Display a message indicating there are no billing transactions yet.
          var html = `<h2>No Records</h2>`;
        } else {
          var records = response.data;

          html = `
                <div class="wrapper">
                  <div class="container mt-0 ">
                      <div class="row ">
                              <div class="row ">
                                  <div class="text-center ">
                                      <h5 class="pe-4">EL SALVADOR WATERWORKS</h5>
                                  </div>
                                  <div class="col-sm-12 mt-3">
                                      <div class="row ">
                                          <div class="col-md-6 ">
                                              <p style="text-decoration: underline; font-size: small">NAME</p>
                                              <h6 class="text-muted mt-0">${records[0].con_firstname} ${records[0].con_middlename} ${records[0].con_lastname}</h6>
                                          </div>
                                  
                                          <div class="col-md-6  text-md-end">
                                              <p style="text-decoration: underline; font-size: small">ACCOUNT NUMBER</p>
                                              <h6 class="text-muted mt-0">${records[0].meter_no}</h6>
                                          </div>
                                      </div>
                                  
                                      <div class="mt-1">
                                          <p style="text-decoration: underline; font-size: small">ADDRESS</p>
                                          <h6 class="text-muted mt-0">${records[0].zone_name} ${records[0].barangay_name} ${records[0].municipality_name}</h6>
                                      </div>
                                  </div>
                                  
                              </div>
                              <div class="row">
                                  
                                  </span>
                                  <table class="tab table table-bordered table-hover">
                                      <thead>
                                          <tr>
                                              <th class="text-center">Previous</th>
                                              <th class="text-center">Present</th>
                                              <th class="text-center">Consumed</th>
                                              <th class="text-center">Amount</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          <tr>
                                              <td class="col-md-3 text-center">${records[0].previous_meter}</td>
                                              <td class="col-md-3 text-center">${records[0].present_meter}</td>
                                              <td class="col-md-3 text-center">${records[0].cubic_consumed}</td>
                                              <td class="col-md-3 text-center">${records[0].bill_amount}</td>
                                          </tr>
                                      </tbody>
                                  </table>
                                  <table class="tabb1 table table-hover table-fixed">
                                      <tbody>
                                          <tr>
                                              <td class="col-md-5 text-start border-0 ">
                                                  <p>
                                                      <strong style="font-size: small">ARREARS </strong>
                                                  </p>
                                                  <p>
                                                      <strong style="font-size: small">AMOUNT UNTIL DUE DATE </strong>
                                                  </p>
                                              </td>
                                              <td class="col-md-1 border-0"></td>
                                              <td class="col-md-3 border-0"></td>
                                              <td class="col-md-3 text-center border-0">
                                                  <p>
                                                      <strong>${records[0].arrears}</strong>
                                                  </p>
                                                  <p>
                                                      <strong>${records[0].total_bill}</strong>
                                                  </p>
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>                                                     
                                  <table class="tabb2 table table-bordered table-hover">
                                      <thead>
                                          <tr>
                                              <th class="text-center">Reading Date</th>
                                              <th class="text-center">Due Date</th>
                                              <th class="text-center">FOR THE MONTH OF</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          <tr>
                                              <td class="col-md-4 text-center">${records[0].reading_date}</td>
                                              <td class="col-md-4 text-center">${records[0].due_date}</td>
                                              <td class="col-md-4 text-center">${records[0].formatted_reading_date2}</td>
                                          </tr>
                                      </tbody>
                                  </table>
                              </div>
                              <div class="col-sm-12 mt-3">
                                      <div class="row ">
                                          <div class="col-md-3 ">
                                          </div>
                                          <div class="col-md-9  text-md-end">
                                              <h6 class="mt-0" style="padding-right: 15px; color: #f44336;">${records[0].billing_uniqueId}</h6>
                                          </div>
                                      </div>
                                  </div>
                      </div>
                  </div>
              </div>
              `;
        }
      } catch (error) {
        // Handle any errors here
        html = `<h4 class="text-center ">${error}</h4>`;
      }

      modalContent.innerHTML = html;
      modal.style.display = "block";
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
      console.log('the error: ', error);
    });
};

const paymentHis = (user_id) => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");

  var myUrl = "http://152.42.243.189/waterworks/gets/get_payment_history.php";
  const formData = new FormData();
  formData.append("accId", user_id);

  axios({
    url: myUrl,
    method: "post",
    data: formData,
  })
    .then((response) => {
      try {
        if (response.data.length === 0) {
          // Display a message indicating there are no billing transactions yet.
          var html = `<h6>No Records</h6>`;
        } else {
          var records = response.data;

          // Add a single "Connected Meter" heading
          html = `
                <div class="text-center ">
                  <h4 class="mb-3" style="text-align:center;">Payment History</h4>
                  <hr class="badge-primary mt-3 mb-4">
                </div>
                <div class="mt-1 text-center">
                  <i class="fas fa-user fa-3x mt-0"></i>
                  <h5 class="font-weight-bold mt-2">${records[0].con_firstname} ${records[0].con_middlename} ${records[0].con_lastname} </h5>
                  <p class="text-muted" >${records[0].zone_name}, ${records[0].barangay_name}, ${records[0].municipality_name}</p>
                  <p class="text-muted" >${records[0].meter_no}</p>
                </div>
              `;

          html += `
                    <table id="example" class="table table-striped table-bordered" style="width:100%">
                        <thead>
                            <tr>
                            <th class="text-center">Payment Date</th>
                            <th class="text-center">Payment Amount</th>
                            <th class="text-center">Clerk Name</th>
                            <th class="text-center">Action</th>
                            </tr>
                        </thead>
                    <tbody>
                    `;

          records.forEach((record) => {
            html += `
                            <tr>
                                <td class="text-center">${record.pay_date}</td>
                                <td class="text-center">${record.pay_amount}</td>
                                <td class="text-center">${record.emp_firstname} ${record.emp_lastname}</td>
                                <td class="text-center"><button class="butts" style="background-color: #0275d8; border: none; padding: 5px; border-radius: 12%; color:white;" onclick="payment_receipt(${record.pay_id})">View</button></td>
                            </tr>
                        `;
          });

          html += `</tbody></table><br/><br/>`;
        }
      } catch (error) {
        // Handle any errors here
        html = `<h4 class="text-center ">Don't Have Payment History</h4>`;
      }

      modalContent.innerHTML = html;
      modal.style.display = "block";
      $('#example').DataTable({
        "ordering": false // Disable sorting for all columns
      });
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
    });
};

const payment_receipt = (pay_id) => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");

  var myUrl = "http://152.42.243.189/waterworks/gets/get_payment_receipt.php";

  const formData = new FormData();
  formData.append("pay_id", pay_id);
  console.log("pay_id : ", pay_id);

  axios({
    url: myUrl,
    method: "post",
    data: formData,
  })
    .then((response) => {
      try {
        if (response.data.length === 0) {
          // Display a message indicating there are no billing transactions yet.
          var html = `<h2>No Records</h2>`;
        } else {
          var records = response.data;

          html = `
                <div class="wrapper">
                  <div class="container mt-0 ">
                      <div class="row ">
                              <div class="row ">
                                  <div class="text-center ">
                                      <h5 class="pe-4">EL SALVADOR WATERWORKS</h5>
                                  </div>
                                  <div class="col-sm-12 mt-3 p-3 border">
                                      <div class="row ">
                                          <div class="col-md-6 ">
                                              <p style="text-decoration: underline; font-size: small">NAME</p>
                                              <h6 class="text-muted mt-0">${records[0].con_firstname} ${records[0].con_middlename} ${records[0].con_lastname}</h6>
                                          </div>
                                  
                                          <div class="col-md-6  text-md-end">
                                              <p style="text-decoration: underline; font-size: small">ACCOUNT NUMBER</p>
                                              <h6 class="text-muted mt-0">${records[0].meter_no}</h6>
                                          </div>
                                      </div>
                                  
                                      <div class="mt-1">
                                          <p style="text-decoration: underline; font-size: small">ADDRESS</p>
                                          <h6 class="text-muted mt-0">${records[0].zone_name} ${records[0].barangay_name} ${records[0].municipality_name}</h6>
                                      </div>
                                  </div>
                                  
                              </div>
                              <div class="row">
                                  
                                  </span>
                                  
                                  <table class="tab1 table table-hover table-fixed ">
                                      <tbody>
                                          <tr>
                                              <td class="col-md-5 text-start border-0">
                                                  <p>
                                                      <strong></strong>
                                                  </p>
                                                  <p>
                                                      <strong>Amount Paid: </strong>
                                                  </p>
                                              </td>
                                              <td class="col-md-2 border-0"></td>
                                              <td class="col-md-3 border-0"></td>
                                              <td class="col-md-3 text-center border-0">
                                                  <p>
                                                      <strong></strong>
                                                  </p>
                                                  <p>
                                                      <strong>${records[0].pay_amount}</strong>
                                                  </p>
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>                                                       
                                  <table class=" table p-3 border">
                                    <thead>
                                        <tr>
                                            <th class="text-center border-0">Date</th>
                                            <th class="text-center border-0"></th>
                                            <th class="text-center border-0">ISSUED BY</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="col-md-4 text-center border-0">${records[0].pay_date}</td>
                                            <td class="col-md-4 text-center border-0"></td>
                                            <td class="col-md-4 text-center border-0">${records[0].emp_firstname} ${records[0].emp_lastname}</td>
                                        </tr>
                                    </tbody>
                                </table>
                              </div>
                              <div class="col-sm-12 mt-3">
                                      <div class="row ">
                                          <div class="col-md-3 ">
                                          </div>
                                          <div class="col-md-9  text-md-end">
                                              <h6 class="mt-0" style="padding-right: 15px; color: #f44336;">${records[0].payment_uniqueId}</h6>
                                          </div>
                                      </div>
                                  </div>
                      </div>
                  </div>
              </div>
              `;
        }
      } catch (error) {
        // Handle any errors here
        html = `<h4 class="text-center ">${error}</h4>`;
      }

      modalContent.innerHTML = html;
      modal.style.display = "block";
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
    });
};
// -------------------------------------------------VIEW END ---------------------------------------------------

// ------------------------------------------------- CHANGE METER START --------------------------------------------------
const change = (user_id) => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");

  var myUrl = "http://152.42.243.189/waterworks/gets/get_consumer.php";
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
                      <div class="container-fluid" >
                                <div class="col-md-12">
                                    <div class="row z-depth-3 ">
                                        <div class="col-md-12 rounded-right">
                                            <div class="car-block text-center">
                                                <i class="fas fa-user fa-3x mt-1"></i>
                                                <h5 class="font-weight-bold mt-2">${employee[0].firstname} ${employee[0].middlename} ${employee[0].lastname} </h5>
                                            </div>
                                            <hr class="badge-primary mt-0">
                                            <div class="row">
                                                <div class="col-sm-8">
                                                    <p style="text-decoration: underline; font-size: small;">Address</p>
                                                    <h6 class="text-muted">${employee[0].zone_name}, ${employee[0].barangay_name}, ${employee[0].municipality_name}</h6>
                                                </div>
                                                <div class="col-sm-4">
                                                    <p style="text-decoration: underline; font-size: small;">Phone Number</p>
                                                    <h6 class="text-muted" >${employee[0].phone_no}</h6>
                                                </div>
                                            </div>
                                            <hr class="badge-primary mt-1">
                                            <h4 class="mt-0 text-center" >Change Meter</h4>
                                            <hr class="badge-primary mt-0">
                                            <div class="row mt-0">
                                                <div class="col-sm-12">
                                                    <p class="mt-0 mb-1">Current Meter Number </p>
                                                    <p class="text-muted" >${employee[0].meter_no}</p>
                                                </div>
                                                <div class="col-sm-12 mt-2">
                                                    <label for="new_meter_no">New Meter Number</label>
                                                    <input type="text" class="form-control " id="new_meter_no" style="height: 30px;" placeholder="Enter New Meter Number" >
                                                </div>
                                            </div>
                                            <div class="row mt-4">
                                                <div class="col-sm-6">
                                                  <button type="button" class="btn btn-primary w-100" onclick="submit_change(${employee[0].user_id})">Submit Change</button>
                                                </div>
                                                <div class="col-sm-1 my-1"></div>
                                                <div class="col-sm-5">
                                                  <button type="button" class="btn btn-primary w-100 " data-bs-dismiss="modal" onclick="closeModal()">Close</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
    });
};
const submit_change = (user_id) => {
  const new_meters = document.getElementById("new_meter_no").value;
  if (new_meters === "") {
    alert("Fill in all fields");
    return;
  } else {
    const myUrl = "http://152.42.243.189/waterworks/admin/change_meter.php";
    const formData = new FormData();
    formData.append("consumerId", user_id);
    formData.append("new_meters", new_meters);

    axios({
      url: myUrl,
      method: "post",
      data: formData,
    })
      .then((response) => {
        console.log(response.data);
        if (response.data !== 1) {
          // alert("Record Successfully Saved!");
          // window.location.href = "./consumer_list.html";
          success_update_modal();
        } else {
          // alert("Record NOT Saved!");
          failed_update_modal();
        }
      })
      .catch((error) => {
        // alert(`ERROR OCCUREDS! ${error}`);
        error_modal();
      });
  }
};
// ------------------------------------------------- CHANGE METER END --------------------------------------------------

// ------------------------------------------------- ADD CONNECTED METER START --------------------------------------------------
const add = (user_id) => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");

  var myUrl = "http://152.42.243.189/waterworks/gets/get_consumer.php";
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
                      <div class="container-fluid" >
                                <div class="col-md-12">
                                    <div class="row z-depth-3 ">
                                        <div class="col-md-12 rounded-right">
                                            <div class="car-block text-center">
                                                <i class="fas fa-user fa-3x mt-1"></i>
                                                <h5 class="font-weight-bold mt-2">${employee[0].firstname} ${employee[0].middlename} ${employee[0].lastname} </h5>
                                                <p class="text-muted" >${employee[0].meter_no}</p>
                                            </div>
                                            <hr class="badge-primary mt-0">
                                            <div class="row">
                                                <div class="col-sm-8">
                                                    <p style="text-decoration: underline; font-size: small;">Address</p>
                                                    <h6 class="text-muted">${employee[0].zone_name}, ${employee[0].barangay_name}, ${employee[0].municipality_name}</h6>
                                                </div>
                                                <div class="col-sm-4">
                                                    <p style="text-decoration: underline; font-size: small;">Phone Number</p>
                                                    <h6 class="text-muted" >${employee[0].phone_no}</h6>
                                                </div>
                                            </div>
                                            <hr class="badge-primary mt-1">
                                            <h4 class="mt-0 text-center" >Add Conntected Meter</h4>
                                            <hr class="badge-primary mt-0">
                                            <div class="row mt-0">
                                                <div class="col-sm-12 mt-2">
                                                    <label for="new_meter_no">Add New Conntected Meter</label>
                                                    <input type="text" class="form-control " id="new_meter_no" style="height: 30px;" placeholder="Enter New Meter Number" >
                                                </div>
                                            </div>
                                            <div class="row mt-4">
                                                <div class="col-sm-6">
                                                  <button type="button" class="btn btn-primary w-100" onclick="submit_add(${employee[0].user_id})">Submit Add</button>
                                                </div>
                                                <div class="col-sm-1 my-1"></div>
                                                <div class="col-sm-5">
                                                  <button type="button" class="btn btn-primary w-100 " data-bs-dismiss="modal" onclick="closeModal()">Close</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
    });
};
const submit_add = (user_id) => {
  const new_meters = document.getElementById("new_meter_no").value;
  if (new_meters === "") {
    alert("Fill in all fields");
    return;
  } else {
    const myUrl = "http://152.42.243.189/waterworks/admin/add_related.php";
    const formData = new FormData();
    formData.append("consumerId", user_id);
    formData.append("new_meters", new_meters);
    formData.append("employee_Id", sessionStorage.getItem("accountId"));

    axios({
      url: myUrl,
      method: "post",
      data: formData,
    })
      .then((response) => {
        console.log(response.data);
        if (response.data.status === 1) {
          success_update_modal();
          displayConsumer();
          // window.location.href = "./addconsumer.html";
        } else if (response.data.status === 0) {
          // alert("Username or phone number already exists!");
          console.log(response);
          failed_update_modal();
        } else {
          // alert("Unknown error occurred.");
          error_modal();
          console.log(response);
        }
      })
      .catch((error) => {
        // alert(`ERROR OCCUREDS! ${error}`);
        error_modal();
        console.log(error);
      });
  }
};
// ------------------------------------------------- ADD CONNECTED METER END --------------------------------------------------

// ------------------------------------------------- VIEW CONNECTED METER START --------------------------------------------------
const more = (user_id) => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");

  var myUrl = "http://152.42.243.189/waterworks/admin/get_consumer_branch.php";
  const formData = new FormData();
  formData.append("accId", user_id);

  axios({
    url: myUrl,
    method: "post",
    data: formData,
  })
    .then((response) => {
      try {
        if (response.data.length === 0) {
          // Display a message indicating there are no billing transactions yet.
          var html = `<h6>No Records</h6>`;
        } else {
          var records = response.data;
          console.log(records);
          // Add a single "Connected Meter" heading
          html = `<h4 class="mb-3" style="text-align:center;">Connected Meter</h4>`;

          html += `
                  <table id="example" class="table table-striped table-bordered" style="width:100%">
                      <thead>
                          <tr>
                              <th scope="col">Full Name</th>
                              <th scope="col">Phone No</th>
                              <th scope="col">Meter No</th>
                              <th scope="col">Action</th>
                          </tr>
                      </thead>
                      <tbody>
              `;

          records.forEach((record) => {
            html += `
                      <tr>
                          <td>${record.firstname} ${record.lastname} #${record.connected_number}</td>
                          <td>${record.phone_no}</td>
                          <td>${record.meter_no}</td>
                          <td>
                              <button class="butts" style="background-color: #0275d8; border: none; padding: 5px; border-radius: 12%; color:white;" onclick="connected_edit(${record.user_id})">Edit</button>
                          </td>
                      </tr>
                  `;
          });

          html += `</tbody></table><br/><br/>`;
        }
      } catch (error) {
        // Handle any errors here
        console.log(error);
        html = `<h4 class="mb-3" style="text-align:center;">No Other Connected Meter</h4>`;

        html += `
                  <table id="example" class="table table-striped table-bordered" style="width:100%">
                      <thead>
                          <tr>
                              <th scope="col">Full Name</th>
                              <th scope="col">Phone No</th>
                              <th scope="col">Meter No</th>
                              <th scope="col">Branch</th>
                              <th scope="col">Action</th>
                          </tr>
                      </thead>
                      <tbody>
                      <tr>
                          <td>NO RECORD</td>
                          <td>NO RECORD</td>
                          <td>NO RECORD</td>
                          <td>NO RECORD</td>
                          <td>
                          </td>
                      </tr>
              `;
        html += `</tbody></table><br/><br/>`;
      }

      modalContent.innerHTML = html;
      modal.style.display = "block";
      $('#example').DataTable({
        "ordering": false // Disable sorting for all columns
      });
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
    });
};

// ------------------------------------------------- VIEW CONNECTED METER END --------------------------------------------------

//--------------------------------------------------EDIT CONNECTED METER START ------------------------------------------------

const connected_edit = (user_id) => {
  const head = document.getElementById("head");
  const paginationNumbers = document.getElementById("paginationNumbers");
  const branchSelect = document.getElementById("branch");
  const searchInput = document.getElementById("searchInput");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const myModal = document.getElementById("myModal");
  myModal.style.display = "none";
  head.style.display = "none";
  paginationNumbers.style.display = "none";
  branchSelect.style.display = "none";
  searchInput.style.display = "none";
  prevBtn.style.display = "none";
  nextBtn.style.display = "none";

  var myUrl = "http://152.42.243.189/waterworks/admin/get_connected_consumers.php";
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
          var consumer = response.data;
          console.log("Consumer : ", consumer[0].user_id);

          var html = `
                  <div class=" row  mt-1">
                    <div class="col-md-1 mt-3">
                      <button class="clear" onclick="displayConsumer()">Back</button>
                    </div>
                    <div class="col-md-11 mt-3">
                      <h4 style="text-align: center;">Edit Connected Consumer</h4>
                    </div>
                  </div>
                  <div class="container-fluid mt-3">
                      <form class="row g-3">
                          <label class="form-label mt-2 mb-0 underline-label">Personal Information</label>
                          <div class="col-md-4 mt-3">
                              <label class="form-label">First Name</label>
                              <input type="text" class="form-control" id="firstname" value="${consumer[0].firstname}" required>
                          </div>
                          <div class="col-md-4 mt-3">
                              <label class="form-label">Middle Name</label>
                              <input type="text" class="form-control" id="middlename" value="${consumer[0].middlename}" required>
                          </div>
                          <div class="col-md-4 mt-3">
                              <label class="form-label">Last Name</label>
                              <input type="text" class="form-control" id="lastname" value="${consumer[0].lastname}" required>
                          </div>
                          <div class="col-md-4 mt-3">
                              <label class="form-label">Phone</label>
                              <input type="text" class="form-control" id="phone" value="${consumer[0].phone_no}" required>
                          </div>
                          <div class="col-md-4 mt-3">
                              <label class="form-label">Email</label>
                              <input type="email" class="form-control" id="email_add" value="${consumer[0].email}" required>
                          </div>
                          <label class="form-label mt-3 mb-0 underline-label">Address</label>
                          <div class="col-md-4 mt-3">
                              <label class="form-label">Municipality</label>
                              <select id="municipality" class="form-select" onchange="getBarangay()">
                                <option value="${consumer[0].municipality_id}" selected>${consumer[0].municipality_name}</option>
                              </select>
                          </div>
                          <div class="col-md-4 mt-3">
                              <label class="form-label">Barangay</label>
                              <select id="barangay" class="form-select" onchange="getZone()">
                              <option value="${consumer[0].barangay_id}" selected>${consumer[0].barangay_name}</option>
                              </select>
                          </div>
                          <div class="col-md-4 mt-3">
                              <label class="form-label">Zone</label>
                              <select id="zoneId" class="form-select" >
                                <option value="${consumer[0].zone_id}" selected>${consumer[0].zone_name}</option>
                              </select>
                          </div>
                          <label class="form-label mt-3 mb-0 underline-label mt-4">Register Account</label>
                          <div class="col-md-3 mt-3">
                              <label class="form-label">Branch</label>
                              <select id="edit_branch" class="form-select">
                                <option value="${consumer[0].branch_id}" selected>${consumer[0].branch_name}</option>
                              </select>
                          </div>
                          <div class="col-md-3 mt-3">
                              <label class="form-label">Property Type</label>
                              <select id="properties" class="form-select">
                                <option value="${consumer[0].property_id}" selected>${consumer[0].property_name}</option>
                              </select>
                          </div> 
                          <div class="col-md-6 mt-3">
                              <label class="form-label">Meter Number</label>
                              <input type="text" class="form-control" id="meter_no" value="${consumer[0].meter_no}" required>
                          </div>                    
                          <div class="col-12 mt-4">
                              <button type="submit" class="btn btn-primary" onclick="submit_connected_update(event, ${consumer[0].user_id})">Submit form</button>
                          </div>
                      </form>
                  </div>
                                    
                  `;

          document.getElementById("mainDiv").innerHTML = html;

          getBranches();
          getProperties();
          getMunicipality();
        }
      } catch (error) {
        var html = `<h2>NO RECORD</h2>`;
      }
    })
    .catch((error) => {
      alert(`ERROR OCCURREDSSSSSSSSSSS! ${error}`);
    });
};
const submit_connected_update = (event, user_id) => {
  event.preventDefault();
  const firstname = document.getElementById("firstname").value;
  const middlename = document.getElementById("middlename").value;
  const lastname = document.getElementById("lastname").value;

  const phone = document.getElementById("phone").value;
  const email_add = document.getElementById("email_add").value;
  const propertyId = document.getElementById("properties").value;

  const municipalityId1 = document.getElementById("municipality").value;
  const barangayId1 = document.getElementById("barangay").value;
  const zone_Id = document.getElementById("zoneId").value;

  const branchId = document.getElementById("edit_branch").value;
  const meter_no = document.getElementById("meter_no").value;

  if (
    firstname === "" ||
    middlename === "" ||
    lastname === "" ||
    phone === "" ||
    email_add === "" ||
    propertyId === "" ||
    municipalityId1 === "" ||
    barangayId1 === "" ||
    zone_Id === "" ||
    branchId === "" ||
    meter_no === ""
  ) {
    alert("Fill in all fields");
    return;
  }

  const myUrl =
    "http://152.42.243.189/waterworks/admin/update_api/update_connected_consumer.php";
  const formData = new FormData();
  formData.append("userid", user_id);
  formData.append("firstname", firstname);
  formData.append("middlename", middlename);
  formData.append("lastname", lastname);
  formData.append("phone", phone);
  formData.append("email_add", email_add);
  formData.append("propertyId", propertyId);
  formData.append("municipalityId", municipalityId1);
  formData.append("barangayId", barangayId1);
  formData.append("zone_Id", zone_Id);
  formData.append("branchId", branchId);
  formData.append("meter_no", meter_no);
  console.log(
    user_id,
    firstname,
    middlename,
    lastname,
    phone,
    email_add,
    municipalityId1,
    barangayId1,
    zone_Id,
    meter_no,
    branchId,
    propertyId
  );

  axios({
    url: myUrl,
    method: "post",
    data: formData,
  })
    .then((response) => {
      console.log(response);
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

// -------------------------------------------------EDIT CONNECTED METER END ---------------------------------------------------

const getBranches = () => {
  const branchSelect = document.getElementById("edit_branch");
  var myUrl = "http://152.42.243.189/waterworks/admin/get_branch.php";
  const formData = new FormData();
  formData.append("branchId", sessionStorage.getItem("branchId"));

  axios({
    url: myUrl,
    method: "post",
    data: formData,
  })
    .then((response) => {
      var branches = response.data;
      console.log("success fetch branch");

      var options = ``;
      branches.forEach((branch) => {
        options += `<option value="${branch.branch_id}">${branch.branch_name}</option>`;
      });
      branchSelect.innerHTML = options;
    })
    .catch((error) => {
      alert(`ERROR OCCURREDsss! ${error}`);
    });
};

const getProperties = () => {
  const propertySelect = document.getElementById("properties");
  var myUrl = "http://152.42.243.189/waterworks/gets/get_property.php";

  axios({
    url: myUrl,
    method: "post",
  })
    .then((response) => {
      var properties = response.data;

      var options = ``;
      properties.forEach((property) => {
        options += `<option value="${property.property_id}">${property.property_name}</option>`;
      });
      propertySelect.innerHTML = options;
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
    });
};
const success_modals = () => {
  const modal = document.getElementById("myModals");
  const modalContent = document.getElementById("modalContents");
  var html = `
      <h5 class="modal-title" style="color: limegreen; text-align:center;">Success!</h5>
  `;
  modalContent.innerHTML = html;
  modal.style.display = "block";
};

const failed_modals = () => {
  const modal = document.getElementById("myModals");
  const modalContent = document.getElementById("modalContents");
  var html = `
  <h5 class="modal-title" style="color: red; text-align:center;">Failed!</h5>
  `;
  modalContent.innerHTML = html;
  modal.style.display = "block";
};

const error_modals = () => {
  const modal = document.getElementById("myModals");
  const modalContent = document.getElementById("modalContents");
  var html = `
      <h5 class="modal-title" style="color: red; text-align:center;">An unknown error occurred!</h5>
  `;
  modalContent.innerHTML = html;
  modal.style.display = "block";
};