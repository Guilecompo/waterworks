const onLoad = () => {
    document.getElementById("ngalan").innerText = sessionStorage.getItem("fullname");
    document.getElementById("Name").innerText = sessionStorage.getItem("fullname");
    document.getElementById("Position").innerText = sessionStorage.getItem("positionName");
    document.getElementById("Email").innerText = sessionStorage.getItem("email");
    document.getElementById("Phone").innerText = sessionStorage.getItem("phone_no");
    document.getElementById("Address").innerText = sessionStorage.getItem("address");
    document.getElementById("Username").innerText = sessionStorage.getItem("meter");
    document.getElementById("Branch").innerText = sessionStorage.getItem("branchName");
    }; 

    const profile = (barangay_id) => {
        var myUrl = "bsyzrflyvtz0qvuxpqgm-mysql.services.clever-cloud.com/waterworks.github.com/admin/getbarangay.php";
        const formData = new FormData();
        formData.append("barangay_id", barangay_id);

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
                    var barangay = response.data;
                    console.log("Barangay : ",barangay);
                    var html = `
                      <div class=" row  mt-3">
                        <div class="col-md-1">
                          <button class="clear" onclick="add_barangay()">Back</button>
                        </div>
                        <div class="col-md-11">
                          <h4 style="text-align: center;">Edit Barangay</h4>
                        </div>
                      </div>
                        <div class="container-fluid mt-3">
                            <form class="row g-3">
                                <label class="form-label mb-0 underline-label">Edit Barangay</label>
                                <div class="col-md-5 ">
                                    <label class="form-label">Municipality</label>
                                    <select id="municipality"  class="form-select" >
                                      <option value="${barangay[0].municipality_id}" selected>${barangay[0].municipality_name}</option>
                                    </select>
                                </div>
                                <div class="col-md-7">
                                    <label class="form-label">Barangay Name</label>
                                    <input type="text" id="update_barangay" class="form-control" value="${barangay[0].barangay_name}" required>
                                </div>
                                <div class="col-12 mt-5">
                                    <button class="btn btn-primary" onclick="submit_edit_barangay(event, ${barangay[0].barangay_id})">Submit Edit</button>
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