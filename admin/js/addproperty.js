let currentPage = 1;
let properties = [];

const onLoad = () => {
  document.getElementById("ngalan").innerText = sessionStorage.getItem("fullname");
    add_property();
    displayProperty();
  }; 
// ------------------------------FOR FORM--------------------------------------------------------------
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
      <h5 class="modal-title " style="color: red; text-align:center;">Position already exists !</h5>
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
  const add_property = () => {
        var html = `
        <div class="mb-1 mt-3">
            <h4 style="text-align: center;">Add Property</h4>
        </div>
        <div class="container-fluid mt-5">
            <form class="row g-3" >
                <label class="form-label mb-0 underline-label">Register Property</label>
                <div class="col-md-12">
                    <label class="form-label mt-4">Property Name</label>
                    <input type="text" class="form-control" id="add_property" required>
                </div>
                <div class="col-12 mt-5">
                    <button type="submit" class="btn btn-primary" onclick="submit_property(event)">Submit form</button>
                </div>
            </form>
        </div>                        
        `;
        document.getElementById("mainDiv").innerHTML = html;
        
    };
    const submit_property = (event) => {
        event.preventDefault();

        const add_property = document.getElementById("add_property").value;
    
      if (add_property === '') {
        alert('Fill in all fields');
        return;
      }
    
      const myUrl = "http://localhost/waterworks/admin/add_property.php";
      const formData = new FormData();
      formData.append("add_property", add_property);
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
              displayProperty();
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
// ------------------------------FOR TABLE--------------------------------------------------------------

const displayProperty = () => {
  var url = "http://localhost/waterworks/admin/propertylist.php";
  
  const formData = new FormData();
  formData.append("accountId", sessionStorage.getItem("accountId"));
  
  axios({
    url: url,
    method: "post",
    data: formData
  })
    .then((response) => {
      properties = response.data;
      console.log(properties);
  
      if (!Array.isArray(properties) || properties.length === 0) {
        errorTable();
      } else {
        sortPropertyByName();
        showPropertyPage(currentPage);
      }
    })
    .catch((error) => {
      alert("ERRORSS! - " + error);
    });  
  };
  
  const sortPropertyByName = () => {
    properties.sort((a, b) => {
    const nameA = (a.property_name + ' ' + a.property_name).toUpperCase();
    const nameB = (b.property_name + ' ' + b.property_name).toUpperCase();
    return nameA.localeCompare(nameB);
  });
  };
  const showNextPage = () => {
    const nextPage = currentPage + 1;
    const start = (nextPage - 1) * 10;
    const end = start + 10;
    const activitiesOnNextPage = properties.slice(start, end);
  
    if (activitiesOnNextPage.length > 0) {
        currentPage++;
        showPropertyPage(currentPage);
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
        showPropertyPage(currentPage);
    } else {
        alert("You are on the first page.");
    }
  };
  const showPropertyPage = (page, propertiesToDisplay = properties) => {
  var start = (page - 1) * 10;
  var end = start + 10;
  var displayedproperties = propertiesToDisplay.slice(start, end);
  refreshTable(displayedproperties);
  showPaginationNumbers(page, Math.ceil(propertiesToDisplay.length / 10));
  };

  const errorTable = () =>{
      var html = `
      
      <table class="table" >
        <thead>
          <tr>
            <th scope="col" >Property</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        </table>`;
  
        document.getElementById("mainDivs").innerHTML = html;
    }
    const refreshTable = (barangayList) => {
    var html = `
      <table class="table mb-0 mt-0">
        <thead>
          <tr>
            <th scope="col">Property</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
    `;
    barangayList.forEach((employee) => {
      html += `
        <tr>
          <td>${employee.property_name}</td>
          <td>
            <button class="clear" onclick="edit(${employee.property_id})">Edit</button>  
          </td>
        </tr>
      `;
    });
    
    html += `</tbody></table>`;
    
    document.getElementById("mainDivs").innerHTML = html;
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
const edit = (property_id) => {

        var myUrl = "http://localhost/waterworks/admin/getproperty.php";
        const formData = new FormData();
        formData.append("property_id", property_id);

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
                    var property = response.data;
                    console.log("property : ",property);
                    var html = `
                        <div class=" row  mt-3">
                          <div class="col-md-1">
                              <button class="clear" onclick="add_property()">Back</button>
                          </div>
                          <div class="col-md-11">
                              <h4 style="text-align: center;">Edit Property</h4>
                          </div>
                        </div>
                        <div class="container-fluid mt-5">
                            <form class="row g-3" >
                                <label class="form-label mb-0 underline-label">Edit Property</label>
                                <div class="col-md-12">
                                    <label class="form-label mt-4">Property Name</label>
                                    <input type="text" class="form-control" id="edit_property" value="${property[0].property_name}" required>
                                </div>
                                <div class="col-12 mt-5">
                                    <button type="submit" class="btn btn-primary" onclick="submit_edit_property(event, ${property[0].property_id})">Submit form</button>
                                </div>
                            </form>
                        </div>   
                    `;
                    document.getElementById("mainDiv").innerHTML = html;
                }
            } catch (error) {
              var html = `<h2>NO RECORD</h2>`;
            }

          }).catch((error) => {
            alert(`ERROR OCCURRED! ${error}`);
        });
}
const submit_edit_property = (event, property_id) => {
  event.preventDefault();

  const add_property = document.getElementById("edit_property").value;

  if (add_property === '') {
      alert('Fill in all fields');
      return;
  }

  const myUrl = "http://localhost/waterworks/admin/update_api/update_property.php";
  const formData = new FormData();
  formData.append("property_id", property_id);
  formData.append("add_property", add_property);
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
        success_update_modal();
        console.log("success update");
        displayProperty();
        //window.location.href = "./addconsumer.html";
      } else if (response.data.status === 0) {
        // alert("Username or phone number already exists!");
        failed_update_modal();
      } else {
        // alert("Unknown error occurred.");
        error_modal();
        console.log(response.data);
      }
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
    });
};


  const success_update_modal = () => {
    const modal = document.getElementById("myModal");
    const modalContent = document.getElementById("modalContent");
  var html = `
        <h5 class="modal-title " style="color: limegreen; text-align:center;">Successfully Saved</h5>
    `;
      modalContent.innerHTML = html;
      modal.style.display = "block";
  
};

const failed_update_modal = () => {
const modal = document.getElementById("myModal");
const modalContent = document.getElementById("modalContent");
var html = `
    <h5 class="modal-title " style="color: red; text-align:center;">Property already exists !</h5>
`;
  modalContent.innerHTML = html;
  modal.style.display = "block";

};