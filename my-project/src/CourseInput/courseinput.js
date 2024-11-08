// courseinput.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('courseForm');
    
    // Handle form submission
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const price = parseInt(document.getElementById('price').value);
        const discount = parseInt(document.getElementById('discount').value);

        // Validate input (basic example)
        if (!title || !description || !price || !discount) {
            alert("All fields are required!");
            return;
        }

        const courseData = {
            title,
            description,
            price,
            discount,
            // Assuming admin_id is available from the current session or localStorage
            admin_id: localStorage.getItem("admin_id") || "defaultAdminId", // Replace with actual admin id logic
        };

        try {
            const response = await axios.post('http://127.0.0.1:3000/app/v1/admin/course/add', courseData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + localStorage.getItem("token")
                }
            });

            if (response.status === 200) {
                alert('Course successfully added!');
                // Optionally, reset the form or redirect
                form.reset();
            }
        } catch (error) {
            console.error('Error adding course:', error);
            alert('Error adding course. Please try again.');
        }
    });
});
