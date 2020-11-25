let articles = [];

const cart_data = {
  subtotal: 0,
  shippingCost: 0,
  total: 0
}

const cartContainer = document.querySelector("#cart-container");
const cartSubtotalID = document.querySelector("#cart-subtotal")
const shippingCostID = document.querySelector("#shipping-cost");
const cartTotalID = document.getElementById("cart-total")

function removeArticle(index) {
  articles.splice(index, 1)
  showCartContent(articles)
}

function showCartContent(array) {
  cartContainer.innerHTML = ''
  document.getElementById("cart-articles-qty").innerHTML = array.length
  if (array.length <= 0) {
    cartContainer.innerHTML = `
    <div class="row mt-5 mx-5 mb-4 px-3 text-center">
      <div class="col">
        <h4>Tu carrito está vacío</h4>
        <p>Ve todos los <a href="products.html">productos</a> que tenemos disponibles!</p>
      </div>
    </div>
    `
    document.querySelector("#totals-container").style.display = "none"
    document.querySelector("#shipping-details-container").style.display = "none"
  } else {
    array.forEach((article, index) => {
      let costUYU = article.unitCost;
      if (article.currency == "USD") {
        costUYU = article.unitCost * 40;
      }

      cartContainer.innerHTML += `
                  <div class="row mb-4 align-items-center">
                    <div class="col-md-5 col-lg-3 col-xl-3">
                      <img class="img-fluid w-100"
                        src="img/products/${article.src.slice(4)}" alt="Sample">
                    </div>
                    <div class="col-md-7 col-lg-9 col-xl-9">
                      <div class="row mb-3 mt-3">
                        <div class="col-md-8 col-7">
                          <h5 class="mb-0">${article.name}</h5>
                        </div>
                        <div class="col-md-4 col-5">
                          <div class="input-group mb-0">
                            <div class="input-group-prepend">
                              <button
                                onclick="this.parentNode.parentNode.querySelector('input[type=number]').stepDown(); updateArticleTotal(${index})"
                                class="btn btn-primary"><i class="fas fa-minus"></i></button>
                            </div>
                            <input class="form-control text-center" id="article-qty${index}" min="1" value="${article.count}" oninput="updateArticleTotal(${index})" type="number">
                            <div class="input-group-append">
                              <button 
                                onclick="this.parentNode.parentNode.querySelector('input[type=number]').stepUp(); 
                                updateArticleTotal(${index})"
                                class="btn btn-primary"><i class="fas fa-plus"></i></button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row mb-3">
                        <div class="col-md-8 col-7">
                          <a onclick="removeArticle(${index})" type="button" class="small text-uppercase mr-3"><i
                              class="fas fa-trash-alt mr-1"></i> Eliminar</a>
                        </div>
                        <div class="col-md-4 col-5 text-center">
                          <p class="mb-0">Unidad <strong>$<span id="article-cost${index}">${article.unitCost}</strong></p>
                          <p class="mb-0">Subtotal <strong>$<span class="article-total" id="article-total${index}"></span></strong></p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr>
      `
      updateArticleTotal(index)
    })
    updateShippingCost()
  }
}

function updateArticleTotal(index) {
  const articleCostID = document.getElementById(`article-cost${index}`)
  const articleQtyID = document.getElementById(`article-qty${index}`)
  const articleTotalID = document.getElementById(`article-total${index}`)
  let cartSubtotalAcc = 0

  articleTotalID.innerHTML = parseInt(articleCostID.innerHTML) * parseInt(articleQtyID.value)

  Array.from(document.getElementsByClassName("article-total")).forEach(articleTotal => {
    cartSubtotalAcc += parseInt(articleTotal.innerHTML)
  });
  cartSubtotalID.innerHTML = cartSubtotalAcc
  updateShippingCost()
}

function updateShippingCost() {
  const shippingType = document.querySelector(".shipping-type:checked").value
  switch (shippingType) {
    case "premium":
      shippingCostID.innerHTML = parseInt(parseInt(cartSubtotalID.innerHTML) * 0.15)
      break
    case "express":
      shippingCostID.innerHTML = parseInt(parseInt(cartSubtotalID.innerHTML) * 0.07)
      break
    case "standard":
      shippingCostID.innerHTML = parseInt(parseInt(cartSubtotalID.innerHTML) * 0.05)
      break
  }
  updateCartTotal()
}

function updateCartTotal() {
  cartTotalID.innerHTML = parseInt(shippingCostID.innerHTML) + parseInt(cartSubtotalID.innerHTML)
}
// function calcTotal() {
//   document.querySelector("#total").innerHTML = parseInt(productTotal.innerHTML) + parseInt(shippingCost.innerHTML);
// }

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
      document.querySelector('#shipping-form').style.display = "none"
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
      // calcShippingCost()
    }
  });

  shippingForm = document.getElementById("shipping-form")
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


{/* <div id="article${index}" class="row align-items-center mx-5 px-3 py-1">
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
      </div> */}