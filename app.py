from flask import Flask, request, render_template
from markupsafe import Markup
import re
import os
from openai import OpenAI # Import the OpenAI library
import uuid
from werkzeug.utils import secure_filename
from io import BytesIO
from PIL import Image
import base64


app = Flask(__name__)

def nl2br_filter(value):
    return Markup(value.replace("\n", "<br>"))

app.jinja_env.filters['nl2br'] = nl2br_filter


# List of predefined countries, colors, shapes, and styles
countries_list = [
    "India", "USA", "China", "Germany", "France", "Japan", "Italy", "UK", "Canada", "Australia",
    "Mexico", "Brazil", "Spain", "Netherlands", "Sweden", "Singapore", "United Arab Emirates", 
    "Saudi Arabia", "Turkey", "South Korea", "South Africa", "Ireland", "Austria", "Poland", 
    "Belgium", "Switzerland", "New Zealand", "Denmark", "Norway", "Portugal", "Czech Republic", 
    "Egypt", "Argentina", "Colombia", "Malaysia", "Chile", "Thailand", "Indonesia", "Vietnam", 
    "Philippines"
]


colors_list = [
    "red", "blue", "green", "yellow", "black", "white", "gray", 
    "purple", "pink", "orange", "brown", "beige", 
    "silver", "golden", "teal", "magenta", "cyan", "maroon", 
    "navy", "turquoise", "lime", "peach", "violet", "indigo", 
    "charcoal", "ivory", "amber"
]

additional_features_list = [
    "eco-friendly", "lightweight", "sustainable", "durable", "waterproof", 
    "breathable", "versatile", "washable", "comfortable", "recyclable", 
    "compact", "adjustable", "stylish", "modern", "vintage", "soft", 
    "organic", "reversible", "high-quality", "portable", "hypoallergenic", 
    "fashionable", "stretchable", "moisture-wicking", "slim-fit", "easy-care", 
    "functional", "luxurious", "machine-washable", "non-toxic", "sleek", 
    "antibacterial", "temperature-regulating", "aesthetic"
]

client = OpenAI(
  base_url = "https://integrate.api.nvidia.com/v1",
  api_key = "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"
)


# Function to extract additional features from the caption
def extract_additional_features(caption):
    features = []
    caption = caption.lower()  # Convert caption to lowercase for case-insensitive comparison
    for feature in additional_features_list:
        if feature in caption:
            features.append(feature.capitalize())  # Capitalize the feature for consistency
    return features if features else ["No special features"]

# Function to extract price from the caption
def extract_price(caption):
    # Searching for price patterns with ₹, Rs., rs, or $ symbols
    price_match = re.search(r'(₹|Rs\.|rs\.|Rs|rs|\$)\s?([\d,]+)', caption)
    if price_match:
        currency_symbol = price_match.group(1)  # Extract currency symbol
        price_str = price_match.group(2)  # Extract numeric part
        price_str = price_str.replace(',', '')  # Remove commas for proper price extraction
        return f'{currency_symbol} {price_str}'
    return ""

# Function to extract country from the caption (case-insensitive)
def extract_country(caption):
    caption = caption.lower()  # Convert caption to lowercase for case-insensitive comparison
    for country in countries_list:
        if country.lower() in caption:
            return country
    return "  "

# Function to extract color from the caption
def extract_color(caption):
    caption = caption.lower()
    for color in colors_list:
        if color in caption:
            return color.capitalize()  # Capitalize the color for consistency
    return "  "


# Function to generate AI description based on the caption
def generate_ai_description(caption):
    try:
        # Sending the user's caption to OpenAI for AI-based description generation
        completion = client.chat.completions.create(
            model="meta/llama-3.1-405b-instruct",
            messages=[{"role": "user", "content": f"Generate a detailed product listing of {caption} to be sold on Amazon. The listing should include the following elements: Product Description: Write a brief and compelling description of the product, including Key features, Material or fabric (if applicable), Color or design details, Any unique characteristics. Highlight the usage or ideal occasion for the product (e.g., daily use, special events, etc.).List important features, one per line, with a new line for each feature. Examples - color, size, weight, dimensions, special materials, benefits, care instructions.Include the brand or company name if it's available. Mention any specific occasions or uses the product is intended. It should be SEO optimiszed, professional, engaging, and formatted in a clear way. Use proper grammar and keep the language focused on selling the product to potential buyers."}],
            temperature=0.2,
            top_p=0.7,
            max_tokens=1024,
            stream=True  # Stream the response
        )

        ai_description = ""
        
        # Process each chunk of the streamed response
        for chunk in completion:
            if chunk.choices[0].delta.content is not None:
                ai_description += chunk.choices[0].delta.content  # Accumulate the content from the chunks
        

        ai_description = ai_description.replace('*', '')

        return ai_description
    
    except Exception as e:
        return f"Error generating description: {e}"



# Route to display the upload form
@app.route('/')
def index():
    return render_template('index.html')

# Route to process the uploaded image and caption
@app.route('/process', methods=['POST'])
def process():
    if 'image' not in request.files or 'caption' not in request.form:
        return "No image or caption provided", 400
    
    image = request.files['image']
    caption = request.form['caption']

    # Validate file type
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    if not ('.' in image.filename and image.filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS):
        return "Invalid file type. Only images are allowed.", 400

    # Use BytesIO to handle the image in memory
    img = Image.open(image.stream)

    # Convert the image to a format that can be embedded as a data URL
    img_io = BytesIO()
    img.save(img_io, 'PNG')  # Save as PNG (you can choose other formats too)
    img_io.seek(0)

    # Convert to base64 encoding to embed the image directly in HTML
    img_data = base64.b64encode(img_io.getvalue()).decode('utf-8')

    # Generate a data URL for embedding in the img tag
    img_url = f"data:image/png;base64,{img_data}"


 
    # Generate AI-based product description
    ai_description = generate_ai_description(caption).replace('\n', '<br>')

    # Extract details
    price = extract_price(ai_description)
    country = extract_country(ai_description)
    color = extract_color(ai_description)
    additional_features = extract_additional_features(ai_description)

    # Create the product listing with all extracted details and AI description
    product_listing = {
        "image": img_url,  # Directly using the base64 image data URL
        "description": caption,
        "ai_description": ai_description,  # Adding AI description
        "price": price,
        "country_of_origin": country,
        "color": color,
        "additional_features": ", ".join(additional_features) 
    }

    return render_template('index.html', result=product_listing, image_url=img_url)

if __name__ == '__main__':
    # Create 'uploads' folder if it doesn't exist
    if not os.path.exists(os.path.join('static', 'uploads')):
        os.makedirs(os.path.join('static', 'uploads'))
    
    app.run(debug=True)
