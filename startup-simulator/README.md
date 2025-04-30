# 💸 Sh*tty Startup Simulator™
_Tagline: "Raise $10M. Build on vibes. Deploy on Friday."_

A satirical game built with FastAPI + Next.js that pokes fun at AI startup culture while teaching the importance of custom evaluation metrics using Galileo.

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16+)
- Python 3.9+
- npm or yarn

### Frontend Setup
```bash
# Install dependencies
npm install

# Run the development server
npm run dev:frontend
```

### Backend Setup
```bash
# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python run_backend.py
```

### Run Both Together
```bash
npm run dev
```

## 🎮 How to Play

1. Enter your startup name and mission
2. Configure your AI stack and select tools
3. Submit a prompt to see your model's output
4. Get evaluated and see if investors will fund you
5. Discover your startup archetype

## 🧪 Available Tools

- Buzzword Biography Generator: Create impressive-sounding product descriptions
- Clever Company Namer: Generate trendy startup names
- Tech Complexifier: Add unnecessary architecture to simple problems
- TAM Identifier: Wildly overestimate your total addressable market
- Vibe Checker: Evaluate if your output has sufficient founder energy
- Founder Quote Inserter: Auto-generate inspirational quotes

## 🤓 Technical Details

- Frontend: Next.js, React, Tailwind CSS, Framer Motion
- Backend: FastAPI, Pydantic
- LLM Handling: Mock LLM outputs for demo purposes
- Evaluation Engine: Simulated evaluation metrics

## 🧠 Concept Summary

You're the CTO of a chaotic, buzzword-laden AI startup. Make stack decisions, prompt your LLM, and demo your product. Then… get roasted by eval results.

Each choice affects:
- 📈 Investor Confidence
- 🤖 Model Performance
- 🔥 Hallucination Risk

## 🧱 Tech Stack

| Layer        | Tech                     |
|--------------|--------------------------|
| Frontend     | Next.js, React, Tailwind |
| Backend      | FastAPI, Pydantic        |
| LLM Handling | OpenAI API  |
| Eval Engine  | Galileo Python SDK        |
| DB           | SQLite      |
| Extras       | Framer Motion  |

## 📝 Game Flow

1. **Landing Page**: Enter your startup name and mission
2. **Stack Builder**: Select LLM model, configure parameters, choose tools
3. **Prompt Terminal**: Enter a prompt for your startup's AI product
4. **Evaluation Display**: View Galileo metrics and get roasted
5. **Investor Decision**: Find out if VCs will fund you based on the evals
6. **Archetype Reveal**: Discover what type of AI startup founder you are

## 🛠️ Available Tools

The simulator comes with various satirical tools that your agents can use:

- **Buzzword Biography Generator**: Creates impressive-sounding but meaningless descriptions
- **Tech Complexifier**: Makes simple ideas sound architecturally complex
- **TAM Identifier**: Wildly overestimates your total addressable market
- **Vibe Checker**: Evaluates if your output has "founder energy"
- **Founder Quote Inserter**: Adds inspirational but meaningless quotes

## 📊 Metrics

The simulator uses the following metrics from Galileo:

- **Hallucination Score**: How factually incorrect the output is
- **Instruction Following**: Whether the model followed directions
- **Relevance**: If the response is on topic
- **Tool Use Accuracy**: How well tools were used
- **Investor Appeal**: Inversely correlated with quality (ironically)

## 🚧 Development

### Project Structure

```
shitty-startup-simulator/
├── backend/                         # FastAPI backend
│   ├── main.py                      # FastAPI app startup
│   ├── config.py                    # Environment config
│   ├── models/                      # Pydantic schemas
│   ├── routes/                      # API routes
│   ├── agents/                      # Modular agents
│   ├── tools/                       # Agent tools
│   └── services/                    # Shared services
├── frontend/                        # Next.js frontend
│   ├── pages/                       # Page components
│   ├── components/                  # UI components
│   ├── styles/                      # CSS and styles
│   └── utils/                       # Helper functions
├── shared/                          # Shared utilities
├── database/                        # Database scripts
├── .env.example                     # Example .env file
├── requirements.txt                 # Python dependencies
└── package.json                     # JS dependencies
```

## 📜 License

This project is MIT licensed. See the LICENSE file for details.

## 🙏 Acknowledgements

- [OpenAI](https://openai.com/) for the LLM API
- [Galileo](https://docs.galileo.ai/) for the evaluation metrics SDK
- The countless AI startups whose pitch decks inspired this satire

> This app is satire. Any resemblance to real AI startups is completely intentional. 