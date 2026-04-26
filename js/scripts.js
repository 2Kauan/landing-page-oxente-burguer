/**
 * OXENTE BURGER — Landing Page Scripts
 * ═══════════════════════════════════════════════════════════════════════════════
 * Interatividade de alta performance, animações otimizadas e tracking B2C.
 */

// ─── Elementos DOM ───────────────────────────────────────────────────────────
const menuToggle = document.getElementById("menuToggle");
const navLista = document.getElementById("navLista");
const modalDemo = document.getElementById("modalDemo");
const modalFechar = document.getElementById("modalFechar");
const header = document.querySelector(".cabecalho");

// ─── Menu Mobile (UX Fluida) ─────────────────────────────────────────────────
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navLista.classList.toggle("ativo");
    menuToggle.classList.toggle("ativo");
  });
}

// Fechar menu automaticamente ao selecionar uma opção
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navLista.classList.remove("ativo");
    menuToggle?.classList.remove("ativo");
  });
});

// ─── Lógica do Modal (Prevenção de Scroll do Fundo) ──────────────────────────
function abrirModal() {
  if (!modalDemo) return;
  modalDemo.classList.add("ativo");
  document.body.style.overflow = "hidden"; // Impede o fundo de rolar
}

function fecharModal() {
  if (!modalDemo) return;
  modalDemo.classList.remove("ativo");
  document.body.style.overflow = ""; // Restaura o scroll
}

// Bind de botões genéricos de CTA para o Modal
document
  .querySelectorAll("#btnDemoHero, .cta-nav, .cta-final .btn-primario")
  .forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // Evita conflito se o botão também for uma âncora
      if (btn.tagName === "A" && btn.getAttribute("href") === "#contato")
        e.preventDefault();
      abrirModal();
    });
  });

if (modalFechar) modalFechar.addEventListener("click", fecharModal);

// Fechar clicando fora da caixa de conteúdo
if (modalDemo) {
  modalDemo.addEventListener("click", (e) => {
    if (e.target === modalDemo) fecharModal();
  });
}

// Fechar via teclado (Acessibilidade)
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalDemo?.classList.contains("ativo")) {
    fecharModal();
  }
});

// ─── Scroll Suave com Compensação de Altura (Header Offset) ──────────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#") return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();

      // Calcula a altura exata do header fixo para não cobrir os títulos
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = targetPosition - headerHeight - 30; // 30px de respiro extra

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  });
});

// ─── Animações de Entrada (Stagger Effect + Performance) ─────────────────────
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const fadeObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      // Aplica um pequeno delay calculado com base no index para criar efeito cascata
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, el.dataset.delay || 0);

      // Para de observar o elemento após animar (melhora drástica de FPS no mobile)
      observer.unobserve(el);
    }
  });
}, observerOptions);

// Prepara e observa as seções limpas (Removido loops inúteis de tabelas B2B)
const elementosAnimados = document.querySelectorAll(
  ".card-aplicacao, .feature-card, .flow-step",
);

elementosAnimados.forEach((el, index) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(24px)";
  el.style.transition =
    "opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.2, 0.65, 0.35, 1)";

  // Agrupa os delays a cada 4 elementos para que o stagger faça sentido por linha visual
  el.dataset.delay = (index % 4) * 100;
  fadeObserver.observe(el);
});

// ─── Header Sticky com Sombra Dinâmica ───────────────────────────────────────
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  if (scrollTop > 50) {
    header?.style.setProperty("box-shadow", "0 4px 20px rgba(0, 0, 0, 0.4)");
    header?.style.setProperty("background", "rgba(13, 13, 15, 0.95)");
  } else {
    header?.style.setProperty("box-shadow", "none");
    header?.style.setProperty("background", "rgba(13, 13, 15, 0.8)");
  }
});

// ─── Analytics B2C (Mapeando Intenção do Cliente) ────────────────────────────
function rastrearIntencao(evento, dados = {}) {
  console.log(`📊 [Analytics] ${evento}:`, dados);
  // Futuro: gtag('event', evento, dados); ou fbq('track', evento);
}

// Mapeia cliques dentro do modal para entender como os clientes preferem pedir
document.querySelectorAll(".modal-item").forEach((item) => {
  item.addEventListener("click", (e) => {
    const textoAcao = item.querySelector("span").textContent;
    rastrearIntencao("iniciou_pedido", {
      modalidade: textoAcao,
      url_destino: item.getAttribute("href"),
    });
  });
});

console.log("🍔 Oxente Burger Landing Page — Lógica B2C Iniciada com Sucesso.");
