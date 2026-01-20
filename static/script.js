// Transcorp Hilton Abuja AI Concierge - Frontend JavaScript

// State management
let conversationHistory = [];
let sessionId = generateSessionId();

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const clearChatButton = document.getElementById('clearChat');
const typingIndicator = document.getElementById('typingIndicator');
const charCount = document.getElementById('charCount');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeChat();
    setupEventListeners();
});

// Generate unique session ID
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Initialize chat
function initializeChat() {
    // Auto-resize textarea
    messageInput.addEventListener('input', () => {
        autoResizeTextarea();
        updateCharCount();
    });

    // Focus on input
    messageInput.focus();
}

// Setup event listeners
function setupEventListeners() {
    // Form submission
    chatForm.addEventListener('submit', handleSubmit);

    // Clear chat button
    clearChatButton.addEventListener('click', clearChat);

    // Quick action buttons
    document.querySelectorAll('.quick-action-btn').forEach(button => {
        button.addEventListener('click', () => {
            const message = button.getAttribute('data-message');
            messageInput.value = message;
            handleSubmit(new Event('submit'));
        });
    });

    // Enter key to send (Shift+Enter for new line)
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    });
}

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();

    const message = messageInput.value.trim();

    if (!message) {
        return;
    }

    // Disable input while processing
    setInputState(false);

    // Add user message to UI
    addMessage('user', message);

    // Clear input
    messageInput.value = '';
    autoResizeTextarea();
    updateCharCount();

    // Add message to history
    conversationHistory.push({
        role: 'user',
        content: message
    });

    // Show typing indicator
    showTypingIndicator(true);

    try {
        // Send to backend
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: conversationHistory,
                session_id: sessionId
            })
        });

        if (!response.ok) {
            throw new Error('Failed to get response from server');
        }

        const data = await response.json();

        // Hide typing indicator
        showTypingIndicator(false);

        // Add assistant message to UI
        addMessage('assistant', data.response);

        // Add to conversation history
        conversationHistory.push({
            role: 'assistant',
            content: data.response
        });

    } catch (error) {
        console.error('Error:', error);
        showTypingIndicator(false);
        showError('Sorry, I encountered an error. Please try again.');
    } finally {
        // Re-enable input
        setInputState(true);
        messageInput.focus();
    }
}

// Add message to chat UI
function addMessage(role, content) {
    // Remove welcome message if it exists
    const welcomeMessage = chatMessages.querySelector('.welcome-message');
    if (welcomeMessage && role === 'user') {
        welcomeMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';

    // Format message content (convert newlines to <br>, handle basic markdown)
    const formattedContent = formatMessageContent(content);
    messageContent.innerHTML = formattedContent;

    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = getCurrentTime();

    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(messageTime);

    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    scrollToBottom();
}

// Format message content
function formatMessageContent(content) {
    // Convert markdown-style formatting to HTML
    let formatted = content
        // Bold
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Line breaks
        .replace(/\n/g, '<br>')
        // Bullet points
        .replace(/^- (.+)$/gm, '• $1');

    return formatted;
}

// Get current time in HH:MM format
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Show/hide typing indicator
function showTypingIndicator(show) {
    if (show) {
        typingIndicator.classList.add('active');
        scrollToBottom();
    } else {
        typingIndicator.classList.remove('active');
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    chatMessages.appendChild(errorDiv);

    // Remove error after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);

    scrollToBottom();
}

// Clear chat
function clearChat() {
    if (confirm('Are you sure you want to start a new conversation?')) {
        conversationHistory = [];
        sessionId = generateSessionId();
        chatMessages.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon">👋</div>
                <h2>Welcome to Transcorp Hilton Abuja!</h2>
                <p>I'm your virtual concierge, here to assist you with any questions about our hotel, services, or your stay.</p>
                <p><strong>How may I help you today?</strong></p>

                <div class="quick-actions">
                    <h3>Quick Links:</h3>
                    <button class="quick-action-btn" data-message="What dining options are available?">🍽️ Dining Options</button>
                    <button class="quick-action-btn" data-message="Tell me about your amenities">🏊 Amenities</button>
                    <button class="quick-action-btn" data-message="What are the check-in and check-out times?">⏰ Check-in/out Times</button>
                    <button class="quick-action-btn" data-message="How do I get to the airport?">🚕 Airport Transfer</button>
                    <button class="quick-action-btn" data-message="Tell me about the spa services">💆 Spa Services</button>
                    <button class="quick-action-btn" data-message="What attractions are nearby?">🗺️ Local Attractions</button>
                </div>
            </div>
        `;

        // Re-attach quick action listeners
        document.querySelectorAll('.quick-action-btn').forEach(button => {
            button.addEventListener('click', () => {
                const message = button.getAttribute('data-message');
                messageInput.value = message;
                handleSubmit(new Event('submit'));
            });
        });

        messageInput.focus();
    }
}

// Auto-resize textarea
function autoResizeTextarea() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 150) + 'px';
}

// Update character count
function updateCharCount() {
    const count = messageInput.value.length;
    charCount.textContent = `${count}/2000`;

    if (count > 1800) {
        charCount.style.color = '#DC3545';
    } else {
        charCount.style.color = '#666666';
    }
}

// Set input state (enabled/disabled)
function setInputState(enabled) {
    messageInput.disabled = !enabled;
    sendButton.disabled = !enabled;

    if (enabled) {
        chatForm.classList.remove('loading');
    } else {
        chatForm.classList.add('loading');
    }
}

// Scroll to bottom of chat
function scrollToBottom() {
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

// Handle connection errors
window.addEventListener('offline', () => {
    showError('You are currently offline. Please check your internet connection.');
});

window.addEventListener('online', () => {
    showError('Connection restored. You can continue chatting.');
});
