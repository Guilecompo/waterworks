<?php
if($_SESSION['accountId'] == 0){

  header("Location: /waterworks/");
  exit;
}
?>

<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">
  <head>
    <title>Admin Dashboard</title>

    <!-- Required meta tags -->
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no" />

    <!-- Bootstrap CSS v5.2.1 -->
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
      crossorigin="anonymous" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/css/bootstrap.min.css" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
      crossorigin="anonymous" />
    <link rel="stylesheet" href="../../style.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.3.1/axios.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>

  <body onload="onLoad()">
    <div class="wrapper">
      <aside id="sidebar" class="js-sidebar">
        <!-- Content For Sidebar -->
        <div class="h-100">
          <div class="sidebar-logo">
            <a href="#">Waterworks</a>
          </div>
          <ul class="sidebar-nav">
            <li class="sidebar-header">Admin Elements</li>
            <li class="sidebar-item">
              <a href="./dashboard.html" class="sidebar-link active mt-3">
                <i class="fa-solid fa-list pe-2"></i>
                Dashboard
              </a>
            </li>
            <li class="sidebar-item mt-3">
              <a
                href="#"
                class="sidebar-link collapsed"
                data-bs-target="#employees"
                data-bs-toggle="collapse"
                aria-expanded="false"
                ><i class="fa-solid fa-user pe-2"></i>
                Employees
              </a>
              <ul
                id="employees"
                class="sidebar-dropdown list-unstyled collapse"
                data-bs-parent="#sidebar">
                <li class="sidebar-item">
                  <a href="./clerklist.html" class="sidebar-link">Clerk List</a>
                </li>
                <li class="sidebar-item">
                  <a href="./headlist.html" class="sidebar-link">Head List</a>
                </li>
                <li class="sidebar-item">
                  <a href="./readerlist.html" class="sidebar-link"
                    >Meter Reader List</a
                  >
                </li>
              </ul>
            </li>
            <li class="sidebar-item">
              <a href="./consumerlist.html" class="sidebar-link mt-3">
                <i class="fa-solid fa-file-lines pe-2"></i>
                Consumers List
              </a>
            </li>
            <li class="sidebar-item">
              <a href="./reports.html" class="sidebar-link mt-3">
                <i class="fa-solid fa-file-lines pe-2"></i>
                Reports
              </a>
            </li>
            <li class="sidebar-header">Masterlist Menu</li>
            <li class="sidebar-item mt-3">
              <a
                href="#"
                class="sidebar-link collapsed"
                data-bs-target="#auth"
                data-bs-toggle="collapse"
                aria-expanded="false"
                ><i class="fa-solid fa-user pe-2"></i>
                Master List
              </a>
              <ul
                id="auth"
                class="sidebar-dropdown list-unstyled collapse"
                data-bs-parent="#sidebar">
                <li class="sidebar-item">
                  <a href="./addbarangay.html" class="sidebar-link"
                    >Add Barangay</a
                  >
                </li>
                <li class="sidebar-item">
                  <a href="./addzone.html" class="sidebar-link">Add Zone</a>
                </li>
                <li class="sidebar-item">
                  <a href="./addemployee.html" class="sidebar-link"
                    >Add Employee</a
                  >
                </li>
                <li class="sidebar-item">
                  <a href="./addconsumertype.html" class="sidebar-link"
                    >Add Consumer Type</a
                  >
                </li>
                <li class="sidebar-item">
                  <a href="./addconsumer.html" class="sidebar-link"
                    >Add Consumer</a
                  >
                </li>
                <li class="sidebar-item">
                  <a href="./addposition.html" class="sidebar-link"
                    >Add Positon</a
                  >
                </li>
                <li class="sidebar-item">
                  <a href="./addrate.html" class="sidebar-link">Add New Rate</a>
                </li>
                <li class="sidebar-item">
                  <a href="./addproperty.html" class="sidebar-link"
                    >Add Property Type</a
                  >
                </li>
                <li class="sidebar-item">
                  <a href="./addbranch.html" class="sidebar-link">Add Branch</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </aside>
      <div class="main">
        <nav class="navbar navbar-expand px-3 border-bottom">
          <button class="btn" id="sidebar-toggle" type="button">
            <span class="nav navbar-toggler-icon"></span>
          </button>
          <div class="navbar-collapse navbar">
            <ul class="navbar-nav">
              <li class="nav-item mt-2">
                <a href="#" class="theme-toggle fs-6 m-2">
                  <i class="fa-regular fa-sun"></i>
                  <i class="fa-regular fa-moon"></i>
                </a>
              </li>
              <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle second-text fw-bold"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false">
                  <i class="fas fa-user me-2"></i>
                  <!-- User Name Who Login -->
                  <span id="ngalan"></span>
                </a>
                <ul
                  class="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdown">
                  <li>
                    <a class="dropdown-item" href="./profile.html">Profile</a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="./change_password.html"
                      >Change Password</a
                    >
                  </li>
                  <li>
                    <a class="dropdown-item" href="/waterworks/">Logout</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
        <main class="content px-3 py-2">
          <div class="container-fluid row p-0 m-0">
            <div class="mb-3">
              <h4>Admin Dashboard</h4>
            </div>
            <div class="container-fluid p-0 mt-0">
              <div class="row">
                <div class="col-12 w-25 col-md-6 d-flex me-auto">
                  <select
                    id="branch"
                    class="form-select"
                    aria-label="Default select example"
                    style="min-width: fit-content">
                    <option value="">Select Branch</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="row col-md-8 p-0 mt-3">
              <div class="row">
                <div class="col-12 col-md-6 d-flex">
                  <div class="card flex-fill border-0">
                    <div class="card-body py-4">
                      <div class="d-flex align-items-start">
                        <div class="flex-grow-1">
                          <h4 class="mb-2" id="totalEmployees">0</h4>
                          <p class="mb-2">Total Employees</p>
                          <div class="mb-0">
                            <!-- <span class="badge text-success me-2">
                                                                +9.0%
                                                            </span>
                                                            <span class="text-muted">
                                                                Since Last Month
                                                            </span> -->
                          </div>
                        </div>
                        <div class="flex-grow-1 mt-1">
                          <i class="fa-solid fa-people-group"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6 d-flex">
                  <div class="card flex-fill border-0">
                    <div class="card-body py-4">
                      <div class="d-flex align-items-start">
                        <div class="flex-grow-1">
                          <h4 class="mb-2" id="totalConsumers">0</h4>
                          <p class="mb-2">Total Consumers</p>
                          <div class="mb-0">
                            <!-- <span class="badge text-success me-2">
                                                                +9.0%
                                                            </span>
                                                            <span class="text-muted">
                                                                Since Last Month
                                                            </span> -->
                          </div>
                        </div>
                        <div class="flex-grow-1 mt-1">
                          <i class="fa-solid fa-people-group"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12 col-md-6 d-flex">
                  <div class="card flex-fill border-0">
                    <div class="card-body py-4">
                      <div class="d-flex align-items-start">
                        <div class="flex-grow-1">
                          <h4 class="mb-2" id="totalConsumed">0</h4>
                          <p class="mb-2">Total Water Consumed</p>
                          <div class="mb-0">
                            <!-- <span class="badge text-success me-2">
                                                                +9.0%
                                                            </span>
                                                            <span class="text-muted">
                                                                Since Last Month
                                                            </span> -->
                          </div>
                        </div>
                        <div class="flex-grow-1 mt-1">
                          <i class="fa-solid fa-droplet"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6 d-flex">
                  <div class="card flex-fill border-0">
                    <div class="card-body py-4">
                      <div class="d-flex align-items-start">
                        <div class="flex-grow-1">
                          <h4 class="mb-2" id="totalPay">0</h4>
                          <p class="mb-2">Total Payments</p>
                          <div class="mb-0">
                            <!-- <span class="badge text-success me-2">
                                                                +9.0%
                                                            </span>
                                                            <span class="text-muted">
                                                                Since Last Month
                                                            </span> -->
                          </div>
                        </div>
                        <div class="flex-grow-1 mt-1">
                          <i class="fa-solid fa-peso-sign"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <div class="row">
                <canvas id="lineChart"></canvas>
              </div> -->
            </div>
            <div class="row col-md-4 p-0 m-0 mt-3">
              <div class="card border-0">
                <div class="card-header mt-3" style="text-align: center">
                  <h5 class="card-title mt-2">Activity Log</h5>
                </div>
                <div class="card-body">
                  <div
                    class="mainDivs mt-2"
                    id="mainDivs"
                    style="font-size: small"></div>
                </div>
                <div class="col-12 d-flex justify-content-center mt-2 mb-3">
                  <div class="pagination-container">
                    <div id="paginationNumbers" class="pagination-numbers"></div>
                  </div>
                </div>                
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    <script
      src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
      integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
      crossorigin="anonymous"></script>

    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js"
      integrity="sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+"
      crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script
      src="https://kit.fontawesome.com/ae360af17e.js"
      crossorigin="anonymous"></script>
    <script src="../../script.js"></script>
    <script src="../../script1.js"></script>
    <script src="../js/dashboard.js"></script>
  </body>
</html>
