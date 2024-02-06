let currentPage = 1;
let consumers = [];
let isEditMode = false;

const onLoad = () => {
  document.getElementById("ngalan").innerText = sessionStorage.getItem("fullname");
    displayConsumer();
    getFileterZones();
  };

  const showNextPage = () => {
    currentPage++;
    showConsumerPage(currentPage);
};

const showPreviousPage = () => {
    if (currentPage > 1) {
        currentPage--;
        showConsumerPage(currentPage);
    } else {
        alert("You are on the first page.");
    }
};
  
  const displayConsumer = () => {
    const head = document.getElementById("head");
    const paginationNumbers = document.getElementById("paginationNumbers");
    const branchSelect = document.getElementById("filterZone");
    const searchInput = document.getElementById("searchInput");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    head.style.display = "block";
    paginationNumbers.style.display = "block";
    branchSelect.style.display = "block";
    searchInput.style.display = "block";
    prevBtn.style.display = "block";
    nextBtn.style.display = "block";

      var url = "http://localhost/waterworks/head/get_consumers.php";
      const formData = new FormData();
      formData.append("accountId", sessionStorage.getItem("accountId"));
      formData.append("branchId", sessionStorage.getItem("branchId"));
      axios({
          url: url,
          method: "post",
          data: formData
      }).then(response => {
        console.log(response.data)
          consumers = response.data;
          if (!Array.isArray(consumers) || consumers.length === 0) {
            errorTable();
          } else {
            sortConsumersByName();
            showConsumerPage(currentPage);
          }
      }).catch(error => {
          alert("ERROR! - " + error);
      });
  };
  
  const sortConsumersByName = () => {
      consumers.sort((a, b) => {
          const nameA = (a.firstname + ' ' + a.lastname).toUpperCase();
          const nameB = (b.firstname + ' ' + b.lastname).toUpperCase();
          return nameA.localeCompare(nameB);
      });
  };
  const filterConsumer = () => {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const filteredConsumers = consumers.filter((consumer) => {
        const fullName = (consumer.firstname + ' ' + consumer.lastname + ' ' + consumer.meter_no).toLowerCase();
        return fullName.includes(searchInput);
    });
    showFilteredConsumers(filteredConsumers);
};

