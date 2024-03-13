const onLoad = () => {
  
    document.getElementById("ngalan").innerText = sessionStorage.getItem("fullname");
  }
  const closeModal = () => {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
    };
    // FOR ADD NEW POSITION
// const add_suffix = () => {
//   const modal = document.getElementById("myModal");
//   const modalContent = document.getElementById("modalContent");
//       var html = `
//       <div class="forms">
//       <h2>Add New Suffix Type</h2>
//       <input type="text" id="add_suffix" placeholder="Enter New Suffix Type" required><br><br>
//     <button class="add-button" onclick="submit_suffix()">Submit</button><br/><br/>
// </div>
//       `;
//       modalContent.innerHTML = html;
//       modal.style.display = "block";
// };
// const submit_suffix = () => {
//   const add_suffix = document.getElementById("add_suffix").value;

//   if (add_suffix === '') {
//     alert('Fill in all fields');
//     return;
//   }

//   const myUrl = "http://localhost/waterbilling/admin/add_suffix.php";
//   const formData = new FormData();
//   formData.append("add_suffix", add_suffix);

//   axios({
//     url: myUrl,
//     method: "post",
//     data: formData,
//   })
//     .then((response) => {
//       console.log(response);
//       if (response.data.status === 1) {
//         alert("Suffix Successfully Added!");
//         window.location.href = "./masterlist.html";
//       } else if (response.data.status === 0) {
//         alert("Suffix already exists!");
//       } else {
//         alert("Unknown error occurred.");
//       }
//     })
//     .catch((error) => {
//       alert(`ERROR OCCURRED! ${error}`);
//     });
// };
//FOR ADD NEW BARANGAY
const add_barangay = () => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");
      var html = `
      <div class="forms">
      <h2>Add New Barangay</h2>
      <select id="municipality" " required>
        <option value="">Select Municipality</option>
      </select><br>
      <input type="text" id="add_barangay" placeholder="Enter New Barangay" required><br><br>
    <button class="add-button" onclick="submit_barangay()">Submit</button><br/><br/>
</div>
      `;
      modalContent.innerHTML = html;
      modal.style.display = "block";
      getMunicipality1();
};
const submit_barangay = () => {
  const municipalityId = document.getElementById("municipality").value;
  const add_barangay = document.getElementById("add_barangay").value;

  if (add_barangay === '' || municipalityId === '') {
    alert('Fill in all fields');
    return;
  }

  const myUrl = "http://128.199.232.132/waterbilling/admin/add_barangay.php";
  const formData = new FormData();
  formData.append("municipalityId", municipalityId);
  formData.append("add_barangay", add_barangay);

  axios({
    url: myUrl,
    method: "post",
    data: formData,
  }).then((response) => {
    console.log(response);
    if (response.data.status === 1) {
        alert("Barangay Successfully Added!");
        // Optionally, you can redirect to another page here
        window.location.href = "./masterlist.html";
    } else if (response.data.status === 0) {
        alert("Barangay already exists!");
    } else {
        alert("Unknown error occurred. Please check the console for details.");
        console.error("Unknown error:", response.data.message);
    }
})
.catch((error) => {
    console.error("ERROR OCCURRED!", error);
    alert("An error occurred. Please check the console for details.");
});
}; 
//FOR ADD NEW BARANGAY
const add_zone = () => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");
      var html = `
      <div class="forms">
      <h2>Add New Zone</h2>
      <select id="municipality" onchange="getBarangay()" required>
        <option value="">Select Municipality</option>
      </select><br>
      <select id="barangay" " required>
        <option value="">Select Barangay</option>
      </select><br>
      <input type="text" id="add_zone" placeholder="Enter New Zone" required><br><br>
    <button class="add-button" onclick="submit_zone()">Submit</button><br/><br/>
</div>
      `;
      modalContent.innerHTML = html;
      modal.style.display = "block";
      getMunicipality();
};
const submit_zone = () => {
  const barangayId = document.getElementById("barangay").value;
  const add_zone = document.getElementById("add_zone").value;

  if (add_zone === '' || barangayId === '') {
    alert('Fill in all fields');
    return;
  }

  const myUrl = "http://128.199.232.132/waterbilling/admin/add_zone.php";
  const formData = new FormData();
  formData.append("barangayId", barangayId);
  formData.append("add_zone", add_zone);

  axios({
    url: myUrl,
    method: "post",
    data: formData,
  }).then((response) => {
    console.log(response);
    if (response.data.status === 1) {
        alert("Zone Successfully Added!");
        // Optionally, you can redirect to another page here
        window.location.href = "./masterlist.html";
    } else if (response.data.status === 0) {
        alert("Zone already exists in same barangay!");
    } else {
        alert("Unknown error occurred. Please check the console for details.");
        console.error("Unknown error:", response.data.message);
    }
})
.catch((error) => {
    console.error("ERROR OCCURRED!", error);
    alert("An error occurred. Please check the console for details.");
});
}; 
// FOR ADD NEW PROPERTY TYPE
const add_property = () => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");
      var html = `
      <div class="forms">
      <h2>Add New Property Type</h2>
      <label >Property Name</label>
      <input type="text" id="add_property" placeholder="Enter New Property" required><br><br>
    <button class="add-button" onclick="submit_property()">Submit</button><br/><br/>
</div>
      `;
      modalContent.innerHTML = html;
      modal.style.display = "block";
};
const submit_property = () => {
  const add_property = document.getElementById("add_property").value;

  if (add_property === '') {
    alert('Fill in all fields');
    return;
  }

  const myUrl = "http://128.199.232.132/waterbilling/admin/add_property.php";
  const formData = new FormData();
  formData.append("add_property", add_property);

  axios({
    url: myUrl,
    method: "post",
    data: formData,
  })
    .then((response) => {
      console.log(response);
      if (response.data.status === 1) {
        alert("Property Successfully Added!");
        window.location.href = "./masterlist.html";
      } else if (response.data.status === 0) {
        alert("Property already exists!");
      } else {
        alert("Unknown error occurred.");
      }
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
    });
};
    // FOR ADD NEW POSITION
    const add_position = () => {
      const modal = document.getElementById("myModal");
      const modalContent = document.getElementById("modalContent");
          var html = `
          <div class="forms">
          <h2>Add New Position</h2>
          <input type="text" id="add_position" placeholder="Enter New Position" required><br><br>
        <button class="add-button" onclick="submit_position()">Submit</button><br/><br/>
    </div>
          `;
          modalContent.innerHTML = html;
          modal.style.display = "block";
    };
    const submit_position = () => {
      const add_position = document.getElementById("add_position").value;
    
      if (add_position === '') {
        alert('Fill in all fields');
        return;
      }
    
      const myUrl = "http://128.199.232.132/waterbilling/admin/add_position.php";
      const formData = new FormData();
      formData.append("add_position", add_position);
    
      axios({
        url: myUrl,
        method: "post",
        data: formData,
      })
        .then((response) => {
          console.log(response);
          if (response.data.status === 1) {
            alert("Position Successfully Added!");
            window.location.href = "./masterlist.html";
          } else if (response.data.status === 0) {
            alert("Position already exists!");
          } else {
            alert("Unknown error occurred.");
          }
        })
        .catch((error) => {
          alert(`ERROR OCCURRED! ${error}`);
        });
    };

    //FOR ADD NEW BRANCH
    const add_branch = () => {
      const modal = document.getElementById("myModal");
      const modalContent = document.getElementById("modalContent");
          var html = `
          <div class="forms">
          <h2>Add New Branch</h2>
          <input type="text" id="branch" placeholder="Enter New Branch" required><br><br>
          <select id="municipality" onchange="getBarangay()" required>
            <option value="">Select Municipality</option>
          </select><br>
          <select id="barangay" onchange="getZone()" required>
            <option value="">Select Barangay</option>
          </select><br>
          <select id="zone" required>
            <option value="">Select Zone</option>
          </select><br>
          <input type="text" id="phone_no" placeholder="Enter Phone Number" required><br><br>
        <button class="add-button" onclick="submit_branch()">Submit</button><br/><br/>
    </div>
          `;
          modalContent.innerHTML = html;
          modal.style.display = "block";
          getMunicipality();
    };
    const submit_branch = () => {
      const branch = document.getElementById("branch").value;
      const municipalityId = document.getElementById("municipality").value;
      const barangayId = document.getElementById("barangay").value;
      const zoneId = document.getElementById("zone").value;
      const phone_no = document.getElementById("phone_no").value;
    
      if (branch === ''||
      municipalityId === '' ||
      barangayId === '' ||
      zoneId === '' ||
      phone_no === '') {
        alert('Fill in all fields');
        return;
      }
    
      const myUrl = "http://128.199.232.132/waterbilling/admin/add_branch.php";
      const formData = new FormData();
      formData.append("branch", branch);
      formData.append("municipalityId", municipalityId);
      formData.append("barangayId", barangayId);
      formData.append("zoneId", zoneId);
      formData.append("phone_no", phone_no);
    
      axios({
        url: myUrl,
        method: "post",
        data: formData,
      })
        .then((response) => {
          console.log(response);
          if (response.data.status === 1) {
            alert("Branch Successfully Added!");
            window.location.href = "./masterlist.html";
          } else if (response.data.status === 0) {
            alert("Branch or Phone already exists!");
          } else {
            alert("Unknown error occurred.");
          }
        })
        .catch((error) => {
          alert(`ERROR OCCURRED! ${error}`);
        });
    };
    // FOR ADD NEW RATE
    const add_rate = () => {
      const modal = document.getElementById("myModal");
      const modalContent = document.getElementById("modalContent");
          var html = `
          <div class="forms">
          <h2>Add New Rate</h2>
          <label for="property">Property Type</label>
          <select id="property" required>Property</select><br><br>
          <label for="minimum_rate">Minimun Rate</label>
          <input type="text" id="minimum_rate" placeholder="Enter New Minumum Rate" required><br><br>
          <label for="second_rate">11 to 20 +Rate</label>
          <input type="text" id="second_rate" placeholder="Enter New 11-20 +Rate" required><br><br>
          <label for="third_rate">21 to 30 +Rate</label>
          <input type="text" id="third_rate" placeholder="Enter New 21-30 +Rate" required><br><br>
          <label for="last_rate">30 above +Rate</label>
          <input type="text" id="last_rate" placeholder="Enter New 30 above +Rate" required><br><br>
        <button class="add-button" onclick="submit_rates()">Submit</button><br/><br/>
    </div>
          `;
          modalContent.innerHTML = html;
          modal.style.display = "block";
          getProperty();
    };
    const submit_rates = () => {
      const propertyId = document.getElementById("property").value;
      const minimum_rate = document.getElementById("minimum_rate").value;
      const second_rate = document.getElementById("second_rate").value;
      const third_rate = document.getElementById("third_rate").value;
      const last_rate = document.getElementById("last_rate").value;
    
      if (propertyId === ''||
          minimum_rate === ''||
          second_rate === ''||
          third_rate === ''||
          last_rate === '') {
        alert('Fill in all fields');
        return;
      }
    
      const myUrl = "http://128.199.232.132/waterbilling/admin/add_property_rate.php";
      const formData = new FormData();
      formData.append("propertyId", propertyId);
      formData.append("minimum_rate", minimum_rate);
      formData.append("second_rate", second_rate);
      formData.append("third_rate", third_rate);
      formData.append("last_rate", last_rate);
    
      axios({
        url: myUrl,
        method: "post",
        data: formData,
      })
        .then((response) => {
          console.log(response);
          if (response.data.status === 1) {
            alert("New Rate Successfully Added!");
            window.location.href = "./masterlist.html";
          } else if (response.data.status === 0) {
            alert("Rate already exists!");
          } else {
            alert("Unknown error occurred.");
          }
        })
        .catch((error) => {
          alert(`ERROR OCCURRED! ${error}`);
        });
    };
    // FOR ADD CONSUMERS
    const add_consumer = () => {
      const modal = document.getElementById("myModal");
      const modalContent = document.getElementById("modalContent");
          var html = `
          <div class="forms">
          <h2>Add New Consumer</h2>
          <input type="text" id="firstname" placeholder="Enter First Name" required><br><br>
      <input type="text" id="middlename" placeholder="Enter Middle Name" required><br><br>
      <input type="text" id="lastname" placeholder="Enter Last Name" required><br><br>
      <input type="text" id="phone" placeholder="Enter Phone Number" required><br><br>
      <input type="text" id="email_add" placeholder="Enter Email Address : example@gmail.com" required><br><br>
      <select id="property" required>Property</select><br>
      <select id="municipality" onchange="getBarangay()" required>
        <option value="">Select Municipality</option>
      </select><br>
      <select id="barangay" onchange="getZone()" required>
        <option value="">Select Barangay</option>
      </select><br>
      <select id="zone" required>
        <option value="">Select Zone</option>
      </select><br>
      <select id="branch" required> </select><br>
      <input type="text" id="meter_no" placeholder="Enter Meter Number" required><br><br>
        <button class="add-button" onclick="submit_consumer()">Submit</button><br/><br/>
    </div>
          `;
          modalContent.innerHTML = html;
          modal.style.display = "block";
          // getSuffix();
          getBranch();
          getProperty();
          getMunicipality();
    };
    const submit_consumer = () => {
      const firstname = document.getElementById("firstname").value;
      const middlename = document.getElementById("middlename").value;
      const lastname = document.getElementById("lastname").value;
      const phone = document.getElementById("phone").value;
      const email_add = document.getElementById("email_add").value;
      const propertyId = document.getElementById("property").value;
      const municipalityId = document.getElementById("municipality").value;
      const barangayId = document.getElementById("barangay").value;
      const zoneId = document.getElementById("zone").value;
      const branchId = document.getElementById("branch").value;
      const meter_no = document.getElementById("meter_no").value;
    
      if (
        firstname === '' ||
        middlename === '' ||
        lastname === '' ||
        phone === '' ||
        email_add === '' ||
        propertyId === '' ||
        municipalityId === '' ||
        barangayId === '' ||
        zoneId === '' ||
        branchId === '' ||
        meter_no === '' 
      ) {
        alert('Fill in all fields');
        return;
      }
    
      const myUrl = "http://128.199.232.132/waterbilling/admin/add_consumer.php";
      const formData = new FormData();
      formData.append("firstname", firstname);
      formData.append("middlename", middlename);
      formData.append("lastname", lastname);
      formData.append("phone", phone);
      formData.append("email_add", email_add);
      formData.append("propertyId", propertyId);
      formData.append("municipalityId", municipalityId);
      formData.append("barangayId", barangayId);
      formData.append("zoneId", zoneId);
      formData.append("branchId", branchId);
      formData.append("meter_no", meter_no);
    
      axios({
        url: myUrl,
        method: "post",
        data: formData,
      })
        .then((response) => {
          console.log(response);
          console.log(response.data);
          if (response.data.status === 1) {
            alert("Record Successfully Saved!");
            window.location.href = "./masterlist.html";
          } else if (response.data.status === 0) {
            alert("Username or phone number or email already exists!");
          } else {
            alert("Unknown error occurred.");
          }
        })
        .catch((error) => {
          alert(`ERROR OCCURRED! ${error}`);
        });
    };
    // FOR ADD EMPLOYEES
  // const add_employee = () => {
  //   const modal = document.getElementById("myModal");
  //   const modalContent = document.getElementById("modalContent");
  //       var html = `
  //         <div class="forms">
  //           <h2>Add New Employee</h2>
  //           <input type="text" id="firstname" placeholder="Enter First Name" required><br><br>
  //           <input type="text" id="middlename" placeholder="Enter Middle Name" required><br><br>
  //           <input type="text" id="lastname" placeholder="Enter Last Name" required><br><br>
  //           <select id="suffix" required>Suffix</select><br>
  //           <input type="text" id="phone" placeholder="Enter Phone Number" required><br><br>
  //           <input type="text" id="email_add" placeholder="Enter Email Address : example@gmail.com" required><br><br>
  //           <select id="municipality" onchange="getBarangay()" required>
  //             <option value="">Select Municipality</option>
  //           </select><br>
  //           <select id="barangay" onchange="getZone()" required>
  //             <option value="">Select Barangay</option>
  //           </select><br>
  //           <select id="zone" required>
  //             <option value="">Select Zone</option>
  //           </select><br>
  //           <input type="text" id="username" placeholder="Enter Username" required><br><br>
  //           <select id="position" style="text-transform: capitalize;" required></select><br>
  //             <button class="add-button" onclick="submit_employee()">Submit</button><br/><br/>
  //         </div>
  //       `;
  //       modalContent.innerHTML = html;
  //       modal.style.display = "block";
        
  //       // getSuffix();
  //       getMunicipality();
  //       getPosition();
  //   };
  //   const submit_employee = () => {
  //     const firstname = document.getElementById("firstname").value;
  //     const middlename = document.getElementById("middlename").value;
  //     const lastname = document.getElementById("lastname").value;
  //     const suffixId = document.getElementById("suffix").value;
  //     const phone = document.getElementById("phone").value;
  //     const email_add = document.getElementById("email_add").value;
  //     const municipalityId = document.getElementById("municipality").value;
  //     const barangayId = document.getElementById("barangay").value;
  //     const zoneId = document.getElementById("zone").value;
  //     const username = document.getElementById("username").value;
  //     const positionId = document.getElementById("position").value;
    
  //     if (
  //       firstname === '' ||
  //       middlename === '' ||
  //       lastname === '' ||
  //       suffixId === '' ||
  //       phone === '' ||
  //       email_add === '' ||
  //       municipalityId === '' ||
  //       barangayId === '' ||
  //       zoneId === '' ||
  //       username === '' ||
  //       positionId === ''
  //     ) {
  //       alert('Fill in all fields');
  //       return;
  //     }
    
  //     const myUrl = "http://localhost/waterbilling/admin/add_employee.php";
  //     const formData = new FormData();
  //     formData.append("firstname", firstname);
  //     formData.append("middlename", middlename);
  //     formData.append("lastname", lastname);
  //     formData.append("suffixId", suffixId);
  //     formData.append("phone", phone);
  //     formData.append("email_add", email_add);
  //     formData.append("municipalityId", municipalityId);
  //     formData.append("barangayId", barangayId);
  //     formData.append("zoneId", zoneId);
  //     formData.append("username", username);
  //     formData.append("positionId", positionId);
    
  //     axios({
  //       url: myUrl,
  //       method: "post",
  //       data: formData,
  //     })
  //       .then((response) => {
  //         console.log(response);
  //         if (response.data.status === 1) {
  //           alert("Record Successfully Saved!");
  //           window.location.href = "./masterlist.html";
  //         } else if (response.data.status === 0) {
  //           alert("Username or phone number already exists!");
  //         } else {
  //           alert("Unknown error occurred.");
  //           console.log(response);
  //         }
  //       })
  //       .catch((error) => {
  //         alert(`ERROR OCCURRED! ${error}`);
  //       });
  //   };

  const add_employee = () => {
    const modal = document.getElementById("myModal");
    const modalContent = document.getElementById("modalContent");
        var html = `
          <div class="forms">
            <h2>Add New Employee</h2>
            <input type="text" id="firstname" placeholder="Enter First Name" required><br><br>
            <input type="text" id="middlename" placeholder="Enter Middle Name" required><br><br>
            <input type="text" id="lastname" placeholder="Enter Last Name" required><br><br>
            <input type="text" id="phone" placeholder="Enter Phone Number" required><br><br>
            
            <input type="text" id="provinceName" placeholder="Enter Province" required><br><br>
            <input type="text" id="municipalityName" placeholder="Enter Municipality" required><br><br>
            <input type="text" id="barangayName" placeholder="Enter Barangay" required><br><br>

            <input type="text" id="email_add" placeholder="Enter Email Address : example@gmail.com" required><br><br>
            <input type="text" id="username" placeholder="Enter Username" required><br><br>

            <select id="branch" required> </select><br>
            
            <select id="position" style="text-transform: capitalize;" required></select><br>
              <button class="add-button" onclick="submit_employee()">Submit</button><br/><br/>
          </div>
        `;
        modalContent.innerHTML = html;
        modal.style.display = "block";
        
        // getSuffix();
        // getMunicipality();
        getBranch();
        getPosition();
    };
    const submit_employee = () => {
      const firstname = document.getElementById("firstname").value;
      const middlename = document.getElementById("middlename").value;
      const lastname = document.getElementById("lastname").value;
      const phone = document.getElementById("phone").value;

      const provinceName = document.getElementById("provinceName").value;
      const municipalityName = document.getElementById("municipalityName").value;
      const barangayName = document.getElementById("barangayName").value;

      const email_add = document.getElementById("email_add").value;
      const username = document.getElementById("username").value;
      const branchId = document.getElementById("branch").value;
      const positionId = document.getElementById("position").value;
    
      if (
        firstname === '' ||
        middlename === '' ||
        lastname === '' ||
        phone === '' ||
        email_add === '' ||
        provinceName === '' ||
        municipalityName === '' ||
        barangayName === '' ||
        username === '' ||
        branchId === '' ||
        positionId === ''
      ) {
        alert('Fill in all fields');
        return;
      }
    
      const myUrl = "http://128.199.232.132/waterbilling/admin/add_employees.php";
      const formData = new FormData();
      formData.append("firstname", firstname);
      formData.append("middlename", middlename);
      formData.append("lastname", lastname);
      formData.append("phone", phone);
      formData.append("email_add", email_add);
      formData.append("provinceNames", provinceName);
      formData.append("municipalityNames", municipalityName);
      formData.append("barangayNames", barangayName);
      formData.append("username", username);
      formData.append("branchId", branchId);
      formData.append("positionId", positionId);
    
      axios({
        url: myUrl,
        method: "post",
        data: formData,
      })
        .then((response) => {
          console.log(response);
          if (response.data.status === 1) {
            alert("Record Successfully Saved!");
            window.location.href = "./masterlist.html";
          } else if (response.data.status === 0) {
            alert("Username or phone number already exists!");
          } else {
            alert("Unknown error occurred.");
            console.log(response);
          }
        })
        .catch((error) => {
          alert(`ERROR OCCURRED! ${error}`);
        });
    };

    // EXTRA
    // const getSuffix = () => {
    // const suffixSelect = document.getElementById("suffix");
    // var myUrl = "http://localhost/waterbilling/admin/get_suffix.php";
    
    // axios({
    //   url: myUrl,
    //   method: "post",
    // })
    //   .then((response) => {
    //     var suffixes = response.data;
    
    //     var options = ``;
    //     suffixes.forEach((suffix) => {
    //       options += `<option value="${suffix.suffix_id}">${suffix.suffix_name}</option>`;
    //     });
    //     suffixSelect.innerHTML = options;
    //   })
    //   .catch((error) => {
    //     alert(`ERROR OCCURRED! ${error}`);
    //   });
    // };
    const getMunicipality1 = () => {
      const municipalitySelect = document.getElementById("municipality");
      var myUrl = "http://128.199.232.132/waterbilling/admin/get_municipality.php";
      
      axios({
        url: myUrl,
        method: "post",
      })
        .then((response) => {
          var municipalities = response.data;
      
          var options = ``;
          municipalities.forEach((municipality) => {
            options += `<option value="${municipality.municipality_id}">${municipality.municipality_name}</option>`;
          });
          municipalitySelect.innerHTML = options;
      
        })
        .catch((error) => {
          alert(`ERROR OCCURRED! ${error}`);
        });
      };
    
    const getMunicipality = () => {
    const municipalitySelect = document.getElementById("municipality");
    var myUrl = "http://128.199.232.132/waterbilling/admin/get_municipality.php";
    
    axios({
      url: myUrl,
      method: "post",
    })
      .then((response) => {
        var municipalities = response.data;
    
        var options = ``;
        municipalities.forEach((municipality) => {
          options += `<option value="${municipality.municipality_id}">${municipality.municipality_name}</option>`;
        });
        municipalitySelect.innerHTML = options;
    
        getBarangay();
      })
      .catch((error) => {
        alert(`ERROR OCCURRED! ${error}`);
      });
    };
    
    const getBarangay = () => {
    const selectedMunicipalityId = document.getElementById("municipality").value;
    
    // Fetch barangays based on the selected municipality
    // Replace this URL with your actual API endpoint
    const barangayUrl = `http://128.199.232.132/waterbilling/admin/get_barangay.php`;
    const formData = new FormData();
    
    // Use selectedMunicipalityId directly
    formData.append("municipalityId", selectedMunicipalityId);
    
    axios({
      url: barangayUrl,
      method: "post",
      data: formData
    })
      .then((response) => {
        const barangaySelect = document.getElementById("barangay");
        const barangays = response.data;
    
        // Clear existing options
        barangaySelect.innerHTML = '<option value="">Select Barangay</option>';
    
        // Populate options for barangays
        barangays.forEach((barangay) => {
          const option = document.createElement("option");
          option.value = barangay.barangay_id;
          option.textContent = barangay.barangay_name;
          barangaySelect.appendChild(option);
        });
      })
      .catch((error) => {
        alert(`ERROR OCCURRED while fetching barangays! ${error}`);
      });
    };
    
    
    const getZone = () => {
    const selectedBarangayId = document.getElementById("barangay").value;
    
      const zoneUrl = `http://128.199.232.132/waterbilling/admin/get_zone.php`;
      const formData = new FormData();
    
    // Use selectedMunicipalityId directly
    formData.append("barangayId", selectedBarangayId);
      axios({
        url: zoneUrl,
        method: "post",
        data: formData
      })
        .then((response) => {
          const zoneSelect = document.getElementById("zone");
          const zones = response.data;
    
          // Clear existing options
          zoneSelect.innerHTML = '<option value="">Select Zone</option>';
    
          // Populate options for zones
          zones.forEach((zone) => {
            const option = document.createElement("option");
            option.value = zone.zone_id;
            option.textContent = zone.zone_name;
            zoneSelect.appendChild(option);
          });
        })
        .catch((error) => {
          alert(`ERROR OCCURRED while fetching zones! ${error}`);
        });
    };
    
    const getPosition = () => {
    const positionSelect = document.getElementById("position");
    var myUrl = "http://128.199.232.132/waterbilling/admin/get_position.php";
    
    axios({
      url: myUrl,
      method: "post",
    })
      .then((response) => {
        var positions = response.data;
    
        var options = ``;
        positions.forEach((position) => {
          options += `<option value="${position.position_id}">${position.position_name}</option>`;
        });
        positionSelect.innerHTML = options;
      })
      .catch((error) => {
        alert(`ERROR OCCURRED! ${error}`);
      });
    };
    
    const getProperty = () => {
      const propertySelect = document.getElementById("property");
      var myUrl = "http://128.199.232.132/waterbilling/admin/get_property.php";
    
      axios({
        url: myUrl,
        method: "post",
      })
        .then((response) => {
          var properties = response.data;
    
          var options = ``;
          properties.forEach((property) => {
            options += `<option value="${property.property_id}">${property.property_name}</option>`;
          });
          propertySelect.innerHTML = options;
        })
        .catch((error) => {
          alert(`ERROR OCCURRED! ${error}`);
        });
    };

    const getBranch = () => {
      const propertySelect = document.getElementById("branch");
      var myUrl = "http://128.199.232.132/waterbilling/admin/get_branch.php";
    
      axios({
        url: myUrl,
        method: "post",
      })
        .then((response) => {
          var properties = response.data;
    
          var options = ``;
          properties.forEach((property) => {
            options += `<option value="${property.branch_id}">${property.branch_name}</option>`;
          });
          propertySelect.innerHTML = options;
        })
        .catch((error) => {
          alert(`ERROR OCCURRED! ${error}`);
        });
    };

