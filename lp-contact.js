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
        
        // すべてのエラーメッセージをクリア
        currentStepElement.querySelectorAll('.error-message').forEach(msg => msg.remove());
        inputs.forEach(input => {
            if (input.type !== 'radio' && input.type !== 'checkbox') {
                input.style.borderColor = '';
            }
        });
        
        inputs.forEach(input => {
            let inputIsValid = true;
            
            if (input.type === 'radio') {
                const radioGroup = document.getElementsByName(input.name);
                if (!Array.from(radioGroup).some(radio => radio.checked)) {
                    inputIsValid = false;
                    // ラジオボタングループ全体にエラーを表示
                    const radioContainer = input.closest('.radio-group') || input.closest('.form-group');
                    if (radioContainer && !radioContainer.querySelector('.error-message')) {
                        const errorElement = document.createElement('p');
                        errorElement.textContent = 'この項目は必須です。';
                        errorElement.className = 'error-message';
                        errorElement.style.color = '#e53935';
                        errorElement.style.marginTop = '5px';
                        errorElement.style.fontSize = '14px';
                        radioContainer.appendChild(errorElement);
                    }
                }
            } else if (input.type === 'checkbox') {
                if (!input.checked) {
                    inputIsValid = false;
                    const formGroup = input.closest('.form-group') || input.closest('.agreement-check');
                    if (formGroup && !formGroup.querySelector('.error-message')) {
                        const errorElement = document.createElement('p');
                        errorElement.textContent = 'この項目は必須です。';
                        errorElement.className = 'error-message';
                        errorElement.style.color = '#e53935';
                        errorElement.style.marginTop = '5px';
                        errorElement.style.fontSize = '14px';
                        formGroup.appendChild(errorElement);
                    }
                }
            } else if (input.tagName === 'SELECT') {
                if (!input.value || input.value === '') {
                    inputIsValid = false;
                    input.style.borderColor = '#e53935';
                    const formGroup = input.closest('.form-group');
                    if (formGroup && !formGroup.querySelector('.error-message')) {
                        const errorElement = document.createElement('p');
                        errorElement.textContent = 'この項目は必須です。';
                        errorElement.className = 'error-message';
                        errorElement.style.color = '#e53935';
                        errorElement.style.marginTop = '5px';
                        errorElement.style.fontSize = '14px';
                        formGroup.appendChild(errorElement);
                    }
                }
            } else if (!input.value.trim()) {
                inputIsValid = false;
                input.style.borderColor = '#e53935';
                const formGroup = input.closest('.form-group');
                if (formGroup && !formGroup.querySelector('.error-message')) {
                    const errorElement = document.createElement('p');
                    errorElement.textContent = 'この項目は必須です。';
                    errorElement.className = 'error-message';
                    errorElement.style.color = '#e53935';
                    errorElement.style.marginTop = '5px';
                    errorElement.style.fontSize = '14px';
                    formGroup.appendChild(errorElement);
                }
            }

            if (!inputIsValid) {
                isValid = false;
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

        // 同意チェックボックスの確認
        const agreementCheckbox = form.querySelector('input[name="agreement"]');
        if (!agreementCheckbox || !agreementCheckbox.checked) {
            alert('利用規約とプライバシーポリシーに同意してください。');
            agreementCheckbox.closest('.agreement-check').style.border = '2px solid #e53935';
            agreementCheckbox.closest('.agreement-check').style.padding = '10px';
            agreementCheckbox.closest('.agreement-check').style.borderRadius = '4px';
            window.scrollTo(0, agreementCheckbox.closest('.agreement-section').offsetTop - 100);
            return;
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

        // 各エンドポイントへの送信を試みる（少なくとも1つ成功すればOK）
        const sendPromises = FORMSPREE_ENDPOINTS.map((endpoint, index) =>
            fetch(endpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`エンドポイント${index + 1}の送信に失敗しました: ${response.status}`);
                }
                return response.json().catch(() => ({ ok: true })); // JSON解析に失敗しても成功とみなす
            })
            .catch(error => {
                console.warn(`エンドポイント${index + 1}の送信エラー:`, error);
                return null; // エラーでもnullを返して続行
            })
        );

        Promise.all(sendPromises)
            .then(results => {
                // 少なくとも1つの送信が成功したか確認
                const hasSuccess = results.some(result => result !== null);
                
                if (hasSuccess) {
                    // フォーム送信成功イベントを送信
                    if (window.dataLayer) {
                        window.dataLayer.push({
                            'event': 'form_submit',
                            'event_category': 'conversion',
                            'event_label': 'お問い合わせフォーム',
                            'value': 1
                        });
                    }
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submit', {
                            'event_category': 'conversion',
                            'event_label': 'お問い合わせフォーム',
                            'value': 1
                        });
                    }
                    // 少なくとも1つの送信が成功した場合、フォームをサンクスメッセージとカレンダー予約に置き換える
                    formContainer.innerHTML = `
                        <div class="form-header success-header">
                            <h1>ご登録ありがとうございます！</h1>
                            <p>ご入力いただいた内容で無事に送信されました。<br>確認のメールが届くまで、今しばらくお待ちください。</p>
                        </div>
                        <div class="calendar-section">
                            <h2 class="calendar-title">日程調整</h2>
                            <p class="calendar-description">ご希望の日程を選択してください</p>
                            <div class="calendar-container">
                                <iframe src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ3J8h2ek2ZpOkSfSCf1r5ChIcNIbBKz5sg5cveObroRjyO_vPaHO5KUaTi5aGqnH-FPMO7G-bQZ?gv=true" width="100%" height="600" frameborder="0"></iframe>
                            </div>
                        </div>
                        <div class="back-button-container">
                            <a href="index.html" class="back-to-top-btn">最初のページに戻る</a>
                        </div>
                    `;
                    window.scrollTo(0, 0); // ページ最上部にスクロール
                } else {
                    // すべての送信に失敗した場合
                    throw new Error('すべての送信先への送信に失敗しました。');
                }
            })
            .catch(error => {
                // ネットワークエラーや上記のエラーが発生した場合
                console.error('送信エラー:', error);
                alert('送信中にエラーが発生しました。大変お手数ですが、時間をおいて再度お試しください。\n\nエラー詳細: ' + error.message);
                
                // ユーザーが再試行できるよう、ボタンの状態を元に戻す
                submitButton.disabled = false;
                submitButton.textContent = '会員登録する';
            });
    });


    // 初期表示
    updateStepDisplay();
});