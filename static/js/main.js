function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
  });
  document.querySelectorAll('.share-form').forEach(form => {
      form.classList.remove('active');
  });
  
  event.currentTarget.classList.add('active');
  document.getElementById(tabName + 'Form').classList.add('active');
}

document.getElementById('fileInput').addEventListener('change', function(e) {
  const fileName = document.getElementById('fileName');
  if(this.files[0]) {
      fileName.textContent = 'Selected file: ' + this.files[0].name;
  }
});

document.getElementById('textForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = document.getElementById('shareText').value;
  if (!text) return;
  const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

  try {
      const response = await fetch('/generate-link/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'X-CSRFToken': csrfToken
          },
          body: `text=${encodeURIComponent(text)}`
      });

      const data = await response.json();
      
      if (data.link) {
          showGeneratedLink(data.link);
      } else {
          alert('Error generating link: ' + (data.error || 'Unknown error'));
      }
  } catch (error) {
      alert('Network error - please try again');
  }
});

function showGeneratedLink(link) {
  const linkContainer = document.getElementById('generatedLink');
  linkContainer.innerHTML = `
      <div class="link-box">
          <div class="link-header">
              <i class="fas fa-link"></i>
              <h3>Your Secure Sharing Link</h3>
          </div>
          <div class="link-display">
              <input type="text" class="link-input" value="${link}" readonly>
              <button class="copy-link-btn" onclick="copyLink('${link}')">
                  <i class="fas fa-copy"></i>
                  Copy
              </button>
          </div>
          <p class="expiry-note">This link will expire in 24 hours</p>
      </div>
  `;
  scrollTo(0, linkContainer.offsetTop);
}

function copyLink(link) {
  navigator.clipboard.writeText(link).then(() => {
      // Visual feedback
      const btn = document.querySelector('.copy-link-btn');
      btn.innerHTML = `<i class="fas fa-check"></i> Copied!`;
      btn.style.background = '#4CAF50';
      
      setTimeout(() => {
          btn.innerHTML = `<i class="fas fa-copy"></i> Copy`;
          btn.style.background = '#6c5ce7';
      }, 2000);
  });
}

document.getElementById('fileForm').addEventListener('submit', async (e) => {
  e.preventDefault;
  alert('File sharing is not yet implemented');
});