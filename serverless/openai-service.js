// Enhanced AI service integration with OpenAI
// This file would be used in a real implementation with OpenAI API

const axios = require('axios');
require('dotenv').config();

// Function to process question with OpenAI
async function processQuestionWithOpenAI(question, studentData) {
  try {
    // Prepare context about the student data
    const context = `
      You are an AI assistant that helps analyze student performance data.
      The data contains information about students (identified by IDs like S01, S02),
      their performance on various exercises, scores (0-100), and time spent.
      
      Some key insights from the data:
      - The highest performing student is S03 with an average score of 92.5%
      - The most difficult exercise is Ü2B4c)_ with an average score of 42.3%
      - There is a moderate positive correlation (r = 0.42) between time spent and scores
      - Student S01 shows improvement over time (early exercises: 82.1%, later exercises: 92.5%)
      
      When answering questions, provide specific data points and insights.
      If appropriate, suggest a visualization type that would help illustrate the answer.
    `;

    // Call OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.AI_MODEL || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: context },
          { role: 'user', content: question }
        ],
        max_tokens: parseInt(process.env.MAX_TOKENS || '500'),
        temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Parse the response
    const aiResponse = response.data.choices[0].message.content;
    const parsedResponse = JSON.parse(aiResponse);
    
    // Generate visualization data based on the response
    const visualizationData = generateVisualization(parsedResponse, question);
    
    return {
      text: parsedResponse.answer || parsedResponse.text,
      visualization: visualizationData
    };
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    
    // Return a fallback response
    return {
      text: "I'm having trouble connecting to my AI service. Please try again later or ask a different question.",
      visualization: null
    };
  }
}

// Function to generate visualization data based on AI response
function generateVisualization(aiResponse, question) {
  // If AI already suggested a visualization, use it
  if (aiResponse.visualization) {
    return aiResponse.visualization;
  }
  
  // Otherwise, try to infer a visualization based on the question and response
  const lowerQuestion = question.toLowerCase();
  
  // For questions about student performance
  if (lowerQuestion.includes('highest') || lowerQuestion.includes('best') || 
      lowerQuestion.includes('top') || lowerQuestion.includes('ranking')) {
    return {
      type: 'bar',
      title: 'Student Performance Ranking',
      data: {
        // Generate placeholder data - in a real implementation, 
        // this would be based on actual student data
        labels: ['S03', 'S01', 'S07', 'S05', 'S02'],
        datasets: [{
          label: 'Average Score (%)',
          data: [92.5, 87.3, 85.1, 82.7, 79.4],
          backgroundColor: 'rgba(54, 162, 235, 0.7)'
        }]
      }
    };
  }
  
  // For questions about exercise difficulty
  if (lowerQuestion.includes('difficult') || lowerQuestion.includes('hardest') || 
      lowerQuestion.includes('easiest') || lowerQuestion.includes('challenging')) {
    return {
      type: 'horizontalBar',
      title: 'Exercise Difficulty',
      data: {
        labels: ['Ü2B4c)_', 'Ü3A2a)_', 'Ü1C5b)_', 'Ü2A1d)_', 'Ü3B3a)_'],
        datasets: [{
          label: 'Average Score (%)',
          data: [42.3, 45.7, 48.2, 51.4, 53.8],
          backgroundColor: 'rgba(255, 99, 132, 0.7)'
        }]
      }
    };
  }
  
  // For questions about time correlation
  if (lowerQuestion.includes('time') && lowerQuestion.includes('score')) {
    return {
      type: 'scatter',
      title: 'Time Spent vs. Score',
      data: {
        datasets: [{
          label: 'Exercises',
          data: [
            {x: 120, y: 65}, {x: 240, y: 75}, {x: 180, y: 60},
            {x: 300, y: 85}, {x: 150, y: 70}, {x: 210, y: 80},
            {x: 270, y: 90}, {x: 90, y: 50}, {x: 330, y: 95}
          ],
          backgroundColor: 'rgba(75, 192, 192, 0.7)'
        }]
      }
    };
  }
  
  // No appropriate visualization for this question
  return null;
}

module.exports = {
  processQuestionWithOpenAI
};
