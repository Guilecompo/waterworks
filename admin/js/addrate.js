let currentPage = 1;
let rates = [];

const onLoad = () => {
  var accountId = sessionStorage.getItem("accountId");
  if (!accountId || accountId === "0") {
      window.location.href = "/waterworks/";
  } else {
    document.getElementById("ngalan").innerText =
    sessionStorage.getItem("fullname");
  add_rate();
  displayRate();
  }
  
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
                    <button type="submit" class="btn btn-primary" onclick="submit_rate(event)">Submit form</button>
                </div>
            </form>
        </div>                
        `;
  document.getElementById("mainDiv").innerHTML = html;

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

  const myUrl = "http://128.199.232.132/waterworks/admin/add_property_rate.php";
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
        success_modal();
        displayRate();
        //   window.location.href = "./addrate.html";
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
  var myUrl = "http://128.199.232.132/waterworks/gets/get_property.php";

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
// ------------------------------FOR TABLE--------------------------------------------------------------

const displayRate = () => {
  var url = "http://128.199.232.132/waterworks/admin/ratelist.php";

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
        sortRateByName();
        showRatePage(currentPage);
      }
    })
    .catch((error) => {
      alert("ERRORSS! - " + error);
    });
};

const sortRateByName = () => {
  rates.sort((a, b) => {
    const nameA = (a.position_name + " " + a.position_name).toUpperCase();
    const nameB = (b.position_name + " " + b.position_name).toUpperCase();
    return nameA.localeCompare(nameB);
  });
};
const showNextPage = () => {
  const nextPage = currentPage + 1;
  const start = (nextPage - 1) * 10;
  const end = start + 10;
  const activitiesOnNextPage = rates.slice(start, end);

  if (activitiesOnNextPage.length > 0) {
    currentPage++;
    showRatePage(currentPage);
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
    showRatePage(currentPage);
  } else {
    alert("You are on the first page.");
  }
};
const showRatePage = (page, ratesToDisplay = rates) => {
  var start = (page - 1) * 10;
  var end = start + 10;
  var displayedrates = ratesToDisplay.slice(start, end);
  refreshTable(displayedrates);
  showPaginationNumbers(page, Math.ceil(ratesToDisplay.length / 10));
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
  showRatePage(pageNumber);
};
const errorTable = () => {
  var html = `
      
      <table class="table " >
        <thead>
          <tr>
            <th scope="col" >Property Name</th>
            <th scope="col" >Minimum</th>
            <th scope="col" >11 - 20</th>
            <th scope="col" >21 - 30</th>
            <th scope="col" >31 & above</th>
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
            <th scope="col" >Property Name</th>
            <th scope="col" >Minimum</th>
            <th scope="col" >11 - 20</th>
            <th scope="col" >21 - 30</th>
            <th scope="col" >31 & above</th>
          </tr>
        </thead>
        <tbody>
    `;
  barangayList.forEach((employee) => {
    html += `
        <tr>
          <td>${employee.property_name}</td>
          <td>${employee.minimum_rate}</td>
          <td>${employee.second_rate}</td>
          <td>${employee.third_rate}</td>
          <td>${employee.last_rate}</td>
        </tr>
      `;
  });

  html += `</tbody></table>`;

  document.getElementById("mainDivs").innerHTML = html;
};

