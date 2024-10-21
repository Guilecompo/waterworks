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
                  <th class="text-center">Action</th>
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
                <th class="text-center">Action</th>
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
                <td class="text-center">
                    <button style="background-color: #b91c1c; border: none; padding: 5px; border-radius: 12%; color:white;" class="clear" onclick="remove_assigned(${employee.user_id})">Remove</button>
                </td>
              </tr>
              `;
    });
    html += `</tbody></table>`;
    document.getElementById("mainDiv").innerHTML = html;
    $('#example').DataTable({
      "ordering": false // Disable sorting for all columns
    });
  };

  const remove_assigned = (user_id) => {
    console.log('You remove :', user_id);
  }