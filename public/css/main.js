// Menu mobile
const burger = document.querySelector('.burger-menu');
const navList = document.querySelector('.nav-list');

burger.addEventListener('click', () => {
    navList.classList.toggle('show');
});

// Panier modal
const cartModal = document.getElementById('cartModal');
const closeCart = document.querySelector('.close-cart');

// Ouvrir le panier quand clic sur panier (ici exemple générique)
document.querySelectorAll('.cart-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        cartModal.style.display = 'flex';
    });
});

closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Fermer au clic dehors
window.addEventListener('click', (e) => {
    if(e.target === cartModal){
        cartModal.style.display = 'none';
    }
});
