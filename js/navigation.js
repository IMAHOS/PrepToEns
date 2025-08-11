// Gestion de la navigation et des interactions
document.addEventListener('DOMContentLoaded', function() {
    // Activer les tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Gestion des cartes cliquables
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            if (target) {
                window.location.href = target;
            }
        });
    });

    // Gestion du bouton retour
    document.querySelectorAll('.back-button').forEach(btn => {
        btn.addEventListener('click', function() {
            window.history.back();
        });
    });

    // Marquer la page active dans la navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
});