// DOM元素
const englishNameInput = document.getElementById('englishName');
const generateBtn = document.getElementById('generateBtn');
const resultsSection = document.getElementById('resultsSection');
const nameCardTemplate = document.getElementById('nameCardTemplate');

// 事件监听器
document.addEventListener('DOMContentLoaded', function() {
    generateBtn.addEventListener('click', async function() {
        const englishName = englishNameInput.value.trim();
        const selectedStyle = document.querySelector('input[name="nameStyle"]:checked').value;
        
        if (!englishName) {
            alert('Please enter your English name');
            return;
        }

        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
        resultsSection.innerHTML = '';

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    english_name: englishName,
                    name_style: selectedStyle
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const names = await response.json();
            
            if (Array.isArray(names)) {
                names.forEach(nameData => {
                    const nameCard = nameCardTemplate.content.cloneNode(true);
                    
                    nameCard.querySelector('.chinese-name').textContent = nameData.chinese;
                    nameCard.querySelector('.pinyin').textContent = nameData.pinyin;
                    nameCard.querySelector('.characters-meaning').textContent = nameData.characters_meaning;
                    nameCard.querySelector('.overall-meaning').textContent = nameData.overall_meaning;
                    nameCard.querySelector('.cultural-meaning').textContent = nameData.cultural_significance;
                    nameCard.querySelector('.personality-traits').textContent = nameData.personality_traits;
                    
                    const saveBtn = nameCard.querySelector('.save-btn');
                    saveBtn.addEventListener('click', function() {
                        // 保存功能待实现
                        alert('Save feature coming soon!');
                    });
                    
                    resultsSection.appendChild(nameCard);
                });
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate names. Please try again.');
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Names';
        }
    });
});

// 添加页面加载动画
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
});
