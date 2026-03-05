from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import traceback

from utils.resume_parser import extract_text_from_pdf, preprocess_text
from utils.skill_matcher import analyze_match

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB max
ALLOWED_EXTENSIONS = {'pdf'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "AI Resume Analyzer API is running"}), 200


@app.route('/api/analyze', methods=['POST'])
def analyze_resume():
    """
    Expects multipart/form-data with:
      - resume: PDF file
      - jobDescription: string
    Returns JSON analysis result.
    """
    try:
        # Validate resume file
        if 'resume' not in request.files:
            return jsonify({"error": "No resume file provided"}), 400

        file = request.files['resume']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        if not allowed_file(file.filename):
            return jsonify({"error": "Only PDF files are supported"}), 400

        # Validate job description
        job_description = request.form.get('jobDescription', '').strip()
        if not job_description:
            return jsonify({"error": "Job description is required"}), 400

        if len(job_description) < 50:
            return jsonify({"error": "Job description is too short (minimum 50 characters)"}), 400

        # Extract and preprocess resume text
        resume_raw = extract_text_from_pdf(file)
        if not resume_raw.strip():
            return jsonify({"error": "Could not extract text from PDF. Ensure it's not a scanned image."}), 400

        resume_cleaned, resume_tokens = preprocess_text(resume_raw)
        job_cleaned, job_tokens = preprocess_text(job_description)

        # Run analysis
        result = analyze_match(resume_cleaned, job_cleaned)

        # Add metadata
        result['resumeWordCount'] = len(resume_tokens)
        result['filename'] = secure_filename(file.filename)

        return jsonify(result), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Internal server error. Please try again."}), 500


@app.route('/api/parse-resume', methods=['POST'])
def parse_resume_only():
    """
    Utility endpoint: just extract and return resume text.
    Expects multipart/form-data with:
      - resume: PDF file
    """
    try:
        if 'resume' not in request.files:
            return jsonify({"error": "No resume file provided"}), 400

        file = request.files['resume']
        if not allowed_file(file.filename):
            return jsonify({"error": "Only PDF files are supported"}), 400

        raw_text = extract_text_from_pdf(file)
        if not raw_text.strip():
            return jsonify({"error": "Could not extract text from PDF"}), 400

        return jsonify({
            "text": raw_text[:3000],  # Return first 3000 chars as preview
            "wordCount": len(raw_text.split()),
            "filename": secure_filename(file.filename),
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 AI Resume Analyzer API starting on http://localhost:5000")
    app.run(debug=False, host='0.0.0.0', port=5000)
