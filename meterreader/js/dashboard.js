let currentPage = 1;
let consumers = [];

const onLoad = () => {
  var accountId = sessionStorage.getItem("accountId");
  if (!accountId || accountId === "0") {
      window.location.href = "/waterworks/";
  } else {
    document.getElementById("ngalan").innerText =
    sessionStorage.getItem("fullname");
    displayConsumer();
    getFilterZones();

    const modal = document.getElementById("myModal");
    const modalContent = document.querySelector(".modal-content");
    modalContent.addEventListener("click", (event) => {
      if (event.target === modalContent) {
        closeModal();
      }
    });
  }
  
};

const displayConsumer = () => {
  const close_butt = document.getElementById("close_butt");
  close_butt.style.display = "flex";
  var url = "http://152.42.243.189/waterworks/meterreader/get_consumers.php";
  const formData = new FormData();
  formData.append("branchId", sessionStorage.getItem("branchId"));
  formData.append("readerId", sessionStorage.getItem("accountId"));
  axios({
    url: url,
    method: "post",
    data: formData,
  })
    .then((response) => {
      console.log(response.data);
      consumers = response.data;

      // sortConsumersByName();
      refreshTables(consumers);
    })
    .catch((error) => {
      //   alert("ERRORSSS! - " + error);
      errorTables();
    });
};
const errorTables = () => {
  var html = ` 
      <div style="display: flex; justify-content: center; align-items: center; height: 62vh;">
        <h5>No work on on this day!</h5>
      </div>
    `;
  document.getElementById("mainDiv").innerHTML = html;
};

const refreshTables = (consumers) => {
  var html = `
    <div class="row">
      `;
  consumers.forEach((consumer) => {
    html += `
        <div class="col-12 col-md-6 mb-2"> 
          <div class="card p-2" style="max-width: 325px; margin: auto; background-color: #167c88; color:white;"> <!-- Reduced padding -->
            <div class="card-body d-flex justify-content-between align-items-center" style="padding: 0.5rem;">
              <div>
                <h6 class="card-text mb-1"> 
                  ${consumer.firstname} ${consumer.lastname} ${ consumer.connected_number !== 0 ? "#" + consumer.connected_number : "" }
                </h6>
                <p class="card-text mb-0"> <!-- Removed margin-bottom -->
                  Meter No: ${consumer.meter_no}
                </p>
              </div>
              <button class="btn btn-md btn-primary" onclick="view(${consumer.user_id})">Bill</button> 
            </div>
          </div>
        </div>
        `;
  });
  html += `</div>`;
  document.getElementById("mainDiv").innerHTML = html;
};



const view = (user_id) => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");

  var myUrl = "http://152.42.243.189/waterworks/meterreader/get_consumer.php";
  const formData = new FormData();
  formData.append("accId", user_id);

  axios({
    url: myUrl,
    method: "post",
    data: formData,
  })
    .then((response) => {
      var employee = response.data;
      console.log("PropertyId :", employee[0].propertyId);

      const close_butt = document.getElementById("close_butt");
      if (close_butt) {
        close_butt.style.display = "none";
      }

      var html = `
                  <div class="container-fluid" >
                            <div class="col-md-12">
                                <div class="row z-depth-3 ">
                                    <div class="col-md-12 rounded-right">
                                        <div class="car-block text-center">
                                            <i class="fas fa-user fa-3x mt-1"></i>
                                            <h5 class="font-weight-bold mt-2">${employee[0].firstname} ${employee[0].lastname} ${ employee[0].connected_number !== 0 ? "#" + employee[0].connected_number : ""  }</h5>
                                            <p >${employee[0].meter_no}</p>
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
                                        <h4 class="mt-0 text-center" >Bill</h4>
                                        <hr class="badge-primary mt-0">
                                        <div class="row mt-0">
                                            <div class="col-sm-12">
                                                <p style="font-size: medium;">Previous Reading :  ${employee[0].total_cubic_consumed}</p>
                                            </div>
                                            <div class="col-sm-12">
                                                <label style="font-size: medium;" for="cubic_consumed">Present Reading</label>
                                                <input type="number" class="form-control " id="cubic_consumed" style="height: 30px;" placeholder="Present Reading" >
                                            </div>
                                        </div>
                                        <div class="row mt-4">
                                            <div class="col-sm-5">
                                              <button type="button" class="btn btn-primary w-100" onclick="submit(${employee[0].user_id},${employee[0].propertyId})">Submit Bill</button>
                                            </div>
                                            <div class="col-sm-2 my-1"></div>
                                            <div class="col-sm-5">
                                              <button type="button" class="btn btn-primary w-100 " data-bs-dismiss="modal" onclick="closeModal()">Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>
                  `;

      modalContent.innerHTML = html;
      modal.style.display = "block";
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
    });
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
  showConsumerPage(currentPage);
};

