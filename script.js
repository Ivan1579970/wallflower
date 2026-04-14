function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function showErrorMessage(message) {
    const form = document.getElementById('reviewForm');
    if (!form) return;

    const oldMsg = form.querySelector('.error-message');
    if (oldMsg) oldMsg.remove();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = 'color: #c44; background: #ffe0e0; padding: 10px; border-radius: 8px; margin-top: 15px; text-align: center;';
    
    form.appendChild(errorDiv);
    
    setTimeout(() => errorDiv.remove(), 5000);
}

function showSuccessMessage(message) {
    const form = document.getElementById('reviewForm');
    if (!form) return;

    const oldMsg = form.querySelector('.success-message');
    if (oldMsg) oldMsg.remove();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = 'color: #4c6b3d; background: #e0ffe0; padding: 10px; border-radius: 8px; margin-top: 15px; text-align: center;';
    
    form.appendChild(successDiv);
    
    setTimeout(() => successDiv.remove(), 5000);
}

let isLoading = false;

function loadReviews() {
    if (isLoading) {
        console.log('Загрузка уже выполняется, пропускаю...');
        return;
    }
    
    isLoading = true;
    console.log('Загрузка отзывов...');
    
    fetch('get_reviews.php')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('comments-container');
            
            if (!container) {
                console.error('Контейнер #comments-container не найден!');
                return;
            }

            if (data.error) {
                container.innerHTML = `<p style="color: red; text-align: center;">${escapeHtml(data.error)}</p>`;
                return;
            }

            if (!Array.isArray(data) || data.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #999;">Пока нет отзывов. Будьте первым!</p>';
                return;
            }

            container.innerHTML = '';
            
            data.forEach(review => {
                const div = document.createElement('div');
                div.className = 'comment';
                div.innerHTML = `
                    <strong>${escapeHtml(review.name)}</strong>
                    <p>${escapeHtml(review.message)}</p>
                    ${review.date ? `<div class="comment-date">📅 ${escapeHtml(review.date)}</div>` : ''}
                `;
                container.appendChild(div);
            });
            
            console.log(`Отображено ${data.length} отзывов`);
        })
        .catch(error => {
            console.error('Ошибка загрузки отзывов:', error);
            const container = document.getElementById('comments-container');
            if (container) {
                container.innerHTML = '<p style="color: red; text-align: center;">Ошибка загрузки отзывов. Проверьте консоль.</p>';
            }
        })
        .finally(() => {
            isLoading = false;
        });
}

function initReviewForm() {
    const form = document.getElementById('reviewForm');
    
    if (!form) {
        console.error('Форма #reviewForm не найдена!');
        return;
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
        
        fetch('add_review.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                form.reset();
                loadReviews();
                showSuccessMessage('Спасибо за ваш отзыв!');
            } else if (data.error) {
                showErrorMessage(data.error);
            } else {
                showErrorMessage('Произошла неизвестная ошибка');
            }
        })
        .catch(error => {
            console.error('Ошибка отправки:', error);
            showErrorMessage('Не удалось отправить отзыв. Проверьте соединение.');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        });
    });
}

document.querySelectorAll('.more-btn').forEach(button => {
    button.addEventListener('click', function() {
        const card = this.closest('.card');
        card.classList.toggle('active');
        if(this.textContent === 'Подробнее'){
            this.textContent = 'Скрыть';
        } else {
            this.textContent = 'Подробнее';
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница загружена, инициализация...');
    loadReviews();
    initReviewForm();
});