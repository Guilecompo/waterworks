const onLoad = () => {
  document.getElementById("ngalan").innerText = sessionStorage.getItem("fullname");
    add_consumer();
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
    window.location.reload();

};
const closeModal = () => {
  const modal = document.getElementById("myModal");
  modal.style.display = "none";
  window.location.reload();
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
                    <label class="form-label">Phone</label>
                    <input type="text" class="form-control" id="phone" required>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" id="email_add" >
                </div>
                <label class="form-label mb-0 underline-label">Address</label>
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
                <label class="form-label mb-0 underline-label mt-4">Register Account</label>
                <div class="col-md-3 ">
                    <label class="form-label">Branch</label>
                    <select id="branch" class="form-select"></select>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Property Type</label>
                    <select id="property" class="form-select"></select>
                </div> 
                <div class="col-md-6">
                    <label class="form-label">Meter Number</label>
                    <input type="text" class="form-control" id="meter_no" required>
                </div>                    
                <div class="col-12 mt-5">
                    <button type="submit" class="btn btn-primary" onclick="submit_consumer(event)">Submit form</button>
                </div>
            </form>
        </div>
                          
        `;
        document.getElementById("mainDiv").innerHTML = html;
        
        getBranch();
        getProperty();
        getMunicipality();
    };
    const submit_consumer = (event) => {
      event.preventDefault();
        const firstname = document.getElementById("firstname").value;
        const middlename = document.getElementById("middlename").value;
        const lastname = document.getElementById("lastname").value;
        const phone = document.getElementById("phone").value;
        const email_add = document.getElementById("email_add").value;
        const propertyId = document.getElementById("property").value;
        const municipalityId = document.getElementById("municipality").value;
        const barangayId = document.getElementById("barangay").value;
        const zoneId = document.getElementById("zone").value;
        const branchId = document.getElementById("branch").value;
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
    
      const myUrl = "http://localhost/waterbilling/admin/add_consumer.php";
      const formData = new FormData();
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
      const getProperty = () => {
        const propertySelect = document.getElementById("property");
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

      const getBranch = () => {
        const propertySelect = document.getElementById("branch");
        var myUrl = "http://localhost/waterworks/admin/get_branch.php";
      
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
          });
      };
      const getPosition = () => {
        const positionSelect = document.getElementById("position");
        var myUrl = "http://localhost/waterworks/admin/get_position.php";
        
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
            var myUrl = "http://localhost/waterworks/gets/get_municipality.php";
            
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
            
              const zoneUrl = `http://localhost/waterworks/gets/get_zone.php`;
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