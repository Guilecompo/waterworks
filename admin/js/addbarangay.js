let currentPage = 1;
let barangays = [];

const onLoad = () => {
  document.getElementById("ngalan").innerText =
    sessionStorage.getItem("fullname");
  add_barangay();
  displayBarangay();
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
      <h5 class="modal-title " style="color: red; text-align:center;">Barangay already exists !</h5>
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
const add_barangay = () => {
  var html = `
        <div class="mb-1 mt-5">
            <h4 style="text-align: center;">Add Barangay</h4>
        </div>
        <div class="container-fluid mt-3">
            <form class="row g-3">
                <label class="form-label mb-0 underline-label">Register Barangay</label>
                <div class="col-md-6 ">
                    <label class="form-label">Municipality</label>
                    <select id="municipality" class="form-select" ></select>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Barangay Name</label>
                    <input type="text" class="form-control" id="add_barangay" required>
                </div>
                <div class="col-12 mt-5">
                    <button type="submit" class="btn btn-primary" onclick="submit_barangay(event)">Submit form</button>
                </div>
            </form>
        </div>                        
        `;
  document.getElementById("mainDiv").innerHTML = html;

  getMunicipality();
};
const submit_barangay = (event) => {
  event.preventDefault();

  const municipalityId = document.getElementById("municipality").value;
  const add_barangay = document.getElementById("add_barangay").value;

  if (add_barangay === "" || municipalityId === "") {
    alert("Fill in all fields");
    return;
  }

  const myUrl = "http://localhost/waterworks/admin/add_barangay.php";
  const formData = new FormData();
  formData.append("municipalityId", municipalityId);
  formData.append("add_barangay", add_barangay);
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
        displayBarangay();
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
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
    });
};
// ---------------------------------------------FOR TABLE-----------------------------------------------------

const displayBarangay = () => {
  var url = "http://localhost/waterworks/admin/barangaylist.php";

  const formData = new FormData();
  formData.append("accountId", sessionStorage.getItem("accountId"));

  axios({
    url: url,
    method: "post",
    data: formData,
  })
    .then((response) => {
      barangays = response.data;
      console.log(barangays);

      if (!Array.isArray(barangays) || barangays.length === 0) {
        errorTable();
      } else {
        sortBarangayByName();
        showBarangayPage(currentPage);
      }
    })
    .catch((error) => {
      alert("ERRORSS! - " + error);
    });
};

const sortBarangayByName = () => {
  barangays.sort((a, b) => {
    const nameA = (a.barangay_name + " " + a.barangay_name).toUpperCase();
    const nameB = (b.barangay_name + " " + b.barangay_name).toUpperCase();
    return nameA.localeCompare(nameB);
  });
};
const showNextPage = () => {
  const nextPage = currentPage + 1;
  const start = (nextPage - 1) * 10;
  const end = start + 10;
  const activitiesOnNextPage = barangays.slice(start, end);

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
const showBarangayPage = (page, barangaysToDisplay = barangays) => {
  var start = (page - 1) * 10;
  var end = start + 10;
  var displayedBarangays = barangaysToDisplay.slice(start, end);
  refreshTable(displayedBarangays);
  showPaginationNumbers(page, Math.ceil(barangaysToDisplay.length / 10));
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
  showBarangayPage(pageNumber);
};

const errorTable = () => {
  var html = `
        
        <table class="table" >
          <thead>
            <tr>
              <th scope="col" >Barangay Name</th>
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
              <th scope="col">Barangay Name</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
      `;
  barangayList.forEach((employee) => {
    html += `
          <tr>
            <td>${employee.barangay_name}</td>
            <td>
              <button class="clear" onclick="edit(${employee.barangay_id})">Edit</button>  
            </td>
          </tr>
        `;
  });

  html += `</tbody></table>`;

  document.getElementById("mainDivs").innerHTML = html;
};

// ---------------------------------------------FOR EDIT-----------------------------------------------------
const edit = (barangay_id) => {
  var myUrl = "http://localhost/waterworks/admin/getbarangay.php";
  const formData = new FormData();
  formData.append("barangay_id", barangay_id);

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
          var barangay = response.data;
          console.log("Barangay : ", barangay);
          var html = `
                      <div class=" row  mt-3">
                        <div class="col-md-1">
                          <button class="clear" onclick="add_barangay()">Back</button>
                        </div>
                        <div class="col-md-11">
                          <h4 style="text-align: center;">Edit Barangay</h4>
                        </div>
                      </div>
                        <div class="container-fluid mt-3">
                            <form class="row g-3">
                                <label class="form-label mb-0 underline-label">Edit Barangay</label>
                                <div class="col-md-5 ">
                                    <label class="form-label">Municipality</label>
                                    <select id="municipality"  class="form-select" >
                                      <option value="${barangay[0].municipality_id}" selected>${barangay[0].municipality_name}</option>
                                    </select>
                                </div>
                                <div class="col-md-7">
                                    <label class="form-label">Barangay Name</label>
                                    <input type="text" id="update_barangay" class="form-control" value="${barangay[0].barangay_name}" required>
                                </div>
                                <div class="col-12 mt-5">
                                    <button class="btn btn-primary" onclick="submit_edit_barangay(event, ${barangay[0].barangay_id})">Submit Edit</button>
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
const submit_edit_barangay = (event, barangay_id) => {
  event.preventDefault();

  const municipalityId = document.getElementById("municipality").value;
  const add_barangay = document.getElementById("update_barangay").value;
  console.log("municipality ID: ", municipalityId);
  console.log("barangay Name : ", add_barangay);

  if (add_barangay === "" || municipalityId === "") {
    alert("Fill in all fields");
    return;
  }

  const myUrl =
    "http://localhost/waterworks/admin/update_api/update_barangay.php";
  const formData = new FormData();
  formData.append("barangay_id", barangay_id);
  formData.append("municipalityId", municipalityId);
  formData.append("add_barangay", add_barangay);
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
        displayBarangay();
        //window.location.href = "./addconsumer.html";
      } else if (response.data.status === 0) {
        // alert("Username or phone number already exists!");
        console.log(response.data);
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

const getMunicipality1 = () => {
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
    <h5 class="modal-title " style="color: red; text-align:center;">Barangay already exists !</h5>
`;
  modalContent.innerHTML = html;
  modal.style.display = "block";
};
