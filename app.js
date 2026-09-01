const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");
const form = document.querySelector("#quoteForm");
const service = document.querySelector("#service");
const quantity = document.querySelector("#quantity");
const urgency = document.querySelector("#urgency");
const locationSelect = document.querySelector("#location");
const otherLocationField = document.querySelector("#otherLocationField");
const otherLocation = document.querySelector("#otherLocation");
const estimateValue = document.querySelector("#estimateValue");
const estimateText = document.querySelector("#estimateText");
const mediaInput = document.querySelector("#media");
const previewGrid = document.querySelector("#previewGrid");
const formSuccess = document.querySelector("#formSuccess");

menuToggle.addEventListener("click", () => {
  mainNav.classList.toggle("open");
});

let pricingConfig = null;

async function loadPricing() {
  try {
    const response = await fetch("pricing.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    pricingConfig = await response.json();
    updatePriceHighlights();
    calculateEstimate();
  } catch (error) {
    estimateValue.textContent = "Estimativa indisponível";
    estimateText.textContent = "Não foi possível carregar a tabela de preços.";
    console.error("Erro ao carregar pricing.json:", error);
  }
}

function updatePriceHighlights() {
  const currency = new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: pricingConfig.moeda,
    maximumFractionDigits: 0
  });

  document.querySelectorAll("[data-price-service]").forEach(element => {
    const serviceKey = element.dataset.priceService;
    const price = pricingConfig.servicos[serviceKey];

    if (!price) return;

    element.textContent = price.requerAvaliacao
      ? price.destaque || "Sob consulta"
      : `${currency.format(price.minimo)}–${currency.format(price.maximo)}`;
  });
}

function calculateEstimate() {
  const key = service.value;
  const qty = Math.max(1, Number(quantity.value || 1));

  if (!pricingConfig) {
    estimateValue.textContent = "A carregar preços...";
    estimateText.textContent = "Aguarde um momento.";
    return;
  }

  const urgencyFactor = pricingConfig.multiplicadoresUrgencia[urgency.value] ?? 1;

  const remoteFee = locationSelect.value === "Outra"
    ? pricingConfig.taxaOutraLocalidade
    : 0;

  if (!key) {
    estimateValue.textContent = "Selecione um serviço";
    estimateText.textContent = "O sistema mostrará uma estimativa quando houver dados suficientes.";
    return;
  }

  const p = pricingConfig.servicos[key];

  if (p?.requerAvaliacao) {
    estimateValue.textContent = "Avaliação necessária";
    estimateText.textContent = p.observacao;
    return;
  }

  if (!p) {
    estimateValue.textContent = "Sob consulta";
    estimateText.textContent = "Este serviço ainda não tem regra automática.";
    return;
  }

  let min = p.minimo + Math.max(0, qty - 1) * p.adicionalMinimo + remoteFee;
  let max = p.maximo + Math.max(0, qty - 1) * p.adicionalMaximo + remoteFee;

  min = Math.round(min * urgencyFactor);
  max = Math.round(max * urgencyFactor);

  estimateValue.textContent = `€${min}–€${max}`;
  estimateText.textContent = p.observacao;
}

[service, quantity, urgency, locationSelect].forEach(el => {
  el.addEventListener("input", calculateEstimate);
});

loadPricing();

function toggleOtherLocation() {
  const isOther = locationSelect.value === "Outra";
  otherLocationField.hidden = !isOther;
  otherLocation.required = isOther;

  if (!isOther) otherLocation.value = "";
}

locationSelect.addEventListener("change", toggleOtherLocation);
toggleOtherLocation();

let selectedFiles = [];

mediaInput.addEventListener("change", () => {
  selectedFiles = [...mediaInput.files].slice(0, 6);
  renderPreviews();
});

function renderPreviews() {
  previewGrid.innerHTML = "";

  selectedFiles.forEach((file, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "preview-item";

    const url = URL.createObjectURL(file);
    const isVideo = file.type.startsWith("video/");
    const media = document.createElement(isVideo ? "video" : "img");

    media.src = url;

    if (isVideo) {
      media.controls = true;
      media.muted = true;
    } else {
      media.alt = file.name;
    }

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "×";

    remove.addEventListener("click", () => {
      selectedFiles.splice(index, 1);
      renderPreviews();
    });

    wrapper.append(media, remove);
    previewGrid.appendChild(wrapper);
  });
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const formData = new FormData(form);

  const request = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    location: formData.get("location") === "Outra"
      ? formData.get("otherLocation")
      : formData.get("location"),
    service: formData.get("service"),
    quantity: formData.get("quantity"),
    urgency: formData.get("urgency"),
    description: formData.get("description"),
    media: selectedFiles.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size
    }))
  };

  localStorage.setItem(
    "voltagem-luminosa-last-request",
    JSON.stringify(request, null, 2)
  );

  formSuccess.hidden = false;

  console.log("Pedido demo:", request);
});
