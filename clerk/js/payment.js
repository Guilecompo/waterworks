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
      showConsumerPage(currentPage);
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
    head.style.display = "block";
    paginationNumbers.style.display = "block";
    branchSelect.style.display = "block";
    searchInput.style.display = "block";

      var url = "http://128.199.232.132/waterworks/clerk/get_consumers.php";
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
      showPaginationNumbersReader(page, Math.ceil(consumersToDisplay.length / 10));
  };
  const showPaginationNumbersReader = (currentPage, totalPages) => {
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
        paginationNumbersHTML += `<span class="active" onclick="goToPageConsumer(${i})">${i}</span>`;
      } else {
        paginationNumbersHTML += `<span onclick="goToPageConsumer(${i})">${i}</span>`;
      }
    }
  
    // Next button
    paginationNumbersHTML += `<button onclick="showNextPage()">Next</button>`;
  
    paginationNumbersDiv.innerHTML = paginationNumbersHTML;
  };
  
  const goToPageConsumer = (pageNumber) => {
    showConsumerPage(pageNumber);
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
                  <td>${consumer.firstname} ${consumer.lastname} ${consumer.connected_number !== 0 ? "#" + consumer.connected_number : ""}</td>
                  <td>${consumer.meter_no}</td>
                  <td>${consumer.branch_name}</td>
                  <td>
                    <button class="clear" onclick="payment(${consumer.user_id})">Pay</button>
                    <button class="clear" onclick="discount(${consumer.user_id}, '${consumer.firstname}', '${consumer.lastname}', ${consumer.connected_number})">Discount</button>
                  </td>
                </tr>
            `;
        });
        html += `</tbody></table>`;
        document.getElementById("mainDiv").innerHTML = html;
    };
    
    const discount = (user_id, firstname, lastname, connected_number) => {
        const modal = document.getElementById("myModal");
        const modalContent = document.getElementById("modalContent");
        const close_butt = document.getElementById("close_butt");
        close_butt.style.display = "none";
    
        var html = `
            <div class="container-fluid">
              <div class="col-md-12">
                <div class="row z-depth-3">
                  <div class="col-md-12 rounded-right">
                    <div class="car-block text-center">
                      <h5 class="modal-title" style="text-align:center;">Are you sure you want to add senior citizen discount to <span style="color: orange; text-align:center;">${firstname} ${lastname} ${connected_number !== 0 ? "#" + connected_number : ""}</span> ?</h5>
                    </div>
                    <div class="row mt-0">
                        <div class="col-sm-12">
                            <label class="form-label mb-0">Discount</label>
                            <select id="consumer" class="form-select mt-0" style="height: 40px;"></select>
                        </div>
                    </div>
                    <div class="row mt-4">
                      <div class="col-sm-5">
                        <button type="button" class="btn btn-primary w-100" onclick="submit_discount(${user_id})">Submit Discount</button>
                      </div>
                      <div class="col-sm-2 my-1"></div>
                      <div class="col-sm-5">
                        <button type="button" class="btn btn-primary w-100" data-bs-dismiss="modal" onclick="closeModal()">Close</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        `;
        modalContent.innerHTML = html;
        modal.style.display = "block";
        getConsumerType();
    };
    const submit_discount = (user_id) => {
      const consumerDiscount = document.getElementById("consumer").value;
      console.log("consumer ID:",  user_id);

      if (consumerDiscount === '') {
        alert('Fill in all fields');
        return;
    } else {
      const myUrl = "http://128.199.232.132/waterworks/clerk/discount.php";
      const formData = new FormData();
      formData.append("consumerId", user_id);
      formData.append("consumerDiscount", consumerDiscount);

      axios({
        url: myUrl,
        method: "post",
        data: formData
    }).then(response => {
      if (response.data.status === 1) {
        success_update_modal();
        console.log("success save");
        displayConsumer();
      }else if (response.data.status === 0) {
        failed_update_modal();
      } else {
        // alert("Unknown error occurred.");
        error_modal();
        console.log(response);
      }
    }).catch(error => {
      // Handle the request failure
      console.error('Request failed:', error);
      error_modal();
     });
    }

    }
    
        const payment = (user_id) => {
          

          const modal = document.getElementById("myModal");
          const modalContent = document.getElementById("modalContent");
          var myUrl = "http://128.199.232.132/waterworks/clerk/get_bill.php";
          const formData = new FormData();
          formData.append("accId", user_id);
        
          axios({
              url: myUrl,
              method: "post",
              data: formData,
          }).then((response) => {
              console.log(response.data);
              
        
              try {
                  if (response.data.length === 0) {
                      // Display a message indicating there are no billing transactions yet.
                      const modal = document.getElementById("myModal");
                      const modalContent = document.getElementById("modalContent");
                      var html = `
                            <h5 class="modal-title " style="color: red; text-align:center;">No Billing Transactions Yet !</h5>
                        `;
                        modalContent.innerHTML = html;
                        modal.style.display = "block";
                  }
        
                  var employee = response.data;
                  console.log("User Id:", employee[0].user_id);
        
                  if (parseInt(employee[0].total_bill) === 0) {
                      const modal = document.getElementById("myModal");
                      const modalContent = document.getElementById("modalContent");
                      var html = `
                            <h5 class="modal-title " style="color: red; text-align:center;">Zero Balance !</h5>
                        `;
                        modalContent.innerHTML = html;
                        modal.style.display = "block";
                  }
                  const close_butt = document.getElementById("close_butt");
                  close_butt.style.display = "none";
                  var html = `
                  <div class="container-fluid" >
                            <div class="col-md-12">
                                <div class="row z-depth-3 ">
                                    <div class="col-md-12 rounded-right">
                                        <div class="car-block text-center">
                                            <h5 class="font-weight-bold mt-2">${employee[0].con_firstname} ${employee[0].con_middlename} ${employee[0].con_lastname} </h5>
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
                                        <hr class="badge-primary mt-4 mb-0">
                                        <h4 class="mt-1 text-center" >Bill Information</h4>
                                        <hr class="badge-primary mt-2">
                                        <div class="row">
                                            <div class="col-sm-9">
                                                <p style="text-decoration: underline; font-size: small;">Meter Reader Name</p>
                                                <h6 class="text-muted">${employee[0].emp_firstname} ${employee[0].emp_middlename} ${employee[0].emp_lastname}</h6>
                                            </div>
                                            <div class="col-sm-3">
                                                <p style="text-decoration: underline; font-size: small;">Reading Date</p>
                                                <h6 class="text-muted ">${employee[0].reading_date}</h6>
                                            </div>
                                        </div>
                                        <div class="row mt-1">
                                            <div class="col-sm-9">
                                                <p style="text-decoration: underline; font-size: small;">Arrears</p>
                                                <h6 class="text-muted">₱ ${employee[0].arrears}</h6>
                                            </div>
                                            <div class="col-sm-3">
                                                <p style="text-decoration: underline; font-size: small;">Balance</p>
                                                <h6 class="text-muted">₱ ${employee[0].total_bill}</h6>
                                            </div>
                                        </div>
                                        <hr class="badge-primary mt-1 mb-0">
                                        <h4 class="mt-0 text-center" >Payment</h4>
                                        <hr class="badge-primary mt-0">
                                        <div class="row mt-0">
                                            <div class="col-sm-12">
                                                <label for="amount">Amount to Pay</label>
                                                <input type="numer" class="form-control " id="amount" style="height: 40px;" placeholder="Enter Amount To Pay" >
                                            </div>
                                        </div>
                                        <div class="row mt-4">
                                            <div class="col-sm-5">
                                              <button type="button" class="btn btn-primary w-100" onclick="submit_payment(${employee[0].user_id})">Submit Payment</button>
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
              } catch (error) {
                const modal = document.getElementById("myModal");
                const modalContent = document.getElementById("modalContent");
                var html = `
                      <h5 class="modal-title " style="color: red; text-align:center;">No Billing Transactions Yet !</h5>
                  `;
                  modalContent.innerHTML = html;
                  modal.style.display = "block";
              }
        
              modalContent.innerHTML = html;
              modal.style.display = "block";
          }).catch((error) => {
              alert(`ERROR OCCURRED! ${error}`);
          });
        };
        const getConsumerType = () => {
          const propertySelect = document.getElementById("consumer");
          var myUrl = "http://128.199.232.132/waterworks/clerk/get_consumertype.php";
        
          axios({
            url: myUrl,
            method: "post",
          })
            .then((response) => {
              var properties = response.data;
        
              var options = ``;
              properties.forEach((property) => {
                options += `<option value="${property.discount_percent }">${property.consumertype}</option>`;
              });
              propertySelect.innerHTML = options;
            })
            .catch((error) => {
              alert(`ERROR OCCURRED! ${error}`);
            });
        };
        const submit_payment = (user_id) => {
            const amount = document.getElementById("amount").value;
        
            if (amount === '' ) {
                alert('Fill in all fields');
                return;
            } else {
                const myUrl = "http://128.199.232.132/waterworks/clerk/payment.php";
                const formData = new FormData();
                formData.append("consumerId", user_id);
                formData.append("amount", amount);
                formData.append("emp_Id", sessionStorage.getItem("accountId"));
                formData.append("branchId", sessionStorage.getItem("branchId"));
        
                console.log("consumer ID : ", user_id);
                console.log("consumer amount : ", amount);
                console.log("clerk ID : ", sessionStorage.getItem("accountId"));
                console.log("branch ID : ", sessionStorage.getItem("branchId"));
        
                axios({
                    url: myUrl,
                    method: "post",
                    data: formData
                }).then(response => {
                    // Check if the response contains an error message
                    if (response.data && response.data.error) {
                        // Handle the error message
                        if (response.data.error === 'Invalid Input amount') {
                            failed_update_modal(response.data.error);
                        } else {
                            failed_update_modal(response.data.error);
                        }
                    } else {
                        // Process the successful response data
                        console.log(response.data);
                        payment_receipt(user_id); // Pass user_id to payment_receipt function
                    }
                }).catch(error => {
                    // Handle the request failure
                    console.error('Request failed:', error);
                    error_modal();
                });
            }
        }
        
          const getFileterZones = () => {
            const positionSelect = document.getElementById("filterZone");
            const barangayName = sessionStorage.getItem("branchId");
            const myUrl = "http://128.199.232.132/waterworks/clerk/get_zones_filter.php";
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
            const url = "http://128.199.232.132/waterworks/clerk/get_consumers_filter.php";
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
            showPaginationNumbersReaderFilter(page, Math.ceil(consumersToDisplay.length / 10));
          };
          const showPaginationNumbersReaderFilter = (currentPage, totalPages) => {
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
                paginationNumbersHTML += `<span class="active" onclick="goToPageConsumerFilter(${i})">${i}</span>`;
              } else {
                paginationNumbersHTML += `<span onclick="goToPageConsumerFilter(${i})">${i}</span>`;
              }
            }
          
            // Next button
            paginationNumbersHTML += `<button onclick="showNextPage()">Next</button>`;
          
            paginationNumbersDiv.innerHTML = paginationNumbersHTML;
          };
          
          const goToPageConsumerFilter = (pageNumber) => {
            showConsumerPageByZone(pageNumber);
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
                        <button class="clear" onclick="payment(${consumer.user_id})">Pay</button>
                        <button class="clear" onclick="discount(${consumer.user_id}, '${consumer.firstname}', '${consumer.lastname}', ${consumer.connected_number})">Discount</button>
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
      
      const failed_update_modal = (errorMessage) => {
        const close_butt = document.getElementById("close_butt");
        close_butt.style.display = "flex";
        const modal = document.getElementById("myModal");
        const modalContent = document.getElementById("modalContent");
    
        var html = `
            <h5 class="modal-title" style="color: red; text-align: center;">Failed!</h5>
            <p style="color: red; text-align: center;">${errorMessage}</p>
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
        const branchSelect = document.getElementById("filterZone");
        const searchInput = document.getElementById("searchInput");
        const close_butt = document.getElementById("close_butt");
        close_butt.style.display = "flex";
        head.style.display = "block";
        paginationNumbers.style.display = "block";
        branchSelect.style.display = "block";
        searchInput.style.display = "block";
      
      };


      const payment_receipt = (user_id) => {
        const modal = document.getElementById("myModal");
        const modalContent = document.getElementById("modalContent");
    
        var myUrl = "http://128.199.232.132/waterworks/clerk/get_payment_receipt.php";
        const formData = new FormData();
        formData.append("accId", user_id);
        console.log("Consumer ID : ", user_id);
    
        axios({
            url: myUrl,
            method: "post",
            data: formData,
        }).then((response) => {
            try {
                console.log(response.data);
                var html = '';
    
                if (response.data.error) {
                    // Display error message
                    html = `<h2>${response.data.error}</h2>`;
                } else if (response.data.length === 0) {
                    // Display a message indicating there are no billing transactions yet.
                    html = `<h2>No Records</h2>`;
                } else {
                    var records = response.data;
                    // Accessing properties only if records array is not empty
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
                                                    <td class="col-md-3 text-start border-0">
                                                        <p>
                                                            <strong></strong>
                                                        </p>
                                                        <p>
                                                            <strong>Amount Paid: </strong>
                                                        </p>
                                                    </td>
                                                    <td class="col-md-3 border-0"></td>
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
                                    <div class="row mt-1">
                                        <div class="col-sm-12">
                                           <button type="button" class="btn btn-primary w-100 " data-bs-dismiss="modal" onclick="success_update_modal()">Close</button>
                                         </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                    `;
      
                }
            } catch (error) {
                // Handle any other errors
                console.error(error);
                html = `
                    <div class="wrapper">
                        <div class="container mt-0">
                            <div class="row">
                                <div class="text-center">
                                    <h5 class="pe-4" style="color:red;">FAILED!</h5>
                                </div>
                                <div class="row mt-1">
                                    <div class="col-sm-12">
                                        <button type="button" class="btn btn-primary w-100" data-bs-dismiss="modal" onclick="failed_update_modal()">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
    
            modalContent.innerHTML = html;
            modal.style.display = "block";
        }).catch((error) => {
            alert(`ERROR OCCURRED! ${error}`);
        });
    };
    