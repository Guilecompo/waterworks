let currentPage = 1;
let consumers = [];
let isEditMode = false;

const onLoad = () => {
  var accountId = sessionStorage.getItem("accountId");
  if (!accountId || accountId === "0") {
      window.location.href = "/waterworks/";
  } else {
    document.getElementById("ngalan").innerText = sessionStorage.getItem("fullname");
    displayConsumer();
    getFileterZones();
  }
};

const showNextPage = () => {
  const nextPage = currentPage + 1;
  const start = (nextPage - 1) * 10;
  const end = start + 10;
  const activitiesOnNextPage = consumers.slice(start, end);

  if (activitiesOnNextPage.length > 0) {
      currentPage++;
      showBarangayPage(currentPage);
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
      showBarangayPage(currentPage);
  } else {
      alert("You are on the first page.");
  }
};

const displayConsumer = () => {
    const head = document.getElementById("head");
    // const paginationNumbers = document.getElementById("paginationNumbers");
    const branchSelect = document.getElementById("filterZone");
    // const searchInput = document.getElementById("searchInput");
    head.style.display = "block";
    // paginationNumbers.style.display = "block";
    branchSelect.style.display = "block";
    // searchInput.style.display = "block";

    var url = "http://152.42.243.189/waterworks/clerk/get_consumers.php";
    const formData = new FormData();
    formData.append("accountId", sessionStorage.getItem("accountId"));
    formData.append("branchId", sessionStorage.getItem("branchId"));

    console.log("MY BRANCH ID :    ",sessionStorage.getItem("branchId"));
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
          refreshTables(consumers);
        }
    }).catch(error => {
        alert("ERROR! - " + error);
    });
};

const errorTable = () => {
    var html = `
        <table id="example" class="table table-striped table-bordered" style="width:100%">
          <thead>
            <tr>
                <th class="text-center">Full Name</th>
                <th class="text-center">Phone No</th>
                <th class="text-center">Meter No</th>
                <th class="text-center">Branch</th>
                <th class="text-center">Action</th>
            </tr>
          </thead>
          </table>`;

    document.getElementById("mainDiv").innerHTML = html;
};

