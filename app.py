from flask import Flask, render_template, request, jsonify
import json
import random
import os
import re
import requests
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

app = Flask(__name__)

# 智谱AI配置
ZHIPU_API_KEY = "00edd26fbd2e4f69b0d8c1d5a60bff75.aogm5k478AIj8MXw"
ZHIPU_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions"

def get_zhipu_headers():
    """获取智谱AI API调用需要的headers"""
    return {
        "Authorization": f"Bearer {ZHIPU_API_KEY}",
        "Content-Type": "application/json"
    }

def generate_name_prompt(english_name, name_style):
    """生成用于请求智谱AI的prompt"""
    style_description = "现代时尚" if name_style == "modern" else "传统古风"
    return f"""作为一个专业的中文姓名翻译专家，请为外国人设计三个不同的{style_description}风格的中文名字。

输入的英文名是：{english_name}

请你仔细思考并设计三个完美的中文名字，要求：
1. 发音要优美，尽量与英文名发音相近
2. 字义要积极向上，寓意吉祥
3. 整体要符合{style_description}的特点
4. 名字的解释要有深度，体现文化内涵
5. 性格特征要积极正面，符合名字特点
6. 三个名字要有各自的特色，不要重复

如果是现代风格：
- 使用当代常用字
- 寓意要符合现代人的审美和价值观
- 避免过于古典或晦涩的用字

如果是古风风格：
- 可以使用典雅古韵的用字
- 融入古典诗词的意境
- 体现传统文化的精髓

请严格按照以下JSON格式返回结果（注意：必须是合法的JSON格式，不要返回其他任何内容）：
{{
    "names": [
        {{
            "chinese": "第一个中文名字（2-3个字）",
            "pinyin": "拼音（用空格分隔每个字）",
            "characters_meaning": "请详细解释每个字的含义（格式：字: 含义）",
            "overall_meaning": "完整解释这个名字的整体寓意（50字以内）",
            "cultural_significance": "分析这个名字体现的中国传统文化内涵（50字以内）",
            "personality_traits": "描述这个名字所暗含的性格特征（30字以内）"
        }},
        {{
            "chinese": "第二个中文名字（2-3个字）",
            "pinyin": "拼音（用空格分隔每个字）",
            "characters_meaning": "请详细解释每个字的含义（格式：字: 含义）",
            "overall_meaning": "完整解释这个名字的整体寓意（50字以内）",
            "cultural_significance": "分析这个名字体现的中国传统文化内涵（50字以内）",
            "personality_traits": "描述这个名字所暗含的性格特征（30字以内）"
        }},
        {{
            "chinese": "第三个中文名字（2-3个字）",
            "pinyin": "拼音（用空格分隔每个字）",
            "characters_meaning": "请详细解释每个字的含义（格式：字: 含义）",
            "overall_meaning": "完整解释这个名字的整体寓意（50字以内）",
            "cultural_significance": "分析这个名字体现的中国传统文化内涵（50字以内）",
            "personality_traits": "描述这个名字所暗含的性格特征（30字以内）"
        }}
    ]
}}

注意事项：
1. 所有解释必须与所选的字有直接关联
2. 文化内涵要体现{style_description}特色
3. 性格特征要符合名字的字义
4. 整体寓意要积极向上
5. 所有解释要简洁有力，避免过于冗长
6. 三个名字要风格各异，突出不同的特点

请直接返回JSON格式的结果，不要加入任何其他说明文字。"""

