let currentPage = 1;
let employees = [];


const onLoad = () => {
  document.getElementById("ngalan").innerText =
    sessionStorage.getItem("fullname");

    displayPaymentReports();
};

const showNextPage = () => {
  currentPage++;
  showEmployeePage(currentPage);
};

const showPreviousPage = () => {
  if (currentPage > 1) {
    currentPage--;
    showEmployeePage(currentPage);
  } else {
    alert("You are on the first page.");
  }
};

const displayPaymentReports = () => {
  var url = "http://128.199.232.132/waterworks/admin/reports.php";

  axios({
      url: url,
      method: "post",
  }).then((response) => {
      try {
          var records = response.data;
          console.log(records);
          var html = `
              <table id="example" class="table table-striped table-bordered" style="width:100%">
                  <thead>
                      <tr>
                          <th class="text-center">NAME</th>
                          <th class="text-center">ZONE</th>
                          <th class="text-center">OR #</th>
                          <th class="text-center">AMOUNT</th>
                      </tr>
                  </thead>
                  <tbody>
          `;
          records.forEach((record) => {
              html += `
                  <tr>
                      <td>${record.con_lastname}, ${record.con_firstname}</td>
                      <td>${record.zone_name}</td>
                      <td>${record.or_num}</td>
                      <td>${record.pay_amount}</td>
                  </tr>
              `;
          });
          html += `
                  </tbody>
              </table>
          `;
          document.getElementById("mainDiv").innerHTML = html;
          $('#example').DataTable({
              "ordering": false // Disable sorting for all columns
          });
      } catch (error) {
          var html = `<h2>No Records</h2>`;
          document.getElementById("mainDiv").innerHTML = html;
          console.log(error);
      }
  }).catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
  });
};


