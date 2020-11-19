const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
var currentCategoriesArray = [];
var currentSortCriteria = undefined;
var minCount = undefined;
var maxCount = undefined;

function sortCategories(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME) {
        result = array.sort(function (a, b) {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_NAME) {
        result = array.sort(function (a, b) {
            if (a.name > b.name) { return -1; }
            if (a.name < b.name) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_BY_PROD_COUNT) {
        result = array.sort(function (a, b) {
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);

            if (aCount > bCount) { return -1; }
            if (aCount < bCount) { return 1; }
            return 0;
        });
    }

    return result;
}

function showCategoriesList() {

    let htmlContentToAppend = "";
    for (let i = 0; i < currentCategoriesArray.length; i++) {
        let category = currentCategoriesArray[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))) {

            htmlContentToAppend += `
                <div class="col-xl-3 col-lg-4 col-md-6 my-3">
                        <div class="card">
                            <img src="img/categories/${category.imgSrc.slice(4)}" alt="${category.description}" class="card-img-top">
                            <div class="card-body">
                                <h5 class="card-title mt-3">${category.name}</h5>
                                <h6 class="card-subtitle mb-3">${category.productCount} artículos</h6>
                                <p class="card-text">${category.description}</p>
                                <a href="category-info.html" class="stretched-link"></a>
                            </div>
                        </div>
                </div>
            `
            // <a href="category-info.html" class="list-group-item list-group-item-action">
            //     <div class="row align-items-center">
            //         <div class="col-4 col-md-3">
            //             <img src="img/categories/${category.imgSrc.slice(4)}" alt="${category.description}" class="img-thumbnail">
            //         </div>
            //         <div class="col mx-2">
            //                 <h4 class="mb-1">${category.name}</h4>
            //                 <small class="text-muted">${category.productCount} artículos</small>
            //             <p class="mb-1">${category.description}</p>
            //         </div>
            //     </div >
            // </a >
        }

        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}

function sortAndShowCategories(sortCriteria, categoriesArray) {
    currentSortCriteria = sortCriteria;

    if (categoriesArray != undefined) {
        currentCategoriesArray = categoriesArray;
    }

    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);

    //Muestro las categorías ordenadas
    showCategoriesList();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
// eslint-disable-next-line no-unused-vars
document.addEventListener("DOMContentLoaded", function (e) {
    // eslint-disable-next-line no-undef
    getJSONData(CATEGORIES_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            sortAndShowCategories(ORDER_ASC_BY_NAME, resultObj.data);
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function () {
        sortAndShowCategories(ORDER_ASC_BY_NAME);
        document.querySelector("#sortDesc").classList.remove("active")
        document.querySelector("#sortByCount").classList.remove("active")
        document.querySelector("#sortAsc").classList.add("active")
    });

    document.getElementById("sortDesc").addEventListener("click", function () {
        sortAndShowCategories(ORDER_DESC_BY_NAME);
        document.querySelector("#sortDesc").classList.add("active")
        document.querySelector("#sortByCount").classList.remove("active")
        document.querySelector("#sortAsc").classList.remove("active")
    });

    document.getElementById("sortByCount").addEventListener("click", function () {
        sortAndShowCategories(ORDER_BY_PROD_COUNT);
        document.querySelector("#sortDesc").classList.remove("active")
        document.querySelector("#sortByCount").classList.add("active")
        document.querySelector("#sortAsc").classList.remove("active")
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function () {
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showCategoriesList();
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function () {
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0) {
            minCount = parseInt(minCount);
        }
        else {
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0) {
            maxCount = parseInt(maxCount);
        }
        else {
            maxCount = undefined;
        }

        showCategoriesList();
    });
});