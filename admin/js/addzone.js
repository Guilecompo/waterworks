let currentPage = 1;
let zones = [];

const onLoad = () => {
  document.getElementById("ngalan").innerText =
    sessionStorage.getItem("fullname");
  add_zones();
  displayZones();
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
      <h5 class="modal-title " style="color: red; text-align:center;">Zone already exists !</h5>
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
const add_zones = () => {
  var html = `
        <div class="mb-1 mt-4">
            <h4 style="text-align: center;">Add Zone</h4>
        </div>
        <div class="container-fluid mt-3">
            <form class="row g-3">
                <label class="form-label mb-0 underline-label">Register Zone</label>
                <div class="col-md-6 ">
                    <label class="form-label">Municipality</label>
                    <select id="municipality" class="form-select" onchange="getBarangay()"></select>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Barangay</label>
                    <select id="barangay" class="form-select" >
                        <option value="">Select Barangay</option>
                    </select>
                </div>
                <div class="col-md-12">
                    <label class="form-label">Zone Name</label>
                    <input type="text" class="form-control" id="add_zone" required>
                </div>
                <div class="col-12 mt-3">
                    <button type="submit" class="btn btn-primary" onclick="submit_zone(event)">Submit form</button>
                </div>
            </form>
        </div>                        
        `;
  document.getElementById("mainDiv").innerHTML = html;

  getMunicipality();
};
const submit_zone = (event) => {
  event.preventDefault();

  const barangayId = document.getElementById("barangay").value;
  const add_zone = document.getElementById("add_zone").value;

  if (add_zone === "" || barangayId === "") {
    alert("Fill in all fields");
    return;
  }

  const myUrl = "http://localhost/waterworks/admin/add_zone.php";
  const formData = new FormData();
  formData.append("barangayId", barangayId);
  formData.append("add_zone", add_zone);
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
        displayZones();
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
    data: formData,
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
// ------------------------------FOR TABLE--------------------------------------------------------------

const displayZones = () => {
  var url = "http://localhost/waterworks/admin/zonelist.php";

  const formData = new FormData();
  formData.append("accountId", sessionStorage.getItem("accountId"));

  axios({
    url: url,
    method: "post",
    data: formData,
  })
    .then((response) => {
      zones = response.data;
      console.log(zones);

      if (!Array.isArray(zones) || zones.length === 0) {
        errorTable();
      } else {
        sortZonesByName();
        showZonePage(currentPage);
      }
    })
    .catch((error) => {
      alert("ERRORSS! - " + error);
    });
};

const sortZonesByName = () => {
  zones.sort((a, b) => {
    // Extract numeric part from the zone name and compare
    const aNumber = parseInt(a.zone_name.match(/\d+/)[0]);
    const bNumber = parseInt(b.zone_name.match(/\d+/)[0]);
    return aNumber - bNumber;
  });
};
const showNextPage = () => {
  const nextPage = currentPage + 1;
  const start = (nextPage - 1) * 10;
  const end = start + 10;
  const activitiesOnNextPage = zones.slice(start, end);

  if (activitiesOnNextPage.length > 0) {
    currentPage++;
    showZonePage(currentPage);
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
    showZonePage(currentPage);
  } else {
    alert("You are on the first page.");
  }
};
const showZonePage = (page, zonesToDisplay = zones) => {
  var start = (page - 1) * 10;
  var end = start + 10;
  var displayedzones = zonesToDisplay.slice(start, end);
  refreshTable(displayedzones);
  showPaginationNumbers(page, Math.ceil(zonesToDisplay.length / 10));
};

const showPaginationNumbers = (currentPage, totalPages) => {
  const paginationNumbersDiv = document.getElementById("paginationNumbers");
  let paginationNumbersHTML = "";

  const pagesToShow = 3; // Number of pages to display

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
      paginationNumbersHTML += `<span class="active" onclick="goToPage(${i})">${i}</span>`;
    } else {
      paginationNumbersHTML += `<span onclick="goToPage(${i})">${i}</span>`;
    }
  }

  // Next button
  paginationNumbersHTML += `<button onclick="showNextPage()">Next</button>`;

  paginationNumbersDiv.innerHTML = paginationNumbersHTML;
};

const goToPage = (pageNumber) => {
  showZonePage(pageNumber);
};

const errorTable = () => {
  var html = `
      
      <table class="table" >
        <thead>
          <tr>
            <th scope="col" >Zone</th>
            <th scope="col">Barangay</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        </table>`;

  document.getElementById("mainDivs").innerHTML = html;
};
const refreshTable = (barangayList) => {
  var html = `
      <table class="table mb-0 mt-0">
        <thead>
          <tr>
            <th scope="col">Zone</th>
            <th scope="col">Barangay</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
    `;
  barangayList.forEach((employee) => {
    html += `
        <tr>
          <td>${employee.zone_name}</td>
          <td>${employee.barangay_name}</td>
          <td>
            <button class="clear" onclick="edit(${employee.zone_id})">Edit</button>  
          </td>
        </tr>
      `;
  });

  html += `</tbody></table>`;

  document.getElementById("mainDivs").innerHTML = html;
};

