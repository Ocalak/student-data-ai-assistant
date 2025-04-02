// Backend integration for the AI Assistant
// This file handles communication with external AI services

class AIBackendService {
    constructor() {
        // Base URL for the serverless function
        // In a real implementation, this would point to your deployed serverless function
        this.apiBaseUrl = 'https://your-serverless-function-url.netlify.app/.netlify/functions/ai-assistant';
        
        // Fallback to mock responses if API is unavailable
        this.useMockResponses = true;
    }

    /**
     * Process a user question and get an AI response
     * @param {string} question - The user's question
     * @param {object} studentData - The student data to analyze
     * @returns {Promise} - Promise resolving to the AI response
     */
    async processQuestion(question, studentData) {
        if (this.useMockResponses) {
            return this.getMockResponse(question);
        }
        
        try {
            const response = await fetch(this.apiBaseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question })
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error calling AI service:', error);
            // Fall back to mock responses if API call fails
            return this.getMockResponse(question);
        }
    }
    
    /**
     * Get a mock response for demonstration purposes
     * @param {string} question - The user's question
     * @returns {Promise} - Promise resolving to a mock response
     */
    async getMockResponse(question) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check for predefined questions and return mock responses
        const lowerQuestion = question.toLowerCase();
        
        if (lowerQuestion.includes('highest average score') || lowerQuestion.includes('best student')) {
            return {
                text: 'The student with the highest average score is S03 with an average score of 92.5%.',
                visualization: {
                    type: 'bar',
                    title: 'Top 5 Students by Average Score',
                    data: {
                        labels: ['S03', 'S01', 'S07', 'S05', 'S02'],
                        datasets: [{
                            label: 'Average Score (%)',
                            data: [92.5, 87.3, 85.1, 82.7, 79.4],
                            backgroundColor: 'rgba(54, 162, 235, 0.7)'
                        }]
                    }
                }
            };
        }
        
        if (lowerQuestion.includes('most difficult') || lowerQuestion.includes('hardest exercise')) {
            return {
                text: 'The most difficult exercise is "Ü2B4c)_" with an average score of 42.3%. This exercise has the lowest average score across all students.',
                visualization: {
                    type: 'horizontalBar',
                    title: '5 Most Difficult Exercises',
                    data: {
                        labels: ['Ü2B4c)_', 'Ü3A2a)_', 'Ü1C5b)_', 'Ü2A1d)_', 'Ü3B3a)_'],
                        datasets: [{
                            label: 'Average Score (%)',
                            data: [42.3, 45.7, 48.2, 51.4, 53.8],
                            backgroundColor: 'rgba(255, 99, 132, 0.7)'
                        }]
                    }
                }
            };
        }
        
        if (lowerQuestion.includes('time spent') && lowerQuestion.includes('score')) {
            return {
                text: 'There is a moderate positive correlation (r = 0.42) between time spent and scores. This suggests that students who spend more time on exercises tend to get higher scores, although the relationship is not very strong.',
                visualization: {
                    type: 'scatter',
                    title: 'Time Spent vs. Score',
                    data: {
                        datasets: [{
                            label: 'Exercises',
                            data: [
                                {x: 120, y: 65}, {x: 240, y: 75}, {x: 180, y: 60},
                                {x: 300, y: 85}, {x: 150, y: 70}, {x: 210, y: 80},
                                {x: 270, y: 90}, {x: 90, y: 50}, {x: 330, y: 95},
                                {x: 180, y: 75}, {x: 240, y: 85}, {x: 120, y: 60},
                                {x: 300, y: 90}, {x: 150, y: 65}, {x: 210, y: 75}
                            ],
                            backgroundColor: 'rgba(75, 192, 192, 0.7)'
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Time Spent (seconds)'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Score (%)'
                                }
                            }
                        }
                    }
                }
            };
        }
        
        if (lowerQuestion.includes('performance') && lowerQuestion.includes('s01')) {
            return {
                text: 'Student S01 has an average score of 87.3%. Their performance appears to be improving over time (early exercises: 82.1%, later exercises: 92.5%).',
                visualization: {
                    type: 'line',
                    title: 'Performance Timeline for S01',
                    data: {
                        labels: ['Jan 5', 'Jan 12', 'Jan 19', 'Jan 26', 'Feb 2', 'Feb 9', 'Feb 16', 'Feb 23'],
                        datasets: [{
                            label: 'Score (%)',
                            data: [75, 80, 85, 82, 90, 88, 95, 93],
                            borderColor: 'rgba(54, 162, 235, 1)',
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            tension: 0.1
                        }]
                    }
                }
            };
        }
        
        if (lowerQuestion.includes('compare') && lowerQuestion.includes('s05') && lowerQuestion.includes('s08')) {
            return {
                text: 'Comparison between S05 and S08:\n\nS05: 82.7% average score, 90.5% pass rate, 185.3 seconds average time\nS08: 76.4% average score, 85.2% pass rate, 210.7 seconds average time\n\nStudent S05 performs better overall with higher average scores and pass rates while spending less time on exercises.',
                visualization: {
                    type: 'bar',
                    title: 'Comparison: S05 vs S08',
                    data: {
                        labels: ['Average Score', 'Pass Rate', 'Average Time (s)'],
                        datasets: [
                            {
                                label: 'S05',
                                data: [82.7, 90.5, 185.3],
                                backgroundColor: 'rgba(54, 162, 235, 0.7)'
                            },
                            {
                                label: 'S08',
                                data: [76.4, 85.2, 210.7],
                                backgroundColor: 'rgba(255, 99, 132, 0.7)'
                            }
                        ]
                    }
                }
            };
        }
        
        if (lowerQuestion.includes('pass rate') && lowerQuestion.includes('ü1a3a')) {
            return {
                text: 'The pass rate for exercise "Ü1A3a)_" is 78.3%. This means that 78.3% of students achieved a score of 50% or higher on this exercise.',
                visualization: {
                    type: 'pie',
                    title: 'Pass Rate for Ü1A3a)_',
                    data: {
                        labels: ['Pass', 'Fail'],
                        datasets: [{
                            data: [78.3, 21.7],
                            backgroundColor: [
                                'rgba(75, 192, 192, 0.7)',
                                'rgba(255, 99, 132, 0.7)'
                            ]
                        }]
                    }
                }
            };
        }
        
        // Default response for other questions
        return {
            text: "I don't have specific information about that. Try asking about student performance, exercise difficulty, or time spent on exercises.\n\nExample questions:\n- Which student has the highest average score?\n- What is the most difficult exercise?\n- How does time spent correlate with scores?\n- Show me the performance trend for student S01\n- Compare the performance of students S05 and S08\n- What is the pass rate for exercise Ü1A3a)_?",
            visualization: null
        };
    }
}

// Export the service
window.AIBackendService = AIBackendService;
