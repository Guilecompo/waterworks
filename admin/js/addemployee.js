
const onLoad = () => {
  var accountId = sessionStorage.getItem("accountId");
  if (!accountId || accountId === "0") {
      window.location.href = "/waterworks/";
  } else {
    document.getElementById("ngalan").innerText = sessionStorage.getItem("fullname");
    add_employee();
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
      <h5 class="modal-title " style="color: red; text-align:center;">Username or Phone Number already exists !</h5>
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
  const clearForm = () => {
    document.getElementById("firstname").value = "";
    document.getElementById("middlename").value = "";
    document.getElementById("lastname").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("email_add").value = "";
    document.getElementById("provinceName").value = "";
    document.getElementById("municipalityName").value = "";
    document.getElementById("barangayName").value = "";
};
  const add_employee = () => {
        var html = `
        
        <div class="mb-1 mt-3">
          <h4 style="text-align: center;">Add Employee</h4>
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
                <div class="col-md-4">
                    <label class="form-label">Province</label>
                    <input type="text" class="form-control" id="provinceName" required>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Municipality</label>
                    <input type="text" class="form-control" id="municipalityName" required>
                </div>
                <div class="col-md-4 ">
                    <label class="form-label">Barangay</label>
                    <input type="text" class="form-control" id="barangayName" required>
                </div>
                <label class="form-label mb-0 underline-label mt-4">Workspace</label>
                    <div class="col-md-4 ">
                        <label class="form-label">Branch</label>
                        <select id="branch" class="form-select"></select>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Position</label>
                        <select id="position" class="form-select"></select>
                    </div>                     
                <div class="col-12 mt-5">
                  <button type="submit" class="btn btn-primary" onclick="submit_employee(event)">Submit form</button>
                </div>
              </form>
        </div>
        `;
        document.getElementById("mainDiv").innerHTML = html;
        
        getSuffix();
        // getMunicipality();
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