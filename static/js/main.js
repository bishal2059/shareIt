// ===== Tab Switching =====
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.share-form').forEach(form => {
        form.classList.remove('active');
    });
    
    event.currentTarget.classList.add('active');
    document.getElementById(tabName + 'Form').classList.add('active');
    
    // Hide result container when switching tabs
    document.getElementById('resultContainer').classList.add('hidden');
}

// ===== Character Count for Text =====
const shareTextarea = document.getElementById('shareText');
const charCount = document.getElementById('charCount');

if (shareTextarea && charCount) {
    shareTextarea.addEventListener('input', () => {
        charCount.textContent = shareTextarea.value.length;
    });
}

// ===== Text Form Submission =====
document.getElementById('textForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = document.getElementById('shareText').value;
    if (!text.trim()) {
        showError('Please enter some text to share');
        return;
    }
    
    const csrfToken = document.querySelector('#textForm [name=csrfmiddlewaretoken]').value;
    const submitBtn = e.target.querySelector('.submit-btn');
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

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
            showResult(data.link);
        } else {
            showError(data.error || 'Error generating link');
        }
    } catch (error) {
        showError('Network error - please try again');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-link"></i> Generate Link';
    }
});

// ===== File Upload Handling =====
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const filePreview = document.getElementById('filePreview');
const uploadProgress = document.getElementById('uploadProgress');
const uploadBtn = document.getElementById('uploadBtn');

let selectedFile = null;

// Click to upload
dropZone.addEventListener('click', () => {
    fileInput.click();
});

// File input change
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

// Drag and drop
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0]);
    }
});

function handleFileSelect(file) {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        showError(`File too large. Maximum size is 10MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
        return;
    }
    
    selectedFile = file;
    
    // Update preview
    const fileName = filePreview.querySelector('.file-name');
    const fileSize = filePreview.querySelector('.file-size');
    
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    
    // Show preview, hide drop zone
    dropZone.style.display = 'none';
    filePreview.classList.remove('hidden');
    uploadBtn.disabled = false;
}

function removeFile() {
    selectedFile = null;
    fileInput.value = '';
    dropZone.style.display = 'block';
    filePreview.classList.add('hidden');
    uploadBtn.disabled = true;
    uploadProgress.classList.add('hidden');
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// ===== File Form Submission =====
document.getElementById('fileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
        showError('Please select a file to upload');
        return;
    }
    
    const csrfToken = document.querySelector('#fileForm [name=csrfmiddlewaretoken]').value;
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    // Show progress
    uploadBtn.disabled = true;
    uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    uploadProgress.classList.remove('hidden');
    
    const progressFill = uploadProgress.querySelector('.progress-fill');
    const progressText = uploadProgress.querySelector('.progress-text');
    
    try {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                progressFill.style.width = percent + '%';
                progressText.textContent = `Uploading... ${percent}%`;
            }
        });
        
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                if (data.link) {
                    showResult(data.link);
                    removeFile();
                } else {
                    showError(data.error || 'Error uploading file');
                }
            } else {
                try {
                    const data = JSON.parse(xhr.responseText);
                    showError(data.error || 'Error uploading file');
                } catch {
                    showError('Error uploading file');
                }
            }
            resetUploadBtn();
        });
        
        xhr.addEventListener('error', () => {
            showError('Network error - please try again');
            resetUploadBtn();
        });
        
        xhr.open('POST', '/upload-file/');
        xhr.setRequestHeader('X-CSRFToken', csrfToken);
        xhr.send(formData);
        
    } catch (error) {
        showError('Error uploading file');
        resetUploadBtn();
    }
});

function resetUploadBtn() {
    uploadBtn.disabled = false;
    uploadBtn.innerHTML = '<i class="fas fa-link"></i> Upload & Generate Link';
    uploadProgress.classList.add('hidden');
    const progressFill = uploadProgress.querySelector('.progress-fill');
    progressFill.style.width = '0%';
}

// ===== Result Display =====
function showResult(link) {
    const resultContainer = document.getElementById('resultContainer');
    const linkInput = document.getElementById('generatedLink');
    
    linkInput.value = link;
    resultContainer.classList.remove('hidden');
    
    // Scroll to result
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function copyGeneratedLink() {
    const linkInput = document.getElementById('generatedLink');
    const copyBtn = document.querySelector('.result-card .copy-btn');
    
    navigator.clipboard.writeText(linkInput.value).then(() => {
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
        }, 2000);
    });
}

function resetForm() {
    // Hide result
    document.getElementById('resultContainer').classList.add('hidden');
    
    // Reset text form
    document.getElementById('shareText').value = '';
    document.getElementById('charCount').textContent = '0';
    
    // Reset file form
    removeFile();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Error Display =====
function showError(message) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(239, 68, 68, 0.95);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 500;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(toast);
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(100px); }
            to { opacity: 1; transform: translateX(0); }
        }
    `;
    document.head.appendChild(style);
    
    // Remove after delay
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