const filterConsumers = () => {
  try {
    const searchInput = document
      .getElementById("searchInput")
      .value.toLowerCase();

    // Check if consumers array is empty
    if (consumers.length === 0) {
      return; // Exit the function if there are no consumers
    }

    const filteredConsumers = consumers.filter((consumer) => {
      const fullName = (
        consumer.firstname +
        " " +
        consumer.lastname +
        " " +
        consumer.meter_no
      ).toLowerCase();
      return fullName.includes(searchInput);
    });
    showFilteredConsumers(filteredConsumers);
  } catch (error) {
    // console.error("Error filtering consumers:", error);
    errorTables();
  }
};

const showFilteredConsumers = (filteredConsumers) => {
  currentPage = 1;
  showConsumerPage(currentPage, filteredConsumers);
};

const submit = (user_id, propertyId) => {
  const cubic_consumed = document.getElementById("cubic_consumed").value;

  if (cubic_consumed === "") {
    alert("Fill in all fields");
    return;
  } else if (cubic_consumed <= 0) {
    alert("Please fill in the fields correctly");
    return;
  } else {
    const myUrl = "http://152.42.243.189/waterworks/meterreader/billing.php";
    const formData = new FormData();
    formData.append("consumerId", user_id);
    formData.append("propertyId", propertyId);
    formData.append("cubic_consumed", cubic_consumed);
    formData.append("branchId", sessionStorage.getItem("branchId"));
    formData.append("readerId", sessionStorage.getItem("accountId"));
    console.log('consumerId:', user_id);
    console.log('propertyId Id:', propertyId);
    console.log('branchId:', sessionStorage.getItem("branchId"));
    console.log('readerId Id:', sessionStorage.getItem("accountId"));

    axios({
      url: myUrl,
      method: "post",
      data: formData,
    })
      .then((response) => {
        if (
          response.data.errorCode !== undefined &&
          response.data.errorCode !== 0
        ) {
          console.log(response.data);
          // Trigger failed_update_modal() based on the error code
          failed_update_modal(response.data.errorCode);
        } else {
          console.log(response.data);
          displayConsumer();
          bill_receipt(user_id);
        }
      })
      .catch((error) => {
        error_modal();
      });
  }
};

const getFilterZones = () => {
  const positionSelect = document.getElementById("filterZones");
  const myUrl = "http://152.42.243.189/waterworks/meterreader/get_zones_filter.php";
  const formData = new FormData();
  formData.append("branchId", sessionStorage.getItem("branchId"));
  formData.append("readerId", sessionStorage.getItem("accountId"));

  axios({
      url: myUrl,
      method: "post",
      data: formData,
  })
  .then((response) => {
      const positions = response.data;
      console.log(positions); // Debugging output

      if (positions && positions.length > 0) {
          let options = `<option value="all">Select Zone</option>`;
          positions.forEach((position) => {
              options += `<option value="${position.zone_name}">${position.barangay_name}, ${position.zone_name}</option>`;
          });
          positionSelect.innerHTML = options;

          // Event listener for position change
          positionSelect.addEventListener("change", () => {
              const selectedZone = positionSelect.value.toLowerCase();
              if (selectedZone === "all") {
                  displayConsumer();
              } else {
                  displayConsumerByZone(selectedZone);
              }
          });
      } else {
          positionSelect.innerHTML = '<option value="all">No Zones Available</option>';
      }
  })
  .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
      console.log(error);
  });
};

const displayConsumerByZone = () => {
  const url =
    "http://152.42.243.189/waterworks/meterreader/get_consumers_filter.php";

  const formData = new FormData();
  formData.append("branchId", sessionStorage.getItem("branchId"));
  formData.append("accountId", sessionStorage.getItem("accountId"));
  formData.append("zoneName", selectedZone);
  axios({
    url: url,
    method: "post",
    data: formData,
  })
    .then((response) => {
      console.log(response.data);
      consumers = response.data;
      //   sortConsumersByNameByZone();
      showConsumerPageByZone(currentPage);
    })
    .catch((error) => {
      errorTables();
      //   alert("ERROR! - " + error);
    });
};

