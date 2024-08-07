// Define the logout function
const logout = async () => {
    try {
      const response = await fetch('http://152.42.243.189/waterworks/gets/logout.php', {
        method: 'POST'
      });
  
      if (response.ok) {
        // Redirect to the login page after successful logout
        sessionStorage.clear();
        window.location.href = "/waterworks/"; // Replace with your login page URL
        console.log('logout success');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  // Attach the logout function to the logout link
  document.getElementById("logoutBtn").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default link behavior
    logout(); // Call the logout function when the link is clicked
  });
  