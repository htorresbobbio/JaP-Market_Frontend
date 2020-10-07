let articles = [];

function showCartContent(array) {
  const cartContainer = document.querySelector("#cart-container");
  let htmlContentToAppend = `<div class="row mt-5 mx-5 mb-4 px-3">
          <div class="col"></div>
          <div class="col-2 text-center font-weight-bold">Precio unitario</div>
          <div class="col-1 font-weight-bold">Cantidad</div>
          <div class="col-2 text-center font-weight-bold">Subtotal</div>
          <div class="col-1"></div>
        </div>`;

  array.forEach((article, index) => {
    let costUYU = article.unitCost;
    if (article.currency == "USD") {
      costUYU = article.unitCost * 40;
    }

    htmlContentToAppend += `<div id="article${index}" class="row align-items-center mx-5 px-3 py-1">
          <div class="col">
            <div class="p-2">
              <img
                src="${article.src}"
                alt=""
                width="70"
                class="img-fluid rounded shadow-sm"
              />
              <h5 class="ml-3 d-inline-block">${article.name}</h5>
            </div>
          </div>
          <div class="col-2 text-center">
            $ <p id="unitCost${index}" class="d-inline-block m-0">${costUYU}</p>
          </div>
          <div class="col-1">
            <input
              type="number"
	      id="count${index}"
              class="form-control"
              style="width: 4rem"
              min="1"
              value="${article.count}"
	      onchange="calcSubtotal()"
            />
          </div>
          <div class="col-2 text-center font-weight-bold">$ <p id="subtotal${index}" class="d-inline-block m-0"></p></div>
            
          <div class="col-1 text-center">
            <a href="#" class="text-dark"><i class="fa fa-trash"></i></a>
          </div>
      </div>`;
  });
  cartContainer.innerHTML = htmlContentToAppend;
  calcSubtotal();
}

function calcSubtotal() {
  articles.forEach((article, index) => {
    const unitCost = parseInt(
      document.querySelector(`#unitCost${index}`).innerHTML
    );
    const count = document.querySelector(`#count${index}`).value;
    const subtotal = document.querySelector(`#subtotal${index}`);
    subtotal.innerHTML = unitCost * count;
  });
  calcProductTotal();
}

function calcProductTotal() {
  let productTotal = 0;
  articles.forEach((article, index) => {
    const subtotal = parseInt(
      document.querySelector(`#subtotal${index}`).innerHTML
    );
    productTotal += subtotal;
  });
  document.querySelector("#product-subtotal").innerHTML = productTotal;
  calcTotal();
}

function calcTotal() {
  const productTotal = parseInt(
    document.querySelector("#product-subtotal").innerHTML
  );
  const shippingCost = parseInt(
    document.querySelector("#shipping-cost").innerHTML
  );

  document.querySelector("#total").innerHTML = productTotal + shippingCost;
}

document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(CART_INFO_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      articles = resultObj.data.articles;
      showCartContent(articles);
    }
  });
});
