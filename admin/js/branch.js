const onLoad = () => {
    var accountId = sessionStorage.getItem("accountId");
    if (!accountId || accountId === "0") {
        window.location.href = "/waterworks/";
    } else {
      document.getElementById("ngalan").innerText =
      sessionStorage.getItem("fullname");
      displayBranch();
      getFilterBranch();
    }
   
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
            displayBranch();
          }
          // Add more conditions as needed for other positions
        });
      })
      .catch((error) => {
        console.log(`ERROR OCCURRED! ${error}`);
      });
  };
  const displayBranchByBranch = (selectedBranch) => {
    var url = "http://152.42.243.189/waterworks/admin/branchlistByBranch.php";
    
    const formData = new FormData();
    formData.append("accountId", sessionStorage.getItem("accountId"));
    formData.append("selectedBranch", selectedBranch);
    axios({
      url: url,
      method: "post",
      data: formData
        })
        .then((response) => {
            branches = response.data;
            console.log(branches);
            BranchRefreshTableByBranch(branches);
        })
        .catch((error) => {
            alert("ERRORSS! - " + error);
        });  
    };
    const BranchRefreshTableByBranch = (branches) => {
        var html = `
            <table id="example" class="table table-striped table-bordered" style="width:100%">
            <thead>
                <tr>
                <th class="text-center" >Branch</th>
                <th class="text-center" >Contact</th>
                <th class="text-center" >Location</th>
                <th class="text-center">Action</th>
                </tr>
            </thead>
            <tbody>
        `;
        branches.forEach((employee) => {
            html += `
            <tr>
                <td class="text-center">${employee.branch_name}</td>
                <td class="text-center">${employee.phone_num}</td>
                <td class="text-center">${employee.zone_name} , ${employee.barangay_name}</td>
                <td class="text-center">
                <button style="background-color: #0275d8; border: none; padding: 5px; border-radius: 12%; color:white;" class="clear" onclick="edit(${employee.branch_id})">Edit</button>  
                </td>
            </tr>
            `;
        });
        
        html += `</tbody></table>`;
        
        document.getElementById("mainDiv").innerHTML = html;

    // Initialize DataTable after populating the HTML
        $('#example').DataTable({
            "ordering": false // Disable sorting for all columns
        });
    };

  const displayBranch = () => {
    var url = "http://152.42.243.189/waterworks/admin/branchlist.php";
    
    const formData = new FormData();
    formData.append("accountId", sessionStorage.getItem("accountId"));
    
    axios({
      url: url,
      method: "post",
      data: formData
        })
        .then((response) => {
            branches = response.data;
            console.log(branches);
        
            if (!Array.isArray(branches) || branches.length === 0) {
            errorTable();
            } else {
            BranchRefreshTable(branches);
            }
        })
        .catch((error) => {
            alert("ERRORSS! - " + error);
        });  
    };
        const errorTable = () =>{
            var html = `
            
            <table id="example" class="table table-striped table-bordered" style="width:100%" >
            <thead>
                <tr>
                <th class="text-center" >Branch</th>
                <th class="text-center" >Contact</th>
                <th class="text-center" >Location</th>
                <th class="text-center">Action</th>
                </tr>
            </thead>
            </table>`;
        
            document.getElementById("mainDiv").innerHTML = html;
        }
        const BranchRefreshTable = (branches) => {
        var html = `
            <table id="example" class="table table-striped table-bordered" style="width:100%">
            <thead>
                <tr>
                <th class="text-center" >Branch</th>
                <th class="text-center" >Contact</th>
                <th class="text-center" >Location</th>
                <th class="text-center">Action</th>
                </tr>
            </thead>
            <tbody>
        `;
        branches.forEach((employee) => {
            html += `
            <tr>
                <td class="text-center">${employee.branch_name}</td>
                <td class="text-center">${employee.phone_num}</td>
                <td class="text-center">${employee.zone_name} , ${employee.barangay_name}</td>
                <td class="text-center">
                <button style="background-color: #0275d8; border: none; padding: 5px; border-radius: 12%; color:white;" class="clear" onclick="edit(${employee.branch_id})">Edit</button>  
                </td>
            </tr>
            `;
        });
        
        html += `</tbody></table>`;
        
        document.getElementById("mainDiv").innerHTML = html;

    // Initialize DataTable after populating the HTML
        $('#example').DataTable({
            "ordering": false // Disable sorting for all columns
        });
    };
    // ---------------------------------------------FOR EDIT-----------------------------------------------------
    const edit = (branch_id) => {
        console.log(branch_id);

        var myUrl = "http://152.42.243.189/waterworks/admin/getbranch.php";
        const formData = new FormData();
        formData.append("branch_id", branch_id);


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
                    var branches = response.data;
                    console.log("branches : ",branches);
                    var html = `
                      <div class=" row  mt-1">
                        <div class="col-md-11">
                          <h4 style="text-align: center;">Edit Branch</h4>
                        </div>
                      </div>
                      <div class="container-fluid mt-3">
                          <form class="row g-3" >
                              <label class="form-label mb-0 underline-label">Edit Branch Address</label>
                              <div class="col-md-4 ">
                                  <label class="form-label">Municipality</label>
                                  <select id="municipalities" class="form-select" onchange="getBarangay1()">
                                    <option value="${branches[0].municipality_id}" selected>${branches[0].municipality_name}</option>
                                  </select>
                              </div>
                              <div class="col-md-4">
                                  <label class="form-label">Barangay</label>
                                  <select id="barangays" class="form-select" onchange="getZone1()">
                                    <option value="${branches[0].barangay_id}" selected>${branches[0].barangay_name}</option>
                                  </select>
                              </div>
                              <div class="col-md-4">
                                  <label class="form-label">Zone</label>
                                  <select id="zones" class="form-select" >
                                      <option value="${branches[0].zone_id}" selected>${branches[0].zone_name}</option>
                                  </select>
                              </div>
                              <label class="form-label mb-0 underline-label mt-4">Edit Register Branch</label>
                              <div class="col-md-6">
                                  <label class="form-label">Branch Name</label>
                                  <input type="text" class="form-control" id="edit_branch" value="${branches[0].branch_name}" required>
                              </div> 
                              <div class="col-md-6">
                                  <label class="form-label">Contact Number</label>
                                  <input type="text" class="form-control" id="edit_phone_no" value="${branches[0].phone_num}" required>
                              </div>                    
                              <div class="col-12 mt-5">
                                  <button type="submit" class="btn btn-primary w-100" onclick="submit_edit_branch(event,${branches[0].branch_id})">Submit form</button>
                              </div>
                          </form>
                      </div>                        
                    `;
                    document.getElementById("modalContents").innerHTML = html;

                    // Trigger the modal
                    var myModal = new bootstrap.Modal(document.getElementById('myModals'), {});
                    myModal.show();
                    
                    getMunicipality1();
                }
            } catch (error) {
                document.getElementById("modalContents").innerHTML = `<h2>No Record</h2>`;
            }

          }).catch((error) => {
            alert(`ERROR OCCURRED! ${error}`);
        });
    }
    const submit_edit_branch = (event, branch_id) => {
        event.preventDefault();

        const municipalityId = document.getElementById("municipalities").value;
        const barangayId = document.getElementById("barangays").value;
        const zoneId = document.getElementById("zones").value;
        const edited_branch = document.getElementById("edit_branch").value;
        const edit_phone_no = document.getElementById("edit_phone_no").value;
        console.log("branch ID: ",branch_id);
        console.log("Municipality ID: ",municipalityId);
        console.log("barangay ID: ",barangayId);
        console.log("Zone Id : ",zoneId);
        console.log("Branch Name : ",edited_branch);
        console.log("Phone Num : ",edit_phone_no);
        

        if (barangayId === '' || municipalityId === ''|| zoneId === '' || edit_branch === ''|| edit_phone_no === '') {
            alert('Fill in all fields');
            return;
        }

        const myUrl = "http://152.42.243.189/waterworks/admin/update_api/update_branch.php";
        const formData = new FormData();
        formData.append("branch_id", branch_id);
        formData.append("municipalityId", municipalityId);
        formData.append("barangayId", barangayId);
        formData.append("zoneId", zoneId);
        formData.append("edit_branch", edited_branch);
        formData.append("edit_phone_no", edit_phone_no);
        formData.append("employee_Id", sessionStorage.getItem("accountId"));

        axios({
            url: myUrl,
            method: "post",
            data: formData,
        })
        .then((response) => {
        console.log(response);
        console.log("Responses : ",response);
        if (response.data.status === 1) {
            success_modals();
            console.log("success update");
            displayBranch();
            //window.location.href = "./addconsumer.html";
        } else if (response.data.status === 0) {
            console.log(response.data);
            // alert("Username or phone number already exists!");
            failed_modals();
        } else {
            // alert("Unknown error occurred.");
            error_modals();
            console.log(response);
        }
        })
        .catch((error) => {
        alert(`ERROR OCCURRED! ${error}`);
        });
    };

    const getMunicipality1 = () => {
        const municipalitySelect = document.getElementById("municipalities");
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
            getBarangay1();
            })
            .catch((error) => {
            alert(`ERROR OCCURRED! ${error}`);
            });
    };
    const getBarangay1 = () => {
        const selectedMunicipalityId = document.getElementById("municipalities").value;
        
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
            const barangaysSelect = document.getElementById("barangays");
            const barangays = response.data;
            console.log("success barangay");
            // Clear existing options
            barangaysSelect.innerHTML = '';
        
            // Populate options for barangays
            barangays.forEach((barangays) => {
            const options = document.createElement("option");
            options.value = barangays.barangay_id;
            options.textContent = barangays.barangay_name;
            barangaysSelect.appendChild(options);
            });
            getZone1();
        })
        .catch((error) => {
            alert(`ERROR OCCURRED while fetching barangays! ${error}`);
        });
    };
    const getZone1 = () => {
      const selectedBarangayId = document.getElementById("barangays").value;
      
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
          const zoneSelect = document.getElementById("zones");
          const zones = response.data;
          console.log("success zone");
    
          // Clear existing options
          zoneSelect.innerHTML = '';
    
          // Sort zones numerically
          zones.sort((a, b) => {
            // Extract numeric part from the zone name and compare
            const aNumber = parseInt(a.zone_name.match(/\d+/)[0]);
            const bNumber = parseInt(b.zone_name.match(/\d+/)[0]);
            return aNumber - bNumber;
          });
    
          // Populate options for zones
          zones.forEach((zone) => {
            const options = document.createElement("option");
            options.value = zone.zone_id;
            options.textContent = zone.zone_name;
            zoneSelect.appendChild(options);
          });
        })
        .catch((error) => {
          alert(`ERROR OCCURRED while fetching zones! ${error}`);
        });
    };

    const add_branch = () => {
        var html = `
        <div class="mb-1 mt-3">
            <h4 style="text-align: center;">Add Branch</h4>
        </div>
        <div class="container-fluid mt-3">
            <form class="row g-3">
                <label class="form-label mb-0 underline-label">Register Branch Address</label>
                <div class="col-md-4 ">
                    <label class="form-label">Municipality</label>
                    <select id="municipality" class="form-select" onchange="getBarangay()"></select>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Barangay</label>
                    <select id="barangay" class="form-select" onchange="getZone()">
                        <option value="">Select Barangay</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Zone</label>
                    <select id="zone" class="form-select" >
                        <option value="">Select Zone</option>
                    </select>
                </div>
                <label class="form-label mb-0 underline-label mt-4">Register Branch</label>
                <div class="col-md-6">
                    <label class="form-label">Branch Name</label>
                    <input type="text" class="form-control" id="branch" required>
                </div> 
                <div class="col-md-6">
                    <label class="form-label">Contact Number</label>
                    <input type="text" class="form-control" id="phone_no" required>
                </div>                    
                <div class="col-12 mt-5">
                    <button type="submit" class="btn btn-primary" onclick="submit_branch(event)">Submit form</button>
                </div>
            </form>
        </div>                        
        `;
        document.getElementById("modalContents").innerHTML = html;

        // Show the modal
        const myModal = new bootstrap.Modal(document.getElementById('myModals'));
        myModal.show();
        
        getMunicipality();
    };
    const submit_branch = (event) => {
        event.preventDefault();

        const branch = document.getElementById("branch").value;
        const municipalityId = document.getElementById("municipality").value;
        const barangayId = document.getElementById("barangay").value;
        const zoneId = document.getElementById("zone").value;
        const phone_no = document.getElementById("phone_no").value;
      
        if (branch === ''||
        municipalityId === '' ||
        barangayId === '' ||
        zoneId === '' ||
        phone_no === '') {
          alert('Fill in all fields');
          return;
        }
      
        const myUrl = "http://152.42.243.189/waterworks/admin/add_branch.php";
        const formData = new FormData();
        formData.append("branch", branch);
        formData.append("municipalityId", municipalityId);
        formData.append("barangayId", barangayId);
        formData.append("zoneId", zoneId);
        formData.append("phone_no", phone_no);
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
              console.log("success save");
              displayBranch();
              //window.location.href = "./addconsumer.html";
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
          })
            .then((response) => {
              const zoneSelect = document.getElementById("zone");
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
              alert(`ERROR OCCURRED while fetching zones! ${error}`);
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
      const closeModal = () => {
        const modal = document.getElementById("myModal");
        modal.style.display = "none";
      
        const head = document.getElementById("head");
        const paginationNumbers = document.getElementById("paginationNumbers");
        const searchInput = document.getElementById("searchInput");
        head.style.display = "block";
      };