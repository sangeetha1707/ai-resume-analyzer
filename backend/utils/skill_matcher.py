import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Comprehensive tech/professional skill dictionary
KNOWN_SKILLS = {
    # Programming Languages
    "python", "java", "javascript", "typescript", "c++", "c#", "ruby", "go",
    "rust", "swift", "kotlin", "scala", "php", "r", "matlab", "perl", "bash",
    "shell", "powershell", "dart", "lua", "haskell", "elixir", "clojure",

    # Web Frameworks & Libraries
    "react", "angular", "vue", "nextjs", "nuxtjs", "svelte", "django", "flask",
    "fastapi", "spring", "express", "nodejs", "rails", "laravel", "gatsby",
    "redux", "graphql", "restful", "rest", "api", "jquery", "bootstrap",
    "tailwind", "webpack", "vite", "babel",

    # Databases
    "sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch",
    "cassandra", "dynamodb", "sqlite", "oracle", "firebase", "supabase",
    "nosql", "neo4j", "influxdb",

    # Cloud & DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ansible",
    "jenkins", "gitlab", "github", "ci/cd", "devops", "linux", "unix",
    "nginx", "apache", "heroku", "vercel", "cloudflare", "lambda", "serverless",

    # Data Science & ML
    "machine learning", "deep learning", "nlp", "tensorflow", "pytorch",
    "keras", "scikit-learn", "pandas", "numpy", "matplotlib", "seaborn",
    "spark", "hadoop", "airflow", "mlflow", "huggingface", "llm", "gpt",
    "neural network", "computer vision", "data analysis", "statistics",
    "regression", "classification", "clustering",

    # Mobile
    "android", "ios", "react native", "flutter", "xamarin", "objective-c",

    # Tools & Methodologies
    "agile", "scrum", "kanban", "jira", "confluence", "git", "svn",
    "testing", "unit testing", "tdd", "bdd", "selenium", "jest", "pytest",
    "microservices", "event-driven", "oop", "functional programming",
    "design patterns", "solid", "mvc",

    # Soft & Business Skills
    "leadership", "communication", "teamwork", "problem solving",
    "project management", "product management", "stakeholder management",
    "analytical", "critical thinking", "collaboration", "mentoring",
    "presentation", "documentation",

    # Security
    "cybersecurity", "penetration testing", "oauth", "jwt", "ssl", "tls",
    "encryption", "authentication", "authorization",

    # Other Technical
    "blockchain", "smart contracts", "solidity", "web3",
    "ar", "vr", "unity", "unreal engine", "opengl",
    "embedded systems", "iot", "raspberry pi", "arduino",
}

# Suggestions map: missing skill -> improvement tip
SUGGESTIONS_MAP = {
    "docker": "Consider adding Docker containerization experience to your resume.",
    "kubernetes": "Kubernetes experience is highly valued — try deploying a project with K8s.",
    "aws": "Cloud experience (AWS) is critical — pursue an AWS certification.",
    "azure": "Microsoft Azure skills are in high demand — consider Azure fundamentals.",
    "python": "Python is essential for many roles — highlight any Python projects.",
    "machine learning": "Add ML projects or courses (e.g., Coursera ML Specialization) to your resume.",
    "react": "React is widely used — build a portfolio project to demonstrate it.",
    "typescript": "TypeScript is increasingly required — add it to your skillset.",
    "sql": "SQL is foundational — make sure your database experience is explicit.",
    "git": "Ensure Git/version control experience is clearly listed.",
    "agile": "Mention Agile/Scrum methodology experience in your work descriptions.",
    "testing": "Add unit/integration testing skills — they're often a requirement.",
    "ci/cd": "CI/CD pipeline experience is valuable — mention Jenkins, GitHub Actions, etc.",
    "communication": "Strengthen resume bullet points to showcase communication achievements.",
    "leadership": "Highlight any leadership roles or mentoring experience.",
    "deep learning": "Consider adding a deep learning project (CNNs, transformers, etc.).",
    "graphql": "GraphQL is growing in popularity — consider learning it for API work.",
    "microservices": "Mention microservices architecture if you have distributed systems experience.",
    "linux": "Linux/Unix proficiency is often expected — ensure it's on your resume.",
    "nosql": "NoSQL experience (MongoDB, Redis) complements SQL skills well.",
}


def extract_skills_from_text(text):
    """Extract known skills from a text string."""
    text_lower = text.lower()
    found_skills = set()

    # Check multi-word skills first (longer matches take priority)
    multi_word = sorted(
        [s for s in KNOWN_SKILLS if ' ' in s],
        key=len, reverse=True
    )
    for skill in multi_word:
        if skill in text_lower:
            found_skills.add(skill)

    # Check single-word skills using word boundary
    single_word = [s for s in KNOWN_SKILLS if ' ' not in s]
    for skill in single_word:
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.add(skill)

    return found_skills


def calculate_tfidf_similarity(text1, text2):
    """Calculate cosine similarity between two texts using TF-IDF."""
    try:
        vectorizer = TfidfVectorizer(
            stop_words='english',
            ngram_range=(1, 2),
            max_features=5000
        )
        tfidf_matrix = vectorizer.fit_transform([text1, text2])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
        return float(similarity[0][0])
    except Exception:
        return 0.0


def analyze_match(resume_text, job_text):
    """
    Full analysis: skill extraction, matching, TF-IDF similarity.
    Returns matchScore, matchedSkills, missingSkills, suggestions.
    """
    resume_skills = extract_skills_from_text(resume_text)
    job_skills = extract_skills_from_text(job_text)

    matched_skills = sorted(resume_skills & job_skills)
    missing_skills = sorted(job_skills - resume_skills)

    # Skill-based score (weighted 60%)
    skill_score = 0.0
    if job_skills:
        skill_score = len(matched_skills) / len(job_skills)

    # TF-IDF semantic similarity (weighted 40%)
    tfidf_score = calculate_tfidf_similarity(resume_text, job_text)

    # Combined weighted score
    final_score = round((skill_score * 0.6 + tfidf_score * 0.4) * 100, 1)
    final_score = min(final_score, 100.0)

    # Generate suggestions for top missing skills
    suggestions = []
    for skill in missing_skills[:8]:
        if skill in SUGGESTIONS_MAP:
            suggestions.append(SUGGESTIONS_MAP[skill])
        else:
            suggestions.append(
                f"Consider adding '{skill}' to your resume if you have experience with it."
            )

    # Generic suggestions
    if final_score < 40:
        suggestions.append("Tailor your resume more closely to the job description language and keywords.")
    if final_score < 60:
        suggestions.append("Quantify your achievements with metrics (e.g., 'reduced load time by 40%').")
    if not suggestions:
        suggestions.append("Great match! Ensure your resume is ATS-friendly with clean formatting.")

    return {
        "matchScore": final_score,
        "matchedSkills": matched_skills,
        "missingSkills": missing_skills,
        "suggestions": suggestions[:6],
        "totalJobSkills": len(job_skills),
        "totalResumeSkills": len(resume_skills),
    }
