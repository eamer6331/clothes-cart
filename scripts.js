//show data in indexpage 

let productlist = document.querySelector(".product-list")
if (productlist) {
    mainobject();
}
function mainobject () {

    products.forEach((item, index) => {
      productlist.innerHTML += `
         <div class="productcard">
        <div class="img-box">
          <img src="${item.colors[0].mainImage}" />
        </div>
        <h2 class="title">${item.title}</h2>
        <span class="price">${item.price}</span>
      </div>`;
    });
  const allcards = document.querySelectorAll(".productcard");
  allcards.forEach((card,index) => {
      card.onclick = () => {
        localStorage.setItem("product",JSON.stringify(products[index]))
      window.location.href = "product-detail.html";
    };
  });
   
}
//show data in product-detail
function productdetail() {
  const title = document.querySelector(".title");
  const description = document.querySelector(".description");
  const thumbnaillist = document.querySelector(".thumbnail-list");
  const product = JSON.parse(localStorage.getItem("product"));
  const sizeoption = document.querySelector(".size-option");
  const coloroption = document.querySelector(".color-option");
  const mainImage = product.colors[0].mainImage;
  let thumbnail = product.colors[0].thumbnails;
  const productcolor = product.colors;
  const mainimg = document.querySelector(".main-img");

  title.textContent = product.title;
  description.textContent = product.description;
  mainimg.innerHTML = `<img src="${mainImage}" alt="" />`;

  productcolor.forEach((color, index) => {
    coloroption.innerHTML += `
        <img src="${color.mainImage}" data-index="${index}" alt="">`;
  });

  // عرض الصور المصغرة
  thumbnaillist.innerHTML = `<img src="${mainImage}" alt="">`;
  thumbnail.forEach((item) => {
    // هنا نضيف الصورة فعليًا كعنصر <img> في الـ DOM
    const img = document.createElement("img");
    img.src = item;
    img.alt = "";
    img.onclick = () => {
      mainimg.innerHTML = `<img src="${item}" alt="">`;
    };
    thumbnaillist.appendChild(img);
  });

  // عرض المقاسات
  let productsize = product.colors[0].sizes;
  
  productsize.forEach((size) => {
    sizeoption.innerHTML += `<button>${size}</button>`;
  });

  const imgcolorchosen = document.querySelectorAll(".color-option img");
  imgcolorchosen.forEach((img) => {
    img.onclick = () => {
      const index = img.dataset.index;
      const chosencolor = productcolor[index];
      thumbnail = chosencolor.thumbnails;
      productsize = chosencolor.sizes;

      // تحديث المقاسات
      sizeoption.innerHTML = "";
      productsize.forEach((size) => {
        sizeoption.innerHTML += `<button>${size}</button>`;
      });

      // تحديث الصورة الرئيسية
      mainimg.innerHTML = `<img src="${img.src}" alt="" />`;

      // تحديث الصور المصغرة
      thumbnaillist.innerHTML = `<img src="${img.src}" alt="">`;
      thumbnail.forEach((item) => {
        const thumbImg = document.createElement("img");
        thumbImg.src = item;
        thumbImg.alt = "";
        thumbImg.onclick = () => {
          mainimg.innerHTML = `<img src="${item}" alt="">`;
        };
        thumbnaillist.appendChild(thumbImg);
      });
    };
  });
}

   
    
   
    
   
   
 

productdetail();

