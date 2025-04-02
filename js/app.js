// Main application JavaScript for the AI Assistant

// Global variables
let chart = null;
let studentData = null;

// DOM elements
document.addEventListener('DOMContentLoaded', () => {
    // Load student data
    fetch('data/student_data.json')
        .then(response => response.json())
        .then(data => {
            studentData = data;
            console.log('Student data loaded successfully');
        })
        .catch(error => console.error('Error loading student data:', error));

    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const visualizationContainer = document.querySelector('.visualization-container');
    const visualizationCanvas = document.getElementById('visualization-canvas');
    const visualizationTitle = document.getElementById('visualization-title');

    // Event listeners
    sendButton.addEventListener('click', handleUserInput);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });

    // Function to handle user input
    function handleUserInput() {
        const question = userInput.value.trim();
        if (question === '') return;

        // Add user message to chat
        addMessageToChat('user', question);
        
        // Clear input field
        userInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Process the question and get AI response
        processQuestion(question)
            .then(response => {
                // Remove typing indicator
                removeTypingIndicator();
                
                // Add AI response to chat
                addMessageToChat('assistant', response.text);
                
                // Handle visualization if available
                if (response.visualization) {
                    showVisualization(response.visualization);
                } else {
                    hideVisualization();
                }
            })
            .catch(error => {
                // Remove typing indicator
                removeTypingIndicator();
                
                // Show error message
                addMessageToChat('assistant', 'Sorry, I encountered an error processing your question. Please try again.');
                console.error('Error processing question:', error);
            });
    }

    // Function to add a message to the chat
    function addMessageToChat(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Process text for potential HTML content (for lists, etc.)
        if (text.includes('<ul>') || text.includes('<li>')) {
            messageContent.innerHTML = text;
        } else {
            // Split by newlines and create paragraph elements
            const paragraphs = text.split('\n').filter(p => p.trim() !== '');
            paragraphs.forEach(paragraph => {
                const p = document.createElement('p');
                p.textContent = paragraph;
                messageContent.appendChild(p);
            });
        }
        
        messageDiv.appendChild(messageContent);
        chatContainer.appendChild(messageDiv);
        
        // Scroll to bottom of chat
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Function to show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant';
        typingDiv.id = 'typing-indicator';
        
        const typingContent = document.createElement('div');
        typingContent.className = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            typingContent.appendChild(dot);
        }
        
        typingDiv.appendChild(typingContent);
        chatContainer.appendChild(typingDiv);
        
        // Scroll to bottom of chat
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Function to remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Function to process the question and get AI response
    async function processQuestion(question) {
        // Use the backend service to process the question
        const backendService = new window.AIBackendService();
        return await backendService.processQuestion(question, studentData);
    }

    // Function to show visualization
    function showVisualization(visualization) {
        // Show visualization container
        visualizationContainer.classList.remove('hidden');
        
        // Set visualization title
        visualizationTitle.textContent = visualization.title || 'Visualization';
        
        // Destroy previous chart if it exists
        if (chart) {
            chart.destroy();
        }
        
        // Create new chart based on visualization type
        const ctx = visualizationCanvas.getContext('2d');
        
        // Configure chart type
        let chartType = 'bar';
        if (visualization.type === 'horizontalBar') {
            chartType = 'bar';
            visualization.options = visualization.options || {};
            visualization.options.indexAxis = 'y';
        } else if (visualization.type) {
            chartType = visualization.type;
        }
        
        // Create chart
        chart = new Chart(ctx, {
            type: chartType,
            data: visualization.data,
            options: visualization.options || {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Function to hide visualization
    function hideVisualization() {
        visualizationContainer.classList.add('hidden');
        
        // Destroy chart if it exists
        if (chart) {
            chart.destroy();
            chart = null;
        }
    }
});
