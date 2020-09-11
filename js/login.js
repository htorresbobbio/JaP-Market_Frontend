function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);

    // After login redirect:
    window.location.href = "index.html"
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    var submitButton = document.getElementById("submitButton")
    submitButton.addEventListener("click", function (e) {
        let inputUser = document.getElementById("inputUser");
        let inputPassword = document.getElementById("inputPassword");
        let isFilled = true;

        if (inputUser.value.trim() === '') {
            isFilled = false;
        }

        if (inputPassword.value.trim() === '') {
            isFilled = false;
        }

        if (isFilled) {
            sessionStorage.clear();
            sessionStorage.setItem('User-Logged', JSON.stringify({ email: inputUser.value.trim() }));
            window.location = 'index.html';
        }
    })
});