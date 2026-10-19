const WHATSAPP_NUMBER = "5548996495663";
const ORDER_COUNTER_KEY = "camberth-next-order-number";
const DELIVERY_FEE = 6;
const MINIMUM_ORDER = 10;

const products = [
  {
    id: "espresso",
    category: "cafes",
    name: "Espresso Especial",
    description: "Dose de café especial, encorpada e aromática.",
    price: 8,
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=900&q=85",
    badge: "Clássico",
    options: ["Tradicional", "Longo"]
  },
  {
    id: "cappuccino",
    category: "cafes",
    name: "Cappuccino Mario",
    description: "Espresso, leite vaporizado e espuma cremosa.",
    price: 16,
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=85",
    badge: "Mais pedido",
    options: ["Leite integral", "Leite sem lactose", "Bebida vegetal"]
  },
  {
    id: "moka",
    category: "cafes",
    name: "Moka Caramelo",
    description: "Café, chocolate, leite cremoso e toque de caramelo.",
    price: 19,
    image: "https://images.unsplash.com/photo-1578374173705-969cbe6f2d6b?auto=format&fit=crop&w=900&q=85",
    badge: "Destaque",
    options: ["Quente", "Gelado"]
  },
  {
    id: "coado",
    category: "cafes",
    name: "Café Coado Especial",
    description: "Preparo delicado para destacar os aromas do grão.",
    price: 15,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",
    options: ["V60", "Prensa francesa"]
  },
  {
    id: "croissant",
    category: "brunch",
    name: "Croissant Artesanal",
    description: "Massa folhada, leve e amanteigada, assada no dia.",
    price: 14,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85",
    badge: "Artesanal",
    options: ["Tradicional", "Presunto e queijo", "Chocolate"]
  },
  {
    id: "brie-parma",
    category: "brunch",
    name: "Sanduíche Brie & Parma",
    description: "Combinação de queijo brie, presunto parma e folhas frescas.",
    price: 32,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=85",
    badge: "Recomendado",
    options: ["Pão da casa", "Croissant"]
  },
  {
    id: "pao-queijo",
    category: "brunch",
    name: "Pão de Queijo",
    description: "Porção quentinha para acompanhar seu café.",
    price: 10,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
    options: ["3 unidades", "5 unidades"]
  },
  {
    id: "torta",
    category: "doces",
    name: "Torta Artesanal do Dia",
    description: "Fatia de torta artesanal; consulte o sabor disponível.",
    price: 18,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
    badge: "Da vitrine",
    options: ["Sabor do dia"]
  },
  {
    id: "mousse",
    category: "doces",
    name: "Mousse de Chocolate",
    description: "Sobremesa cremosa de chocolate com finalização delicada.",
    price: 17,
    image: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=900&q=85",
    options: ["Tradicional"]
  },
  {
    id: "creme-brulee",
    category: "doces",
    name: "Crème Brûlée",
    description: "Creme delicado com cobertura caramelizada crocante.",
    price: 19,
    image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&w=900&q=85",
    badge: "Sobremesa",
    options: ["Tradicional"]
  },
  {
    id: "bolo-sem-gluten",
    category: "especiais",
    name: "Bolo sem Glúten",
    description: "Fatia artesanal para quem busca uma opção sem glúten.",
    price: 17,
    image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=900&q=85",
    badge: "Sem glúten",
    options: ["Sabor do dia"]
  },
  {
    id: "brownie-sem-lactose",
    category: "especiais",
    name: "Brownie sem Lactose",
    description: "Brownie intenso de chocolate, preparado sem lactose.",
    price: 16,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=85",
    badge: "Sem lactose",
    options: ["Tradicional"]
  }
];

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const state = { filter: "todos", cart: [], nextCartId: 1 };

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const menuGrid = $("#menuGrid");
const cartDrawer = $("#cartDrawer");
const cartBackdrop = $("#cartBackdrop");
const cartList = $("#cartList");
const floatingCart = $(".floating-cart");
const checkout = $("#checkout");
const orderMessage = $("#orderMessage");
const nextOrderNumber = $("#nextOrderNumber");
const deliveryMode = $("#deliveryMode");
const addressGroup = $("#addressGroup");
const paymentMethod = $("#paymentMethod");
const changeGroup = $("#changeGroup");
const customerCpf = $("#customerCpf");

function formatOrderNumber(number) {
  return `#${String(number).padStart(4, "0")}`;
}

function getNextOrderNumber() {
  const stored = Number(localStorage.getItem(ORDER_COUNTER_KEY));
  return Number.isFinite(stored) && stored > 0 ? stored : 1;
}

function updateNextOrderNumber() {
  nextOrderNumber.textContent = `Próximo pedido ${formatOrderNumber(getNextOrderNumber())}`;
}

