// AWS SAP クイズアプリケーション
class QuizApp {
    constructor() {
        this.currentCategory = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.questions = [];
        this.selectedAnswer = null;
        this.isAnswerSubmitted = false;
        
        this.init();
    }

    init() {
        this.renderCategories();
        this.showCategorySelection();
    }

    renderCategories() {
        const categoriesGrid = document.getElementById('categoriesGrid');
        categoriesGrid.innerHTML = '';

        Object.keys(quizData).forEach(categoryKey => {
            const category = quizData[categoryKey];
            const categoryCard = document.createElement('div');
            categoryCard.className = `category-card ${categoryKey.replace('-', '')}`;
            categoryCard.onclick = () => this.startQuiz(categoryKey);
            
            categoryCard.innerHTML = `
                <span class="category-icon">${category.icon}</span>
                <div class="category-title">${category.title}</div>
                <div class="question-count">${category.questions.length}問</div>
            `;
            
            categoriesGrid.appendChild(categoryCard);
        });
    }

    startQuiz(categoryKey) {
        this.currentCategory = categoryKey;
        this.questions = [...quizData[categoryKey].questions];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.selectedAnswer = null;
        this.isAnswerSubmitted = false;

        // 問題をシャッフル（オプション）
        // this.shuffleArray(this.questions);

        this.showQuizSection();
        this.renderQuestion();
    }

    showCategorySelection() {
        document.getElementById('categorySelection').style.display = 'block';
        document.getElementById('quizSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'none';
    }

    showQuizSection() {
        document.getElementById('categorySelection').style.display = 'none';
        document.getElementById('quizSection').style.display = 'block';
        document.getElementById('resultsSection').style.display = 'none';
        
        // クイズタイトルを設定
        document.getElementById('quizTitle').textContent = 
            `${quizData[this.currentCategory].icon} ${quizData[this.currentCategory].title} クイズ`;
    }

    showResultsSection() {
        document.getElementById('categorySelection').style.display = 'none';
        document.getElementById('quizSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
    }

    renderQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        const questionNumber = this.currentQuestionIndex + 1;
        const totalQuestions = this.questions.length;

        // 進捗を更新
        this.updateProgress();

        // 質問番号
        document.getElementById('questionNumber').textContent = `Question ${questionNumber}`;
        
        // 質問文
        document.getElementById('questionText').textContent = question.question;

        // 選択肢を生成
        const optionsList = document.getElementById('optionsList');
        optionsList.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionItem = document.createElement('li');
            optionItem.className = 'option-item';
            
            const optionButton = document.createElement('button');
            optionButton.className = 'option-button';
            optionButton.textContent = option;
            optionButton.onclick = () => this.selectAnswer(index);
            optionButton.disabled = this.isAnswerSubmitted;
            
            optionItem.appendChild(optionButton);
            optionsList.appendChild(optionItem);
        });

