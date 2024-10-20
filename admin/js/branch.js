const onLoad = () => {
    var accountId = sessionStorage.getItem("accountId");
    if (!accountId || accountId === "0") {
        window.location.href = "/waterworks/";
    } else {
      document.getElementById("ngalan").innerText =
      sessionStorage.getItem("fullname");
      displayBranch();
    }
   
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
          sortBranchByName();
          showBranchPage(currentPage);
        }
      })
      .catch((error) => {
        alert("ERRORSS! - " + error);
      });  
    };
    
    const sortBranchByName = () => {
      branches.sort((a, b) => {
      const nameA = (a.branch_name + ' ' + a.branch_name).toUpperCase();
      const nameB = (b.branch_name + ' ' + b.branch_name).toUpperCase();
      return nameA.localeCompare(nameB);
    });
    };
    const showNextPage = () => {
      const nextPage = currentPage + 1;
      const start = (nextPage - 1) * 10;
      const end = start + 10;
      const activitiesOnNextPage = branches.slice(start, end);
    
      if (activitiesOnNextPage.length > 0) {
          currentPage++;
          showBranchPage(currentPage);
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
          showBranchPage(currentPage);
      } else {
          alert("You are on the first page.");
      }
    };
    const showBranchPage = (page, branchesToDisplay = branches) => {
    var start = (page - 1) * 10;
    var end = start + 10;
    var displayedbranches = branchesToDisplay.slice(start, end);
    refreshTable(displayedbranches);
    showPaginationNumbers(page, Math.ceil(branchesToDisplay.length / 10));
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
      showBranchPage(pageNumber);
    };
    const errorTable = () =>{
        var html = `
        
        <table class="table" >
          <thead>
            <tr>
              <th scope="col" >Branch</th>
              <th scope="col" >Contact</th>
              <th scope="col" >Location</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          </table>`;
    
          document.getElementById("mainDiv").innerHTML = html;
      }
      const refreshTable = (barangayList) => {
      var html = `
        <table class="table mb-0 mt-0">
          <thead>
            <tr>
              <th scope="col" >Branch</th>
              <th scope="col" >Contact</th>
              <th scope="col" >Location</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
      `;
      barangayList.forEach((employee) => {
        html += `
          <tr>
            <td>${employee.branch_name}</td>
            <td>${employee.phone_num}</td>
            <td>${employee.zone_name} , ${employee.barangay_name}</td>
            <td>
              <button class="clear" onclick="edit(${employee.branch_id})">Edit</button>  
            </td>
          </tr>
        `;
      });
      
      html += `</tbody></table>`;
      
      document.getElementById("mainDiv").innerHTML = html;
      };