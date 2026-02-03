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
            const bestScore = QuizProgress.getBestScore(categoryKey);
            const history = QuizProgress.getProgress(categoryKey);
            const attemptCount = history.length;

            const categoryCard = document.createElement('div');
            categoryCard.className = `category-card ${categoryKey.replace('-', '')}`;

            // アクセシビリティ: キーボードナビゲーション対応
            categoryCard.setAttribute('role', 'button');
            categoryCard.setAttribute('tabindex', '0');
            categoryCard.setAttribute('aria-label',
                `${category.title}カテゴリ、${getTotalQuestions(categoryKey)}問` +
                (attemptCount > 0 ? `、最高スコア${bestScore}%、受験回数${attemptCount}回` : '')
            );

            // クリックイベント
            categoryCard.onclick = () => this.startQuiz(categoryKey);

            // キーボードイベント（Enter と Space キー）
            categoryCard.onkeypress = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.startQuiz(categoryKey);
                }
            };

            let statsHTML = '';
            if (attemptCount > 0) {
                statsHTML = `
                    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 0.85em;">
                        <div><span aria-hidden="true">🏆</span> 最高スコア: ${bestScore}%</div>
                        <div><span aria-hidden="true">📝</span> 受験回数: ${attemptCount}回</div>
                    </div>
                `;
            }

            categoryCard.innerHTML = `
                <span class="category-icon" aria-hidden="true">${category.icon}</span>
                <div class="category-title">${category.title}</div>
                <div class="question-count">${getTotalQuestions(categoryKey)}問</div>
                ${statsHTML}
            `;

            categoriesGrid.appendChild(categoryCard);
        });
    }

    startQuiz(categoryKey) {
        this.currentCategory = categoryKey;
        this.questions = getAllQuestions(categoryKey);
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

        // 全体統計を表示
        this.displayOverallStats();
    }

    displayOverallStats() {
        const statsContainer = document.getElementById('overallStats');
        if (!statsContainer) return;

        const totalQuizzes = QuizProgress.getTotalQuizzesCompleted();

        if (totalQuizzes === 0) {
            statsContainer.innerHTML = `
                <div style="text-align: center; color: #4a5568;">
                    <h3 style="margin-bottom: 10px; color: #2c3e50;">📚 学習統計</h3>
                    <p>まだクイズを開始していません。カテゴリを選択して始めましょう！</p>
                </div>
            `;
            return;
        }

        // カテゴリごとの統計を集計
        let totalScore = 0;
        let totalQuestions = 0;
        let categoriesCompleted = 0;

        Object.keys(quizData).forEach(categoryKey => {
            const history = QuizProgress.getProgress(categoryKey);
            if (history.length > 0) {
                categoriesCompleted++;
                history.forEach(record => {
                    totalScore += record.score;
                    totalQuestions += record.total;
                });
            }
        });

        const overallAccuracy = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

        statsContainer.innerHTML = `
            <div style="text-align: center;">
                <h3 style="margin-bottom: 15px; color: #2c3e50;">📊 学習統計</h3>
                <div style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 15px;
                    margin-top: 15px;
                ">
                    <div style="background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <div style="font-size: 2rem; font-weight: bold; color: #74b9ff;">${totalQuizzes}</div>
                        <div style="color: #6B7280; font-size: 0.9em; margin-top: 5px;">受験回数</div>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <div style="font-size: 2rem; font-weight: bold; color: #00b894;">${overallAccuracy}%</div>
                        <div style="color: #6B7280; font-size: 0.9em; margin-top: 5px;">平均正答率</div>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <div style="font-size: 2rem; font-weight: bold; color: #fdcb6e;">${categoriesCompleted}</div>
                        <div style="color: #6B7280; font-size: 0.9em; margin-top: 5px;">学習カテゴリ</div>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <div style="font-size: 2rem; font-weight: bold; color: #e17055;">${totalScore}/${totalQuestions}</div>
                        <div style="color: #6B7280; font-size: 0.9em; margin-top: 5px;">正解数</div>
                    </div>
                </div>
            </div>
        `;
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

        // ボタンの状態をリセット（選択肢生成前に）
        this.selectedAnswer = null;
        this.isAnswerSubmitted = false;

        // 選択肢を生成
        const optionsList = document.getElementById('optionsList');
        optionsList.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionItem = document.createElement('li');
            optionItem.className = 'option-item';

            const optionButton = document.createElement('button');
            optionButton.className = 'option-button';
            optionButton.type = 'button'; // 明示的にtype属性を設定
            optionButton.textContent = option;
            optionButton.onclick = () => this.selectAnswer(index);
            optionButton.disabled = false; // 初期状態では有効

            // アクセシビリティ: aria-label で選択肢の文脈を明確化
            const optionLabel = ['A', 'B', 'C', 'D'][index];
            optionButton.setAttribute('aria-label', `選択肢${optionLabel}: ${option}`);

            optionItem.appendChild(optionButton);
            optionsList.appendChild(optionItem);
        });

        // ボタンの状態を設定
        document.getElementById('submitBtn').style.display = 'inline-block';
        document.getElementById('submitBtn').disabled = true;
        document.getElementById('nextBtn').style.display = 'none';
        document.getElementById('explanation').classList.remove('show');

        // 関連リソースセクションを非表示にリセット
        const resourcesContainer = document.getElementById('explanationResources');
        if (resourcesContainer) {
            resourcesContainer.style.display = 'none';
        }
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
        const correctLabel = ['A', 'B', 'C', 'D'][question.correct];

        optionButtons.forEach((button, index) => {
            button.disabled = true; // 回答提出後はすべて無効化
            button.classList.remove('selected');

            if (index === question.correct) {
                button.classList.add('correct');
                // アクセシビリティ: 正解ボタンのaria-labelを更新
                const optionText = button.textContent;
                button.setAttribute('aria-label', `正解: 選択肢${['A', 'B', 'C', 'D'][index]}: ${optionText}`);

                // 正解アイコンを追加
                if (!button.querySelector('.result-icon')) {
                    const correctIcon = document.createElement('span');
                    correctIcon.className = 'result-icon';
                    correctIcon.setAttribute('aria-hidden', 'true');
                    correctIcon.textContent = ' ✅';
                    button.appendChild(correctIcon);
                }
            } else if (index === this.selectedAnswer && !isCorrect) {
                button.classList.add('incorrect');
                // アクセシビリティ: 不正解ボタンのaria-labelを更新
                const optionText = button.textContent;
                button.setAttribute('aria-label', `不正解: 選択肢${['A', 'B', 'C', 'D'][index]}: ${optionText}`);

                // 不正解アイコンを追加
                if (!button.querySelector('.result-icon')) {
                    const incorrectIcon = document.createElement('span');
                    incorrectIcon.className = 'result-icon';
                    incorrectIcon.setAttribute('aria-hidden', 'true');
                    incorrectIcon.textContent = ' ❌';
                    button.appendChild(incorrectIcon);
                }
            }
        });

        // アクセシビリティ: ARIA live regionで結果をアナウンス
        const answerFeedback = document.getElementById('answerFeedback');
        if (answerFeedback) {
            if (isCorrect) {
                answerFeedback.textContent = '正解です！';
            } else {
                answerFeedback.textContent = `不正解です。正解は選択肢${correctLabel}です。`;
            }
        }

        // 解説を表示
        document.getElementById('explanationText').textContent = question.explanation;
        document.getElementById('explanation').classList.add('show');

        // 関連リソースを表示（存在する場合）
        this.renderRelatedResources(question.relatedResources);

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

        // 学習進捗を保存
        QuizProgress.saveProgress(this.currentCategory, correctAnswers, totalQuestions);

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

        // 学習履歴を表示
        this.displayLearningHistory();

        this.showResultsSection();
    }

    displayLearningHistory() {
        const history = QuizProgress.getProgress(this.currentCategory);
        const historyContainer = document.getElementById('learningHistory');

        if (!historyContainer) return;

        if (history.length === 0) {
            historyContainer.innerHTML = '<p style="color: #6B7280; text-align: center;">まだ学習履歴がありません</p>';
            return;
        }

        let historyHTML = '<div style="max-height: 300px; overflow-y: auto;">';
        historyHTML += '<h3 style="margin-bottom: 15px; color: #2c3e50;">📊 最近の学習履歴（最大10回分）</h3>';
        historyHTML += '<div style="display: grid; gap: 10px;">';

        // 最新から順に表示（逆順）
        history.slice().reverse().forEach((record, index) => {
            const isLatest = index === 0;
            const borderColor = record.accuracy >= 90 ? '#00b894' :
                               record.accuracy >= 70 ? '#74b9ff' :
                               record.accuracy >= 50 ? '#fdcb6e' : '#e17055';

            historyHTML += `
                <div style="
                    background: ${isLatest ? '#f0f8ff' : 'white'};
                    border-left: 4px solid ${borderColor};
                    padding: 12px 15px;
                    border-radius: 8px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    ${isLatest ? 'box-shadow: 0 2px 8px rgba(0,0,0,0.1);' : ''}
                ">
                    <div>
                        <span style="font-weight: ${isLatest ? 'bold' : 'normal'}; color: #2c3e50;">
                            ${isLatest ? '🎯 今回: ' : ''}${record.date}
                        </span>
                    </div>
                    <div style="display: flex; gap: 15px; align-items: center;">
                        <span style="color: #4a5568;">${record.score}/${record.total}問正解</span>
                        <span style="
                            font-weight: bold;
                            color: ${borderColor};
                            font-size: 1.1em;
                        ">${record.accuracy}%</span>
                    </div>
                </div>
            `;
        });

        historyHTML += '</div></div>';
        historyContainer.innerHTML = historyHTML;
    }

    restartQuiz() {
        this.startQuiz(this.currentCategory);
    }

    // 関連リソースを表示する
    renderRelatedResources(relatedResources) {
        const resourcesContainer = document.getElementById('explanationResources');
        const resourcesList = document.getElementById('resourcesList');

        // relatedResources がない場合は非表示
        if (!relatedResources || relatedResources.length === 0) {
            resourcesContainer.style.display = 'none';
            return;
        }

        // リストをクリア（安全なDOM操作）
        resourcesList.replaceChildren();

        // 各リソースをリンクとして生成
        relatedResources.forEach(resource => {
            const li = document.createElement('li');
            const link = document.createElement('a');

            if (resource.type === 'internal') {
                // 内部リンク（サイト内資料）
                link.href = resource.path;
                link.className = 'resource-link internal';
                link.textContent = resource.title;
                // 同じタブで開く
                link.target = '_self';
            } else if (resource.type === 'external') {
                // 外部リンク（AWS公式等）
                link.href = resource.url;
                link.className = 'resource-link external';
                link.textContent = resource.title;
                // 新しいタブで開く + セキュリティ対策
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
            }

            li.appendChild(link);
            resourcesList.appendChild(li);
        });

        // 表示する
        resourcesContainer.style.display = 'block';
    }

    goBackToCategories() {
        // カテゴリカードを再レンダリング（統計情報を更新するため）
        this.renderCategories();
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