var product = {};
var comments = [];
var userLogged = undefined;

function showImagesGallery(array) {
    let htmlContentToAppend = "";

    for (let i = 0; i < array.length; i++) {
        let imageSrc = array[i];

        htmlContentToAppend += `
        <div class="col-lg-3 col-md-4 col-6">
            <div class="d-block mb-4 h-100">
                <img class="img-fluid img-thumbnail" src="` + imageSrc + `" alt="">
            </div>
        </div>
        `

        document.getElementById("productImagesGallery").innerHTML = htmlContentToAppend;
    }
}

function showComments(array) {
    let htmlContentToAppend = "";
    for (let i = 0; i < array.length; i++) {
        let comment = array[i];
        let starRatingHTML = "";
        for (let i = 1; i <= comment.score; i++) {
            starRatingHTML += "<span class='fa fa-star checked'></span>"
        }
        for (let i = comment.score + 1; i <= 5; i++) {
            starRatingHTML += "<span class='fa fa-star'></span>"
        }
        htmlContentToAppend += `<div class="mt-2"><strong>Calificación:</strong> ${starRatingHTML}</div>
        <p class="mt-1 mb-2">${comment.description}</p>
        <div class="mb-5 ml-4"><h6 class="font-weight-bold">${comment.user}</h6>
        <em>Publicado el ${comment.dateTime}</em></div>`
        document.getElementById("productComments").innerHTML = htmlContentToAppend;
    }
}

function getFormatedDate() {
    let timeNow = new Date()
    let dateTime = ""
    dateTime = `${timeNow.getFullYear()}-${timeNow.getMonth() + 1}-${timeNow.getDate()} ${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}`
    return dateTime
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    userLogged = JSON.parse(sessionStorage.getItem('User-Logged'));

    getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            product = resultObj.data;

            let productNameHTML = document.getElementById("productName");
            let productDescriptionHTML = document.getElementById("productDescription");
            let productCostHTML = document.getElementById("productCost");
            let productSoldCountHTML = document.getElementById("productSoldCount");
            let productCategory = document.getElementById("productCategory");

            productNameHTML.innerHTML = product.name;
            productDescriptionHTML.innerHTML = product.description;
            productCostHTML.innerHTML = `${product.cost} ${product.currency}`;
            productSoldCountHTML.innerHTML = product.soldCount;
            productCategory.innerHTML = product.category;

            //Muestro las imagenes en forma de galería
            showImagesGallery(product.images);
        }
    });
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            comments = resultObj.data;
            showComments(comments);
        }
    })

    if (userLogged != undefined) {
        document.getElementById("reviewForm").style.display = "inline"
    }

    document.getElementById("sendReview").addEventListener("click", function () {
        let score = parseInt(document.querySelector('input[name="score"]:checked').value);
        let description = document.getElementById("userComment");
        let newReview = { score: score, description: description.value, user: userLogged.email, dateTime: getFormatedDate() }
        comments.push(newReview)
        showComments(comments);
        description.value = "";
    })
});
