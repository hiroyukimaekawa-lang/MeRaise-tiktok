// スムーズスクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ヘッダーのスクロール時のスタイル変更
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// カードのホバーエフェクト強化
const companyCards = document.querySelectorAll('.company-card');
companyCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// アニメーション（スクロール時に要素をフェードイン）
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// アニメーション対象の要素を監視
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.company-section, .feature-card');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
});

// Slick Carouselの初期化を無効化（レスポンシブ時はHTMLの内容のみを表示）
// すべての画面サイズでカルーセルを無効化
$(document).ready(function(){
    // 既に初期化されているSlick Carouselを破棄
    if ($('.carousel').hasClass('slick-initialized')) {
        $('.carousel').slick('unslick');
    }
    
    // カルーセルクラスを削除して通常のグリッド表示に
    $('.carousel').removeClass('slick-initialized slick-slider');
    
    // ウィンドウリサイズ時もカルーセルを無効化
    $(window).on('resize', function(){
        if ($('.carousel').hasClass('slick-initialized')) {
            $('.carousel').slick('unslick');
        }
        $('.carousel').removeClass('slick-initialized slick-slider');
    });
});

// CTAボタンのクリックイベント（実際のリンクに置き換える必要があります）
document.querySelectorAll('.hero-cta, .feature-cta, .btn-register').forEach(button => {
    button.addEventListener('click', function(e) {
        // ここに実際のリンク先やトラッキングコードを追加
        console.log('CTA clicked:', this.textContent);
    });
});

// モバイルメニューのトグル（必要に応じて）
const createMobileMenu = () => {
    if (window.innerWidth <= 768) {
        // モバイル用のメニュー機能を追加する場合はここに実装
    }
};

window.addEventListener('resize', createMobileMenu);
createMobileMenu();

// 画像コラージュのアニメーション
const collageItems = document.querySelectorAll('.collage-item');
collageItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.2}s`;
    item.style.animation = 'float 3s ease-in-out infinite';
});

// CSSアニメーションを動的に追加
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0px) rotate(var(--rotation, 0deg));
        }
        50% {
            transform: translateY(-10px) rotate(var(--rotation, 0deg));
        }
    }
    
    .item1 { --rotation: -5deg; }
    .item2 { --rotation: 5deg; }
    .item3 { --rotation: -3deg; }
    .item4 { --rotation: 8deg; }
`;
document.head.appendChild(style);

