// DOM元素
const englishNameInput = document.getElementById('englishName');
const generateBtn = document.getElementById('generateBtn');
const resultsSection = document.getElementById('resultsSection');
const nameCardTemplate = document.getElementById('nameCardTemplate');

// 事件监听器
document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateBtn');
    const englishNameInput = document.getElementById('englishName');
    const resultsSection = document.getElementById('resultsSection');
    const nameCardTemplate = document.getElementById('nameCardTemplate');

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
                        // 创建要复制的文本
                        const copyText = `Chinese Name: ${nameData.chinese}
Pinyin: ${nameData.pinyin}
Characters Meaning: ${nameData.characters_meaning}
Overall Meaning: ${nameData.overall_meaning}
Cultural Significance: ${nameData.cultural_significance}
Personality Traits: ${nameData.personality_traits}`;

                        // 复制到剪贴板
                        copyToClipboard(copyText, saveBtn);
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

    // 复制到剪贴板的函数
    async function copyToClipboard(text, button) {
        try {
            await navigator.clipboard.writeText(text);
            
            // 更新按钮文本显示反馈
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.style.backgroundColor = '#27ae60';
            
            // 2秒后恢复按钮原始状态
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '#2ecc71';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy to clipboard. Please try again.');
        }
    }
});

// 添加页面加载动画
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
});
