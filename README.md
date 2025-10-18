# HealthMate - Sehat ka Smart Dost

An AI-powered personal health companion app that helps you manage medical reports and track health vitals.

## Features

- **User Authentication**: Secure login/register with JWT
- **Medical Report Upload**: Upload PDFs, images of medical reports
- **AI Analysis**: Gemini-powered analysis of medical reports
- **Bilingual Support**: English + Roman Urdu interface
- **Health Insights**: 
  - Abnormal values highlighted
  - Doctor questions suggested
  - Food recommendations
  - Home remedies
- **Manual Vitals Tracking**: Track BP, Sugar, Weight, Heart Rate, etc.
- **Health Timeline**: View all reports and vitals in chronological order

## Tech Stack

- **Frontend**: Next.js 15 + React + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB (configure in .env)
- **AI**: Gemini via Vercel AI Gateway
- **Storage**: Cloudinary/Firebase (configure in .env)
- **Authentication**: JWT

## Getting Started

### 1. Clone and Install

\`\`\`bash
git clone <your-repo>
cd healthmate
npm install
\`\`\`

### 2. Setup Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Required variables:
- `JWT_SECRET`: Any random string for JWT signing
- `MONGODB_URI`: Your MongoDB connection string
- `OPENAI_API_KEY`: Your OpenAI API key (optional - uses Vercel AI Gateway by default)

### 3. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Register**: Create a new account
2. **Upload Report**: Go to Dashboard → Upload Report
3. **View Analysis**: Click "View" on any report to see AI analysis
4. **Add Vitals**: Track your health metrics manually
5. **Check Timeline**: View all your health records in one place

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/reports/upload` - Upload medical report
- `GET /api/reports` - Get all reports
- `GET /api/reports/[id]` - Get specific report
- `POST /api/reports/analyze` - Analyze report with Gemini
- `POST /api/vitals/add` - Add vital reading
- `GET /api/vitals` - Get all vitals
- `GET /api/timeline` - Get health timeline

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

\`\`\`bash
vercel deploy
\`\`\`

### Deploy to Other Platforms

The app can be deployed to any Node.js hosting:
- Render
- Railway
- Heroku
- AWS
- DigitalOcean

## Security Notes

- Always use HTTPS in production
- Change JWT_SECRET to a strong random string
- Use environment variables for all secrets
- Enable CORS only for your domain
- Implement rate limiting for API endpoints
- Use Row Level Security (RLS) if using Supabase

## Future Enhancements

- Real-time notifications for health alerts
- Integration with wearable devices
- Doctor consultation booking
- Prescription management
- Health insurance integration
- Mobile app (React Native)

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

---

**Disclaimer**: This app is for informational purposes only. Always consult with a healthcare professional for medical advice.

**Roman Urdu**: "Yeh app sirf maloomat ke liye hai. Hamesha apne doctor se salah lein."
