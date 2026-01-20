# Transcorp Hilton Abuja AI Concierge Chatbot

A sophisticated AI-powered virtual concierge for Transcorp Hilton Abuja, built with FastAPI and Anthropic's Claude AI. This chatbot provides guests with instant, accurate, and professional assistance 24/7 for all hotel-related inquiries.

![Hilton Concierge](https://img.shields.io/badge/Hilton-Concierge-005CB9?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.9+-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi)
![Claude AI](https://img.shields.io/badge/Claude-AI-8B5CF6?style=for-the-badge)

## 🌟 Features

### Core Capabilities
- **24/7 Virtual Assistance**: Instant responses to guest inquiries at any time
- **Comprehensive Knowledge Base**: Information about rooms, dining, amenities, services, and local attractions
- **Multilingual Support**: Communicates in English, French, Arabic, and Nigerian Pidgin
- **Context-Aware Conversations**: Maintains conversation history for personalized interactions
- **Professional Brand Voice**: Maintains Hilton's high service standards in all interactions

### Technical Features
- **Fast & Scalable**: Built with FastAPI for high performance
- **Real-time Chat Interface**: Modern, responsive web interface
- **Session Management**: Tracks conversation history per session
- **Error Handling**: Graceful error handling and user feedback
- **RESTful API**: Well-documented API endpoints for easy integration

## 📋 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.9 or higher**
- **pip** (Python package manager)
- **Anthropic API Key** (Get one at [anthropic.com](https://www.anthropic.com))

## 📦 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd AI-chatbot
```

### 2. Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Anthropic API key
nano .env  # or use your preferred text editor
```

Add your Anthropic API key:
```env
ANTHROPIC_API_KEY=your_actual_api_key_here
```

## ⚙️ Configuration

### Environment Variables

Edit the `.env` file to configure the application:

```env
# Anthropic API Configuration
ANTHROPIC_API_KEY=your_api_key_here

# Server Configuration
HOST=0.0.0.0
PORT=8000

# Model Configuration
MODEL_NAME=claude-3-5-sonnet-20241022
MAX_TOKENS=4096
TEMPERATURE=0.7
```

### Configuration Options

| Variable | Description | Default |
|----------|-------------|---------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key (required) | - |
| `HOST` | Server host address | `0.0.0.0` |
| `PORT` | Server port | `8000` |
| `MODEL_NAME` | Claude model to use | `claude-3-5-sonnet-20241022` |
| `MAX_TOKENS` | Maximum tokens for responses | `4096` |
| `TEMPERATURE` | Response creativity (0.0-1.0) | `0.7` |

## 🚀 Usage

### Starting the Server

```bash
# Make sure virtual environment is activated
python main.py
```

Or use uvicorn directly:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The application will be available at:
- **Web Interface**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

### Using the Web Interface

1. Open your browser and navigate to http://localhost:8000
2. You'll see the Transcorp Hilton Abuja AI Concierge interface
3. Click on quick action buttons or type your question
4. The AI concierge will respond with helpful information

### Quick Action Examples

The interface provides quick action buttons for common queries:
- 🍽️ Dining Options
- 🏊 Amenities
- ⏰ Check-in/out Times
- 🚕 Airport Transfer
- 💆 Spa Services
- 🗺️ Local Attractions

## 📚 API Documentation

### Endpoints

#### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "Transcorp Hilton Abuja AI Concierge",
  "timestamp": "2026-01-20T12:00:00"
}
```

#### 2. Chat (Send Message)
```http
POST /chat
```

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "What are the check-in times?"
    }
  ],
  "session_id": "session_123456"
}
```

**Response:**
```json
{
  "response": "Check-in at Transcorp Hilton Abuja is at 3:00 PM (15:00)...",
  "session_id": "session_123456",
  "timestamp": "2026-01-20T12:00:00"
}
```

#### 3. Get Conversation History
```http
GET /conversation/{session_id}
```

**Response:**
```json
{
  "session_id": "session_123456",
  "messages": [...],
  "message_count": 4
}
```

#### 4. Clear Conversation
```http
DELETE /conversation/{session_id}
```

**Response:**
```json
{
  "message": "Conversation cleared successfully"
}
```

### Interactive API Documentation

FastAPI provides automatic interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📁 Project Structure

```
AI-chatbot/
├── main.py                 # FastAPI application and API endpoints
├── system_prompt.py        # Comprehensive system prompt for AI concierge
├── requirements.txt        # Python dependencies
├── .env.example           # Example environment variables
├── .env                   # Your environment variables (not in git)
├── .gitignore            # Git ignore rules
├── README.md             # This file
└── static/               # Frontend files
    ├── index.html        # Main chat interface
    ├── styles.css        # Styling
    └── script.js         # Frontend JavaScript
```

## 🌐 Deployment

### Production Considerations

#### 1. Security
- Use HTTPS in production
- Set specific CORS origins (not `*`)
- Use environment-specific API keys
- Implement rate limiting
- Add authentication if needed

#### 2. Database
The current implementation uses in-memory storage. For production:
- Use Redis for session storage
- Use PostgreSQL/MongoDB for conversation history
- Implement conversation retention policies

#### 3. Monitoring
- Add logging (e.g., with Python's logging module)
- Implement error tracking (e.g., Sentry)
- Monitor API usage and costs
- Set up health checks and alerts

### Deployment Options

#### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t hilton-concierge .
docker run -p 8000:8000 --env-file .env hilton-concierge
```

#### Cloud Platforms

- **AWS**: Deploy on EC2, ECS, or use Elastic Beanstalk
- **Google Cloud**: Use Cloud Run or App Engine
- **Azure**: Deploy on Azure App Service
- **Heroku**: Simple deployment with Procfile
- **Railway/Render**: Easy deployment for small projects

### Example: Deploy to Railway

1. Create `railway.toml`:
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "uvicorn main:app --host 0.0.0.0 --port $PORT"
```

2. Push to GitHub
3. Connect Railway to your repository
4. Add environment variables in Railway dashboard
5. Deploy!

## 🔒 Security

### Best Practices

1. **Never commit `.env` file** - It's in `.gitignore` for a reason
2. **Use environment variables** - For all sensitive configuration
3. **Rotate API keys** - Regularly update your Anthropic API key
4. **Implement rate limiting** - Prevent abuse of the API
5. **Input validation** - Already implemented via Pydantic models
6. **HTTPS only** - In production environments
7. **CORS configuration** - Set specific allowed origins

### Data Privacy

The chatbot follows NDPR (Nigeria Data Protection Regulation) principles:
- No storage of sensitive personal information
- Conversations can be cleared by users
- No sharing of guest information
- Transparent about being an AI assistant

## 🎨 Customization

### Modifying the System Prompt

Edit `system_prompt.py` to customize:
- Brand voice and tone
- Knowledge base information
- Response guidelines
- Supported languages

### Styling the Interface

Edit `static/styles.css` to customize:
- Colors (see CSS variables in `:root`)
- Fonts
- Layout
- Animations

### Adding Features

The modular structure makes it easy to add:
- User authentication
- Multi-language UI
- Voice input/output
- Image support
- Integration with hotel systems

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Module not found" error
```bash
# Solution: Ensure virtual environment is activated
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

**Issue**: "API key not found"
```bash
# Solution: Check your .env file
cat .env  # Should show ANTHROPIC_API_KEY=your_key_here
```

**Issue**: Port already in use
```bash
# Solution: Use a different port
uvicorn main:app --port 8001
```

**Issue**: CORS errors in browser
```bash
# Solution: Check CORS settings in main.py
# Make sure your frontend URL is in allow_origins
```

## 📝 Testing

### Manual Testing

Test the chatbot with various queries:

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test chat endpoint
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello"}],
    "session_id": "test123"
  }'
```

### Example Test Queries

- "What time is breakfast served?"
- "Tell me about the spa"
- "How do I get to the airport?"
- "Bonjour, quelle heure est le petit-déjeuner?" (French)
- "What are the room rates?" (Tests pricing inquiry handling)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software for Transcorp Hilton Abuja.

## 📧 Support

For issues, questions, or suggestions:
- Create an issue in the repository
- Contact the development team
- Email: tech@transcrphiltonabuja.com (example)

## 🙏 Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- Powered by [Anthropic Claude](https://www.anthropic.com/)
- Designed for [Transcorp Hilton Abuja](https://www.hilton.com/)

---

**Version 1.0.0** | January 2026 | Transcorp Hilton Abuja

*Making hospitality smarter, one conversation at a time.* 🏨✨
