// AWS SAP クイズアプリケーション
class QuizApp {
    constructor() {
        this.currentCategory = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.questions = [];
        this.selectedAnswer = null;
        this.isAnswerSubmitted = false;
        this.quizMode = 'normal';
        this.timerInterval = null;
        this.timerRemaining = 0;
        this.timerTotal = 0;

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

            // 問題単位の統計
            const wrongCount = QuizAnswerHistory.getWrongQuestions(categoryKey).length;
            const unanswered = QuizAnswerHistory.getUnansweredCount(categoryKey);
            const totalQ = getTotalQuestions(categoryKey);
            const attempted = totalQ - unanswered;
            const attemptPercent = Math.round((attempted / totalQ) * 100);
            const perQAccuracy = QuizAnswerHistory.getCategoryAccuracy(categoryKey);

            let statsHTML = '';
            if (attemptCount > 0 || attempted > 0) {
                const reviewBtnHTML = wrongCount > 0
                    ? `<button class="review-btn" onclick="event.stopPropagation(); startReviewQuiz('${categoryKey}')" aria-label="${quizData[categoryKey].title}の復習モード（${wrongCount}問）"><span aria-hidden="true">🔄</span> 復習: ${wrongCount}問</button>`
                    : '';
                statsHTML = `
                    <div class="category-stats">
                        <div class="category-progress-bar"><div class="category-progress-fill" style="width: ${attemptPercent}%"></div></div>
                        <div class="category-stat-row">
                            <span>${perQAccuracy !== null ? '正答率: ' + perQAccuracy + '%' : ''}</span>
                            <span>未回答: ${unanswered}問</span>
                        </div>
                        ${attemptCount > 0 ? `<div class="category-stat-row" style="margin-top: 4px;"><span><span aria-hidden="true">🏆</span> 最高: ${bestScore}%</span><span><span aria-hidden="true">📝</span> ${attemptCount}回</span></div>` : ''}
                        ${reviewBtnHTML}
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

    startQuiz(categoryKey, mode = 'normal') {
        this.currentCategory = categoryKey;
        this.quizMode = mode;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.selectedAnswer = null;
        this.isAnswerSubmitted = false;

        // ディープコピー（シャッフル時の元データ破壊防止）
        let rawQuestions = getAllQuestions(categoryKey).map(q => ({
            ...q,
            options: [...q.options]
        }));

        // 復習モード: 不正解問題のみフィルタ
        if (mode === 'review') {
            const wrongIds = QuizAnswerHistory.getWrongQuestions(categoryKey);
            rawQuestions = rawQuestions.filter(q => wrongIds.includes(q.id));
            if (rawQuestions.length === 0) {
                alert('復習する問題がありません。すべて正解済みです！');
                return;
            }
        }

        // シャッフル（設定が有効な場合）
        const settings = QuizSettings.get();
        if (settings.shuffle) {
            this.shuffleArray(rawQuestions);
            rawQuestions.forEach(q => {
                const correctOption = q.options[q.correct];
                this.shuffleArray(q.options);
                q.correct = q.options.indexOf(correctOption);
            });
        }

        this.questions = rawQuestions;

        this.showQuizSection();
        this.renderQuestion();
    }

    showCategorySelection() {
        document.getElementById('categorySelection').style.display = 'block';
        document.getElementById('quizSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'none';

        // 設定パネルを表示
        this.renderSettings();
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
        const cat = quizData[this.currentCategory];
        document.getElementById('quizTitle').textContent = `${cat.icon} ${cat.title} クイズ`;

        // 復習モードバッジ
        const badge = document.getElementById('quizModeBadge');
        if (badge) {
            badge.style.display = this.quizMode === 'review' ? 'inline-block' : 'none';
        }
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
        document.getElementById('questionNumber').textContent = `第${questionNumber}問`;
        
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

        // 前回のフィードバックバナーをクリア
        const oldBanner = document.getElementById('feedbackBanner');
        if (oldBanner) oldBanner.remove();

        // カテゴリメタタグを表示
        // ※将来 question.difficulty が追加された場合はここでタグ追加可能
        const metaContainer = document.getElementById('questionMeta');
        if (metaContainer) {
            metaContainer.replaceChildren();
            const tag = document.createElement('span');
            tag.className = 'question-meta-tag';
            tag.textContent = quizData[this.currentCategory].title;
            metaContainer.appendChild(tag);
        }

        // タイマー開始
        this.stopTimer();
        this.startTimer();

        // アクセシビリティ: 問題文にフォーカスを移動
        const questionTextEl = document.getElementById('questionText');
        if (questionTextEl) {
            questionTextEl.setAttribute('tabindex', '-1');
            questionTextEl.focus();
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

        this.stopTimer();
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

        // 問題単位の回答履歴を保存
        QuizAnswerHistory.recordAnswer(this.currentCategory, question.id, isCorrect);

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

        // フィードバックバナーを表示
        const existingBanner = document.getElementById('feedbackBanner');
        if (existingBanner) existingBanner.remove();

        const feedbackBanner = document.createElement('div');
        feedbackBanner.className = `answer-feedback-banner ${isCorrect ? 'correct' : 'incorrect'}`;
        feedbackBanner.id = 'feedbackBanner';
        const feedbackIcon = document.createElement('span');
        feedbackIcon.setAttribute('aria-hidden', 'true');
        feedbackIcon.textContent = isCorrect ? '✅' : '❌';
        feedbackBanner.appendChild(feedbackIcon);
        feedbackBanner.appendChild(document.createTextNode(
            isCorrect ? '正解！よくできました' : '不正解 — 解説を確認しましょう'
        ));
        const explanation = document.getElementById('explanation');
        explanation.parentNode.insertBefore(feedbackBanner, explanation);

        // 解説を表示
        document.getElementById('explanationText').textContent = question.explanation;
        explanation.classList.add('show');

        // 関連リソースを表示（不正解時はCTAバナー付き）
        this.renderRelatedResources(question.relatedResources, !isCorrect);

        // ボタンの状態を更新
        document.getElementById('submitBtn').style.display = 'none';

        const nextBtn = document.getElementById('nextBtn');
        if (this.currentQuestionIndex < this.questions.length - 1) {
            nextBtn.style.display = 'inline-block';
            nextBtn.textContent = '次の問題へ';
        } else {
            nextBtn.style.display = 'inline-block';
            nextBtn.textContent = '成績を確認する';
        }

        // アクセシビリティ: 次のアクションボタンにフォーカス
        nextBtn.focus();
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
        const current = this.currentQuestionIndex + 1;
        const total = this.questions.length;
        const remaining = total - current;
        const progress = (current / total) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('progressText').textContent =
            `第${current}問 / ${total}問（残り${remaining}問）`;
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

        // 「間違えた問題だけ再挑戦」ボタンの表示制御
        const retryBtn = document.getElementById('retryWrongBtn');
        if (retryBtn) {
            const hasWrong = this.userAnswers.some(a => !a.isCorrect);
            retryBtn.style.display = hasWrong ? 'inline-block' : 'none';
        }

        // レーダーチャート表示
        this.renderRadarChart('radarChartContainer');

        // 不正解問題一覧表示
        this.renderWrongAnswerResources();

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
        historyHTML += '<h3 style="margin-bottom: 15px; color: #2c3e50;">📊 学習履歴（直近10回）</h3>';
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
    renderRelatedResources(relatedResources, emphasize = false) {
        const resourcesContainer = document.getElementById('explanationResources');
        const resourcesList = document.getElementById('resourcesList');

        // relatedResources がない場合は非表示
        if (!relatedResources || relatedResources.length === 0) {
            resourcesContainer.style.display = 'none';
            return;
        }

        // リストをクリア（安全なDOM操作）
        resourcesList.replaceChildren();

        // 不正解時のCTAバナー（内部リソースがある場合のみ）
        const existingCta = resourcesContainer.querySelector('.resource-cta-banner');
        if (existingCta) existingCta.remove();

        if (emphasize && relatedResources.some(r => r.type === 'internal')) {
            const cta = document.createElement('div');
            cta.className = 'resource-cta-banner';
            const icon = document.createElement('span');
            icon.setAttribute('aria-hidden', 'true');
            icon.textContent = '📖';
            cta.appendChild(icon);
            cta.appendChild(document.createTextNode(' この分野の学習リソースを確認しましょう'));
            resourcesContainer.insertBefore(cta, resourcesList);
        }

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

    // SVGレーダーチャートを描画
    renderRadarChart(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const categories = Object.keys(quizData);
        const attempted = categories.filter(c => QuizAnswerHistory.getCategoryAccuracy(c) !== null);

        if (attempted.length < 3) {
            container.textContent = '';
            const msg = document.createElement('p');
            msg.style.cssText = 'text-align: center; color: #6B7280; font-size: 0.9em;';
            msg.textContent = '3カテゴリ以上の学習後にレーダーチャートが表示されます';
            container.appendChild(msg);
            return;
        }

        const n = attempted.length;
        const centerX = 150, centerY = 150, radius = 110;
        const angleStep = (2 * Math.PI) / n;

        const ns = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(ns, 'svg');
        svg.setAttribute('viewBox', '0 0 300 300');
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', 'カテゴリ別正答率レーダーチャート');
        svg.classList.add('radar-chart');

        // ガイド同心多角形（25%, 50%, 75%, 100%）
        [0.25, 0.5, 0.75, 1.0].forEach(scale => {
            const points = attempted.map((_, i) => {
                const angle = angleStep * i - Math.PI / 2;
                const x = centerX + radius * scale * Math.cos(angle);
                const y = centerY + radius * scale * Math.sin(angle);
                return `${x.toFixed(1)},${y.toFixed(1)}`;
            }).join(' ');
            const poly = document.createElementNS(ns, 'polygon');
            poly.setAttribute('points', points);
            poly.classList.add('radar-guide');
            svg.appendChild(poly);
        });

        // 軸線
        attempted.forEach((_, i) => {
            const angle = angleStep * i - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            const line = document.createElementNS(ns, 'line');
            line.setAttribute('x1', centerX);
            line.setAttribute('y1', centerY);
            line.setAttribute('x2', x.toFixed(1));
            line.setAttribute('y2', y.toFixed(1));
            line.classList.add('radar-axis');
            svg.appendChild(line);
        });

        // データ多角形
        const dataPoints = attempted.map((cat, i) => {
            const accuracy = QuizAnswerHistory.getCategoryAccuracy(cat) / 100;
            const angle = angleStep * i - Math.PI / 2;
            const x = centerX + radius * accuracy * Math.cos(angle);
            const y = centerY + radius * accuracy * Math.sin(angle);
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(' ');
        const dataPoly = document.createElementNS(ns, 'polygon');
        dataPoly.setAttribute('points', dataPoints);
        dataPoly.classList.add('radar-data');
        svg.appendChild(dataPoly);

        // ラベル
        attempted.forEach((cat, i) => {
            const angle = angleStep * i - Math.PI / 2;
            const labelRadius = radius + 25;
            const x = centerX + labelRadius * Math.cos(angle);
            const y = centerY + labelRadius * Math.sin(angle);
            const accuracy = QuizAnswerHistory.getCategoryAccuracy(cat);
            const title = quizData[cat].title;
            // 長いタイトルは6文字で切る
            const shortTitle = title.length > 6 ? title.substring(0, 6) + '…' : title;

            const text = document.createElementNS(ns, 'text');
            text.setAttribute('x', x.toFixed(1));
            text.setAttribute('y', y.toFixed(1));
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.classList.add('radar-label');
            text.textContent = shortTitle;
            svg.appendChild(text);

            // パーセント表示
            const pctText = document.createElementNS(ns, 'text');
            pctText.setAttribute('x', x.toFixed(1));
            pctText.setAttribute('y', (y + 10).toFixed(1));
            pctText.setAttribute('text-anchor', 'middle');
            pctText.setAttribute('dominant-baseline', 'middle');
            pctText.classList.add('radar-pct-label');
            pctText.textContent = `${accuracy}%`;
            svg.appendChild(pctText);
        });

        container.replaceChildren(svg);
    }

    // 不正解問題一覧と関連リソースを結果画面に表示
    renderWrongAnswerResources() {
        const container = document.getElementById('wrongAnswerResources');
        if (!container) return;

        const wrongAnswers = this.userAnswers.filter(a => !a.isCorrect);
        if (wrongAnswers.length === 0) {
            container.replaceChildren();
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'wrong-answer-summary';

        const heading = document.createElement('h3');
        heading.textContent = '📝 間違えた問題と復習リンク';
        wrapper.appendChild(heading);

        wrongAnswers.forEach(answer => {
            const question = this.questions.find(q => q.id === answer.questionId);
            if (!question) return;

            const item = document.createElement('div');
            item.className = 'wrong-answer-item';

            const qText = document.createElement('div');
            qText.className = 'wa-question';
            qText.textContent = question.question;
            item.appendChild(qText);

            if (question.relatedResources && question.relatedResources.length > 0) {
                const resourcesDiv = document.createElement('div');
                resourcesDiv.className = 'wa-resources';
                question.relatedResources.forEach(res => {
                    if (res.type === 'internal') {
                        const link = document.createElement('a');
                        link.href = res.path;
                        link.textContent = '📖 ' + res.title;
                        resourcesDiv.appendChild(link);
                        resourcesDiv.appendChild(document.createTextNode(' '));
                    }
                });
                if (resourcesDiv.children.length > 0) {
                    item.appendChild(resourcesDiv);
                }
            }

            wrapper.appendChild(item);
        });

        container.replaceChildren(wrapper);
    }

    // 設定パネルを描画
    renderSettings() {
        const container = document.getElementById('quizSettings');
        if (!container) return;

        const settings = QuizSettings.get();

        // 安全なDOM構築
        container.replaceChildren();

        // シャッフル設定
        const shuffleItem = document.createElement('div');
        shuffleItem.className = 'setting-item';

        const shuffleLabel = document.createElement('label');
        shuffleLabel.className = 'toggle-switch';
        const shuffleInput = document.createElement('input');
        shuffleInput.type = 'checkbox';
        shuffleInput.id = 'shuffleToggle';
        shuffleInput.setAttribute('role', 'switch');
        shuffleInput.setAttribute('aria-label', '問題・選択肢シャッフル');
        shuffleInput.checked = settings.shuffle;
        const shuffleSlider = document.createElement('span');
        shuffleSlider.className = 'toggle-slider';
        shuffleLabel.appendChild(shuffleInput);
        shuffleLabel.appendChild(shuffleSlider);

        const shuffleText = document.createElement('span');
        shuffleText.className = 'setting-label';
        shuffleText.textContent = 'シャッフル';

        shuffleItem.appendChild(shuffleLabel);
        shuffleItem.appendChild(shuffleText);

        // タイマー設定
        const timerItem = document.createElement('div');
        timerItem.className = 'setting-item';

        const timerLabel = document.createElement('label');
        timerLabel.className = 'toggle-switch';
        const timerInput = document.createElement('input');
        timerInput.type = 'checkbox';
        timerInput.id = 'timerToggle';
        timerInput.setAttribute('role', 'switch');
        timerInput.setAttribute('aria-label', 'タイマーモード');
        timerInput.checked = settings.timerEnabled;
        const timerSlider = document.createElement('span');
        timerSlider.className = 'toggle-slider';
        timerLabel.appendChild(timerInput);
        timerLabel.appendChild(timerSlider);

        const timerText = document.createElement('span');
        timerText.className = 'setting-label';
        timerText.textContent = 'タイマー';

        const timerSecondsInput = document.createElement('input');
        timerSecondsInput.type = 'number';
        timerSecondsInput.id = 'timerSecondsInput';
        timerSecondsInput.className = 'timer-seconds-input';
        timerSecondsInput.value = settings.timerSeconds;
        timerSecondsInput.min = 30;
        timerSecondsInput.max = 600;
        timerSecondsInput.step = 10;
        timerSecondsInput.setAttribute('aria-label', '1問あたりの制限時間（秒）');
        timerSecondsInput.disabled = !settings.timerEnabled;

        const secLabel = document.createElement('span');
        secLabel.className = 'setting-label';
        secLabel.style.fontSize = '0.85rem';
        secLabel.style.color = '#6B7280';
        secLabel.textContent = '秒';

        timerItem.appendChild(timerLabel);
        timerItem.appendChild(timerText);
        timerItem.appendChild(timerSecondsInput);
        timerItem.appendChild(secLabel);

        container.appendChild(shuffleItem);
        container.appendChild(timerItem);

        // イベントリスナー
        shuffleInput.addEventListener('change', (e) => {
            QuizSettings.set('shuffle', e.target.checked);
        });

        timerInput.addEventListener('change', (e) => {
            QuizSettings.set('timerEnabled', e.target.checked);
            timerSecondsInput.disabled = !e.target.checked;
        });

        timerSecondsInput.addEventListener('change', (e) => {
            const val = Math.max(30, Math.min(600, parseInt(e.target.value) || 144));
            e.target.value = val;
            QuizSettings.set('timerSeconds', val);
        });
    }

    // タイマー開始
    startTimer() {
        const settings = QuizSettings.get();
        if (!settings.timerEnabled) {
            const timerContainer = document.getElementById('timerContainer');
            if (timerContainer) timerContainer.style.display = 'none';
            return;
        }

        this.timerRemaining = settings.timerSeconds;
        this.timerTotal = settings.timerSeconds;

        const timerContainer = document.getElementById('timerContainer');
        if (timerContainer) timerContainer.style.display = 'flex';

        this.updateTimerDisplay();

        this.timerInterval = setInterval(() => {
            this.timerRemaining--;
            this.updateTimerDisplay();

            if (this.timerRemaining === 30 || this.timerRemaining === 10) {
                this.announceTimer(this.timerRemaining);
            }

            if (this.timerRemaining <= 0) {
                this.onTimeout();
            }
        }, 1000);
    }

    // タイマー停止
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    // タイマー表示更新
    updateTimerDisplay() {
        const fill = document.getElementById('timerFill');
        const text = document.getElementById('timerText');
        if (!fill || !text) return;

        const pct = (this.timerRemaining / this.timerTotal) * 100;
        fill.style.width = `${pct}%`;

        // 色の切り替え
        fill.classList.remove('warning', 'danger');
        if (pct <= 25) {
            fill.classList.add('danger');
        } else if (pct <= 50) {
            fill.classList.add('warning');
        }

        const min = Math.floor(this.timerRemaining / 60);
        const sec = this.timerRemaining % 60;
        text.textContent = `${min}:${String(sec).padStart(2, '0')}`;
    }

    // タイムアウト処理
    onTimeout() {
        this.stopTimer();

        if (this.isAnswerSubmitted) return;

        this.isAnswerSubmitted = true;
        const question = this.questions[this.currentQuestionIndex];

        // タイムアウトを不正解として記録
        this.userAnswers.push({
            questionId: question.id,
            selectedAnswer: -1,
            correct: question.correct,
            isCorrect: false
        });
        QuizAnswerHistory.recordAnswer(this.currentCategory, question.id, false);

        // 正解をハイライト
        const optionButtons = document.querySelectorAll('.option-button');
        optionButtons.forEach((button, index) => {
            button.disabled = true;
            if (index === question.correct) {
                button.classList.add('correct');
                if (!button.querySelector('.result-icon')) {
                    const icon = document.createElement('span');
                    icon.className = 'result-icon';
                    icon.setAttribute('aria-hidden', 'true');
                    icon.textContent = ' ✅';
                    button.appendChild(icon);
                }
            }
        });

        // フィードバック
        const answerFeedback = document.getElementById('answerFeedback');
        if (answerFeedback) {
            answerFeedback.textContent = '時間切れです。';
        }

        // フィードバックバナー（時間切れ）
        const existingBanner = document.getElementById('feedbackBanner');
        if (existingBanner) existingBanner.remove();

        const feedbackBanner = document.createElement('div');
        feedbackBanner.className = 'answer-feedback-banner timeout';
        feedbackBanner.id = 'feedbackBanner';
        const feedbackIcon = document.createElement('span');
        feedbackIcon.setAttribute('aria-hidden', 'true');
        feedbackIcon.textContent = '⏰';
        feedbackBanner.appendChild(feedbackIcon);
        feedbackBanner.appendChild(document.createTextNode('時間切れ — 正解を確認しましょう'));
        const explanation = document.getElementById('explanation');
        explanation.parentNode.insertBefore(feedbackBanner, explanation);

        // 解説表示
        document.getElementById('explanationText').textContent = question.explanation;
        explanation.classList.add('show');
        this.renderRelatedResources(question.relatedResources, true);

        // ボタン切り替え
        document.getElementById('submitBtn').style.display = 'none';
        const nextBtn = document.getElementById('nextBtn');
        if (this.currentQuestionIndex < this.questions.length - 1) {
            nextBtn.style.display = 'inline-block';
            nextBtn.textContent = '次の問題へ';
        } else {
            nextBtn.style.display = 'inline-block';
            nextBtn.textContent = '成績を確認する';
        }
        nextBtn.focus();

        this.announceTimer(0);
    }

    // タイマーARIAアナウンス
    announceTimer(seconds) {
        const announce = document.getElementById('timerAnnounce');
        if (!announce) return;
        if (seconds === 0) {
            announce.textContent = '時間切れです。';
        } else {
            announce.textContent = `残り${seconds}秒です。`;
        }
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

function startReviewQuiz(categoryKey) {
    quizApp.startQuiz(categoryKey, 'review');
}

function retryWrongQuestions() {
    quizApp.startQuiz(quizApp.currentCategory, 'review');
}

function goBack() {
    // メインページ（index.html）に戻る
    window.location.href = 'index.html';
}

// ページ読み込み時にアプリを初期化
document.addEventListener('DOMContentLoaded', function() {
    quizApp = new QuizApp();
});

// 問題単位の回答履歴管理
class QuizAnswerHistory {
    static STORAGE_KEY = 'aws-sap-quiz-answers';

    static _getData() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (!raw) return { version: 1, answers: {} };
            const data = JSON.parse(raw);
            if (!data.version || !data.answers) return { version: 1, answers: {} };
            return data;
        } catch {
            return { version: 1, answers: {} };
        }
    }

    static _saveData(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch {
            // localStorage quota exceeded — silently fail
        }
    }

    static recordAnswer(categoryKey, questionId, isCorrect) {
        const data = this._getData();
        const key = `${categoryKey}:${questionId}`;
        const existing = data.answers[key] || { attempts: 0, correct: 0, lastWrong: false, lastDate: '' };
        existing.attempts++;
        if (isCorrect) existing.correct++;
        existing.lastWrong = !isCorrect;
        existing.lastDate = new Date().toISOString().split('T')[0];
        data.answers[key] = existing;
        this._saveData(data);
    }

    static getWrongQuestions(categoryKey) {
        const data = this._getData();
        const prefix = `${categoryKey}:`;
        const wrongIds = [];
        for (const [key, val] of Object.entries(data.answers)) {
            if (key.startsWith(prefix) && val.lastWrong) {
                // Extract questionId — may be number or string
                const qId = key.slice(prefix.length);
                wrongIds.push(isNaN(qId) ? qId : Number(qId));
            }
        }
        return wrongIds;
    }

    static getCategoryAccuracy(categoryKey) {
        const data = this._getData();
        const prefix = `${categoryKey}:`;
        let totalAttempts = 0;
        let totalCorrect = 0;
        for (const [key, val] of Object.entries(data.answers)) {
            if (key.startsWith(prefix)) {
                totalAttempts += val.attempts;
                totalCorrect += val.correct;
            }
        }
        if (totalAttempts === 0) return null;
        return Math.round((totalCorrect / totalAttempts) * 100);
    }

    static getUnansweredCount(categoryKey) {
        const data = this._getData();
        const prefix = `${categoryKey}:`;
        const answeredIds = new Set();
        for (const key of Object.keys(data.answers)) {
            if (key.startsWith(prefix)) {
                const qId = key.slice(prefix.length);
                answeredIds.add(isNaN(qId) ? qId : Number(qId));
            }
        }
        const allQuestions = getAllQuestions(categoryKey);
        return allQuestions.filter(q => !answeredIds.has(q.id)).length;
    }

    static getQuestionStats(categoryKey, questionId) {
        const data = this._getData();
        const key = `${categoryKey}:${questionId}`;
        return data.answers[key] || null;
    }
}

// クイズ設定の永続化
class QuizSettings {
    static STORAGE_KEY = 'aws-sap-quiz-settings';
    static DEFAULTS = { shuffle: false, timerEnabled: false, timerSeconds: 144 };

    static get() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (!raw) return { ...this.DEFAULTS };
            return { ...this.DEFAULTS, ...JSON.parse(raw) };
        } catch {
            return { ...this.DEFAULTS };
        }
    }

    static set(key, value) {
        const settings = this.get();
        settings[key] = value;
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
        } catch {
            // quota exceeded
        }
    }
}

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