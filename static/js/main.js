// DOM元素
const englishNameInput = document.getElementById('englishName');
const generateBtn = document.getElementById('generateBtn');
const resultsSection = document.getElementById('resultsSection');
const nameCardTemplate = document.getElementById('nameCardTemplate');

// 事件监听器
generateBtn.addEventListener('click', generateNames);
englishNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateNames();
    }
});

// 生成名字的主函数
async function generateNames() {
    const englishName = englishNameInput.value.trim();
    if (!englishName) {
        alert('Please enter your English name');
        return;
    }

    try {
        // 显示加载状态
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';

        // 发送请求到后端
        const response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ english_name: englishName })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const names = await response.json();
        displayResults(names);
    } catch (error) {
        console.error('Error:', error);
        alert('Sorry, something went wrong. Please try again.');
    } finally {
        // 恢复按钮状态
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Names';
    }
}

// 显示结果
function displayResults(names) {
    // 清空之前的结果
    resultsSection.innerHTML = '';

    // 为每个名字创建一个卡片
    names.forEach(name => {
        const card = nameCardTemplate.content.cloneNode(true);

        // 填充卡片内容
        card.querySelector('.chinese-name').textContent = name.chinese;
        card.querySelector('.pinyin').textContent = name.pinyin;
        card.querySelector('.characters-meaning').textContent = name.characters_meaning;
        card.querySelector('.overall-meaning').textContent = name.overall_meaning;
        card.querySelector('.cultural-meaning').textContent = name.cultural_significance;
        card.querySelector('.personality-traits').textContent = name.personality_traits;

        // 添加保存按钮功能
        const saveBtn = card.querySelector('.save-btn');
        saveBtn.addEventListener('click', () => saveName(name));

        resultsSection.appendChild(card);
    });
}

// 保存名字
function saveName(name) {
    // 获取已保存的名字
    let savedNames = JSON.parse(localStorage.getItem('savedNames') || '[]');
    
    // 检查是否已经保存
    if (!savedNames.some(saved => saved.chinese === name.chinese)) {
        savedNames.push(name);
        localStorage.setItem('savedNames', JSON.stringify(savedNames));
        alert('Name saved successfully!');
    } else {
        alert('This name is already saved!');
    }
}

// 添加页面加载动画
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
});
