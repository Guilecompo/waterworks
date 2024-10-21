let employees = [];

const onLoad = () => {
  var accountId = sessionStorage.getItem("accountId");
  if (!accountId || accountId === "0") {
      window.location.href = "/waterworks/";
  } else {
    document.getElementById("ngalan").innerText =
    sessionStorage.getItem("fullname");
    displayAssigned();
  }
  
};

const displayAssigned = () => {
    const head = document.getElementById("head");
    head.style.display = "block";
  
    var url = "http://152.42.243.189/waterworks/admin/get_assigned.php";
    const formData = new FormData();
    formData.append("accountId", sessionStorage.getItem("accountId"));
    axios({
      url: url,
      method: "post",
      data: formData,
    })
      .then((response) => {
        console.log(response.data);
        employees = response.data;
        if (!Array.isArray(employees) || employees.length === 0) {
          errorTable();
        } else {
          consumerRefreshTables(employees);
        }
      })
      .catch((error) => {
        console.log("ERROR! - " + error);
      });
  };
  const errorTable = () => {
    var html = `
          <table id="example" class="table table-striped table-bordered" style="width:100%">
            <thead>
              <tr>
                  <th class="text-center">Full Name</th>
                  <th class="text-center">Area</th>
                  <th class="text-center">Branch</th>
              </tr>
            </thead>
            </table>`;
  
    document.getElementById("mainDiv").innerHTML = html;
  };
  const consumerRefreshTables = (employees) => {
    var html = `
          <table id="example" class="table table-striped table-bordered" style="width:100%">
            <thead>
              <tr>
                <th class="text-center">Full Name</th>
                <th class="text-center">Area</th>
                <th class="text-center">Branch</th>
              </tr>
            </thead>
            <tbody>
          `;
          employees.forEach((employee) => {
      html += `
              <tr>
                <td class="text-center">${employee.firstname} ${employee.lastname}</td>
                <td class="text-center">${employee.zone_name}</td>
                <td class="text-center">${employee.branch_name}</td>
              </tr>
              `;
    });
    html += `</tbody></table>`;
    document.getElementById("mainDiv").innerHTML = html;
    $('#example').DataTable({
      "ordering": false // Disable sorting for all columns
    });
  };