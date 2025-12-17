# ShareIt

Fast, Secure, and Effortless File & Text Sharing

A web application that enables users to share text snippets and files instantly by generating secure, shareable links. All shared content automatically expires after 24 hours, ensuring privacy and security.

**Live Demo:** https://shareit-ijx9.onrender.com

## Features

- **Text Sharing** - Share text, code, or notes instantly
- **File Uploads** - Upload files up to 10MB with drag & drop support
- **Auto-Expiry** - Links automatically expire after 24 hours
- **One-Click Copy** - Copy generated links with a single click
- **Upload Progress** - Real-time progress indicator for file uploads
- **Responsive Design** - Works on all devices
- **Secure Storage** - Files stored securely in Supabase Storage

## Tech Stack

**Backend:** Django 5.x, Supabase (PostgreSQL + Storage), WhiteNoise

**Frontend:** HTML5, CSS3, JavaScript (ES6+), Font Awesome

**Hosting:** Render, Supabase Storage

## Installation

### Prerequisites

- Python 3.9 or higher
- pip (Python package manager)
- Supabase account (https://supabase.com)

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

## Configuration

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

1. Create a new Supabase project

2. Create the required tables (SQL Editor):
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

3. Create a storage bucket
   - Go to Storage → New Bucket
   - Name: `ShareIt`
   - Public bucket: Enabled

4. Configure storage policies (if RLS enabled):
   ```sql
   CREATE POLICY "Allow public uploads" ON storage.objects 
   FOR INSERT WITH CHECK (bucket_id = 'ShareIt');
   
   CREATE POLICY "Allow public downloads" ON storage.objects 
   FOR SELECT USING (bucket_id = 'ShareIt');
   ```

## Deployment

### Deploy to Render

1. Connect your GitHub repository to Render

2. Configure environment variables in Render dashboard

3. Build Command:
   ```bash
   pip install -r requirements.txt && python manage.py collectstatic --noinput
   ```

4. Start Command:
   ```bash
   gunicorn shareIt.wsgi:application
   ```

### Other Platforms

The app is compatible with any platform that supports Python/Django:
- Heroku - Add `Procfile`
- Railway - Auto-detects Django
- DigitalOcean App Platform - Use buildpacks
- AWS/GCP - Container or VM deployment

## Project Structure

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
└── README.md              
```

## Security

- **Auto-expiring links** - All shared content expires after 24 hours
- **File size limits** - Maximum 10MB per file to prevent abuse
- **No account required** - Anonymous sharing, no data retention
- **HTTPS enforced** - Secure connections in production

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

**Bishal** - [@bishal2059](https://github.com/bishal2059)