// Configuration
const CONFIG = {
    API_BASE_URL: 'http://127.0.0.1:3000/app/v1/admin/blog',
    DRAFT_KEY: 'blog_draft',
};

// State management
let state = {
    isEditing: false,
    blogId: null,
    isDirty: false,
};

// Initialize TinyMCE
tinymce.init({
    selector: '#content',
    height: 500,
    menubar: false,
    plugins: [
        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'media', 'table', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | blocks | ' +
        'bold italic backcolor | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat | help',
    content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; }',
    setup: function(editor) {
        editor.on('change', function() {
            state.isDirty = true;
            autosaveDraft();
        });
    }
});

// Form handling
document.getElementById('blogForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    showLoading();
    
    const formData = {
        title: document.getElementById('title').value,
        content: tinymce.get('content').getContent(),
        imageUrl: document.getElementById('imageUrl').value,
    };

    try {
        const response = await axios.post(
            state.isEditing 
                ? `${CONFIG.API_BASE_URL}/edit/${state.blogId}`
                : `${CONFIG.API_BASE_URL}/add`,
            formData, // This is the request body data
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + localStorage.getItem("token")
                }
            }
        );
        
        console.log("status ", response);
        if (!response.ok) throw new Error('Failed to save blog post');

        const result = await response.json();
        clearDraft();
        state.isDirty = false;
        
        // Redirect to the blog post or listing page
        window.location.href = `/blog.html?id=${result.id}`;
    } catch (error) {
        console.error('Error saving blog post:', error);
        alert('Failed to save blog post. Please try again.');
    } finally {
        hideLoading();
    }
});

// Preview functionality
document.getElementById('previewBtn').addEventListener('click', () => {
    const title = document.getElementById('title').value;
    const content = tinymce.get('content').getContent();
    
    const previewContent = document.getElementById('previewContent');
    previewContent.innerHTML = `
        <h1 class="text-3xl font-bold mb-4">${title}</h1>
        ${content}
    `;
    
    document.getElementById('previewModal').classList.remove('hidden');
});

document.getElementById('closePreview').addEventListener('click', () => {
    document.getElementById('previewModal').classList.add('hidden');
});

// Draft saving
let autosaveTimeout;
function autosaveDraft() {
    clearTimeout(autosaveTimeout);
    autosaveTimeout = setTimeout(() => {
        const draftData = {
            title: document.getElementById('title').value,
            content: tinymce.get('content').getContent(),
            imageUrl: document.getElementById('imageUrl').value,
            timestamp: new Date().toISOString(),
        };
        localStorage.setItem(CONFIG.DRAFT_KEY, JSON.stringify(draftData));
    }, 1000);
}

function loadDraft() {
    const draftData = localStorage.getItem(CONFIG.DRAFT_KEY);
    if (draftData) {
        const draft = JSON.parse(draftData);
        document.getElementById('title').value = draft.title || '';
        document.getElementById('imageUrl').value = draft.imageUrl || '';
        // Wait for TinyMCE to initialize
        tinymce.get('content').on('init', () => {
            tinymce.get('content').setContent(draft.content || '');
        });
    }
}

function clearDraft() {
    localStorage.removeItem(CONFIG.DRAFT_KEY);
}

// Save draft button handler
document.getElementById('saveDraftBtn').addEventListener('click', () => {
    autosaveDraft();
    alert('Draft saved successfully!');
});

// Form validation
function validateForm() {
    const title = document.getElementById('title').value.trim();
    const content = tinymce.get('content').getContent().trim();
    
    if (!title) {
        alert('Please enter a title for your blog post');
        return false;
    }
    
    if (!content) {
        alert('Please enter some content for your blog post');
        return false;
    }
    
    return true;
}

// Loading spinner
function showLoading() {
    document.getElementById('loadingSpinner').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingSpinner').classList.add('hidden');
}

// Edit mode handling
async function loadExistingBlog(blogId) {
    try {
        showLoading();
        const response = await fetch(`${CONFIG.API_BASE_URL}/${blogId}`);
        if (!response.ok) throw new Error('Failed to fetch blog post');
        
        const blog = await response.json();
        
        document.getElementById('title').value = blog.title;
        document.getElementById('imageUrl').value = blog.imageUrl || '';
        tinymce.get('content').setContent(blog.content);
        
        // Update page title and state
        document.getElementById('pageTitle').textContent = 'Edit Blog Post';
        state.isEditing = true;
        state.blogId = blogId;
    } catch (error) {
        console.error('Error loading blog post:', error);
        alert('Failed to load blog post. Please try again.');
    } finally {
        hideLoading();
    }
}

// Initialize page
function initializePage() {
    // Check if we're in edit mode
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');
    
    if (blogId) {
        loadExistingBlog(blogId);
    } else {
        loadDraft();
    }
    
    // Set up beforeunload handler for unsaved changes
    window.addEventListener('beforeunload', (e) => {
        if (state.isDirty) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);