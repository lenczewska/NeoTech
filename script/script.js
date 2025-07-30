let next = document.querySelector('.next');
let prev = document.querySelector('.prev');

next?.addEventListener('click', function () {
  let items = document.querySelectorAll('.item');
  document.querySelector('.slide')?.append(items[0]);
});

prev?.addEventListener('click', function () {
  let items = document.querySelectorAll('.item');
  document.querySelector('.slide')?.prepend(items[items.length - 1]);
});


document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".cards");
  const searchInput = document.getElementById("searchInput");
  const sortBtn = document.getElementById("sortBtn");


  let currentData = [...data];

  function renderCards(items) {
    container.innerHTML = "";
    items.forEach(item => {
      const card = document.createElement("div");
      card.className = `
                          bg-[#111827] 
                          border border-[#2f2f2f] 
                          rounded-xl 
                          shadow-[0_4px_30px_rgba(0,255,255,0.05)] 
                          hover:shadow-[0_6px_40px_rgba(0,255,255,0.2)] 
                          transition-all duration-300 
                          text-white 
                          p-4 
                          flex flex-col 
                          justify-between 
                          space-y-3 
                          h-full
                        
                         
                                    `;
                              card.innerHTML = `
                          <img 
                            src="${item.images[0]}" 
                            alt="${item.model}" 
                            class="w-full h-[300px] object-cover rounded-lg border border-[#2a2a2a]" 
                          />
                       
                          <div class="flex flex-col space-y-2 flex-grow">
                            <h2 class="text-lg font-semibold text-cyan-400 leading-tight">
                              ${item.brand} ${item.model}
                            </h2>
                       
                            <p class="text-sm text-gray-400 min-h-[1rem]">
                              ${item.category.toUpperCase()} • ${item.year}
                            </p>
                       
                            <p class="text-md font-bold text-white min-h-[1.25rem]">
                              ${item.price} ${item.currency}
                            </p>
                       
                            <p class="text-sm text-gray-500 min-h-[1rem]">
                              Şəhər: ${item.city}
                            </p>
                       
                            <p class="text-sm min-h-[1.25rem]">
                              ${item.credit
                                  ? '<span class="text-green-400">Kredit var</span>'
                                  : '<span class="text-gray-600">Kredit yoxdur</span>'} • 
                              ${item.barter
                                  ? '<span class="text-blue-400">Barter var</span>'
                                  : '<span class="text-gray-600">Barter yoxdur</span>'}
                            </p>
                            <div class="mt-4 flex flex-col sm:flex-row gap-3">
                            <button 
                          onclick='addToBasket(${JSON.stringify(item)})'
                          class="bg-[#ff00cc] text-white px-4 py-2 rounded-full w-[150px] hover:shadow-[0_0_20px_#ff00cc] transition duration-300">
                          Sifariş et
                                   </button>
                    
                            </div>
                          </div>
                              `;
                       


      container.append(card);
    });
  }


  renderCards(currentData);


  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    currentData = data.filter(item => {
      const fullName = (item.brand + " " + item.model).toLowerCase();
      return fullName.includes(query);
    });
    renderCards(currentData);
  });




  sortBtn.addEventListener("click", () => {
    currentData.sort((a, b) => {
      const nameA = (a.brand + " " + a.model).toLowerCase();
      const nameB = (b.brand + " " + b.model).toLowerCase();
      return nameA.localeCompare(nameB);
    });
    renderCards(currentData);
  });
});


const basketItemsContainer = document.getElementById('basket-items');
const totalPriceSpan = document.getElementById('total-price');

let basket = JSON.parse(localStorage.getItem("basket")) || [];

// Рендер корзины
function renderBasket() {
  basketItemsContainer.innerHTML = "";
  let total = 0;

  if (basket.length === 0) {
    basketItemsContainer.innerHTML = `<p class="text-gray-400">Səbətiniz boşdur.</p>`;
    totalPriceSpan.textContent = "0₼";
    return;
  }

  basket.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const card = document.createElement("div");
    card.className = "flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-gray-900 text-white shadow-[0_10px_20px_rgba(135,206,250,0.1)] border border-gray-700";

    card.innerHTML = `
      <img src="${item.images[0]}" alt="${item.model}" class="w-full md:w-[180px] h-[180px] object-cover rounded-lg border border-[#2a2a2a]" />

      <div class="flex flex-col justify-between flex-grow space-y-2">
        <div>
          <h2 class="text-xl font-semibold text-cyan-400">${item.brand} ${item.model}</h2>
          <p class="text-sm text-gray-400">${item.category.toUpperCase()} • ${item.year}</p>
          <p class="text-sm text-gray-500">Şəhər: ${item.city}</p>
          <p class="text-sm">
            ${item.credit
        ? '<span class="text-green-400">Kredit var</span>'
        : '<span class="text-gray-600">Kredit yoxdur</span>'} • 
            ${item.barter
        ? '<span class="text-blue-400">Barter var</span>'
        : '<span class="text-gray-600">Barter yoxdur</span>'}
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button class="px-3 py-1 bg-pink-700 text-white rounded-full text-xl" data-action="decrease" data-index="${index}">–</button>
          <span class="text-lg font-bold">${item.quantity}</span>
          <button class="px-3 py-1 bg-pink-700 text-white rounded-full text-xl" data-action="increase" data-index="${index}">+</button>
        </div>

        <p class="text-md font-bold text-white">Cəmi: ${itemTotal} ${item.currency}</p>

        <button class="mt-2 text-sm text-pink-400 hover:underline self-start" data-action="remove" data-index="${index}">
          Ləgv et
        </button>
      </div>
    `;

    basketItemsContainer.appendChild(card);
  });

 totalPriceSpan.textContent = `${total.toFixed(2)}₼`;

}

function addToBasket(product) {
  let basket = JSON.parse(localStorage.getItem("basket")) || [];

  const index = basket.findIndex(item => item.id === product.id);

  if (index !== -1) {
    basket[index].quantity += 1;
    showToast(`1 ədəd elavə olundu(${basket[index].quantity})`);
  } else {
    const newProduct = { ...product, quantity: 1 }; 
    basket.push(newProduct);
    showToast("Səbətə əlavə olundu");
  }

  localStorage.setItem("basket", JSON.stringify(basket));
  renderBasket();
}



function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = "fixed bottom-6 right-6 bg-pink-600 text-white px-4 py-2 rounded shadow-lg animate-fadeIn z-50";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}


basketItemsContainer.addEventListener("click", (e) => {
  const action = e.target.getAttribute("data-action");
  const index = e.target.getAttribute("data-index");

  if (action === "increase") {
    basket[index].quantity += 1;
  } else if (action === "decrease") {
    basket[index].quantity -= 1;
    if (basket[index].quantity <= 0) {
      basket.splice(index, 1); 
    }
  } else if (action === "remove") {
    basket.splice(index, 1);
  }

  localStorage.setItem("basket", JSON.stringify(basket));
  renderBasket();
});


renderBasket();
