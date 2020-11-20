const form = document.querySelector(".form-signin")
form.addEventListener("submit", function (e) {
    e.preventDefault();
    e.stopPropagation();
    let inputEmail = document.getElementById("inputEmail")
    form.classList.add('was-validated')
    if (form.checkValidity()) {
        sessionStorage.clear();
        sessionStorage.setItem(
            "User-Logged",
            JSON.stringify({ email: inputEmail.value.trim() })
        );
        window.location.href = "index.html"
    }
})