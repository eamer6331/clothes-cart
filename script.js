// ====== اختيار العناصر حسب الصفحة ======
const productcontainer = document.querySelector(".product-list");
const productdetails = document.querySelector(".product-detail");
const contentcart = document.querySelector(".contentcart");
  const addtocartbtn = document.querySelector(".add-cart-btn");

if (productcontainer) {
  displayproducts();
} else if (productdetails) {
  displayproductdetails();
} else if (contentcart) {
  displaycontentcart();
  displaycarttotal();
}

// ====== عرض المنتجات ======
function displayproducts() {
  productcontainer.innerHTML = "";

  products.forEach((item, index) => {
    productcontainer.innerHTML += `
      <div class="productcard">
        <div class="img-box">
          <img src="${item.colors[0].mainImage}" />
        </div>
        <h2 class="title">${item.title}</h2>
        <span class="price">${item.price}</span>
      </div>`;
  });

  const imgboxes = document.querySelectorAll(".img-box");

  imgboxes.forEach((box, index) => {
    box.addEventListener("click", () => {
      localStorage.setItem("product", JSON.stringify(products[index]));
      window.location.href = "product-detail.html";
    });
  });
}

// ====== صفحة تفاصيل المنتج ======
function displayproductdetails() {
  const productdata = JSON.parse(localStorage.getItem("product"));
  if (!productdata) return;

  const title = document.querySelector(".title");
  const price = document.querySelector(".price");
  const mainimg = document.querySelector(".main-img");
  const thumbnaillist = document.querySelector(".thumbnail-list");
  const coloroption = document.querySelector(".color-option");
  const sizeoption = document.querySelector(".size-option");
  const description = document.querySelector(".description");
  const addtocartbtn = document.querySelector(".add-cart-btn");

  let currentColor = productdata.colors[0];
  let currentsize = currentColor.sizes[0];

  // ✅ تحديث الزر بناءً على حالة المنتج في الكارت
  function updateAddToCartButton() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = cart.some(
      (item) =>
        item.id === productdata.id &&
        item.color === currentColor.name &&
        item.size === currentsize
    );

    if (exists) {
      addtocartbtn.disabled = true;
      addtocartbtn.style.opacity = "0.6";
      addtocartbtn.style.cursor = "not-allowed";
      addtocartbtn.textContent = "Already in Cart";
    } else {
      addtocartbtn.disabled = false;
      addtocartbtn.style.opacity = "1";
      addtocartbtn.style.cursor = "pointer";
      addtocartbtn.textContent = "Add to Cart";
    }
  }

  // ✅ عرض الصور
  function renderImages(colorData) {
    mainimg.innerHTML = `<img src="${colorData.mainImage}" alt="">`;
    thumbnaillist.innerHTML = "";

    const allImages = [colorData.mainImage, ...colorData.thumbnails];
    allImages.forEach((imgSrc) => {
      const img = document.createElement("img");
      img.src = imgSrc;
      img.addEventListener("click", () => {
        mainimg.innerHTML = `<img src="${imgSrc}" alt="">`;
      });
      thumbnaillist.appendChild(img);
    });
  }

  // ✅ تحديث المقاسات
  function updateSizeOptions(colordata) {
    sizeoption.innerHTML = "";
    colordata.sizes.forEach((size) => {
      const btn = document.createElement("button");
      btn.textContent = size;
      if (size === currentsize) btn.classList.add("selected");
      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".size-option button")
          .forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        currentsize = size;
        updateAddToCartButton(); // 🟢 تحديث الزر عند تغيير المقاس
      });
      sizeoption.appendChild(btn);
    });
  }

  // ✅ عرض الألوان
  function renderColors() {
    coloroption.innerHTML = "";
    productdata.colors.forEach((color) => {
      const img = document.createElement("img");
      img.src = color.mainImage;
      img.alt = color.name;
      if (color.name === currentColor.name) img.classList.add("selected");

      img.addEventListener("click", () => {
        document
          .querySelectorAll(".color-option img")
          .forEach((i) => i.classList.remove("selected"));
        img.classList.add("selected");

        currentColor = color;
        renderImages(color);
        updateSizeOptions(color);
        updateAddToCartButton(); // 🟢 تحديث الزر عند تغيير اللون
      });

      coloroption.appendChild(img);
    });
  }

  // ✅ دالة الإضافة إلى الكارت
  function addtocart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItem = {
      id: productdata.id,
      title: productdata.title,
      price: productdata.price,
      image: currentColor.mainImage,
      color: currentColor.name,
      size: currentsize,
      description: productdata.description,
      quantity: 1,
    };

    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));

    addtocartbtn.disabled = true;
    addtocartbtn.style.opacity = "0.6";
    addtocartbtn.style.cursor = "not-allowed";
    addtocartbtn.textContent = "Added to Cart";

    updateCartCount();
    displaycontentcart();
    displaycarttotal();
  }

  // ✅ ربط الزر
  addtocartbtn.addEventListener("click", addtocart);

  // ✅ عرض البيانات الأساسية
  title.textContent = productdata.title;
  price.textContent = productdata.price;
  description.textContent = productdata.description;

  renderImages(currentColor);
  renderColors();
  updateSizeOptions(currentColor);
  updateAddToCartButton(); // 🟢 أول مرة
}