function reserveOrderNumber() {
  const current = getNextOrderNumber();
  localStorage.setItem(ORDER_COUNTER_KEY, String(current + 1));
  updateNextOrderNumber();
  return formatOrderNumber(current);
}

function getCartEntries() {
  return state.cart.map((cartItem) => ({
    ...products.find((product) => product.id === cartItem.productId),
    ...cartItem
  }));
}

function itemUnitPrice(item) {
  if (item.id === "pao-queijo" && item.option === "5 unidades") return item.price + 5;
  if (item.id === "croissant" && item.option !== "Tradicional") return item.price + 5;
  if (item.id === "cappuccino" && item.option === "Bebida vegetal") return item.price + 3;
  return item.price;
}

function calculateTotals() {
  const subtotal = getCartEntries().reduce(
    (sum, item) => sum + itemUnitPrice(item) * item.quantity,
    0
  );
  const deliveryFee = deliveryMode.value === "entrega" && subtotal > 0 ? DELIVERY_FEE : 0;
  return { subtotal, deliveryFee, total: subtotal + deliveryFee };
}

function renderMenu() {
  const visibleProducts = products.filter(
    (product) => state.filter === "todos" || product.category === state.filter
  );

  menuGrid.innerHTML = visibleProducts.map((product) => `
    <article class="menu-item">
      <div class="item-media">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        ${product.badge ? `<span class="item-badge">${product.badge}</span>` : ""}
      </div>
      <div class="item-body">
        <div class="item-title">
          <h3>${product.name}</h3>
          <span class="price">${money.format(product.price)}</span>
        </div>
        <p class="item-description">${product.description}</p>
        <button class="add-button" type="button" data-add="${product.id}">Adicionar</button>
      </div>
    </article>
  `).join("");
}

function renderCart() {
  const entries = getCartEntries();

  cartList.innerHTML = entries.length
    ? entries.map((item) => `
      <article class="cart-row" data-cart-id="${item.cartId}">
        <div class="cart-row-top">
          <strong>${item.name}</strong>
          <span>${money.format(itemUnitPrice(item) * item.quantity)}</span>
        </div>
        <div class="qty-controls">
          <button class="qty-button" type="button" data-decrease="${item.cartId}" aria-label="Diminuir quantidade">−</button>
          <span>${item.quantity}</span>
          <button class="qty-button" type="button" data-increase="${item.cartId}" aria-label="Aumentar quantidade">+</button>
        </div>
        <div class="item-options">
          <select data-option="${item.cartId}" aria-label="Escolher opção">
            ${item.options.map((option) => `<option value="${option}" ${option === item.option ? "selected" : ""}>${option}</option>`).join("")}
          </select>
          <input class="item-note" data-note="${item.cartId}" value="${item.note}" placeholder="Observação do item" />
        </div>
      </article>
    `).join("")
    : '<p class="empty-cart">Escolha um item para começar.</p>';

  const totals = calculateTotals();
  $("#subtotal").textContent = money.format(totals.subtotal);
  $("#deliveryFee").textContent = money.format(totals.deliveryFee);
  $("#grandTotal").textContent = money.format(totals.total);
  $$("[data-cart-total]").forEach((element) => { element.textContent = money.format(totals.total); });
  $$("[data-cart-count]").forEach((element) => { element.textContent = state.cart.reduce((sum, item) => sum + item.quantity, 0); });
  floatingCart.classList.toggle("visible", entries.length > 0);
  checkout.disabled = entries.length === 0;
}

function addItem(productId, button) {
  const product = products.find((item) => item.id === productId);
  state.cart.push({
    cartId: state.nextCartId,
    productId,
    quantity: 1,
    option: product.options[0],
    note: ""
  });
  state.nextCartId += 1;
  orderMessage.textContent = "";
  renderCart();

  if (button) {
    const original = button.textContent;
    button.textContent = "Adicionado";
    button.classList.add("added");
    window.setTimeout(() => {
      button.textContent = original;
      button.classList.remove("added");
    }, 900);
  }
}

function openCart() {
  cartBackdrop.hidden = false;
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("cart-open");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("cart-open");
  window.setTimeout(() => { cartBackdrop.hidden = true; }, 260);
}

function formatCpf(value) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function updateDeliveryMode() {
  const isDelivery = deliveryMode.value === "entrega";
  addressGroup.classList.toggle("hidden", !isDelivery);
  ["street", "addressNumber", "addressComplement", "district", "referencePoint"].forEach((id) => {
    $(`#${id}`).required = isDelivery;
  });
  renderCart();
}

function updatePaymentMode() {
  const isCash = paymentMethod.value === "Dinheiro";
  changeGroup.classList.toggle("hidden", !isCash);
  $("#changeFor").required = isCash;
}

