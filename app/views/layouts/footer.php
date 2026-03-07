</main>
<footer>
  <!-- Logo à gauche -->
  <div class="footer-left">
    <div class="logo"&copy; <?= date('Y') ?>>Nelegance. Tous droits réservés.</div>
  </div>

  <!-- Liens centraux -->
  <div class="footer-center">
    <a href="#">Accueil</a>
    <a href="#">Boutique</a>
    <a href="#">Panier</a>
    <a href="#">Contact</a>
  </div>

  <!-- Réseaux sociaux à droite -->
  <div class="footer-right">
    <a href="www.instagram.com">Instagram</a>
    <a href="www.facebook.com">Facebook</a>
  </div>
</footer>
<script>
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {

        this.innerText = "Ajouté ✓";
        this.style.background = "green";

        setTimeout(() => {
            window.location.href = "/cart/add/" + this.dataset.id;
        }, 600);

    });
});
const hamburger = document.getElementById('hamburger');
const nav = document.querySelector('.nav');
const overlay = document.getElementById('overlay');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    overlay.classList.toggle('active');
});

overlay.addEventListener('click', () => {
    hamburger.classList.remove('active');
    nav.classList.remove('active');
    overlay.classList.remove('active');
});

const cards = document.querySelectorAll('.product-card');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.style.opacity = 1;
            entry.target.style.transform = "translateY(0)";
        }
    });
}, { threshold: 0.1 });

cards.forEach(card => {
    card.style.opacity = 0;
    card.style.transform = "translateY(40px)";
    card.style.transition = "0.8s ease";
    observer.observe(card);
});

const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.style.opacity = 1;
            entry.target.style.transform = "translateY(0)";
        }
    });
});

sections.forEach(sec => {
    sec.style.opacity = 0;
    sec.style.transform = "translateY(50px)";
    sec.style.transition = "1s ease";
    observer.observe(sec);
});

window.addEventListener("load", () => {
    const hero = document.querySelector(".hero-content");
    hero.style.opacity = 0;
    hero.style.transform = "translateY(20px)";
    hero.style.transition = "1.2s ease";

    setTimeout(() => {
        hero.style.opacity = 1;
        hero.style.transform = "translateY(0)";
    }, 300);
});

</script>

</body>
</html>
