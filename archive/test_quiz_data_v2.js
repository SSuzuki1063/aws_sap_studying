#!/usr/bin/env node
// クイズデータの検証スクリプト（改良版）

const fs = require('fs');
const vm = require('vm');

// quiz-data-extended.js を読み込み
const quizDataContent = fs.readFileSync('quiz-data-extended.js', 'utf8');

// VMコンテキストで実行
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(quizDataContent, sandbox);

const quizData = sandbox.quizData;

console.log('='.repeat(70));
console.log('AWS SAP クイズデータ 検証結果');
console.log('='.repeat(70));
console.log();

let totalQuestions = 0;
let hasErrors = false;
let warnings = 0;

// 各カテゴリを検証
Object.keys(quizData).forEach(categoryKey => {
    const category = quizData[categoryKey];
    const questionCount = category.questions.length;
    totalQuestions += questionCount;

    console.log(`📁 ${category.title} (${categoryKey}): ${questionCount}問`);

    // 各問題を検証
    category.questions.forEach((q, index) => {
        // ID の連番チェック
        if (q.id !== index + 1) {
            console.log(`  ⚠️  警告: 問題${index + 1}のIDが${q.id}です（期待値: ${index + 1}）`);
            warnings++;
        }

        // 必須フィールドのチェック
        if (!q.question) {
            console.log(`  ❌ エラー: 問題${q.id}に質問文がありません`);
            hasErrors = true;
        }
        if (!q.options || q.options.length !== 4) {
            console.log(`  ❌ エラー: 問題${q.id}の選択肢が4つではありません（現在: ${q.options?.length || 0}個）`);
            hasErrors = true;
        }
        if (q.correct === undefined || q.correct < 0 || q.correct > 3) {
            console.log(`  ❌ エラー: 問題${q.id}の正解インデックスが不正です（current: ${q.correct}）`);
            hasErrors = true;
        }
        if (!q.explanation) {
            console.log(`  ❌ エラー: 問題${q.id}に説明がありません`);
            hasErrors = true;
        }
    });
});

console.log();
console.log('-'.repeat(70));
console.log(`合計カテゴリ数: ${Object.keys(quizData).length}`);
console.log(`合計問題数: ${totalQuestions}問`);
console.log(`警告: ${warnings}件`);
console.log('-'.repeat(70));

if (hasErrors) {
    console.log();
    console.log('❌ エラーが見つかりました');
    process.exit(1);
} else {
    console.log();
    console.log('✅ すべての検証に合格しました！');
    if (warnings > 0) {
        console.log(`⚠️  ${warnings}件の警告がありますが、動作には問題ありません`);
    }
    process.exit(0);
}
