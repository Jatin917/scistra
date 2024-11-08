// Extract the blog ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const blogId = urlParams.get('id');
const CONFIG = {
    API_BASE_URL: 'http://127.0.0.1:3000/app/v1/client/blog'
};

// Fetch the blog details based on the blog ID
async function fetchBlogDetails(id) {
    try {
        const response = await axios.get(`${CONFIG.API_BASE_URL}/get/${id}`);
        const blog = response.data; // Corrected from `response.json()` to `response.data`

        // Display blog details in the HTML
        document.querySelector('.blog-title').textContent = blog.title;
        document.querySelector('.blog-content').textContent = blog.content;

        // Optionally, add dynamic classes based on blog data (example below)
        if (blog.isPopular) {
            document.querySelector('.blog-title').classList.add('text-blue-500');
        }

    } catch (error) {
        console.error('Error fetching blog details:', error);
    }
}

// Call the function to fetch and display blog details
if (blogId) {
    fetchBlogDetails(blogId);
} else {
    console.error("Blog ID is missing from the URL.");
}