//   const sortConsumersByNameByZone = () => {
//     consumers.sort((a, b) => {
//         const nameA = (a.firstname + ' ' + a.lastname).toUpperCase();
//         const nameB = (b.firstname + ' ' + b.lastname).toUpperCase();
//         return nameA.localeCompare(nameB);
//     });
//   };

const showConsumerPageByZone = (page, consumersToDisplay = consumers) => {
  var start = (page - 1) * 10;
  var end = start + 10;
  var displayedConsumers = consumersToDisplay.slice(start, end);
  refreshTablesByZone(displayedConsumers);
  showPaginationNumbers(page, Math.ceil(consumersToDisplay.length / 10));
};
const refreshTablesByZone = (employeeList) => {
  var html = `
    <table class="billtab table mb-0 mt-0">
    <thead>
        <tr>
        <th>Full Name</th>
        <th>Meter No</th>
        <th>Action</th>
        </tr>
    </thead>
    <tbody>
    `;
  employeeList.forEach((employee) => {
    html += `
        <tr>
            <td>${employee.firstname} ${employee.lastname}</td>
            <td>${employee.meter_no}</td>
            <td>
            <button class="butts" onclick="view(${employee.user_id})">Bill</button>
            </td>
        </tr>
        `;
  });
  html += `</tbody></table>`;
  document.getElementById("mainDiv").innerHTML = html;
};

const success_update_modal = () => {
  const close_butt = document.getElementById("close_butt");
  close_butt.style.display = "flex";
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");
  var html = `
      <h5 class="modal-title " style="color: limegreen; text-align:center;">Successfully</h5>
  `;
  modalContent.innerHTML = html;
  modal.style.display = "block";
};

const failed_update_modal = () => {
  const close_butt = document.getElementById("close_butt");
  close_butt.style.display = "flex";
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");
  var html = `
  <h5 class="modal-title " style="color: red; text-align:center;">Failed !</h5>
`;
  modalContent.innerHTML = html;
  modal.style.display = "block";
};
const error_modal = () => {
  const close_butt = document.getElementById("close_butt");
  close_butt.style.display = "flex";
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
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const close_butt = document.getElementById("close_butt");
  close_butt.style.display = "flex";
  head.style.display = "block";
  searchInput.style.display = "block";
};