// ---------------------------------------------FOR EDIT-----------------------------------------------------
const edit = (zone_id) => {
  console.log(zone_id);

  var myUrl = "http://localhost/waterworks/admin/getzone.php";
  const formData = new FormData();
  formData.append("zone_id", zone_id);

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
          var zones = response.data;
          console.log("zones : ", zones);
          var html = `
                    <div class=" row  mt-3">
                          <div class="col-md-1">
                              <button class="clear" onclick="add_zones()">Back</button>
                          </div>
                          <div class="col-md-11">
                              <h4 style="text-align: center;">Edit Zone</h4>
                          </div>
                        </div>
                    <div class="container-fluid mt-3">
                        <form class="row g-3">
                            <label class="form-label mb-0 underline-label">Edit Zone</label>
                            <div class="col-md-6 ">
                                <label class="form-label">Municipality</label>
                                <select id="municipalities" class="form-select" onchange="getBarangay1()">
                                  <option value="${zones[0].municipality_id}" selected>${zones[0].municipality_name}</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Barangay</label>
                                <select id="barangays" class="form-select" >
                                <option value="${zones[0].barangay_id}" selected>${zones[0].barangay_name}</option>
                                </select>
                            </div>
                            <div class="col-md-12">
                                <label class="form-label">Zone Name</label>
                                <input type="text" class="form-control" id="edited_zone" value="${zones[0].zone_name}" required>
                            </div>
                            <div class="col-12 mt-3">
                                <button type="submit" class="btn btn-primary" onclick="submit_edit_zone(event, ${zones[0].zone_id})">Submit Edit</button>
                            </div>
                        </form>
                    </div>  
                    `;
          document.getElementById("mainDiv").innerHTML = html;

          getMunicipality1();
        }
      } catch (error) {
        var html = `<h2>NO RECORD</h2>`;
      }
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
    });
};
const submit_edit_zone = (event, zone_id) => {
  event.preventDefault();

  const municipalityId = document.getElementById("municipalities").value;
  const barangayId = document.getElementById("barangays").value;
  const edited_zone = document.getElementById("edited_zone").value;
  console.log("barangay ID: ", barangayId);
  console.log("Zone Name : ", edited_zone);

  if (barangayId === "" || municipalityId === "" || edited_zone === "") {
    alert("Fill in all fields");
    return;
  }

  const myUrl = "http://localhost/waterworks/admin/update_api/update_zone.php";
  const formData = new FormData();
  formData.append("zone_id", zone_id);
  formData.append("municipalityId", municipalityId);
  formData.append("barangayId", barangayId);
  formData.append("edited_zone", edited_zone);
  formData.append("employee_Id", sessionStorage.getItem("accountId"));

  axios({
    url: myUrl,
    method: "post",
    data: formData,
  })
    .then((response) => {
      console.log(response);
      console.log("Responses : ", response);
      if (response.data.status === 1) {
        success_update_modal();
        console.log("success update");
        displayZones();
        //window.location.href = "./addconsumer.html";
      } else if (response.data.status === 0) {
        // alert("Username or phone number already exists!");
        failed_update_modal();
        console.log(response.data);
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

const getMunicipality1 = () => {
  const municipalitySelect = document.getElementById("municipalities");
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
      getBarangay1();
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
    });
};
const getBarangay1 = () => {
  const selectedMunicipalityId =
    document.getElementById("municipalities").value;

  const barangayUrl = `http://localhost/waterworks/gets/get_barangay.php`;
  const formData = new FormData();

  // Use selectedMunicipalityId directly
  formData.append("municipalityId", selectedMunicipalityId);

  axios({
    url: barangayUrl,
    method: "post",
    data: formData,
  })
    .then((response) => {
      const barangaysSelect = document.getElementById("barangays");
      const barangays = response.data;
      console.log("success barangay");
      // Clear existing options
      barangaysSelect.innerHTML = "";

      // Populate options for barangays
      barangays.forEach((barangays) => {
        const options = document.createElement("option");
        options.value = barangays.barangay_id;
        options.textContent = barangays.barangay_name;
        barangaysSelect.appendChild(options);
      });
    })
    .catch((error) => {
      alert(`ERROR OCCURRED while fetching barangays! ${error}`);
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
    <h5 class="modal-title " style="color: red; text-align:center;">Zone already exists !</h5>
`;
  modalContent.innerHTML = html;
  modal.style.display = "block";
};