// ====== دالة إضافة للكارت ======
function addtocart(data, color, size) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartItem = {
    id: data.id,
    title: data.title,
    price: data.price,
    image: color.mainImage,
    color: color.name,
    size: size,
    description: data.description,
    quantity: 1,  
  };

  addtocartbtn.disabled = false;
  addtocartbtn.style.opacity = "1";
  addtocartbtn.style.cursor = "pointer";
  addtocartbtn.textContent = "Add to Cart";

  const exists = cart.some(
    (item) =>
      item.id === productdata.id &&
      item.color === currentColor.name &&
      item.size === currentsize
  );

  if (exists) {
    addtocartbtn.disabled = true; // 
    //     addtocartbtn.style.opacity = "0.6";
    addtocartbtn.style.cursor = "not-allowed";
    addtocartbtn.textContent = "added in cart";
  } else {
    addtocartbtn.onclick = () => {
      cart.push({
        id: productdata.id,
        title: productdata.title,
        price: productdata.price,
        image: currentColor.mainImage,
        color: currentColor.name,
        size: currentsize,
        description: productdata.description,
        quantity: 1,
      });

      localStorage.setItem("cart", JSON.stringify(cart));
      addtocartbtn.disabled = true;
      addtocartbtn.style.opacity = "0.6";
      addtocartbtn.style.cursor = "not-allowed";
      addtocartbtn.textContent = "Added to Cart";

      updateCartCount();
      displaycontentcart();
      displaycarttotal();
    };
  }

}

// ====== عرض محتوى الكارت ======
function displaycontentcart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const rowbottom = document.querySelector(".rowbottom");
  if (!rowbottom) return;

  rowbottom.innerHTML = "";

  cart.forEach((item, index) => {
    if (!item.quantity) item.quantity = 1;

    rowbottom.innerHTML += `
      <div class="cartcontents">
        <span class="imageclass">
          <img src="${item.image}" alt="${item.title}" />
          <div>
            <span>${item.title}</span>
            <div class="small">
              <small>${item.size}</small>
              <span>${item.color}</span>
            </div>
          </div>
        </span>
        <span class="price">${item.price}</span>
        <span>
          <input class="inputvalue" type="number" min="1" value="${
            item.quantity
          }">
        </span>
        <span class="totalprice">${(
          parseFloat(String(item.price).replace(/[^0-9.]/g, "")) * item.quantity
        ).toFixed(2)}</span>
        <span onclick="deleteitem(${index})" class="remove">X</span>
      </div>
    `;
  });

  const inputValues = document.querySelectorAll(".inputvalue");
  const totalElements = document.getElementsByClassName("totalprice");

  inputValues.forEach((input, index) => {
    input.addEventListener("input", () => {
      const quantity = parseInt(input.value) || 1;
      cart[index].quantity = quantity;
      localStorage.setItem("cart", JSON.stringify(cart));

      const itemPrice =
        parseFloat(String(cart[index].price).replace(/[^0-9.]/g, "")) || 0;
      const totalPrice = quantity * itemPrice;

      if (totalElements[index]) {
        totalElements[index].textContent = totalPrice.toFixed(2);
      }

      displaycarttotal();
    });
  });

  displaycarttotal();
}

// ====== حذف عنصر من الكارت ======
function deleteitem(id) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(id, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displaycontentcart();
  updateCartCount();
}

// ====== عرض cart total ======
function displaycarttotal() {
  const carttotalcontent = document.querySelector(".carttotal");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!carttotalcontent) return;

  const subtotal = cart.reduce((sum, item) => {
    const price = parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  carttotalcontent.innerHTML = `
    <div><span>cart total</span></div>
    <div><span>subtotal</span><span class="subtotal">$${subtotal.toFixed(
      2
    )}</span></div>
    <div><span>delivery free</span><span>free</span></div>
    <div><span>grand total</span><span>$${subtotal.toFixed(2)}</span></div>
    <button>proceed to checkout</button>
  `;
}
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemCount = document.querySelector(".cart-item");
  if (!cartItemCount) return;

  const totalItems = cart.length;

  if (totalItems > 0) {
    cartItemCount.textContent = totalItems;
    cartItemCount.style.display = "inline-block"; 
  } else {
    cartItemCount.style.display = "none";
  }
  
}
updateCartCount();


