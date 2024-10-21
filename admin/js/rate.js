let rates = [];

const onLoad = () => {
  var accountId = sessionStorage.getItem("accountId");
  if (!accountId || accountId === "0") {
      window.location.href = "/waterworks/";
  } else {
    document.getElementById("ngalan").innerText =
    sessionStorage.getItem("fullname");
  displayRate();
  }
  
};
const displayRate = () => {
    var url = "http://152.42.243.189/waterworks/admin/ratelist.php";
  
    const formData = new FormData();
    formData.append("accountId", sessionStorage.getItem("accountId"));
  
    axios({
      url: url,
      method: "post",
      data: formData,
    })
      .then((response) => {
        rates = response.data;
        console.log(rates);
  
        if (!Array.isArray(rates) || rates.length === 0) {
          errorTable();
        } else {
          RateRefreshTable(rates);
        }
      })
      .catch((error) => {
        alert("ERRORSS! - " + error);
      });
  };
  
  const errorTable = () => {
    var html = `
        
        <table class="table " >
          <thead>
            <tr>
              <th class="text-center" >Property Name</th>
              <th class="text-center" >Minimum</th>
              <th class="text-center" >11 - 20</th>
              <th class="text-center" >21 - 30</th>
              <th class="text-center" >31 & above</th>
              <th class="text-center" >Action</th>
            </tr>
          </thead>
          </table>`;
  
    document.getElementById("mainDivs").innerHTML = html;
  };
  const RateRefreshTable = (rates) => {
    var html = `
        <table id="example" class="table table-striped table-bordered" style="width:100%">
          <thead>
            <tr>
              <th class="text-center" >Property Name</th>
              <th class="text-center" >Minimum</th>
              <th class="text-center" >11 - 20</th>
              <th class="text-center" >21 - 30</th>
              <th class="text-center" >31 & above</th>
              <th class="text-center" >Action</th>
            </tr>
          </thead>
          <tbody>
      `;
      rates.forEach((employee) => {
      html += `
          <tr>
            <td class="text-center">${employee.property_name}</td>
            <td class="text-center">${employee.minimum_rate}</td>
            <td class="text-center">${employee.second_rate}</td>
            <td class="text-center">${employee.third_rate}</td>
            <td class="text-center">${employee.last_rate}</td>
            <td class="text-center">
                <button style="background-color: #0275d8; border: none; padding: 5px; border-radius: 12%; color:white;" class="clear" onclick="edit(${employee.rate_id})">Edit</button>
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

  const add_rate = () => {
    var html = `
          <div class="mb-1 mt-3">
              <h4 style="text-align: center;">Add New Rate</h4>
          </div>
          <div class="container-fluid mt-3">
              <form class="row g-3">
                  <label class="form-label mb-0 underline-label">Register Rate Information</label>
                  <div class="col-md-12">
                      <label class="form-label">Property Type</label>
                      <select id="property" class="form-select"></select>
                  </div>
                  <label class="form-label mb-0 underline-label"></label>
                  <div class="col-md-6">
                      <label class="form-label">Minimun Rate</label>
                      <input type="text" class="form-control" id="minimum_rate" required>
                  </div>
                  <div class="col-md-6">
                      <label class="form-label">11 to 20 +Rate</label>
                      <input type="text" class="form-control" id="second_rate" required>
                  </div>
                  <div class="col-md-6">
                      <label class="form-label">21 to 30 +Rate</label>
                      <input type="text" class="form-control" id="third_rate" required>
                  </div>
                  <div class="col-md-6">
                      <label class="form-label">31 and above +Rate</label>
                      <input type="text" class="form-control" id="last_rate" required>
                  </div>
                                  
                  <div class="col-12 mt-5">
                      <button type="submit" class="btn btn-primary w-100" onclick="submit_rate(event)">Submit form</button>
                  </div>
              </form>
          </div>                
          `;
          document.getElementById("modalContents").innerHTML = html;

          // Show the modal
          const myModal = new bootstrap.Modal(document.getElementById('myModals'));
          myModal.show();
  
    getProperty();
  };
  const submit_rate = (event) => {
    event.preventDefault();
    const propertyId = document.getElementById("property").value;
    const minimum_rate = document.getElementById("minimum_rate").value;
    const second_rate = document.getElementById("second_rate").value;
    const third_rate = document.getElementById("third_rate").value;
    const last_rate = document.getElementById("last_rate").value;
  
    if (
      propertyId === "" ||
      minimum_rate === "" ||
      second_rate === "" ||
      third_rate === "" ||
      last_rate === ""
    ) {
      alert("Fill in all fields");
      return;
    }
  
    const myUrl = "http://152.42.243.189/waterworks/admin/add_property_rate.php";
    const formData = new FormData();
    formData.append("propertyId", propertyId);
    formData.append("minimum_rate", minimum_rate);
    formData.append("second_rate", second_rate);
    formData.append("third_rate", third_rate);
    formData.append("last_rate", last_rate);
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
          displayRate();
          //   window.location.href = "./addrate.html";
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


  const edit = (rate_id) => {
    console.log(rate_id);

    var myUrl = "http://152.42.243.189/waterworks/admin/get_rate.php";
    const formData = new FormData();
    formData.append("rate_id", rate_id);


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
                var rates = response.data;
                console.log("rates : ",rates);
                var html = `
                    <div class="mb-1 mt-3">
                        <h4 style="text-align: center;">Edit Rate</h4>
                    </div>
                    <div class="container-fluid mt-3">
                        <form class="row g-3">
                            <div class="col-md-12">
                                <label class="form-label">Property Type</label>
                                <select id="property" class="form-select" selected>
                                    <option value="${rates[0].property_id}" selected>${rates[0].property_name}</option>
                                </select>
                            </div>
                            <label class="form-label mb-0 underline-label"></label>
                            <div class="col-md-6">
                                <label class="form-label">Minimun Rate</label>
                                <input type="text" class="form-control" id="edit_minimum_rate" value="${rates[0].minimum_rate}" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">11 to 20 +Rate</label>
                                <input type="text" class="form-control" id="edit_second_rate" value="${rates[0].second_rate}" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">21 to 30 +Rate</label>
                                <input type="text" class="form-control" id="edit_third_rate" value="${rates[0].third_rate}" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">31 and above +Rate</label>
                                <input type="text" class="form-control" id="edit_last_rate" value="${rates[0].last_rate}" required>
                            </div>
                                            
                            <div class="col-12 mt-5">
                                <button type="submit" class="btn btn-primary w-100" onclick="submit_edit_rate(event,${rates[0].rate_id})">Submit form</button>
                            </div>
                        </form>
                    </div>
                `;
                document.getElementById("modalContents").innerHTML = html;

                // Trigger the modal
                var myModal = new bootstrap.Modal(document.getElementById('myModals'), {});
                myModal.show();
                
                getProperty();
            }
        } catch (error) {
            document.getElementById("modalContents").innerHTML = `<h2>No Record</h2>`;
        }

      }).catch((error) => {
        alert(`ERROR OCCURRED! ${error}`);
    });
}
const submit_edit_rate = (event, rate_id) => {
    event.preventDefault();
    console.log('RATE ID: ',rate_id)
    const propertyId = document.getElementById("property").value;
    const minimum_rate = document.getElementById("edit_minimum_rate").value;
    const second_rate = document.getElementById("edit_second_rate").value;
    const third_rate = document.getElementById("edit_third_rate").value;
    const last_rate = document.getElementById("edit_last_rate").value;
  
    if (
      propertyId === "" ||
      minimum_rate === "" ||
      second_rate === "" ||
      third_rate === "" ||
      last_rate === ""
    ) {
      alert("Fill in all fields");
      return;
    }
  
    const myUrl = "http://152.42.243.189/waterworks/admin/update_api/update_rate.php";
    const formData = new FormData();
    formData.append("rate_id", rate_id);
    formData.append("propertyId", propertyId);
    formData.append("minimum_rate", minimum_rate);
    formData.append("second_rate", second_rate);
    formData.append("third_rate", third_rate);
    formData.append("last_rate", last_rate);
    formData.append("employee_Id", sessionStorage.getItem("accountId"));

    console.log(rate_id, propertyId, minimum_rate, second_rate, third_rate, last_rate, sessionStorage.getItem("accountId"))
  
    axios({
      url: myUrl,
      method: "post",
      data: formData,
    })
      .then((response) => {
        console.log(response);
        if (response.data.status === 1) {
          success_modals();
          displayRate();
          //   window.location.href = "./addrate.html";
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
  const closeModal = () => {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
  
    const head = document.getElementById("head");
    const paginationNumbers = document.getElementById("paginationNumbers");
    const searchInput = document.getElementById("searchInput");
    head.style.display = "block";
  };