const bill_receipt = (user_id) => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");

  var myUrl =
    "http://152.42.243.189/waterworks/meterreader/consumer_billing_history.php";
  const formData = new FormData();
  formData.append("accId", user_id);
  console.log("Consumer ID : ", user_id);

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
          var records = response.data;
          console.log('responese: ',response.data)
          if (records && records.length > 0) {
          html = `
          <div class="wrapper ms-0 p-0 m-0">
            <div class="container mt-0">
                <div class="row">
                    <!-- Title Section -->
                    <div class="title text-center mb-3 mt-4 d-flex align-items-center justify-content-center">
                        <!-- Left Image -->
                        <div class="left-image">
                            <img src="http://152.42.243.189/waterworks/logo2.png" alt="Left Image" class="img-circle" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">
                        </div>
                        
                        <!-- Center Text -->
                        <div class="mx-3">
                            <h6 class="w-100">Waterworks<br>El Salvador City</h6>
                        </div>
                        
                        <!-- Right Image -->
                        <div class="right-image">
                            <img src="http://152.42.243.189/waterworks/logo.png" alt="Right Image" class="img-circle" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">
                        </div>
                    </div>

                    <hr>
                    <!-- Billing Statement Header -->
                    <div class="col-sm-12">
                        <h6 class="text-center py-1 text-decoration-underline">Billing Statement</h6>
                    </div>

                    <hr>
                    <!-- Billing Details -->
                    <div class="col-sm-12 mt-3">
                        <div class="row justify-content-between">
                            <div class="col-5">
                                <p>FOR THE MONTH:</p>
                            </div>
                            <div class="col-7 text-start" style="padding-left: 1px;">
                                <p>${records[0].formatted_reading_date2}</p>
                            </div>
                        </div>
        
                        <div class="row justify-content-between">
                            <div class="col-5">
                                <p>DATE:</p>
                            </div>
                            <div class="col-7 text-start" style="padding-left: 1px;">
                                <p>${records[0].reading_date}</p>
                            </div>
                        </div>
        
                        <div class="row justify-content-between">
                            <div class="col-5">
                                <p>Period cover:</p>
                            </div>
                            <div class="col-7 text-start" style="padding-left: 1px;">
                                <p>${records[0].period_cover}</p>
                            </div>
                        </div>

                        <hr>
                        <!-- Consumer Name -->
                        <div class="text-center py-1">
                            <h5>${records[0].con_lastname}, ${records[0].con_firstname}</h5>
                        </div>

                        <hr>
        
                        <!-- Meter Readings -->
                        <div class="row justify-content-between">
                            <div class="col-5">
                                <p>PRESENT READING:</p>
                            </div>
                            <div class="col-7 text-start" style="padding-left: 1px;">
                                <p>${records[0].present_meter}</p>
                            </div>
                        </div>
        
                        <div class="row justify-content-between">
                            <div class="col-5">
                                <p>PREVIOUS READING:</p>
                            </div>
                            <div class="col-7 text-start" style="padding-left: 1px;">
                                <p>${records[0].previous_meter}</p>
                            </div>
                        </div>
        
                        <!-- Billing Calculation -->
                        <div class="row justify-content-between">
                            <div class="col-5">
                                <p>Cubic meter:</p>
                            </div>
                            <div class="col-7 text-start" style="padding-left: 1px;">
                                <p>${records[0].cubic_consumed}</p>
                            </div>
                        </div>
        
                        <div class="row justify-content-between">
                            <div class="col-5">
                                <p>WATER BILL:</p>
                            </div>
                            <div class="col-7 text-start" style="padding-left: 1px;">
                                <p>${records[0].bill_amount}</p>
                            </div>
                        </div>
        
                        <div class="row justify-content-between">
                            <div class="col-5">
                                <p>ARREARS:</p>
                            </div>
                            <div class="col-7 text-start" style="padding-left: 1px;">
                                <p>${records[0].arrears}</p>
                            </div>
                        </div>
        
                        <div class="row justify-content-between">
                            <div class="col-5">
                                <p>TOTAL BILL:</p>
                            </div>
                            <div class="col-7 text-start" style="padding-left: 1px;">
                                <p>${records[0].total_bill}</p>
                            </div>
                        </div>
        
                        <div class="row justify-content-between">
                            <div class="col-5">
                                <p>Amount due:</p>
                            </div>
                            <div class="col-7 text-start" style="padding-left: 1px;">
                                <p>${records[0].amount_due}</p>
                            </div>
                        </div>
        
                        <div class="row justify-content-between">
                            <div class="col-5">
                                <p>DUE DATE:</p>
                            </div>
                            <div class="col-7 text-start" style="padding-left: 1px;">
                                <p>${records[0].formatted_reading_date1}</p>
                            </div>
                        </div>
        
                        <!-- Meter Reader Information -->
                        <div class="row justify-content-between">
                            <div class="col-5">
                                <p>METER READER:</p>
                            </div>
                            <div class="col-7 text-start" style="padding-left: 1px;">
                                <p>${records[0].emp_lastname}, ${records[0].emp_firstname}</p>
                            </div>
                        </div>
        
                        <div class="row justify-content-between">
                            <div class="col-5">
                                <p>DELIVERED:</p>
                            </div>
                            <div class="col-7 text-start" style="padding-left: 1px;">
                                <p>${records[0].reading_date}</p>
                            </div>
                        </div>
                        <div class="row justify-content-between">
                            <div class="col-5">
                                <p>RECEIPT NO:</p>
                            </div>
                            <div class="col-7 text-start" style="padding-left: 1px;">
                                <p>${records[0].billing_uniqueId}</p>
                            </div>
                        </div>
                        <hr>
        
                        <!-- Print Button -->
                        <div class="row mt-1">
                            <div class="col-sm-12">
                                <button type="button" class="btn btn-primary w-100" onclick="printModalContent()">Print</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
              `;
            } else {
              // Handle case when no records are found
              html = `<h2>No Records Found</h2>`;
            }
        }
        modalContent.innerHTML = html;
      } catch (error) {
        // Handle any errors here
        console.log(error);
      }

      modalContent.innerHTML = html;
      modal.style.display = "block";
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
    });
};

const printModalContent = () => {
  window.print();
};
