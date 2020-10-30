/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const ORDER_ASC_BY_COST = "CostAsc";
const ORDER_DESC_BY_COST = "CostDesc"
const ORDER_DESC_BY_SOLD_COUNT = "Relevancia";
var currentProductsArray = [];
var currentSortCriteria = undefined;
var minCount = undefined;
var maxCount = undefined;
var searchText = undefined;

function sortProducts(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_COST) {
        result = array.sort(function (a, b) {
            let aCount = parseInt(a.cost);
            let bCount = parseInt(b.cost);

            if (aCount > bCount) { return 1; }
            if (aCount < bCount) { return -1; }
            return 0;
        });
    }
    else if (criteria === ORDER_DESC_BY_COST) {
        result = array.sort(function (a, b) {
            let aCount = parseInt(a.cost);
            let bCount = parseInt(b.cost);

            if (aCount > bCount) { return -1; }
            if (aCount < bCount) { return 1; }
            return 0;
        });
    }
    else if (criteria === ORDER_DESC_BY_SOLD_COUNT) {
        result = array.sort(function (a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if (aCount > bCount) { return -1; }
            if (aCount < bCount) { return 1; }
            return 0;
        });
    }
    return result;
}

function showProductsList() {

    // <a href="product-info.html"></a>
    let htmlContentToAppend = "";
    for (let i = 0; i < currentProductsArray.length; i++) {
        let product = currentProductsArray[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(product.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(product.cost) <= maxCount)) &&
            ((searchText == undefined) || ((product.name.toLowerCase().indexOf(searchText) != -1) || (product.description.toLowerCase().indexOf(searchText) != -1)))) {

            htmlContentToAppend += `
                <div class="col-lg-4 col-md-6">
                        <div class="card mb-3">
                            <img src="` + product.imgSrc + `" alt="` + product.description + `" class="card-img-top">
                            <div class="card-body">
                                <h5 class="card-title">`+ product.name + `</h4>
                                <h6 class="card-subtitle mb-3">` + product.cost + ` ${product.currency}</h5>
                                <p class="card-text">` + product.description + `</p>
                            </div>
                        </div>
                </div>
            `
        }

        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}

function sortAndShowProducts(sortCriteria, productsArray) {
    currentSortCriteria = sortCriteria;

    if (productsArray != undefined) {
        currentProductsArray = productsArray;
    }

    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    //Muestro las categorías ordenadas
    showProductsList();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            sortAndShowProducts(ORDER_DESC_BY_SOLD_COUNT, resultObj.data);
        }
    });

    document.getElementById("sortCostAsc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_ASC_BY_COST);
    });

    document.getElementById("sortCostDesc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_DESC_BY_COST);
    });

    document.getElementById("sortRelevance").addEventListener("click", function () {
        sortAndShowProducts(ORDER_DESC_BY_SOLD_COUNT);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function () {
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showProductsList();
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function () {
        //Obtengo el mínimo y máximo de los intervalos para filtrar por precio
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

        showProductsList();
    });

    document.getElementById("searchText").addEventListener("input", function () {
        searchText = document.getElementById("searchText").value.toLowerCase();
        showProductsList();
    })

    document.getElementById("searchClear").addEventListener("click", function () {
        document.getElementById("searchText").value = "";
        searchText = undefined;
        showProductsList();
    })
});