import re
import PyPDF2
import io
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Download required NLTK data
def download_nltk_data():
    try:
        nltk.data.find('tokenizers/punkt')
    except LookupError:
        nltk.download('punkt', quiet=True)
    try:
        nltk.data.find('corpora/stopwords')
    except LookupError:
        nltk.download('stopwords', quiet=True)
    try:
        nltk.data.find('tokenizers/punkt_tab')
    except LookupError:
        nltk.download('punkt_tab', quiet=True)

download_nltk_data()


def extract_text_from_pdf(pdf_file):
    """Extract raw text from a PDF file object."""
    text = ""
    try:
        pdf_bytes = pdf_file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    except Exception as e:
        raise ValueError(f"Failed to parse PDF: {str(e)}")
    return text


def clean_text(text):
    """Clean and normalize text."""
    # Lowercase
    text = text.lower()
    # Remove special characters but keep spaces
    text = re.sub(r'[^\w\s]', ' ', text)
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def tokenize_and_filter(text):
    """Tokenize text and remove stopwords."""
    try:
        tokens = word_tokenize(text)
    except Exception:
        tokens = text.split()

    try:
        stop_words = set(stopwords.words('english'))
    except Exception:
        stop_words = set()

    filtered = [
        token for token in tokens
        if token.isalpha() and token not in stop_words and len(token) > 2
    ]
    return filtered


def preprocess_text(text):
    """Full preprocessing pipeline."""
    cleaned = clean_text(text)
    tokens = tokenize_and_filter(cleaned)
    return cleaned, tokens
