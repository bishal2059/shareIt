<p align="center">
  <img src="https://img.icons8.com/fluency/96/share.png" alt="ShareIt Logo" width="80"/>
</p>

<h1 align="center">ShareIt</h1>

<p align="center">
  <strong>Fast, Secure, and Effortless File & Text Sharing</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#installation">Installation</a> •
  <a href="#configuration">Configuration</a> •
  <a href="#deployment">Deployment</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/Django-5.x-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django"/>
  <img src="https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"/>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License"/>
</p>

---

## 🎯 Overview

**ShareIt** is a modern web application that enables users to share text snippets and files instantly by generating secure, shareable links. All shared content automatically expires after 24 hours, ensuring privacy and security.

Perfect for:
- 📝 Sharing code snippets with colleagues
- 📁 Quick file transfers between devices
- 🔗 Temporary sharing without account creation
- 💼 Professional file sharing with auto-cleanup

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📤 **Text Sharing** | Share text, code, or notes instantly with syntax highlighting |
| 📁 **File Uploads** | Upload files up to **10MB** with drag & drop support |
| ⏰ **Auto-Expiry** | Links automatically expire after 24 hours |
| 📋 **One-Click Copy** | Copy generated links with a single click |
| 📊 **Upload Progress** | Real-time progress indicator for file uploads |
| 📱 **Responsive Design** | Beautiful UI that works on all devices |
| 🌙 **Modern Dark Theme** | Easy on the eyes with glassmorphism effects |
| 🔒 **Secure Storage** | Files stored securely in Supabase Storage |

---

## 🖥️ Demo

<p align="center">
  <img src="https://via.placeholder.com/800x450/0f0f23/667eea?text=ShareIt+Demo" alt="ShareIt Demo" width="100%"/>
</p>

**Live Demo:** [https://shareit-ijx9.onrender.com](https://shareit-ijx9.onrender.com)

---

## 🛠️ Tech Stack

### Backend
- **Django 5.x** - Python web framework
- **Supabase** - PostgreSQL database & file storage
- **WhiteNoise** - Static file serving

### Frontend
- **HTML5 / CSS3** - Modern markup & styling
- **JavaScript (ES6+)** - Interactive functionality
- **Font Awesome** - Icon library
- **Google Fonts (Inter)** - Typography

### Infrastructure
- **Render** - Cloud hosting platform
- **Supabase Storage** - File storage with CDN

---

## 📦 Installation

### Prerequisites

- Python 3.9 or higher
- pip (Python package manager)
- Supabase account ([Sign up free](https://supabase.com))

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/bishal2059/shareIt.git
   cd shareIt
   ```

2. **Create virtual environment**
   ```bash
   python -m venv .venv
   
   # Linux/macOS
   source .venv/bin/activate
   
   # Windows
   .venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run the development server**
   ```bash
   python manage.py runserver
   ```

6. **Open in browser**
   ```
   http://127.0.0.1:8000
   ```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost 127.0.0.1

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_BUCKET_NAME=ShareIt

# Server
PORT=8000
```

### Supabase Setup

1. **Create a new Supabase project**

2. **Create the required tables** (SQL Editor):
   ```sql
   -- Table for shared texts
   CREATE TABLE shared_texts (
       id UUID PRIMARY KEY,
       content TEXT NOT NULL,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Table for shared files
   CREATE TABLE shared_files (
       id UUID PRIMARY KEY,
       original_name TEXT NOT NULL,
       storage_name TEXT NOT NULL,
       file_size BIGINT NOT NULL,
       content_type TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Disable RLS for public access (or configure policies)
   ALTER TABLE shared_texts DISABLE ROW LEVEL SECURITY;
   ALTER TABLE shared_files DISABLE ROW LEVEL SECURITY;
   ```

3. **Create a storage bucket**
   - Go to Storage → New Bucket
   - Name: `ShareIt`
   - Public bucket: ✅ Enabled

4. **Configure storage policies** (if RLS enabled):
   ```sql
   CREATE POLICY "Allow public uploads" ON storage.objects 
   FOR INSERT WITH CHECK (bucket_id = 'ShareIt');
   
   CREATE POLICY "Allow public downloads" ON storage.objects 
   FOR SELECT USING (bucket_id = 'ShareIt');
   ```

---

## 🚀 Deployment

### Deploy to Render

1. **Connect your GitHub repository to Render**

2. **Configure environment variables** in Render dashboard

3. **Build Command:**
   ```bash
   pip install -r requirements.txt && python manage.py collectstatic --noinput
   ```

4. **Start Command:**
   ```bash
   gunicorn shareIt.wsgi:application
   ```

### Deploy to Other Platforms

The app is compatible with any platform that supports Python/Django:
- **Heroku** - Add `Procfile`
- **Railway** - Auto-detects Django
- **DigitalOcean App Platform** - Use buildpacks
- **AWS/GCP** - Container or VM deployment

---

## 📁 Project Structure

```
shareIt/
├── home/                   # Home app
│   ├── templates/         
│   │   └── home_page.html  # Main sharing interface
│   ├── views.py           
│   └── urls.py            
├── shareIt/                # Project settings
│   ├── settings.py         # Django configuration
│   ├── urls.py             # URL routing
│   └── views.py            # Core views (share, upload, download)
├── templates/              # Global templates
│   ├── layout.html         # Base template
│   ├── main.html           # Landing page
│   ├── share_page.html     # Text share view
│   ├── share_file.html     # File share view
│   └── error.html          # Error page
├── static/                 # Static assets
│   ├── css/               
│   └── js/                
├── requirements.txt        # Python dependencies
├── .env.example           # Environment template
└── README.md              
```

---

## 🔒 Security

- **Auto-expiring links** - All shared content expires after 24 hours
- **File size limits** - Maximum 10MB per file to prevent abuse
- **No account required** - Anonymous sharing, no data retention
- **HTTPS enforced** - Secure connections in production

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Bishal**

- GitHub: [@bishal2059](https://github.com/bishal2059)

---

<p align="center">
  Made with ❤️ using Django & Supabase
</p>