// import axios from 'axios'

// Configuration
const CONFIG = {
    ITEMS_PER_PAGE: 10,
    API_BASE_URL: 'http://127.0.0.1:3000/app/v1/client/blog'
};

// State management
let state = {
    currentPage: 1,
    totalPages: 1,
    searchQuery: '',
    sortOrder: 'newest',
    blogs: []
};

// Utility functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function truncateText(text, maxLength = 200) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

// API calls
async function fetchBlogs() {
    try {
        const queryParams = new URLSearchParams({
            page: state.currentPage,
            limit: CONFIG.ITEMS_PER_PAGE,
            search: state.searchQuery,
            sort: state.sortOrder
        });

        const response = await axios.get('http://127.0.0.1:3000/app/v1/client/blog/getall');
        console.log(response);
        if (!response.statusText) throw new Error('Failed to fetch blogs');
        console.log("response ", response)
        let data = response.data;
        // data = await data.json();
        console.log("data blog ", data)
        state.blogs = data;
        state.totalPages = Math.ceil(data.length / CONFIG.ITEMS_PER_PAGE);
        return data;
    } catch (error) {
        console.error('Error fetching blogs:', error);
        showError('Failed to load blog posts. Please try again later.');
        return null;
    }
}

// DOM manipulation
function createBlogCard(blog) {
    const template = document.getElementById('blogTemplate');
    const blogElement = template.content.cloneNode(true);
    
    // Set blog details
    blogElement.querySelector('.blog-title').textContent = blog.title;
    blogElement.querySelector('.blog-title').href = `blogdetail.html?id=${blog.id}`;
    blogElement.querySelector('.blog-title').target = "_blank"; // Opens in a new tab    
    blogElement.querySelector('.read-more').href = `blogdetail.html?id=${blog.id}`;
    blogElement.querySelector('.read-more').target = "_blank"; // Opens in a new tab    
    // blogElement.querySelector('.admin-name').textContent = `By ${blog.admin.name}`;
    blogElement.querySelector('.blog-content').textContent = truncateText(blog.content);
    blogElement.querySelector('.blog-date').textContent = formatDate(blog.created_at);
    // blogElement.querySelector('.read-more').href = `/blog.html?id=${blog.id}`;
    
    // Set admin avatar (if available)
    const avatarImg = blogElement.querySelector('.admin-avatar');
    // if (blog.admin.avatar_url) {
    //     avatarImg.src = blog.admin.avatar_url;
    //     avatarImg.alt = `${blog.admin.name}'s avatar`;
    // }
    
    return blogElement;
}

function renderBlogs() {
    const container = document.getElementById('blogsContainer');
    container.innerHTML = ''; // Clear existing content
    
    state.blogs.forEach(blog => {
        container.appendChild(createBlogCard(blog));
    });
    
    updatePaginationControls();
}

function updatePaginationControls() {
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');
    
    prevButton.disabled = state.currentPage === 1;
    nextButton.disabled = state.currentPage === state.totalPages;
    currentPageSpan.textContent = `${state.currentPage} of ${state.totalPages}`;
}

function showError(message) {
    const container = document.getElementById('blogsContainer');
    container.innerHTML = `
        <div class="text-center py-12">
            <p class="text-red-600">${message}</p>
        </div>
    `;
}

function showLoading() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'block';
}

function hideLoading() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'none';
}

// Event handlers
async function handlePageChange(newPage) {
    if (newPage < 1 || newPage > state.totalPages) return;
    
    state.currentPage = newPage;
    showLoading();
    await fetchBlogs();
    hideLoading();
    renderBlogs();
}

function handleSearch(event) {
    state.searchQuery = event.target.value;
    state.currentPage = 1; // Reset to first page when searching
    debounce(async () => {
        showLoading();
        await fetchBlogs();
        hideLoading();
        renderBlogs();
    }, 300)();
}

function handleSort(event) {
    state.sortOrder = event.target.value;
    state.currentPage = 1; // Reset to first page when sorting
    fetchBlogs().then(() => {
        renderBlogs();
    });
}

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize the page
async function initializePage() {
    // Add event listeners
    document.getElementById('prevPage').addEventListener('click', () => handlePageChange(state.currentPage - 1));
    document.getElementById('nextPage').addEventListener('click', () => handlePageChange(state.currentPage + 1));
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('sortSelect').addEventListener('change', handleSort);
    
    // Load initial data
    showLoading();
    await fetchBlogs();
    hideLoading();
    renderBlogs();
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);