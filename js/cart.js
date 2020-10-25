let articles = [];

const productTotal = document.querySelector("#product-subtotal")

const shippingCost = document.querySelector("#shipping-cost");

function removeArticle(index) {
  articles.splice(index, 1)
  showCartContent(articles)
}

function showCartContent(array) {
  const cartContainer = document.querySelector("#cart-container");
  let htmlContentToAppend = `<div class="row mt-5 mx-5 mb-4 px-3">
          <div class="col"></div>
          <div class="col-2 text-center font-weight-bold">Precio unitario</div>
          <div class="col-1 font-weight-bold">Cantidad</div>
          <div class="col-2 text-center font-weight-bold">Subtotal</div>
          <div class="col-1"></div>
        </div>`;

  if (array.length <= 0) {
    cartContainer.innerHTML = `
    <div class="row mt-5 mx-5 mb-4 px-3 text-center">
      <div class="col">
        <h4>Tu carrito está vacío</h4>
        <p>Ve todos los <a href="products.html">productos</a> que tenemos disponibles!</p>
      </div>
    </div>
    `
    document.querySelector("#cart-details").style.display = "none"
  } else {
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
              style="width: 4.5rem"
              min="1"
              value="${article.count}"
              onchange="calcSubtotal()"
              required
            />
          </div>
          <div class="col-2 text-center font-weight-bold">$ <p id="subtotal${index}" class="d-inline-block m-0"></p></div>
            
          <div class="col-1 text-center">
            <a href="#" onclick="removeArticle(${index})" class="text-dark"><i class="fa fa-trash"></i></a>
          </div>
      </div>`;
    });
    cartContainer.innerHTML = htmlContentToAppend;
    calcSubtotal();
  }
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
  let totalAcc = 0
  articles.forEach((article, index) => {
    const subtotal = parseInt(
      document.querySelector(`#subtotal${index}`).innerHTML
    );
    totalAcc += subtotal;
  });
  productTotal.innerHTML = totalAcc
  calcShippingCost();
}

function calcShippingCost() {
  const shippingType = document.querySelector(".shipping-type:checked").value
  const productTotalValue = parseInt(productTotal.innerHTML)
  switch (shippingType) {
    case "premium":
      shippingCost.innerHTML = productTotalValue * 0.15
      break
    case "express":
      shippingCost.innerHTML = productTotalValue * 0.07
      break
    case "standard":
      shippingCost.innerHTML = productTotalValue * 0.05
      break
  }
  calcTotal()
}

function calcTotal() {
  document.querySelector("#total").innerHTML = parseInt(productTotal.innerHTML) + parseInt(shippingCost.innerHTML);
}

function showCCData() {
  const HTMLContainer = document.querySelector("#paymentOptionContent")
  HTMLContainer.innerHTML = `
  <div class="form-group">
    <label for="CCNumber">Número de tarjeta (entre 13 y 19 dígitos)</label>
    <input type="tel" id="CCNumber" class="form-control" pattern="[0-9]{13,16}" placeholder='xxxx-xxxx-xxxx-xxxx' required>
  </div>
  <div class="form-group">
    <label for="CCPaymentsQty">Cantidad de cuotas</label>
    <select class="form-control" id="CCPaymentsQty" required>
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>6</option>
      <option>12</option>
    </select>
  </div>
  `
}

function showTransferData() {
  const HTMLContainer = document.querySelector("#paymentOptionContent")
  HTMLContainer.innerHTML = `
  <div class="form-group">
    <label for="TransferBank">Banco</label>
    <select class="form-control" id="TransferBank" required>
      <option>BROU</option>
      <option>Itau</option>
      <option>BBVA</option>
      <option>Santander</option>
    </select>
  </div>
  <div class="form-group">
    <label for="AccountNumber">Número de cuenta</label>
    <input type="tel" id="AccountNumber" class="form-control" required>
  </div>
  `
}

function validatePaymentForm() {
  paymentForm = document.querySelector("#paymentForm")
  paymentForm.addEventListener('submit', (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (paymentForm.checkValidity()) {
      document.querySelector('#mainContainer').style.display = "none"
      document.querySelector('#successAlertContainer').classList.remove('d-none')
      $('#paymentModal').modal('hide')
    }
  })
}

document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(CART_INFO_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      articles = resultObj.data.articles;
      showCartContent(articles);
      calcShippingCost()
    }
  });

  shippingForm = document.querySelector("#shippingForm")
  shippingForm.addEventListener('submit', (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (shippingForm.checkValidity()) {
      $('#paymentModal').modal('show')
      validatePaymentForm()
    }
    shippingForm.classList.add('was-validated')
  })
});