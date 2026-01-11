document.addEventListener('DOMContentLoaded', function() {
    const steps = Array.from(document.querySelectorAll('.form-step'));
    const nextButtons = Array.from(document.querySelectorAll('.btn-next'));
    const prevButtons = Array.from(document.querySelectorAll('.btn-prev'));
    const indicators = Array.from(document.querySelectorAll('.progress-bar .step'));
    const form = document.getElementById('registrationForm');

    let currentStep = 0;

    function updateStepDisplay() {
        // すべてのステップを非表示に
        steps.forEach((step, index) => {
            step.classList.toggle('active-step', index === currentStep);
        });

        // インジケーターの状態を更新
        indicators.forEach((indicator, index) => {
            indicator.classList.remove('active', 'completed');
            if (index < currentStep) {
                indicator.classList.add('completed');
            } else if (index === currentStep) {
                indicator.classList.add('active');
            }
        });
    }

    function validateStep(stepIndex) {
        const currentStepElement = steps[stepIndex];
        const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            // 既存のエラーメッセージを削除
            const errorMsg = input.closest('.form-group').querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
            input.style.borderColor = '#ddd';

            let inputIsValid = true;
            if (input.type === 'radio') {
                const radioGroup = document.getElementsByName(input.name);
                if (!Array.from(radioGroup).some(radio => radio.checked)) {
                    inputIsValid = false;
                }
            } else if (input.type === 'checkbox') {
                if (!input.checked) {
                   inputIsValid = false;
                }
            } else if (!input.value.trim()) {
                inputIsValid = false;
            }

            if (!inputIsValid) {
                isValid = false;
                input.style.borderColor = '#e53935'; // 赤色でハイライト
                const errorElement = document.createElement('p');
                errorElement.textContent = 'この項目は必須です。';
                errorElement.className = 'error-message';
                input.closest('.form-group').appendChild(errorElement);
            }
        });
        
        return isValid;
    }

    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep) && currentStep < steps.length - 1) {
                currentStep++;
                updateStepDisplay();
                window.scrollTo(0, 0); // ページトップにスクロール
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateStepDisplay();
                window.scrollTo(0, 0); // ページトップにスクロール
            }
        });
    });
    
    
    form.addEventListener('submit', function(e) {
        // デフォルトのフォーム送信（HTMLのaction属性への送信）をキャンセル
        e.preventDefault();

        // 最終ステップのバリデーションを実行
        if (!validateStep(currentStep)) {
            alert('未入力またはエラーの項目があります。ご確認ください。');
            return; // バリデーションが失敗したらここで処理を終了
        }

        // 送信先となる複数のFormspreeエンドポイントをここに記載
        const FORMSPREE_ENDPOINTS = [
            'https://formspree.io/f/xeokqold', // 1つ目の送信先
            'https://formspree.io/f/mnnvqnbd'  // 2つ目の送信先
        ];

        const formData = new FormData(form);
        const formContainer = document.querySelector('.form-container');
        const submitButton = form.querySelector('.submit-btn');

        // 送信ボタンを無効化し、「送信中...」に変更してユーザーに処理中であることを伝える
        submitButton.disabled = true;
        submitButton.textContent = '送信中...';

        // Promise.allを使い、すべてのエンドポイントに同時にデータを非同期で送信
        const sendPromises = FORMSPREE_ENDPOINTS.map(endpoint =>
            fetch(endpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
        );

        Promise.all(sendPromises)
            .then(responses => {
                // すべての送信が成功したか（HTTPステータスが正常か）を確認
                const allSuccess = responses.every(response => response.ok);
                
                if (allSuccess) {
                    // 全ての送信が成功した場合、フォームをサンクスメッセージに置き換える
                    formContainer.innerHTML = `
                        <div class="form-header" style="text-align: center; padding: 40px;">
                            <h1>ご登録ありがとうございます！</h1>
                            <p>ご入力いただいた内容で無事に送信されました。<br>確認のメールが届くまで、今しばらくお待ちください。</p>
                        </div>
                    `;
                    window.scrollTo(0, 0); // ページ最上部にスクロール
                } else {
                    // 1つでも送信に失敗した場合はエラーを発生させる
                    throw new Error('一部の送信に失敗しました。レスポンスが正常ではありません。');
                }
            })
            .catch(error => {
                // ネットワークエラーや上記のエラーが発生した場合
                console.error('送信エラー:', error);
                alert('送信中にエラーが発生しました。大変お手数ですが、時間をおいて再度お試しください。');
                
                // ユーザーが再試行できるよう、ボタンの状態を元に戻す
                submitButton.disabled = false;
                submitButton.textContent = '会員登録する';
            });
    });


    // 初期表示
    updateStepDisplay();
});