// ========== モーダル機能 ==========
document.addEventListener('DOMContentLoaded', function() {
    // モーダルを開く
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // 背景スクロールを無効化
        }
    }

    // モーダルを閉じる
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // 背景スクロールを有効化
        }
    }

    // モーダルを開くボタン
    document.querySelectorAll('[data-modal]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            openModal(modalId);
        });
    });

    // モーダルを閉じるボタン（×ボタン）
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    // モーダル背景をクリックで閉じる
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });

    // ESCキーでモーダルを閉じる
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });

    // ログインと登録フォームの切り替え
    const switchToRegisterLink = document.querySelector('.switch-to-register');
    if (switchToRegisterLink) {
        switchToRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal('login-modal');
            setTimeout(() => {
                openModal('register-modal');
            }, 300);
        });
    }

    // ========== ログインフォーム処理 ==========
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const submitBtn = this.querySelector('.btn-submit');
            
            // バリデーション
            if (!email || !password) {
                alert('メールアドレスとパスワードを入力してください。');
                return;
            }

            // 送信ボタンを無効化
            submitBtn.disabled = true;
            submitBtn.textContent = 'ログイン中...';

            // ここに実際のログイン処理を実装
            // 例: APIへのリクエスト
            setTimeout(() => {
                alert('ログイン処理を実装してください。\nメール: ' + email);
                submitBtn.disabled = false;
                submitBtn.textContent = 'ログイン';
                // closeModal('login-modal');
            }, 1000);
        });
    }

    // ========== 登録フォーム処理（ステップ管理） ==========
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        let currentStep = 1;
        const totalSteps = 3;

        // ステップ表示を更新
        function updateStepDisplay() {
            for (let i = 1; i <= totalSteps; i++) {
                const step = document.getElementById(`register-step-${i}`);
                if (step) {
                    if (i === currentStep) {
                        step.classList.add('active-step');
                    } else {
                        step.classList.remove('active-step');
                    }
                }
            }
            // スクロールをトップに
            const modalContent = registerForm.closest('.modal-content');
            if (modalContent) {
                modalContent.scrollTop = 0;
            }
        }

        // ステップのバリデーション
        function validateStep(step) {
            const stepElement = document.getElementById(`register-step-${step}`);
            if (!stepElement) return false;

            const requiredFields = stepElement.querySelectorAll('input[required], select[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (field.type === 'radio') {
                    const radioGroup = document.querySelectorAll(`input[name="${field.name}"]`);
                    const isChecked = Array.from(radioGroup).some(radio => radio.checked);
                    if (!isChecked) {
                        isValid = false;
                        field.closest('.form-group')?.classList.add('error');
                    } else {
                        field.closest('.form-group')?.classList.remove('error');
                    }
                } else {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('error');
                    } else {
                        field.classList.remove('error');
                    }
                }
            });

            return isValid;
        }

        // 次へボタン
        document.querySelectorAll('#register-form .btn-next').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                if (validateStep(currentStep)) {
                    if (currentStep < totalSteps) {
                        currentStep++;
                        updateStepDisplay();
                    }
                } else {
                    alert('必須項目を入力してください。');
                }
            });
        });

        // 戻るボタン
        document.querySelectorAll('#register-form .btn-prev').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                if (currentStep > 1) {
                    currentStep--;
                    updateStepDisplay();
                }
            });
        });

        // フォーム送信
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // 最終ステップのバリデーション
            if (!validateStep(currentStep)) {
                alert('必須項目を入力してください。');
                return;
            }

            // 同意チェックボックスの確認
            const agreement = this.querySelector('input[name="agreement"]');
            if (!agreement || !agreement.checked) {
                alert('利用規約とプライバシーポリシーに同意してください。');
                return;
            }

            const submitBtn = this.querySelector('.btn-submit');
            const formData = new FormData(this);

            // 送信ボタンを無効化
            submitBtn.disabled = true;
            submitBtn.textContent = '送信中...';

            // Formspreeへの送信（実際のエンドポイントに変更してください）
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // フォーム送信成功イベントを送信
                    if (window.dataLayer) {
                        window.dataLayer.push({
                            'event': 'form_submit',
                            'event_category': 'conversion',
                            'event_label': '会員登録フォーム',
                            'value': 1
                        });
                    }
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submit', {
                            'event_category': 'conversion',
                            'event_label': '会員登録フォーム',
                            'value': 1
                        });
                    }
                    
                    alert('登録が完了しました！\nご登録ありがとうございます。');
                    registerForm.reset();
                    currentStep = 1;
                    updateStepDisplay();
                    closeModal('register-modal');
                } else {
                    throw new Error('送信に失敗しました。');
                }
            })
            .catch(error => {
                alert('エラーが発生しました。もう一度お試しください。\n' + error.message);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = '会員登録する';
            });
        });

        // 初期表示
        updateStepDisplay();
    }

    // ========== Google Analytics 4 CV計測イベント ==========
    // イベント送信用の共通関数（GTMとGA4の両方に対応）
    function sendGAEvent(eventName, eventParams = {}) {
        // dataLayer.push を使用（GTMで処理される）
        if (window.dataLayer) {
            window.dataLayer.push({
                'event': eventName,
                ...eventParams
            });
        }
        // gtag も併用（GA4に直接送信）
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventParams);
        }
    }

    // LINE相談ボタン クリック計測
    const lineConsultationBtn = document.getElementById('line-consultation-btn');
    if (lineConsultationBtn) {
        lineConsultationBtn.addEventListener('click', function() {
            sendGAEvent('line_click', {
                'event_category': 'engagement',
                'event_label': 'LINE相談ボタン',
                'value': 1
            });
        });
    }

    // 「面接対策はこちら」ボタン クリック計測
    const interviewBtn = document.getElementById('interview-btn');
    if (interviewBtn) {
        interviewBtn.addEventListener('click', function() {
            sendGAEvent('interview_click', {
                'event_category': 'engagement',
                'event_label': '面接対策ボタン',
                'value': 1
            });
        });
    }

    // 「ES添削はこちら」ボタン クリック計測
    const esEditBtn = document.getElementById('es-edit-btn');
    if (esEditBtn) {
        esEditBtn.addEventListener('click', function() {
            sendGAEvent('es_click', {
                'event_category': 'engagement',
                'event_label': 'ES添削ボタン',
                'value': 1
            });
        });
    }

    // フォーム送信完了計測（index.html内のregister-form）
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        // 既存のsubmitイベントリスナーを保持しつつ、イベント送信を追加
        const originalSubmitHandler = registerForm.onsubmit;
        registerForm.addEventListener('submit', function(e) {
            // フォーム送信が成功した場合のイベント送信は、送信成功後に実行される
        }, true);
    }
});
