// Réponses correctes pour chaque QCM
const correctAnswers = {
    'sciences-theme1': {
        'q1': 'a',
        'q2': 'a', 
        'q3': 'a'
    },
    'francais-primaire': {
        'q1': 'b',
        'q2': 'c',
        'q3': 'a'
    },
    'maths-primaire': {
        'q1': 'a',
        'q2': 'b',
        'q3': 'c'
    },
    'didactique-maths': {
        'q1': 'b',
        'q2': 'a',
        'q3': 'a'
    },
    'discipline-maths': {
        'q1': 'c',
        'q2': 'b',
        'q3': 'a'
    },
    'sciences-education': {
        'q1': 'a',
        'q2': 'c',
        'q3': 'b'
    }
};

// Feedback personnalisé
const feedbackMessages = [
    { min: 0, max: 33, message: "Vous devriez revoir les bases de la didactique mathématique." },
    { min: 34, max: 66, message: "Pas mal ! Quelques révisions ciblées vous seraient bénéfiques." },
    { min: 67, max: 100, message: "Excellent travail ! Vous maîtrisez bien ces concepts." },
    {
        min: 0,
        max: 33,
        message: "Consultez les ouvrages de référence et révisez les concepts clés."
    },
    {
        min: 34,
        max: 66,
        message: "Bon début, approfondissez avec des études de cas concrets."
    },
    {
        min: 67,
        max: 100,
        message: "Très bonne maîtrise, concentrez-vous sur les sujets d'actualité éducative."
    }
];

// Initialisation du QCM
document.addEventListener('DOMContentLoaded', function() {
    const qcmForm = document.getElementById('qcmForm');
    
    if (qcmForm) {
        qcmForm.addEventListener('submit', function(e) {
            e.preventDefault();
            evaluateQCM(this);
        });
    }
    
    // Gestion du bouton "Recommencer"
    const retryBtn = document.getElementById('retryBtn');
    if (retryBtn) {
        retryBtn.addEventListener('click', function() {
            window.location.reload();
        });
    }
});

// Évaluation du QCM
function evaluateQCM(form) {
    const qcmType = form.getAttribute('data-qcm-type');
    const answers = correctAnswers[qcmType];
    let score = 0;
    
    // Vérifier chaque réponse
    Object.keys(answers).forEach(question => {
        const selectedAnswer = form.querySelector(`input[name="${question}"]:checked`);
        
        if (selectedAnswer && selectedAnswer.value === answers[question]) {
            score++;
        }
    });
    
    // Calcul du score
    const totalQuestions = Object.keys(answers).length;
    const percentage = Math.round((score / totalQuestions) * 100);
    
    // Affichage des résultats
    displayResults(score, totalQuestions, percentage);
}

// Affichage des résultats
function displayResults(score, total, percentage) {
    // Mise à jour des éléments UI
    document.getElementById('progressBar').style.width = `${percentage}%`;
    document.getElementById('progressBar').textContent = `${percentage}%`;
    document.getElementById('scoreText').textContent = `Score : ${score}/${total}`;
    
    // Feedback personnalisé
    const feedback = feedbackMessages.find(msg => percentage >= msg.min && percentage <= msg.max);
    document.getElementById('feedback').textContent = feedback.message;
    
    // Couleur de la barre de progression
    const progressBar = document.getElementById('progressBar');
    progressBar.classList.remove('bg-danger', 'bg-warning', 'bg-success');
    
    if (percentage < 50) {
        progressBar.classList.add('bg-danger');
    } else if (percentage < 80) {
        progressBar.classList.add('bg-warning');
    } else {
        progressBar.classList.add('bg-success');
    }
    
    // Affichage de la section résultats
    document.getElementById('results').classList.remove('hidden');
    
    // Défilement vers les résultats
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}