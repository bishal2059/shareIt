# ShareIt 🚀

A secure, modern platform for instant text and file sharing with auto-expiring links. Built with Django and Supabase.

## ✨ Features

- 📁 File uploads up to 100MB
- ⏳ Auto-expiring links (24 hours default)
- 📋 One-click copy functionality
- 🌐 Responsive design for all devices

## 🛠 Tech Stack

**Frontend:**  
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

**Backend:**  
![Django](https://img.shields.io/badge/Django-092E20?style=flat&logo=django&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)

**Other:**  
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)

## 🚀 Local Setup

### Prerequisites
- Python 3.9+
- Node.js (for optional frontend tooling)
- Supabase account

### Setup env variables using .env.example file.

### Installation

1. **Clone repository**
   ```bash
   git clone git@github.com:bishal2059/shareIt.git
   cd shareIt
   ```
2. **Setup Python Environment**
    ```bash
    python -m venv .venv
    source .venv/bin/activate  # Linux/MacOS
    .venv\Scripts\activate    # Windows
    ```
3. **Install libraries**
    ```bash 
    pip install -r requirements.txt
    ```
4.  **Run Server**
    ```bash
    python manage.py runserver
    ```