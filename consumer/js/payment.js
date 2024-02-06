    const onLoad = () => {
        document.getElementById("ngalan").innerText = sessionStorage.getItem("fullname");
        document.getElementById("fullname").innerText = sessionStorage.getItem("fullname");
        document.getElementById("meter_no").innerText = sessionStorage.getItem("meter");
        view_consumer();
    }

    const view_consumer  = () => {
    
        var myUrl = "http://bsyzrflyvtz0qvuxpqgm-mysql.services.clever-cloud.com/waterworks.github.com/consumer/get_payment_history.php";
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
                } else {
                    var records = response.data;
                    console.log(records);
                    // Add a single "Connected Meter" heading
                    html = ``;
                    
                    html += 
                    `
                    <table class=" table">
                        <thead>
                            <tr>
                            <th scope="col">Payment Date</th>
                            <th scope="col">Payment Amount</th>
                            <th scope="col">Clerk Name</th>
                            <th scope="col">Action</th>
                            </tr>
                        </thead>
                    <tbody>
                    `;
                    
                    records.forEach((record) => {
                        html += 
                        `
                            <tr>
                                <td>${record.pay_date}</td>
                                <td>${record.pay_amount}</td>
                                <td>${record.emp_firstname} ${record.emp_lastname}</td>
                                <td><button class="butts" onclick="payment_receipt(${record.pay_id})">View</button></td>
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
                            <th scope="col">Payment Amount</th>
                            <th scope="col">Clerk Name</th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr>
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
    

    const payment_receipt  = (pay_id) => {
        const modal = document.getElementById("myModal");
        const modalContent = document.getElementById("modalContent");
      
      
        var myUrl = "http://localhost/waterworks/consumer/get_payment_receipt.php";
        
        const formData = new FormData();
        formData.append("pay_id", pay_id);
        console.log("pay_id : ", pay_id);
      
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
                                        <div class="col-sm-12 mt-3 p-3 border">
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
                                        
                                        <table class="tab1 table table-hover table-fixed ">
                                            <tbody>
                                                <tr>
                                                    <td class="col-md-5 text-start border-0">
                                                        <p>
                                                            <strong></strong>
                                                        </p>
                                                        <p>
                                                            <strong>Amount Paid: </strong>
                                                        </p>
                                                    </td>
                                                    <td class="col-md-2 border-0"></td>
                                                    <td class="col-md-3 border-0"></td>
                                                    <td class="col-md-3 text-center border-0">
                                                        <p>
                                                            <strong></strong>
                                                        </p>
                                                        <p>
                                                            <strong>${records[0].pay_amount}</strong>
                                                        </p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>                                                       
                                        <table class=" table p-3 border">
                                          <thead>
                                              <tr>
                                                  <th class="text-center border-0">Date</th>
                                                  <th class="text-center border-0"></th>
                                                  <th class="text-center border-0">ISSUED BY</th>
                                              </tr>
                                          </thead>
                                          <tbody>
                                              <tr>
                                                  <td class="col-md-4 text-center border-0">${records[0].pay_date}</td>
                                                  <td class="col-md-4 text-center border-0"></td>
                                                  <td class="col-md-4 text-center border-0">${records[0].emp_firstname} ${records[0].emp_lastname}</td>
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
                                        <div class="col-sm-12 mt-3 p-3 border">
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
                                        
                                        <table class="tab1 table table-hover table-fixed ">
                                            <tbody>
                                                <tr>
                                                    <td class="col-md-3 text-start border-0">
                                                        <p>
                                                            <strong></strong>
                                                        </p>
                                                        <p>
                                                            <strong>Amount Paid: </strong>
                                                        </p>
                                                    </td>
                                                    <td class="col-md-3 border-0"></td>
                                                    <td class="col-md-3 border-0"></td>
                                                    <td class="col-md-3 text-center border-0">
                                                        <p>
                                                            <strong></strong>
                                                        </p>
                                                        <p>
                                                            <strong>NO RECORDS</strong>
                                                        </p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>                                                       
                                        <table class=" table p-3 border">
                                          <thead>
                                              <tr>
                                                  <th class="text-center border-0">Date</th>
                                                  <th class="text-center border-0"></th>
                                                  <th class="text-center border-0">ISSUED BY</th>
                                              </tr>
                                          </thead>
                                          <tbody>
                                              <tr>
                                                  <td class="col-md-4 text-center border-0">NO RECORDS</td>
                                                  <td class="col-md-4 text-center border-0"></td>
                                                  <td class="col-md-4 text-center border-0">NO RECORDS</td>
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