def call_zhipu_ai(english_name, name_style):
    """调用智谱AI生成名字"""
    try:
        payload = {
            "model": "glm-4-flash",
            "messages": [
                {
                    "role": "user",
                    "content": generate_name_prompt(english_name, name_style)
                }
            ],
            "temperature": 0.7,
            "top_p": 0.7,
            "max_tokens": 2000,
            "stream": False
        }
        
        response = requests.post(
            ZHIPU_API_URL,
            headers=get_zhipu_headers(),
            json=payload,
            timeout=15
        )
        
        if response.status_code == 200:
            result = response.json()
            content = result['choices'][0]['message']['content']
            return json.loads(content)
        else:
            print(f"API调用失败: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"调用智谱AI时发生错误: {str(e)}")
        return None

def load_data():
    with open('data/chinese_characters.json', 'r', encoding='utf-8') as f:
        characters = json.load(f)
    with open('data/translation_rules.json', 'r', encoding='utf-8') as f:
        rules = json.load(f)
    return characters, rules

def get_phonetic_mapping(english_syllable, rules):
    """根据音节获取可能的中文字符"""
    mappings = []
    # 处理元音
    for vowel in rules["音节映射"]["元音"]:
        if vowel in english_syllable.lower():
            mappings.extend(rules["音节映射"]["元音"][vowel])
    # 处理辅音
    for consonant in rules["音节映射"]["辅音"]:
        if english_syllable.lower().startswith(consonant):
            mappings.extend(rules["音节映射"]["辅音"][consonant])
    return mappings if mappings else rules["音节映射"]["元音"]["a"]  # 默认返回

def split_name(name):
    """将英文名分割成音节"""
    # 简单的音节分割规则
    name = name.lower()
    syllables = re.findall(r'[^aeiou]*[aeiou][^aeiou]*', name)
    return syllables if syllables else [name]

def get_character_info(char, characters):
    """获取汉字的详细信息"""
    # 在常用字和音译字中查找
    for category in ["常用字", "音译字"]:
        if category in characters:
            if char in characters[category].get("名字", {}):
                return characters[category]["名字"][char]
            elif char in characters[category]:
                return characters[category][char]
    return {
        "meaning": "优雅高尚",
        "pinyin": "pinyin",
        "cultural_significance": "寓意美好",
        "personality": "积极向上"
    }

def generate_chinese_name(english_name, name_style, characters, rules):
    """生成中文名字，优先使用智谱AI，失败时使用随机生成"""
    # 首先尝试使用智谱AI生成
    ai_result = call_zhipu_ai(english_name, name_style)
    if ai_result and 'names' in ai_result and len(ai_result['names']) == 3:
        return ai_result['names']
        
    # 如果AI生成失败，使用备用的随机生成逻辑
    print("使用备用的随机生成逻辑")
    backup_names = []
    
    while len(backup_names) < 3:
        syllables = split_name(english_name)
        name_length = random.randint(2, 3)
        chinese_chars = []
        
        for i in range(name_length):
            if i < len(syllables):
                possible_chars = get_phonetic_mapping(syllables[i], rules)
            else:
                possible_chars = list(characters["常用字"]["名字"]["男性常用"].keys()) + \
                               list(characters["常用字"]["名字"]["女性常用"].keys())
            
            chosen_char = random.choice(possible_chars)
            chinese_chars.append(chosen_char)
        
        chinese_name = "".join(chinese_chars)
        
        # 检查是否重复
        if chinese_name not in [n.get("chinese") for n in backup_names]:
            chars_info = []
            for char in chinese_chars:
                info = get_character_info(char, characters)
                chars_info.append(f"{char}: {info.get('meaning', '优雅')}")
            
            style_text = "现代" if name_style == "modern" else "古风"
            backup_names.append({
                "chinese": chinese_name,
                "pinyin": " ".join([get_character_info(char, characters).get("pinyin", "").capitalize() for char in chinese_chars]),
                "characters_meaning": " ".join(chars_info),
                "overall_meaning": f"这个{style_text}风格的名字寓意着生命的美好与无限可能",
                "cultural_significance": f"体现了{style_text}特色的文化内涵，展现对美好生活的向往",
                "personality_traits": "开放、进取、充满活力"
            })
    
    return backup_names

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.get_json()
        english_name = data.get('english_name', '').strip()
        name_style = data.get('name_style', 'modern')  # 默认使用现代风格
        
        if not english_name:
            return jsonify({"error": "Name is required"}), 400

        # 加载数据
        characters, rules = load_data()
        
        # 生成名字（现在一次调用就能得到三个名字）
        names = generate_chinese_name(english_name, name_style, characters, rules)
        
        return jsonify(names)
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    # 确保数据目录存在
    if not os.path.exists('data'):
        os.makedirs('data')
    
    app.run(debug=True)