const refreshTables = (consumers) => {
    var html = `
        <table id="example" class="table table-striped table-bordered" style="width:100%">
          <thead>
            <tr>
              <th class="text-center">Full Name</th>
              <th class="text-center">Meter No</th>
              <th class="text-center">Branch</th>
              <th class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
        `;
        consumers.forEach(consumer => {
        html += `
            <tr>
              <td class="text-center">${consumer.firstname} ${consumer.lastname} ${ consumer.connected_number !== 0 ? "#" + consumer.connected_number : ""  }</td>
              <td class="text-center">${consumer.meter_no}</td>
              <td class="text-center">${consumer.branch_name}</td>
              <td class="text-center">
              <button class="clear" style="background-color: #0275d8; border: none; padding: 5px; border-radius: 12%; color:white;" onclick="view_consumer(${consumer.user_id})">View</button>
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

const view_consumer = (user_id) => {
    const modal = document.getElementById("myModal");
    const modalContent = document.getElementById("modalContent");
    let html = ""; // Define html variable here

    var myUrl = "http://152.42.243.189/waterworks/clerk/consumer_billing_history.php";
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
                html = `<h2>No Records</h2>`;
            } else {
                const records = response.data;
                const itemsPerPage = 5;
                const totalPages = Math.ceil(records.length / itemsPerPage);

                const renderPage = () => {
                  if (!Array.isArray(records) || records.length === 0) {
                      // Handle case where records is not an array or is empty
                      html = `<h2 class="text-center">No Records</h2>`;
                      html += `<div class="car-block text-center ">
                        <i class="fas fa-user fa-3x mt-1"></i>
                        <h5 class="font-weight-bold mt-2"></h5>
                        <p </p>
                      </div>
                      <table id="example" class="table table-striped table-bordered" style="width:100%">
                        <thead>
                          <tr>
                            <th class="text-center">Reading Date</th>
                            <th class="text-center">Cubic Consumed</th>
                            <th class="text-center">Bill Amount</th>
                            <th class="text-center">Arrears</th>
                            <th class="text-center">Total Bill</th>
                            <th class="text-center">Reader Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td class="text-center">NO RECORDS</td>
                            <td class="text-center">NO RECORDS</td>
                            <td class="text-center">NO RECORDS</td>
                            <td class="text-center">NO RECORDS</td>
                            <td class="text-center">NO RECORDS</td>
                            <td class="text-center">NO RECORDS</td>
                          </tr>
                        </tbody>
                      </table><br/><br/>`;
                  } else {
                      const startIndex = (currentPage - 1) * itemsPerPage;
                      const endIndex = Math.min(startIndex + itemsPerPage, records.length);
                      const currentPageRecords = records.slice(startIndex, endIndex);
              
                      html = `
                          <div class="car-block text-center ">
                            <i class="fas fa-user fa-3x mt-1"></i>
                            <h5 class="font-weight-bold mt-2">${currentPageRecords[0].con_firstname} ${currentPageRecords[0].con_middlename} ${currentPageRecords[0].con_lastname} </h5>
                            <p >${currentPageRecords[0].meter_no}</p>
                          </div>
                          <table id="example" class="table table-striped table-bordered" style="width:100%">
                            <thead>
                              <tr>
                                <th class="text-center">Reading Date</th>
                                <th class="text-center">Cubic Consumed</th>
                                <th class="text-center">Bill Amount</th>
                                <th class="text-center">Arrears</th>
                                <th class="text-center">Total Bill</th>
                                <th class="text-center">Reader Name</th>
                              </tr>
                            </thead>
                            <tbody>
                      `;
              
                      currentPageRecords.forEach((record) => {
                          html += `
                              <tr>
                                <td class="text-center">${record.reading_date}</td>
                                <td class="text-center">${record.cubic_consumed}</td>
                                <td class="text-center">${record.bill_amount}</td>
                                <td class="text-center">${record.arrears}</td>
                                <td class="text-center">${record.total_bill}</td>
                                <td class="text-center">${record.emp_firstname} ${record.emp_lastname}</td>
                              </tr>
                          `;
                      });
              
                      html += `</tbody></table><br/><br/>`;
                  }
              };
              

                renderPage();
            }
        } catch (error) {
            // Handle any errors here
            console.log(error);
            html = `<h2 class="text-center">No Billing History Yet</h2>`;
            html += `
        <div class="car-block text-center ">
          <i class="fas fa-user fa-3x mt-1"></i>
          <h5 class="font-weight-bold mt-2"></h5>
          <p </p>
        </div>
      `;
            html += `
        <table id="example" class="table table-striped table-bordered" style="width:100%">
          <thead>
            <tr>
              <th class="text-center">Reading Date</th>
              <th class="text-center">Cubic Consumed</th>
              <th class="text-center">Bill Amount</th>
              <th class="text-center">Arrears</th>
              <th class="text-center">Total Bill</th>
              <th class="text-center">Reader Name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-center">NO RECORDS</td>
              <td class="text-center">NO RECORDS</td>
              <td class="text-center">NO RECORDS</td>
              <td class="text-center">NO RECORDS</td>
              <td class="text-center">NO RECORDS</td>
              <td class="text-center">NO RECORDS</td>
            </tr>
          </tbody>
        </table><br/><br/>
      `;
        }

        modalContent.innerHTML = html;
        modal.style.display = "block";
        $('#example').DataTable({
          "ordering": false // Disable sorting for all columns
        });
    }).catch((error) => {
        alert(`ERROR OCCURRED! ${error}`);
    });
};


const nextPage = () => {
  const nextPage = currentPage + 1;
  const start = (nextPage - 1) * 10;
  const end = start + 10;
  const activitiesOnNextPage = consumers.slice(start, end);

  if (activitiesOnNextPage.length > 0) {
      currentPage++;
      showBarangayPage(currentPage);
  } else {
      alert("Next page is empty or has no content.");
      // Optionally, you can choose to disable the button here
      // For example, if you have a button element with id "nextButton":
      // document.getElementById("nextButton").disabled = true;
  }
};

const prevPage = () => {
  if (currentPage > 1) {
      currentPage--;
      showBarangayPage(currentPage);
  } else {
      alert("You are on the first page.");
  }
};

const goToPage = (page, user_id) => {
    currentPage = page;
    view_consumer(user_id);
};

// ---------------------------------------------FOR EDIT-----------------------------------------------------
const edit = (user_id) => {
  const head = document.getElementById("head");
  // const paginationNumbers = document.getElementById("paginationNumbers");
  const branchSelect = document.getElementById("branch");
  // const searchInput = document.getElementById("searchInput");
  head.style.display = "none";
  paginationNumbers.style.display = "none";
  // branchSelect.style.display = "none";
  // searchInput.style.display = "none";

  var myUrl = "http://152.42.243.189/waterworks/head/getconsumer.php";
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
    
      const myUrl = "http://152.42.243.189/waterworks/head/update_api/update_consumer.php";
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

  const getBranches = () => {
    const branchSelect = document.getElementById("edit_branch");
    var myUrl = "http://152.42.243.189/waterworks/head/get_branch.php";
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
          alert(`ERROR OCCURRED! ${error}`);
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
      
        const zoneUrl = `http://152.42.243.189/waterworks/gets/get_zone.php`;
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
        const myUrl = "http://152.42.243.189/waterworks/clerk/get_zones_filter.php";
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
        const url = "http://152.42.243.189/waterworks/clerk/get_consumers_filter.php";
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
        showPaginationNumbersByZone(page, Math.ceil(consumersToDisplay.length / 10));
      };
      const showPaginationNumbersByZone = (currentPage, totalPages) => {
        // const paginationNumbersDiv = document.getElementById("paginationNumbers");
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
            paginationNumbersHTML += `<span class="active" onclick="goToPageConsumerByZone(${i})">${i}</span>`;
          } else {
            paginationNumbersHTML += `<span onclick="goToPageConsumerByZone(${i})">${i}</span>`;
          }
        }
      
        // Next button
        paginationNumbersHTML += `<button onclick="showNextPage()">Next</button>`;
      
        paginationNumbersDiv.innerHTML = paginationNumbersHTML;
      };
      
      const goToPageConsumerByZone = (pageNumber) => {
        showConsumerPageByZone(pageNumber);
      };
      const refreshTablesByZone = (employeeList) => {
          var html = `
          <table id="example" class="table table-striped table-bordered" style="width:100%">
            <thead>
              <tr>
                <th class="text-center">Full Name</th>
                <th class="text-center">Meter No</th>
                <th class="text-center">Branch</th>
                <th class="text-center">Action</th>
              </tr>
            </thead>
          <tbody>
          `;
          employeeList.forEach(consumer => {
              html += `
              <tr>
                <td class="text-center">${consumer.firstname} ${consumer.lastname}</td>
                <td class="text-center">${consumer.meter_no}</td>
                <td class="text-center">${consumer.branch_name}</td>
                <td class="text-center">
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
        // const paginationNumbers = document.getElementById("paginationNumbers");
        const branchSelect = document.getElementById("filterZone");
        // const searchInput = document.getElementById("searchInput");
        head.style.display = "block";
        // paginationNumbers.style.display = "block";
        branchSelect.style.display = "block";
        // searchInput.style.display = "block";
      
      };