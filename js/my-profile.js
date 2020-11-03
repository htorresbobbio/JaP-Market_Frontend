const defaultAvatar = '<a href="https://imgbb.com/"><img src="https://i.ibb.co/S6dt6zn/Profile-avatar-placeholder-large.png" alt="Profile-avatar-placeholder-large" border="0"></a>'

const profileForm = {
    id: document.querySelector("#profile-form"),
    name: document.querySelector('#name'),
    surname: document.querySelector('#surname'),
    age: (document.querySelector('#age')),
    email: document.querySelector('#email'),
    phone: document.querySelector('#phone'),
    avatar: document.querySelector('#avatar')
}

function setProfileData() {
    profileForm.id.addEventListener('submit', (e) => {
        e.preventDefault()
        e.stopPropagation()
        const profileData = {
            name: profileForm.name.value,
            surname: profileForm.surname.value,
            age: parseInt(profileForm.age.value),
            email: profileForm.email.value,
            phone: profileForm.phone.value,
            avatar: profileForm.avatar
        }
        localStorage.setItem('profileData', JSON.stringify(profileData))
    })
}

function getProfileData() {
    profileData = JSON.parse(localStorage.getItem('profileData'))
    if (profileData) {
        profileForm.name.value = profileData.name
        profileForm.surname.value = profileData.surname
        profileForm.age.value = profileData.age
        profileForm.email.value = profileData.email
        profileForm.phone.value = profileData.phone
        profileForm.avatar.src = profileData.avatar
    } else {
        profileForm.avatar.src = "https://i.ibb.co/S6dt6zn/Profile-avatar-placeholder-large.png"
    }
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getProfileData()
    setProfileData()
});