const showFilteredConsumers = (filteredConsumers) => {
    currentPage = 1;
    showConsumerPage(currentPage, filteredConsumers);
};
  
  const showConsumerPage = (page, consumersToDisplay = consumers) => {
      var start = (page - 1) * 10;
      var end = start + 10;
      var displayedConsumers = consumersToDisplay.slice(start, end);
      refreshTables(displayedConsumers);
      showPaginationNumbers(page, Math.ceil(consumersToDisplay.length / 10));
  };

    const errorTable = () =>{
        var html = `
        <table class="table">
          <thead>
            <tr>
                <th scope="col">Full Name</th>
                <th scope="col">Phone No</th>
                <th scope="col">Meter No</th>
                <th scope="col">Branch</th>
                <th scope="col">Action</th>
            </tr>
          </thead>
          </table>`;
    
          document.getElementById("mainDiv").innerHTML = html;
      }
      const refreshTables = (consumerList) => {
        var html = `
        <table class="table">
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
        consumerList.forEach(consumer => {
            html += `
            <tr>
              <td>${consumer.firstname} ${consumer.lastname}</td>
              <td>${consumer.meter_no}</td>
              <td>${consumer.branch_name}</td>
              <td>
              <button class="clear" onclick="view_consumer(${consumer.user_id})">View</button>
              </td>
            </tr>
            `;
        });
        html += `</tbody></table>`;
        document.getElementById("mainDiv").innerHTML = html;
    };

      
// ---------------------------------------------FOR view billing histry of consumer --------------------------
const view_consumer  = (user_id) => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");


  var myUrl = "http://localhost/waterworks/clerk/consumer_billing_history.php";
  const formData = new FormData();
  formData.append("accId", user_id);
  console.log("Consumer ID : ", user_id);

  axios({
      url: myUrl,
      method: "post",
      data: formData,
  }).then((response) => {

      try {
        
          if (response.data.length === 0) {
              // Display a message indicating there are no billing transactions yet.
              var html = `<h2>No Records</h2>`;
          } else {
              var records = response.data;
              // Add a single "Connected Meter" heading
              html = `
              <div class="car-block text-center">
                <i class="fas fa-user fa-3x mt-1"></i>
                <h5 class="font-weight-bold mt-2">${records[0].con_firstname} ${records[0].con_middlename} ${records[0].con_lastname} </h5>
                <p >${records[0].meter_no}</p>
              </div>
              `;
              
              html += 
                `
                <table class="tab table">
                <thead>
                    <tr>
                        <th scope="col">Reading Date</th>
                        <th scope="col">Cubic Consumed</th>
                        <th scope="col">Bill Amount</th>
                        <th scope="col">Arrears</th>
                        <th scope="col">Total Bill</th>
                        <th scope="col">Reader Name</th>
                    </tr>
                </thead>
                <tbody>
                `;
                
                records.forEach((record) => {
                    html += 
                    `
                        <tr>
                            <td>${record.reading_date}</td>
                            <td>${record.cubic_consumed}</td>
                            <td>${record.bill_amount}</td>
                            <td>${record.arrears}</td>
                            <td>${record.total_bill}</td>
                            <td>${record.emp_firstname} ${record.emp_lastname}</td>
                        </tr>
                    `;
                });
              

              html += `</tbody></table><br/><br/>`;
          }
      } catch (error) {
          // Handle any errors here
          html = `<h2>No Other Connected Meter</h2>`;
          html = `
          <div class="car-block text-center">
            <i class="fas fa-user fa-3x mt-1"></i>
            <h5 class="font-weight-bold mt-2"></h5>
            <p </p>
          </div>
          `;
              
          html += 
          `
          <table class="tab table">
          <thead>
                    <tr>
                        <th scope="col">Reading Date</th>
                        <th scope="col">Cubic Consumed</th>
                        <th scope="col">Bill Amount</th>
                        <th scope="col">Arrears</th>
                        <th scope="col">Total Bill</th>
                        <th scope="col">Reader Name</th>
                    </tr>
                </thead>
          <tbody>
          <tr>
              <td>NO RECORDS</td>
              <td>NO RECORDS</td>
              <td>NO RECORDS</td>
              <td>NO RECORDS</td>
              <td>NO RECORDS</td>
              <td>NO RECORDS</td>
          </tr>
          `;
          html += `</tbody></table><br/><br/>`;
      }

      modalContent.innerHTML = html;
      modal.style.display = "block";
  }).catch((error) => {
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

  var myUrl = "http://localhost/waterworks/head/getconsumer.php";
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
              var consumer = response.data;
              console.log("Consumer : ",consumer[0].user_id);
              
                var html = `
                  <div class=" row  mt-1">
                    <div class="col-md-1 mt-3">
                      <button class="clear" onclick="displayConsumer()">Back</button>
                    </div>
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
                              <button type="submit" class="btn btn-primary" onclick="submit_edit_consumer(event, ${consumer[0].user_id})">Submit form</button>
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

    }).catch((error) => {
      alert(`ERROR OCCURREDSSSSSSSSSSS! ${error}`);
  });
}
const submit_edit_consumer = (event, user_id) => {
      event.preventDefault();
        const firstname = document.getElementById("firstname").value;
        const middlename = document.getElementById("middlename").value;
        const lastname = document.getElementById("lastname").value;

        const phone = document.getElementById("phone").value;
        const email_add = document.getElementById("email_add").value;
        const propertyId = document.getElementById("properties").value;

        const municipalityId = document.getElementById("municipality").value;
        const barangayId = document.getElementById("barangay").value;
        const zoneId = document.getElementById("zoneId").value;

        const branchId = document.getElementById("edit_branch").value;
        const meter_no = document.getElementById("meter_no").value;
    
      if (
        firstname === '' ||
        middlename === '' ||
        lastname === '' ||
        phone === '' ||
        email_add === '' ||
        propertyId === '' ||
        municipalityId === '' ||
        barangayId === '' ||
        zoneId === '' ||
        branchId === '' ||
        meter_no === '' 
      ) {
        alert('Fill in all fields');
        return;
      }
    
      const myUrl = "http://localhost/waterworks/head/update_api/update_consumer.php";
      const formData = new FormData();
      formData.append("userid", user_id);
      formData.append("firstname", firstname);
      formData.append("middlename", middlename);
      formData.append("lastname", lastname);
      formData.append("phone", phone);
      formData.append("email_add", email_add);
      formData.append("propertyId", propertyId);
      formData.append("municipalityId", municipalityId);
      formData.append("barangayId", barangayId);
      formData.append("zoneId", zoneId);
      formData.append("branchId", branchId);
      formData.append("meter_no", meter_no);
      console.log(user_id, 
        firstname, 
        middlename, 
        lastname, 
        phone, 
        email_add, 
        municipalityId, 
        barangayId, 
        zoneId, 
        meter_no, 
        branchId, 
        propertyId);
      
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
  const getProperties = () => {
    const propertySelect = document.getElementById("properties");
    var myUrl = "http://localhost/waterworks/gets/get_property.php";
  
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

  const getBranches = () => {
    const branchSelect = document.getElementById("edit_branch");
    var myUrl = "http://localhost/waterworks/head/get_branch.php";
    const formData = new FormData();
    formData.append("branchId", sessionStorage.getItem("branchId"));

    axios({
      url: myUrl,
      method: "post",
      data: formData
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
  

    const getMunicipality = () => {
      const municipalitySelect = document.getElementById("municipality");
      var myUrl = "http://localhost/waterworks/gets/get_municipality.php";
      
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
          alert(`ERROR OCCURRED! ${error}`);
        });
      };
      
      const getBarangay = () => {
      const selectedMunicipalityId = document.getElementById("municipality").value;
      
      const barangayUrl = `http://localhost/waterworks/gets/get_barangay.php`;
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
          barangaySelect.innerHTML = ``;
      
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
      
      
      const getZone = () => {
        const selectedBarangayId = document.getElementById("barangay").value;
      
        const zoneUrl = `http://localhost/waterworks/gets/get_zone.php`;
        const formData = new FormData();
      
        // Use selectedMunicipalityId directly
        formData.append("barangayId", selectedBarangayId);
        axios({
          url: zoneUrl,
          method: "post",
          data: formData
        }).then((response) => {
          const zoneSelect = document.getElementById("zoneId");
          const zones = response.data;
      
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
          alert(`ERROR OCCURRED while fetching zones! ${error}`);
      });
      
      };

      const getFileterZones = () => {
        const positionSelect = document.getElementById("filterZone");
        const barangayName = sessionStorage.getItem("branchId");
        const myUrl = "http://localhost/waterworks/clerk/get_zones_filter.php";
        const formData = new FormData();
        formData.append("barangayId", barangayName);
      
        axios({
          url: myUrl,
          method: "post",
          data: formData
        })
          .then((response) => {
            const positions = response.data;
      
            let options = `<option value="all">Select Zone</option>`;
            positions.forEach((position) => {
              options += `<option value="${position.zone_name}">${position.barangay_name}, ${position.zone_name}</option>`;
            });
            positionSelect.innerHTML = options;
      
            // Event listener for position change
            positionSelect.addEventListener("change", () => {
              selectedZone = positionSelect.value.toLowerCase(); // Assign value to selectedZone
              // Call the appropriate display function based on the selected position
              if (selectedZone === "all") {
                displayConsumer();
              } else {
                displayConsumerByZone();
              }
              // Add more conditions as needed for other positions
            });
          })
          .catch((error) => {
            alert(`ERROR OCCURRED! ${error}`);
          });
      };
      
      const displayConsumerByZone = () => {
        const url = "http://localhost/waterworks/clerk/get_consumers_filter.php";
        const formData = new FormData();
        formData.append("branchId", sessionStorage.getItem("branchId"));
        formData.append("accountId", sessionStorage.getItem("accountId"));
        formData.append("zoneName", selectedZone);
        axios({
          url: url,
          method: "post",
          data: formData
        }).then(response => {
          console.log(response.data);
          consumers = response.data;
          sortConsumersByNameByZone();
          showConsumerPageByZone(currentPage);
        }).catch(error => {
          alert("ERROR! - " + error);
        });
      };
      
      
      const sortConsumersByNameByZone = () => {
        consumers.sort((a, b) => {
            const nameA = (a.firstname + ' ' + a.lastname).toUpperCase();
            const nameB = (b.firstname + ' ' + b.lastname).toUpperCase();
            return nameA.localeCompare(nameB);
        });
      };
      
      const showConsumerPageByZone = (page, consumersToDisplay = consumers) => {
        var start = (page - 1) * 10;
        var end = start + 10;
        var displayedConsumers = consumersToDisplay.slice(start, end);
        refreshTablesByZone(displayedConsumers);
        showPaginationNumbers(page, Math.ceil(consumersToDisplay.length / 10));
      };
      const refreshTablesByZone = (employeeList) => {
          var html = `
          <table class="table">
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
          employeeList.forEach(consumer => {
              html += `
              <tr>
                <td>${consumer.firstname} ${consumer.lastname}</td>
                <td>${consumer.meter_no}</td>
                <td>${consumer.branch_name}</td>
                <td>
                  <button class="clear" onclick="view_consumer(${consumer.user_id})">View</button>
                </td>
              </tr>
              `;
          });
          html += `</tbody></table>`;
          document.getElementById("mainDiv").innerHTML = html;
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
        const branchSelect = document.getElementById("filterZone");
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