function validateOrder() {
  if (calculateTotals().subtotal < MINIMUM_ORDER) {
    orderMessage.textContent = `O pedido mínimo é ${money.format(MINIMUM_ORDER)}.`;
    return false;
  }

  const fields = [
    ["customerName", "Nome completo"],
    ["customerCpf", "CPF"],
    ["paymentMethod", "Forma de pagamento"]
  ];

  if (deliveryMode.value === "entrega") {
    fields.push(
      ["street", "Rua"],
      ["addressNumber", "Número"],
      ["addressComplement", "Complemento"],
      ["district", "Bairro"],
      ["referencePoint", "Ponto de referência"]
    );
  }

  if (paymentMethod.value === "Dinheiro") fields.push(["changeFor", "Troco"]);

  for (const [id, label] of fields) {
    const field = $(`#${id}`);
    if (!field.value.trim()) {
      orderMessage.textContent = `Preencha: ${label}.`;
      field.focus();
      return false;
    }
  }

  if (customerCpf.value.replace(/\D/g, "").length !== 11) {
    orderMessage.textContent = "Digite um CPF com 11 números.";
    customerCpf.focus();
    return false;
  }

  return true;
}

menuGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) addItem(button.dataset.add, button);
});

$(".filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  state.filter = button.dataset.filter;
  $$(".filter").forEach((filter) => filter.classList.toggle("active", filter === button));
  renderMenu();
});

cartList.addEventListener("click", (event) => {
  const increase = event.target.closest("[data-increase]");
  const decrease = event.target.closest("[data-decrease]");

  if (increase) {
    state.cart.find((item) => item.cartId === Number(increase.dataset.increase)).quantity += 1;
  }

  if (decrease) {
    const cartId = Number(decrease.dataset.decrease);
    const item = state.cart.find((entry) => entry.cartId === cartId);
    if (item.quantity === 1) state.cart = state.cart.filter((entry) => entry.cartId !== cartId);
    else item.quantity -= 1;
  }

  if (increase || decrease) renderCart();
});

cartList.addEventListener("change", (event) => {
  const select = event.target.closest("[data-option]");
  if (!select) return;
  state.cart.find((item) => item.cartId === Number(select.dataset.option)).option = select.value;
  renderCart();
});

cartList.addEventListener("input", (event) => {
  const note = event.target.closest("[data-note]");
  if (!note) return;
  state.cart.find((item) => item.cartId === Number(note.dataset.note)).note = note.value;
});

$$("[data-open-cart]").forEach((button) => button.addEventListener("click", openCart));
$$("[data-close-cart]").forEach((button) => button.addEventListener("click", closeCart));
cartBackdrop.addEventListener("click", closeCart);
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeCart(); });

deliveryMode.addEventListener("change", updateDeliveryMode);
paymentMethod.addEventListener("change", updatePaymentMode);
customerCpf.addEventListener("input", () => { customerCpf.value = formatCpf(customerCpf.value); });

checkout.addEventListener("click", () => {
  if (!state.cart.length || !validateOrder()) return;

  const orderNumber = reserveOrderNumber();
  const entries = getCartEntries();
  const totals = calculateTotals();
  const isDelivery = deliveryMode.value === "entrega";
  const address = isDelivery
    ? `${$("#street").value.trim()}, ${$("#addressNumber").value.trim()} - ${$("#addressComplement").value.trim()}, ${$("#district").value.trim()}`
    : "Retirada no balcão";

  const itemLines = entries.map((item) => [
    `- ${item.quantity}x ${item.name}: ${money.format(itemUnitPrice(item) * item.quantity)}`,
    `  Opção: ${item.option}`,
    `  Observação: ${item.note.trim() || "Sem observação"}`
  ].join("\n"));

  const message = [
    `Olá, quero fazer o pedido ${orderNumber} no Mario:`,
    "",
    `Pedido: ${orderNumber}`,
    `Nome: ${$("#customerName").value.trim()}`,
    `CPF: ${customerCpf.value.trim()}`,
    `Forma: ${isDelivery ? "Entrega" : "Retirada"}`,
    `Endereço: ${address}`,
    isDelivery ? `Referência: ${$("#referencePoint").value.trim()}` : "",
    `Pagamento: ${paymentMethod.value}`,
    paymentMethod.value === "Dinheiro" ? `Troco para: ${$("#changeFor").value.trim()}` : "",
    "",
    "Itens:",
    ...itemLines,
    "",
    `Subtotal: ${money.format(totals.subtotal)}`,
    `Entrega: ${money.format(totals.deliveryFee)}`,
    `Total: ${money.format(totals.total)}`,
    "",
    `Observações gerais: ${$("#notes").value.trim() || "Sem observações"}`
  ].filter(Boolean).join("\n");

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  orderMessage.innerHTML = `${orderNumber} pronto. <a href="${whatsappUrl}" target="_blank" rel="noopener">Abrir WhatsApp</a>`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

renderMenu();
renderCart();
updateNextOrderNumber();
updateDeliveryMode();
updatePaymentMode();
