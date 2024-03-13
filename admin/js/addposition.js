let currentPage = 1;
let positions = [];

const onLoad = () => {
  document.getElementById("ngalan").innerText = sessionStorage.getItem("fullname");
    add_position();
    displayPosition();
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
  const add_position = () => {
        var html = `
        <div class="mb-1 mt-3">
            <h4 style="text-align: center;">Add Position</h4>
        </div>
        <div class="container-fluid mt-3">
            <form class="row g-3">
                <label class="form-label mb-0 underline-label">Register Position</label>
                <div class="col-md-10">
                    <label class="form-label">Position Name</label>
                    <input type="text" class="form-control" id="add_position" required>
                </div>
                <div class="col-12 mt-5">
                    <button type="submit" class="btn btn-primary" onclick="submit_position(event)">Submit form</button>
                </div>
            </form>
        </div>                        
        `;
        document.getElementById("mainDiv").innerHTML = html;
        
    };
    const submit_position = (event) => {
        event.preventDefault();

        const add_position = document.getElementById("add_position").value;
    
      if (add_position === '') {
        alert('Fill in all fields');
        return;
      }
    
      const myUrl = "http://128.199.232.132/waterworks/admin/add_position.php";
      const formData = new FormData();
      formData.append("add_position", add_position);
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
              displayPosition();
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
const displayPosition = () => {
  var url = "http://128.199.232.132/waterworks/admin/positionlist.php";
  
  const formData = new FormData();
  formData.append("accountId", sessionStorage.getItem("accountId"));
  
  axios({
    url: url,
    method: "post",
    data: formData
  })
    .then((response) => {
      positions = response.data;
      console.log(positions);
  
      if (!Array.isArray(positions) || positions.length === 0) {
        errorTable();
      } else {
        sortPositionByName();
        showPositionPage(currentPage);
      }
    })
    .catch((error) => {
      alert("ERRORSS! - " + error);
    });  
  };
  
  const sortPositionByName = () => {
    positions.sort((a, b) => {
    const nameA = (a.position_name + ' ' + a.position_name).toUpperCase();
    const nameB = (b.position_name + ' ' + b.position_name).toUpperCase();
    return nameA.localeCompare(nameB);
  });
  };
  const showNextPage = () => {
    const nextPage = currentPage + 1;
    const start = (nextPage - 1) * 10;
    const end = start + 10;
    const activitiesOnNextPage = positions.slice(start, end);
  
    if (activitiesOnNextPage.length > 0) {
        currentPage++;
        showPositionPage(currentPage);
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
        showPositionPage(currentPage);
    } else {
        alert("You are on the first page.");
    }
  };
  const showPositionPage = (page, positionsToDisplay = positions) => {
  var start = (page - 1) * 10;
  var end = start + 10;
  var displayedpositions = positionsToDisplay.slice(start, end);
  refreshTable(displayedpositions);
  showPaginationNumbers(page, Math.ceil(positionsToDisplay.length / 10));
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
    showPositionPage(pageNumber);
  };
  const errorTable = () =>{
      var html = `
      
      <table class="table" >
        <thead>
          <tr>
            <th scope="col" >Position</th>
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
            <th scope="col">Position</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
    `;
    barangayList.forEach((employee) => {
      html += `
        <tr>
          <td>${employee.position_name}</td>
          <td>
            <button class="clear" onclick="edit(${employee.position_id})">Edit</button>  
          </td>
        </tr>
      `;
    });
    
    html += `</tbody></table>`;
    
    document.getElementById("mainDivs").innerHTML = html;
    };
// ---------------------------------------------FOR EDIT-----------------------------------------------------
const edit = (position_id) => {

        var myUrl = "http://128.199.232.132/waterworks/admin/getposition.php";
        const formData = new FormData();
        formData.append("position_id", position_id);

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
                    var position = response.data;
                    console.log("Position : ",position);
                    var html = `
                        <div class=" row  mt-3">
                          <div class="col-md-1">
                              <button class="clear" onclick="add_position()">Back</button>
                          </div>
                          <div class="col-md-11">
                              <h4 style="text-align: center;">Edit Position</h4>
                          </div>
                        </div>
                        <div class="container-fluid mt-3">
                            <form class="row g-3">
                                <label class="form-label mb-0 underline-label">Edit Position</label>
                                <div class="col-md-10">
                                    <label class="form-label">Position Name</label>
                                    <input type="text" class="form-control" id="edit_position"  value="${position[0].position_name}" required>
                                </div>
                                <div class="col-12 mt-5">
                                    <button type="submit" class="btn btn-primary" onclick="submit_edit_position(event, ${position[0].position_id})">Submit form</button>
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
const submit_edit_position = (event, position_id) => {
  event.preventDefault();

  const add_position = document.getElementById("edit_position").value;

  if (add_position === '') {
      alert('Fill in all fields');
      return;
  }

  const myUrl = "http://128.199.232.132/waterworks/admin/update_api/update_position.php";
  const formData = new FormData();
  formData.append("position_id", position_id);
  formData.append("add_position", add_position);
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
        displayPosition();
        //window.location.href = "./addconsumer.html";
      } else if (response.data.status === 0) {
        // alert("Username or phone number already exists!");
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
    <h5 class="modal-title " style="color: red; text-align:center;">Position already exists !</h5>
`;
  modalContent.innerHTML = html;
  modal.style.display = "block";

};