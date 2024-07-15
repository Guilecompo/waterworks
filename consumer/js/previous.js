const onLoad = () => {
    var accountId = sessionStorage.getItem("accountId");
  if (!accountId || accountId === "0") {
      window.location.href = "/waterworks/";
  } else {
    document.getElementById("ngalan").innerText = sessionStorage.getItem("fullname");
    document.getElementById("fullname").innerText = sessionStorage.getItem("fullname");
    document.getElementById("meter_no").innerText = sessionStorage.getItem("meter");
    view_consumer();
  }
    
}

const view_consumer  = () => {
    var myUrl = "http://152.42.243.189/waterworks/consumer/consumer_billing_history.php";
    const formData = new FormData();
    formData.append("accId", sessionStorage.getItem("accountId"));
    console.log(sessionStorage.getItem("accountId"));
  
    axios({
        url: myUrl,
        method: "post",
        data: formData,
    }).then((response) => {
  
        try {
          
            if (response.data.length === 0) {
                // Display a message indicating there are no billing transactions yet.
                var html = `<h2>No Records</h2>`;
                document.getElementById("mainDiv").innerHTML = html;
            } else {
                var records = response.data;
                // Add a single "Connected Meter" heading
                html = ``;
                
                html += 
                `
                <table class=" table">
                <thead>
                    <tr>
                        <th scope="col">Reading Date</th>
                        <th scope="col">Total Bill</th>
                        <th scope="col">Reader Name</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                `;
                
                records.forEach((record) => {
                    html += 
                    `
                        <tr>
                            <td>${record.reading_date}</td>
                            <td>${record.total_bill}</td>
                            <td>${record.emp_firstname} ${record.emp_lastname}</td>
                            <td><button class="butts" onclick="bill_receipt(${record.billing_id}, ${record.update_status_id})">View</button></td>
                        </tr>
                    `;
                });
                
  
                html += `</tbody></table><br/><br/>`;
                document.getElementById("mainDiv").innerHTML = html;
            }
        } catch (error) {
            // Handle any errors here
            html = ``;
                
                html += 
                `
                <table class="tab table">
                <thead>
                    <tr>
                        <th scope="col">Reading Date</th>
                        <th scope="col">Cubic Consumed</th>
                        <th scope="col">Arrears</th>
                        <th scope="col">Penalty</th>
                        <th scope="col">Total Bill</th>
                        <th scope="col">Reader Name</th>
                    </tr>
                </thead>
                <tbody>
                <tr>
                    <td>NO RECORDS</td>
                    <td>NO RECORDS</td>
                    <td>NO RECORDS</td>
                    <td>NO RECORDS</td>
                    <td>NO RECORDS</td>
                    <td>NO RECORDS</td>
                </tr>
                `;
                html += `</tbody></table><br/><br/>`;
                document.getElementById("mainDiv").innerHTML = html;
                console.log(error);
        }
    }).catch((error) => {
        alert(`ERROR OCCURRED! ${error}`);
    });
  };

  const bill_receipt  = (billing_id, update_status_id) => {
    const modal = document.getElementById("myModal");
    const modalContent = document.getElementById("modalContent");
  
  
    var myUrl = "http://152.42.243.189/waterworks/consumer/consumer_billing_history1.php";
    const formData = new FormData();
    formData.append("update_status_id", update_status_id);
    formData.append("billing_id", billing_id);
    console.log("update_status_id  : ", update_status_id);
    console.log("billing_id  : ", billing_id);
  
    axios({
        url: myUrl,
        method: "post",
        data: formData,
    }).then((response) => {
  
        try {
          
            if (response.data.length === 0) {
                // Display a message indicating there are no billing transactions yet.
                var html = `<h2>No Records</h2>`;
            } else {
                var records = response.data;
  
                html = `
                  <div class="wrapper">
                    <div class="container mt-0 ">
                        <div class="row ">
                                <div class="row ">
                                    <div class="text-center ">
                                        <h5 class="pe-4">EL SALVADOR WATERWORKS</h5>
                                    </div>
                                    <div class="col-sm-12 mt-3">
                                        <div class="row ">
                                            <div class="col-md-6 ">
                                                <p style="text-decoration: underline; font-size: small">NAME</p>
                                                <h6 class="text-muted mt-0">${records[0].con_firstname} ${records[0].con_middlename} ${records[0].con_lastname}</h6>
                                            </div>
                                    
                                            <div class="col-md-6  text-md-end">
                                                <p style="text-decoration: underline; font-size: small">ACCOUNT NUMBER</p>
                                                <h6 class="text-muted mt-0">${records[0].meter_no}</h6>
                                            </div>
                                        </div>
                                    
                                        <div class="mt-1">
                                            <p style="text-decoration: underline; font-size: small">ADDRESS</p>
                                            <h6 class="text-muted mt-0">${records[0].zone_name} ${records[0].barangay_name} ${records[0].municipality_name}</h6>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div class="row">
                                    
                                    </span>
                                    <table class="tab table table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th class="text-center">Previous</th>
                                                <th class="text-center">Present</th>
                                                <th class="text-center">Consumed</th>
                                                <th class="text-center">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class="col-md-3 text-center">${records[0].previous_meter}</td>
                                                <td class="col-md-3 text-center">${records[0].present_meter}</td>
                                                <td class="col-md-3 text-center">${records[0].cubic_consumed}</td>
                                                <td class="col-md-3 text-center">${records[0].bill_amount}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table class="tabb1 table table-hover table-fixed">
                                        <tbody>
                                            <tr>
                                                <td class="col-md-5 text-start border-0 ">
                                                    <p>
                                                        <strong style="font-size: small">ARREARS </strong>
                                                    </p>
                                                    <p>
                                                        <strong style="font-size: small">AMOUNT UNTIL DUE DATE </strong>
                                                    </p>
                                                </td>
                                                <td class="col-md-1 border-0"></td>
                                                <td class="col-md-3 border-0"></td>
                                                <td class="col-md-3 text-center border-0">
                                                    <p>
                                                        <strong>${records[0].arrears}</strong>
                                                    </p>
                                                    <p>
                                                        <strong>${records[0].total_bill}</strong>
                                                    </p>
                                                    <p>
                                                        <strong>${records[0].update_status_name}</strong>
                                                    </p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>                                                     
                                    <table class="tabb2 table table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th class="text-center">Reading Date</th>
                                                <th class="text-center">Due Date</th>
                                                <th class="text-center">FOR THE MONTH OF</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class="col-md-4 text-center">${records[0].reading_date}</td>
                                                <td class="col-md-4 text-center">${records[0].due_date}</td>
                                                <td class="col-md-4 text-center">${records[0].formatted_reading_date2}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                        </div>
                    </div>
                </div>
                `;
  
                
            }
        } catch (error) {
            // Handle any errors here
            console.log(error);
            html = `
                  <div class="wrapper">
                    <div class="container mt-0 ">
                        <div class="row ">
                                <div class="row ">
                                    <div class="text-center ">
                                        <h5 class="pe-4">EL SALVADOR WATERWORKS</h5>
                                    </div>
                                    <div class="col-sm-12 mt-3">
                                        <div class="row ">
                                            <div class="col-md-6">
                                                <p style="text-decoration: underline; font-size: small">NAME</p>
                                                <h6 class="text-muted mt-0">NO RECORDS</h6>
                                            </div>
                                    
                                            <div class="col-md-6  text-md-end">
                                                <p style="text-decoration: underline; font-size: small">ACCOUNT NUMBER</p>
                                                <h6 class="text-muted mt-0">NO RECORDS</h6>
                                            </div>
                                        </div>
                                    
                                        <div class="mt-1">
                                            <p style="text-decoration: underline; font-size: small">ADDRESS</p>
                                            <h6 class="text-muted mt-0">NO RECORDS</h6>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div class="row">
                                    
                                    </span>
                                    <table class="tab table table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th class="text-center">Previous</th>
                                                <th class="text-center">Present</th>
                                                <th class="text-center">Consumed</th>
                                                <th class="text-center">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class="col-md-3 text-center">NO RECORDS</td>
                                                <td class="col-md-3 text-center">NO RECORDS</td>
                                                <td class="col-md-3 text-center">NO RECORDS</td>
                                                <td class="col-md-3 text-center">NO RECORDS</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table class="tabb1 table table-hover table-fixed">
                                        <tbody>
                                            <tr>
                                                <td class="col-md-3 text-start border-0 ">
                                                    <p >
                                                        <strong>Arrears: </strong>
                                                    </p>
                                                    <p>
                                                        <strong >Total Amount: </strong>
                                                    </p>
                                                </td>
                                                <td class="col-md-3 border-0"></td>
                                                <td class="col-md-3 border-0"></td>
                                                <td class="col-md-3 text-center border-0">
                                                    <p>
                                                        <strong>NO RECORDS</strong>
                                                    </p>
                                                    <p>
                                                        <strong>NO RECORDS</strong>
                                                    </p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>                                                     
                                    <table class="tabb2 table table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th class="text-center">Reading Date</th>
                                                <th class="text-center">Due Date</th>
                                                <th class="text-center">FOR THE MONTH OF</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class="col-md-4 text-center">NO RECORDS</td>
                                                <td class="col-md-4 text-center">NO RECORDS</td>
                                                <td class="col-md-4 text-center">NO RECORDS</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                        </div>
                    </div>
                </div>
                `;
        }
  
        modalContent.innerHTML = html;
        modal.style.display = "block";
    }).catch((error) => {
        alert(`ERROR OCCURRED! ${error}`);
    });
  };

  const closeModal = () => {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
  
    const head = document.getElementById("head");
    const close_butt = document.getElementById("close_butt");
    close_butt.style.display = "flex";
    head.style.display = "block";
  
  };