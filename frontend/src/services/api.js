import axios from 'axios';

const BASE_URL = 'https://ai-resume-analyzer-backend-qn02.onrender.com';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

/**
 * Analyze resume against job description.
 * @param {File} resumeFile - PDF resume file
 * @param {string} jobDescription - Job description text
 * @returns {Promise<Object>} Analysis result
 */
export const analyzeResume = async (resumeFile, jobDescription) => {
  const formData = new FormData();
  formData.append('resume', resumeFile);
  formData.append('jobDescription', jobDescription);

  const response = await apiClient.post('/api/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

/**
 * Parse resume text only (preview).
 * @param {File} resumeFile - PDF resume file
 * @returns {Promise<Object>} Extracted text and metadata
 */
export const parseResume = async (resumeFile) => {
  const formData = new FormData();
  formData.append('resume', resumeFile);

  const response = await apiClient.post('/api/parse-resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

/**
 * Check API health.
 */
export const checkHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};
