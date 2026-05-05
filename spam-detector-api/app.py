from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Spam keywords list
SPAM_KEYWORDS = [
    # Money / prizes
    'free', 'winner', 'congratulations', 'prize', 'lottery', 'cash', 'bonus',
    'claim', 'won', 'selected', 'lucky', 'earn', 'income', 'investment',
    # Urgency / action
    'urgent', 'act now', 'limited time', 'expire', 'immediately',
    'click here', 'open immediately', 'verify', 'confirm',
    # Account / security
    'password', 'login', 'account', 'suspend', 'unusual activity',
    'verify your account', 'update your information',
    # Offers / deals
    'discount', 'offer', 'deal', 'lowest price', 'save', 'cheap',
    'buy now', 'order now', 'exclusive', 'limited offer', 'special promotion',
    # Common spam phrases
    'meet singles', 'weight loss', 'viagra', 'cialis', 'enlargement',
    'work from home', 'make money fast', 'multi level', 'mlm',
    'guaranteed', 'risk free', 'satisfaction guaranteed',
    # Links / attachments
    'open attachment', 'download now', 'visit our website',
]

@app.route('/')
def home():
    return jsonify({"message": "Spam Detection API is running!"})

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    subject = data.get('subject', '').lower()
    body = data.get('body', '').lower()
    
    full_text = subject + " " + body
    
    found_keywords = [kw for kw in SPAM_KEYWORDS if kw in full_text]
    spam_score = len(found_keywords)
    
    is_spam = spam_score >= 2
    
    return jsonify({
        'is_spam': is_spam,
        'spam_score': spam_score,
        'found_keywords': found_keywords[:5],
        'message': 'Spam detected!' if is_spam else 'Legitimate email'
    })

if __name__ == '__main__':
    app.run(debug=True)