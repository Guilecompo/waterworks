let currentPage = 1;
let employees = [];


const onLoad = () => {
  var accountId = sessionStorage.getItem("accountId");
  if (!accountId || accountId === "0") {
      window.location.href = "/waterworks/";
  } else {
     document.getElementById("ngalan").innerText =
    sessionStorage.getItem("fullname");

    displayVolumeReports();
  }
 
};

const displayVolumeReports = () => {
    var url = "http://152.42.243.189/waterworks/meterreader/volume.php";
    const formData = new FormData();
    formData.append("accountId", sessionStorage.getItem("accountId"));
  
    axios({
        url: url,
        method: "post",
        data: formData
    }).then((response) => {
        try {
            var records = response.data;
            console.log(records);
  
            // Get the current month and year
            const currentMonth = new Date().toLocaleString('default', { month: 'long' });
            const currentYear = new Date().getFullYear();
            const title = `TOTAL VOLUME FOR THE MONTH OF ${currentMonth.toUpperCase()} ${currentYear}`;
  
            // Construct the HTML with the new title above the table and buttons
            var html = `
                <div class="d-flex justify-content-evenly">
                    <button id="exportExcelBtn" class="btn btn-primary btn-sm mt-3">Export to Excel</button>
                    <button id="printBtn" class="btn btn-secondary btn-sm mt-3 ml-2">Print</button>
                </div>
                <div style="overflow-x: auto; -webkit-overflow-scrolling: touch; margin-top: 15px;">
                    <table id="example" class="table table-striped table-bordered" style="width:100%; margin-bottom: 0; white-space: nowrap;">
                        <thead>
                            <tr>
                                <th class="text-center" colspan="9">${title}</th>
                            </tr>
                            <tr>
                                <th class="text-center">BILLING ID</th>
                                <th class="text-center">BILLING DATE&TIME</th>
                                <th class="text-center">NAME</th>
                                <th class="text-center">METER</th>
                                <th class="text-center">ADDRESS</th>
                                <th class="text-center">PREVIOUS</th>
                                <th class="text-center">PRESENT</th>
                                <th class="text-center">CONSUMED</th>
                                <th class="text-center">REMARKS</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            let totalConsumed = 0;
            records.forEach((record) => {
                html += `
                    <tr>
                        <td class="text-center">${record.billing_uniqueId}</td>
                        <td class="text-center">${record.reading_date}</td>
                        <td class="text-center">${record.lastname}, ${record.firstname}</td>
                        <td class="text-center">${record.meter_no}</td>
                        <td class="text-center">${record.zone_name}, ${record.barangay_name}</td>
                        <td class="text-center">${record.previous_meter}</td>
                        <td class="text-center">${record.present_meter}</td>
                        <td class="text-center">${record.cubic_consumed}</td>
                        <td class="text-center"></td>
                    </tr>
                `;
                totalConsumed += parseFloat(record.cubic_consumed);
            });
  
            html += `
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="7" class="text-right"><strong>Total Consumed:</strong></td>
                            <td class="text-center"><strong>${totalConsumed}</strong></td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            `;

            // Display the table
            document.getElementById("mainDiv").innerHTML = html;
            
            // Initialize DataTable (optional, if you need sorting or other features)
            $('#example').DataTable({
                "ordering": false // Disable sorting for all columns
            });
  
            // Add event listener to the export button
            document.getElementById("exportExcelBtn").addEventListener("click", function() {
                exportVolumeToExcel(records, totalConsumed, title);
            });
  
            // Add event listener to the print button
            document.getElementById("printBtn").addEventListener("click", function() {
                printVolumeReport(records, title);
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


  const exportVolumeToExcel = (records, totalConsumed, title) => {
    var wb = XLSX.utils.book_new();
    var rows = [
        // Add the title row, merged across all columns (9 columns in this case)
        [{ v: title, t: 's', s: { alignment: { horizontal: 'center' }, font: { bold: true, size: 14 } } }],
    ];
  
    // Add the header row
    rows.push(['BILLING ID', 'BILLING DATE&TIME', 'NAME', 'METER', 'ADDRESS', 'PREVIOUS', 'PRESENT', 'CONSUMED', 'REMARKS']);
  
    // Add the record data
    records.forEach((record) => {
        rows.push([
            record.billing_uniqueId,
            record.reading_date,
            `${record.lastname}, ${record.firstname}`,
            record.meter_no,
            `${record.zone_name}, ${record.barangay_name}`,
            record.previous_meter,
            record.present_meter,
            record.cubic_consumed
        ]);
    });
  
    // Add the total row (the last row)
    rows.push([
        'Total Consumed:', '', '', '', '', '', '', totalConsumed, ''
    ]);
  
    var ws = XLSX.utils.aoa_to_sheet(rows);
  
    // Set column widths
    ws['!cols'] = [
        { wch: 15 }, { wch: 30 }, { wch: 25 }, { wch: 15 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
    ];
  
    // Merge the title across all columns (from column 0 to 8, which are the total 9 columns in the table)
    ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }
    ];
  
    XLSX.utils.book_append_sheet(wb, ws, "Volume Report");
  
    // Write the Excel file
    XLSX.writeFile(wb, "volume_report.xlsx");
  };
  
  
  const printVolumeReport = (records, title) => {
    var printWindow = window.open('', '', 'height=600,width=800');
    var tableContent = document.getElementById("example").outerHTML;
  
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Arial, sans-serif; }');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-top: 20px; }');
    printWindow.document.write('th, td { padding: 8px; border: 1px solid #ddd; text-align: center; }');
    printWindow.document.write('th { background-color: #f2f2f2; font-weight: bold; }');
    printWindow.document.write('tfoot td { font-weight: bold; }');
    printWindow.document.write('</style></head><body>');
  
    printWindow.document.write(tableContent);
    printWindow.document.write('</body></html>');
  
    printWindow.document.close();
    printWindow.print();
  };