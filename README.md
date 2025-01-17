# Chinese Name Generator (中文姓名生成器)

A smart web application that helps foreigners generate meaningful Chinese names with cultural interpretations.

## Features

### 1. Intelligent Name Generation
- Convert English names to Chinese names with similar pronunciation
- Generate 3 unique Chinese name options for each input
- Ensure phonetic harmony and cultural appropriateness
- Match English pronunciation patterns while maintaining Chinese naming conventions

### 2. Cultural Interpretation
Each recommended name includes:
- Character-by-character explanation
- Overall name meaning
- Cultural significance
- Personality traits associated with the name
- English interpretation of the name's meaning

### 3. User Experience
- Clean and intuitive interface
- Simple 3-step process
- Clear result display
- Save and export name options

## Project Structure

```
generate_CN_name/
├── static/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── img/
├── templates/
│   └── index.html
├── data/
│   ├── chinese_characters.json
│   └── translation_rules.json
├── app.py
└── README.md
```

## Setup and Installation

1. Install Python requirements:
```bash
pip install -r requirements.txt
```

2. Run the application:
```bash
python app.py
```

3. Open your browser and visit `http://localhost:5000`

## Usage

1. Enter your English name in the input field
2. Click "Generate Names" button
3. View the generated Chinese names with their cultural interpretations
4. Save or export your favorite options

## Technical Details

- Frontend: HTML5, CSS3, JavaScript
- Backend: Python Flask
- Data Storage: JSON files for character database and translation rules

## Development Guidelines

1. Code Style
   - Follow PEP 8 for Python code
   - Use semantic HTML5 elements
   - Maintain clean and modular CSS

2. Documentation
   - Comment code thoroughly in both English and Chinese
   - Keep README updated with new features and changes

3. Testing
   - Test name generation with various input patterns
   - Verify cultural appropriateness of generated names
   - Ensure responsive design across devices

## Contributing

Feel free to submit issues and enhancement requests!
