// Gestion des QCM
class Quiz {
    constructor(containerId, quizData) {
        this.container = document.getElementById(containerId);
        this.quizData = quizData;
        this.userAnswers = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.init();
    }

    init() {
        this.renderQuiz();
        this.setupEventListeners();
    }

    renderQuiz() {
        let html = `
            <div class="quiz-header mb-4">
                <h2>${this.quizData.title}</h2>
                <div class="progress mb-3">
                    <div class="progress-bar" role="progressbar" 
                         style="width: ${(this.currentQuestion / this.quizData.questions.length) * 100}%">
                        Question ${this.currentQuestion + 1} sur ${this.quizData.questions.length}
                    </div>
                </div>
            </div>
            <div class="quiz-question card mb-3">
                <div class="card-body">
                    <h5 class="card-title">Question ${this.currentQuestion + 1}</h5>
                    <p class="card-text">${this.quizData.questions[this.currentQuestion].question}</p>
                    <div class="quiz-options">
                        ${this.renderOptions()}
                    </div>
                </div>
            </div>
            <div class="quiz-navigation">
                <button id="prev-question" class="btn btn-outline-secondary ${this.currentQuestion === 0 ? 'disabled' : ''}">
                    <i class="fas fa-arrow-left"></i> Précédent
                </button>
                <button id="next-question" class="btn btn-primary float-end">
                    ${this.currentQuestion === this.quizData.questions.length - 1 ? 'Terminer' : 'Suivant'} 
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        `;
        
        this.container.innerHTML = html;
    }

    renderOptions() {
        return this.quizData.questions[this.currentQuestion].options.map((option, index) => `
            <div class="form-check mb-2">
                <input class="form-check-input" type="radio" 
                       name="question-${this.currentQuestion}" 
                       id="option-${index}" 
                       value="${index}"
                       ${this.userAnswers[this.currentQuestion] === index ? 'checked' : ''}>
                <label class="form-check-label" for="option-${index}">
                    ${option}
                </label>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Navigation entre les questions
        document.getElementById('prev-question')?.addEventListener('click', () => {
            this.saveAnswer();
            this.currentQuestion--;
            this.renderQuiz();
        });

        document.getElementById('next-question')?.addEventListener('click', () => {
            this.saveAnswer();
            
            if (this.currentQuestion < this.quizData.questions.length - 1) {
                this.currentQuestion++;
                this.renderQuiz();
            } else {
                this.showResults();
            }
        });
    }

    saveAnswer() {
        const selectedOption = document.querySelector(`input[name="question-${this.currentQuestion}"]:checked`);
        if (selectedOption) {
            this.userAnswers[this.currentQuestion] = parseInt(selectedOption.value);
        }
    }

    showResults() {
        this.score = 0;
        let resultsHtml = `
            <div class="quiz-results card">
                <div class="card-header bg-primary text-white">
                    <h3>Résultats du QCM</h3>
                </div>
                <div class="card-body">
                    <h4 class="mb-4">Score final: ${this.calculateScore()}%</h4>
        `;

        // Détail des réponses
        this.quizData.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            const isCorrect = userAnswer === question.answer;
            
            if (isCorrect) this.score++;
            
            resultsHtml += `
                <div class="question-result mb-4 p-3 ${isCorrect ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'}">
                    <h5>Question ${index + 1}: ${isCorrect ? '✓ Correcte' : '✗ Incorrecte'}</h5>
                    <p><strong>Question:</strong> ${question.question}</p>
                    <p><strong>Votre réponse:</strong> ${question.options[userAnswer] || 'Aucune réponse'}</p>
                    ${!isCorrect ? `<p><strong>Réponse correcte:</strong> ${question.options[question.answer]}</p>` : ''}
                    <p class="text-muted"><small><strong>Explication:</strong> ${question.explanation}</small></p>
                </div>
            `;
        });

        resultsHtml += `
                </div>
                <div class="card-footer text-center">
                    <button id="restart-quiz" class="btn btn-primary me-2">
                        <i class="fas fa-redo"></i> Recommencer
                    </button>
                    <a href="index.html" class="btn btn-outline-secondary">
                        <i class="fas fa-home"></i> Retour à l'accueil
                    </a>
                </div>
            </div>
        `;

        this.container.innerHTML = resultsHtml;
        
        // Gestion du bouton recommencer
        document.getElementById('restart-quiz')?.addEventListener('click', () => {
            this.userAnswers = [];
            this.currentQuestion = 0;
            this.score = 0;
            this.renderQuiz();
        });

        // Enregistrer le score dans la progression
        this.saveProgress();
    }

    calculateScore() {
        return Math.round((this.score / this.quizData.questions.length) * 100);
    }

    saveProgress() {
        const quizCategory = this.quizData.category || 'general';
        const percentage = this.calculateScore();
        
        // Charger la progression existante
        const progressData = JSON.parse(localStorage.getItem('userProgress')) || {};
        
        // Initialiser la catégorie si elle n'existe pas
        if (!progressData.quizzes) {
            progressData.quizzes = {};
        }
        
        // Ne garder que le meilleur score
        if (!progressData.quizzes[quizCategory] || percentage > progressData.quizzes[quizCategory]) {
            progressData.quizzes[quizCategory] = percentage;
            localStorage.setItem('userProgress', JSON.stringify(progressData));
            
            // Mettre à jour la progression globale
            if (typeof updateGlobalProgress === 'function') {
                updateGlobalProgress();
            }
        }
    }
}

// Fonction pour initialiser un QCM
function initQuiz(quizId) {
    // En pratique, vous chargeriez les données depuis un fichier JSON
    // Voici un exemple de structure de données
    const quizData = {
        title: "QCM Français - Grammaire",
        category: "francais",
        questions: [
            {
                question: "Quelle est la nature du mot 'rapidement' dans la phrase : 'Il court rapidement.' ?",
                options: ["Adjectif", "Adverbe", "Nom", "Verbe"],
                answer: 1,
                explanation: "'Rapidement' modifie le verbe 'court', c'est donc un adverbe."
            },
            {
                question: "Quel est le temps du verbe dans la phrase : 'Nous aurions mangé si nous avions eu faim.' ?",
                options: ["Conditionnel présent", "Conditionnel passé", "Plus-que-parfait", "Futur antérieur"],
                answer: 1,
                explanation: "'Aurions mangé' est au conditionnel passé (auxiliaire au conditionnel présent + participe passé)."
            }
        ]
    };

    new Quiz('quiz-container', quizData);
}