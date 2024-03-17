// Printing Functionality
function printTable() {
  // Hide non-table elements
  var nonTableElements = document.querySelectorAll('body > *:not(table)');
  nonTableElements.forEach(element => {
      element.style.display = 'none';
  });

  // Print the table
  window.print();

  // Restore display of non-table elements after printing
  nonTableElements.forEach(element => {
      element.style.display = '';
  });
}

// Execute onLoad function when the page is loaded
window.onload = function() {
  onLoad();
};

// Function to load data and display payment reports
const onLoad = () => {
  document.getElementById("ngalan").innerText = sessionStorage.getItem("fullname");
  displayPaymentReports();
};

// Function to display payment reports
const displayPaymentReports = () => {
  var url = "http://128.199.232.132/waterworks/admin/reports.php";

  axios({
      url: url,
      method: "post",
  }).then((response) => {
      try {
          var records = response.data;
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
                      <td class="text-center">${record.con_lastname}, ${record.con_firstname}</td>
                      <td class="text-center">${record.zone_name}</td>
                      <td class="text-center">${record.or_num}</td>
                      <td class="text-center">${record.pay_amount}</td>
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
