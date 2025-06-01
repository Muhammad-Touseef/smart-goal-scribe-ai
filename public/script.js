
class ChatApp {
    constructor() {
        this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.isLoading = false;
        
        this.initializeElements();
        this.attachEventListeners();
        this.initializeTimestamp();
        this.enableInput();
    }

    initializeElements() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
    }

    attachEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        this.messageInput.addEventListener('input', () => {
            this.updateSendButton();
        });
    }

    initializeTimestamp() {
        const initialTimestamp = document.getElementById('initialTimestamp');
        if (initialTimestamp) {
            initialTimestamp.textContent = new Date().toLocaleTimeString();
        }
    }

    enableInput() {
        this.messageInput.disabled = false;
        this.updateSendButton();
    }

    updateSendButton() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendButton.disabled = this.isLoading || !hasText;
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isLoading) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input and disable it
        this.messageInput.value = '';
        this.setLoading(true);

        try {
            console.log('Sending message:', message);
            console.log('Session ID:', this.sessionId);

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    sessionId: this.sessionId
                }),
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response data:', data);

            // Add AI response to chat
            this.addMessage(data.response, 'ai');

        } catch (error) {
            console.error('Error sending message:', error);
            this.addMessage(
                "Sorry, there was an error processing your message. Please make sure the server is running and try again.",
                'ai',
                true
            );
        } finally {
            this.setLoading(false);
        }
    }

    addMessage(text, sender, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        if (isError) {
            contentDiv.style.background = '#fee2e2';
            contentDiv.style.color = '#dc2626';
        }

        const textP = document.createElement('p');
        textP.textContent = text;

        const timestamp = document.createElement('span');
        timestamp.className = 'timestamp';
        timestamp.textContent = new Date().toLocaleTimeString();

        contentDiv.appendChild(textP);
        contentDiv.appendChild(timestamp);
        messageDiv.appendChild(contentDiv);

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    setLoading(loading) {
        this.isLoading = loading;
        
        if (loading) {
            // Add loading message
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'message ai-message';
            loadingDiv.id = 'loading-message';

            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content loading';

            const loadingText = document.createElement('span');
            loadingText.textContent = 'Thinking';

            const dotsDiv = document.createElement('div');
            dotsDiv.className = 'loading-dots';
            
            for (let i = 0; i < 3; i++) {
                const dot = document.createElement('div');
                dot.className = 'loading-dot';
                dotsDiv.appendChild(dot);
            }

            contentDiv.appendChild(loadingText);
            contentDiv.appendChild(dotsDiv);
            loadingDiv.appendChild(contentDiv);

            this.chatMessages.appendChild(loadingDiv);
            this.scrollToBottom();
        } else {
            // Remove loading message
            const loadingMessage = document.getElementById('loading-message');
            if (loadingMessage) {
                loadingMessage.remove();
            }
        }

        this.messageInput.disabled = loading;
        this.updateSendButton();
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Initialize the chat app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});
