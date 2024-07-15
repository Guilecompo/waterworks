const onLoad = () => {
  var accountId = sessionStorage.getItem("accountId");
  if (!accountId || accountId === "0") {
      window.location.href = "/waterworks/";
  } else {
    document.getElementById("ngalan").innerText = sessionStorage.getItem("fullname");
    add_consumer();
  }
  }; 

  const success_modal = () => {
      const modal = document.getElementById("myModal");
      const modalContent = document.getElementById("modalContent");
    var html = `
          <h5 class="modal-title " style="color: limegreen; text-align:center;">Successfully Saved</h5>
      `;
        modalContent.innerHTML = html;
        modal.style.display = "block";
    
};

const failed_modal = () => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");
var html = `
      <h5 class="modal-title " style="color: red; text-align:center;">Meter Number or Phone Number already exists !</h5>
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
                    <select id="suffix" class="form-select" required></select>
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
                    <select id="municipality" class="form-select" onchange="getBarangay()" required></select>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Barangay</label>
                    <select id="barangay" class="form-select" onchange="getZone()" required>
                        <option value="">Select Barangay</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Zone</label>
                    <select id="zone" class="form-select" required>
                        <option value="">Select Zone</option>
                    </select>
                </div>
                <label class="form-label mb-0 underline-label mt-4">Register Account</label>
                <div class="col-md-4 ">
                    <label class="form-label">Branch</label>
                    <select id="branch" class="form-select" required></select>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Property Type</label>
                    <select id="property" class="form-select" required></select>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Consumer Type</label>
                    <select id="consumer" class="form-select" required></select>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Meter Number</label>
                    <input type="text" class="form-control" id="meter_no" required>
                </div>   
                <div class="col-md-4">
                    <label class="form-label">House Number</label>
                    <input type="number" class="form-control" id="house_no" required>
                </div>           
                <div class="col-12 mt-5">
                    <button type="submit" class="btn btn-primary" onclick="submit_consumer(event)">Submit form</button>
                </div>
            </form>
        </div>
                          
        `;
        document.getElementById("mainDiv").innerHTML = html;
        getSuffix();
        getBranch();
        getConsumerType();
        getProperty();
        getMunicipality();
    };
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
        const zoneId = document.getElementById("zone").value;
        const branchId = document.getElementById("branch").value;

        const consumer = document.getElementById("consumer").value;
        const meter_no = document.getElementById("meter_no").value;
        const house_no = document.getElementById("house_no").value;

    
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
          { id: "zone", element: document.getElementById("zone") },
          { id: "branch", element: document.getElementById("branch") },
          { id: "consumer", element: document.getElementById("consumer") },
          { id: "meter_no", element: document.getElementById("meter_no") },
          { id: "house_no", element: document.getElementById("house_no") }
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
    
    
      const myUrl = "http://152.42.243.189/waterworks/head/add_consumer.php";
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
              success_modal();
              // window.location.href = "./addconsumer.html";
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
            alert(`ERROR OCCURRED! ${error}`);
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
            alert(`ERROR OCCURRED! ${error}`);
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
            alert(`ERROR OCCURRED! ${error}`);
          });
      };

      const getBranch = () => {
        const propertySelect = document.getElementById("branch");
        var myUrl = "http://152.42.243.189/waterworks/head/get_branch.php";
        const formData = new FormData();
        formData.append("branchId", sessionStorage.getItem("branchId"));
        
          axios({
            url: myUrl,
            method: "post",
            data: formData,
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
            
            const barangayUrl = `http://152.42.243.189/waterworks/head/get_barangay.php`;
            const formData = new FormData();
            
            // Use selectedMunicipalityId directly
            formData.append("municipalityId", selectedMunicipalityId);
            formData.append("barangayId", sessionStorage.getItem("barangayIds"));
            console.log("barangayId:" , sessionStorage.getItem("barangayIds"));
            axios({
              url: barangayUrl,
              method: "post",
              data: formData
            })
              .then((response) => {
                const barangaySelect = document.getElementById("barangay");
                const barangays = response.data;
                console.log(response.data);
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