        // ボタンの状態をリセット
        this.selectedAnswer = null;
        this.isAnswerSubmitted = false;
        document.getElementById('submitBtn').style.display = 'inline-block';
        document.getElementById('submitBtn').disabled = true;
        document.getElementById('nextBtn').style.display = 'none';
        document.getElementById('explanation').classList.remove('show');
    }

    selectAnswer(answerIndex) {
        if (this.isAnswerSubmitted) return;

        this.selectedAnswer = answerIndex;
        
        // 全ての選択肢の状態をリセット
        const optionButtons = document.querySelectorAll('.option-button');
        optionButtons.forEach(button => {
            button.classList.remove('selected');
        });
        
        // 選択された選択肢をハイライト
        optionButtons[answerIndex].classList.add('selected');
        
        // 回答ボタンを有効化
        document.getElementById('submitBtn').disabled = false;
    }

    submitAnswer() {
        if (this.selectedAnswer === null || this.isAnswerSubmitted) return;

        this.isAnswerSubmitted = true;
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = this.selectedAnswer === question.correct;
        
        // 回答を記録
        this.userAnswers.push({
            questionId: question.id,
            selectedAnswer: this.selectedAnswer,
            correct: question.correct,
            isCorrect: isCorrect
        });

        // 選択肢に正解/不正解のスタイルを適用
        const optionButtons = document.querySelectorAll('.option-button');
        optionButtons.forEach((button, index) => {
            button.disabled = true;
            button.classList.remove('selected');
            
            if (index === question.correct) {
                button.classList.add('correct');
            } else if (index === this.selectedAnswer && !isCorrect) {
                button.classList.add('incorrect');
            }
        });

        // 解説を表示
        document.getElementById('explanationText').textContent = question.explanation;
        document.getElementById('explanation').classList.add('show');

        // ボタンの状態を更新
        document.getElementById('submitBtn').style.display = 'none';
        
        if (this.currentQuestionIndex < this.questions.length - 1) {
            document.getElementById('nextBtn').style.display = 'inline-block';
            document.getElementById('nextBtn').textContent = '次の問題 →';
        } else {
            document.getElementById('nextBtn').style.display = 'inline-block';
            document.getElementById('nextBtn').textContent = '結果を見る 🎯';
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.renderQuestion();
        } else {
            this.showResults();
        }
    }

    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('progressText').textContent = 
            `${this.currentQuestionIndex + 1}/${this.questions.length}`;
    }

    showResults() {
        const correctAnswers = this.userAnswers.filter(answer => answer.isCorrect).length;
        const totalQuestions = this.questions.length;
        const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

        // 結果を表示
        document.getElementById('scoreDisplay').textContent = `${correctAnswers}/${totalQuestions}`;
        document.getElementById('correctCount').textContent = correctAnswers;
        document.getElementById('incorrectCount').textContent = totalQuestions - correctAnswers;
        document.getElementById('accuracyRate').textContent = `${accuracy}%`;

        // スコアに応じてスタイルとメッセージを設定
        const scoreDisplay = document.getElementById('scoreDisplay');
        let message = '';
        
        scoreDisplay.className = 'score-display';
        
        if (accuracy >= 90) {
            scoreDisplay.classList.add('score-excellent');
            message = '🌟 素晴らしい！完璧に近い理解度です。AWS SAP試験に向けて順調に進んでいますね！';
        } else if (accuracy >= 70) {
            scoreDisplay.classList.add('score-good');
            message = '👍 良好な成績です！基本的な概念は理解できています。さらなる向上を目指しましょう。';
        } else if (accuracy >= 50) {
            scoreDisplay.classList.add('score-fair');
            message = '📚 まずまずの成績です。もう少し学習を深めると更に理解が向上しそうです。';
        } else {
            scoreDisplay.classList.add('score-poor');
            message = '💪 まだ伸び代がたくさんあります！学習リソースを見直して再挑戦してみてください。';
        }
        
        document.getElementById('scoreMessage').textContent = message;
        
        this.showResultsSection();
    }

    restartQuiz() {
        this.startQuiz(this.currentCategory);
    }

    goBackToCategories() {
        this.showCategorySelection();
    }

    // 配列をシャッフルする関数（オプション）
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

// グローバル関数（HTMLから呼び出される）
let quizApp;

function startQuiz(categoryKey) {
    quizApp.startQuiz(categoryKey);
}

function selectAnswer(answerIndex) {
    quizApp.selectAnswer(answerIndex);
}

function submitAnswer() {
    quizApp.submitAnswer();
}

function nextQuestion() {
    quizApp.nextQuestion();
}

function goBackToCategories() {
    quizApp.goBackToCategories();
}

function restartQuiz() {
    quizApp.restartQuiz();
}

function goBack() {
    // メインページ（index.html）に戻る
    window.location.href = 'index.html';
}

// ページ読み込み時にアプリを初期化
document.addEventListener('DOMContentLoaded', function() {
    quizApp = new QuizApp();
});

// ローカルストレージを使用した学習進捗の保存（オプション機能）
class QuizProgress {
    static saveProgress(category, score, totalQuestions) {
        const progress = JSON.parse(localStorage.getItem('aws-sap-quiz-progress') || '{}');
        const date = new Date().toISOString().split('T')[0];
        
        if (!progress[category]) {
            progress[category] = [];
        }
        
        progress[category].push({
            date: date,
            score: score,
            total: totalQuestions,
            accuracy: Math.round((score / totalQuestions) * 100)
        });
        
        // 最新の10回分のみ保存
        if (progress[category].length > 10) {
            progress[category] = progress[category].slice(-10);
        }
        
        localStorage.setItem('aws-sap-quiz-progress', JSON.stringify(progress));
    }
    
    static getProgress(category) {
        const progress = JSON.parse(localStorage.getItem('aws-sap-quiz-progress') || '{}');
        return progress[category] || [];
    }
    
    static getBestScore(category) {
        const progress = this.getProgress(category);
        if (progress.length === 0) return null;
        
        return Math.max(...progress.map(p => p.accuracy));
    }
    
    static getTotalQuizzesCompleted() {
        const progress = JSON.parse(localStorage.getItem('aws-sap-quiz-progress') || '{}');
        let total = 0;
        Object.values(progress).forEach(categoryProgress => {
            total += categoryProgress.length;
        });
        return total;
    }
}