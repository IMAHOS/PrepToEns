// Gestion de la progression avec localStorage
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser la progression si elle n'existe pas
    if (!localStorage.getItem('userProgress')) {
        resetProgress();
    }

    // Mettre à jour la barre de progression globale
    updateGlobalProgress();

    // Gestion du bouton de réinitialisation
    document.getElementById('reset-progress')?.addEventListener('click', function() {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser toute votre progression ?')) {
            resetProgress();
            location.reload();
        }
    });
});

function resetProgress() {
    const defaultProgress = {
        crpe: {
            francais: 0,
            maths: 0,
            pedagogie: 0
        },
        capes: {
            maths: 0,
            francais: 0,
            histoire: 0,
            sciences: 0,
            pedagogie: 0
        },
        agreg: {
            maths: 0,
            lettres: 0,
            sciences: 0,
            philo: 0
        },
        quizzes: {},
        completedLessons: []
    };
    
    localStorage.setItem('userProgress', JSON.stringify(defaultProgress));
}

function updateGlobalProgress() {
    const progressData = JSON.parse(localStorage.getItem('userProgress'));
    let total = 0;
    let count = 0;

    // Calculer la progression pour CRPE
    for (const subject in progressData.crpe) {
        total += progressData.crpe[subject];
        count++;
    }

    // Calculer la progression pour CAPES
    for (const subject in progressData.capes) {
        total += progressData.capes[subject];
        count++;
    }

    // Calculer la progression pour Agrégation
    for (const subject in progressData.agreg) {
        total += progressData.agreg[subject];
        count++;
    }

    // Calculer la moyenne globale
    const averageProgress = count > 0 ? Math.round(total / count) : 0;
    
    // Mettre à jour la barre de progression
    const progressBar = document.getElementById('global-progress');
    if (progressBar) {
        progressBar.style.width = `${averageProgress}%`;
        progressBar.textContent = `${averageProgress}%`;
        progressBar.setAttribute('aria-valuenow', averageProgress);
        
        // Changer la couleur en fonction du pourcentage
        if (averageProgress < 30) {
            progressBar.className = 'progress-bar bg-danger';
        } else if (averageProgress < 70) {
            progressBar.className = 'progress-bar bg-warning';
        } else {
            progressBar.className = 'progress-bar bg-success';
        }
    }
}

// Fonction pour mettre à jour la progression d'un sujet spécifique
function updateSubjectProgress(concours, subject, score) {
    const progressData = JSON.parse(localStorage.getItem('userProgress'));
    
    if (progressData[concours] && progressData[concours][subject] !== undefined) {
        // Ne garder que le meilleur score
        if (score > progressData[concours][subject]) {
            progressData[concours][subject] = score;
            localStorage.setItem('userProgress', JSON.stringify(progressData));
            updateGlobalProgress();
            return true;
        }
    }
    return false;
}

// Marquer une leçon comme complétée
function completeLesson(lessonId) {
    const progressData = JSON.parse(localStorage.getItem('userProgress'));
    
    if (!progressData.completedLessons.includes(lessonId)) {
        progressData.completedLessons.push(lessonId);
        localStorage.setItem('userProgress', JSON.stringify(progressData));
        updateGlobalProgress();
        return true;
    }
    return false;
}