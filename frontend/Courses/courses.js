// Sample course data array - fetched from backend
let courses = [];

// Function to check if the current user is an admin
async function isAdmin() {
    try {
        if(!localStorage.getItem("token")){
            return false
        }
        const response = await fetch('http://127.0.0.1:3000/app/v1/auth', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        return data.isAdmin; // Assume the backend returns an `isAdmin` boolean in the response
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false; // Default to non-admin in case of error
    }
}

// Function to open edit form
function openEditForm(course) {
    // Display the form with pre-filled course data
    document.getElementById('editForm').classList.remove('hidden');
    document.getElementById('editTitle').value = course.title;
    document.getElementById('editDescription').value = course.discription;
    document.getElementById('editPrice').value = course.price;
    document.getElementById('editDiscount').value = course.discount;

    // Store course ID in form for editing later
    document.getElementById('editForm').dataset.courseId = course.id;
}

// Function to close edit form
function closeEditForm() {
    document.getElementById('editForm').classList.add('hidden');
}

// Function to handle course editing
async function handleEditCourse() {
    const courseId = document.getElementById('editForm').dataset.courseId;
    const title = document.getElementById('editTitle').value;
    const description = document.getElementById('editDescription').value;
    const price = parseInt(document.getElementById('editPrice').value, 10);
    const discount = parseInt(document.getElementById('editDiscount').value, 10);

    const updatedCourse = { title, discription: description, price, discount };

    try {
        const response = await fetch(`http://127.0.0.1:3000/app/v1/admin/course/edit/${courseId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCourse),
        });

        if (response.ok) {
            alert("Course updated successfully.");
            closeEditForm();
            await fetchCourses(); // Refresh courses from backend
            initCourseListing();
        } else {
            alert("Failed to update the course.");
        }
    } catch (error) {
        console.error('Error updating course:', error);
        alert("An error occurred while trying to update the course.");
    }
}

// Function to handle course deletion
async function handleDeleteCourse(courseId) {
    const confirmation = confirm("Are you sure you want to delete this course?");
    if (!confirmation) return;

    try {
        const response = await fetch(`http://127.0.0.1:3000/app/v1/admin/course/delete/${courseId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert("Course deleted successfully.");
            courses = courses.filter(course => course.id !== courseId); // Remove from local array
            initCourseListing(); // Refresh the course listing
        } else {
            alert("Failed to delete the course.");
        }
    } catch (error) {
        console.error('Error deleting course:', error);
        alert("An error occurred while trying to delete the course.");
    }
}

// Function to fetch courses from backend
async function fetchCourses() {
    try {
        const response = await fetch('http://127.0.0.1:3000/app/v1/client/course/getall');
        courses = await response.json();
    } catch (error) {
        console.error('Error fetching courses:', error);
        courses = []; // Set to empty if there’s an error
    }
}

// Function to create course card
// Function to create course card
function createCourseCard(course, isAdmin) {
    const template = document.getElementById('courseTemplate');
    const courseElement = template.content.cloneNode(true);

    // Set course details
    courseElement.querySelector('.course-title').textContent = course.title;
    courseElement.querySelector('.course-subtitle').textContent = course.discription;

    // Set pricing and discount
    const discountedPrice = course.price - (course.price * course.discount) / 100;
    courseElement.querySelector('.original-price').textContent = `₹ ${course.price.toLocaleString('en-IN')}/-`;
    courseElement.querySelector('.discounted-price').textContent = `₹ ${discountedPrice.toLocaleString('en-IN')}/-`;

    // Admin actions
    if (isAdmin) {
        const actionContainer = courseElement.querySelector('.flex.items-center.space-x-2');
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'bg-yellow-500 text-white px-4 py-2 rounded-md mr-2';
        editButton.addEventListener('click', () => openEditForm(course));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'bg-red-600 text-white px-4 py-2 rounded-md';
        deleteButton.addEventListener('click', () => handleDeleteCourse(course.id));

        actionContainer.appendChild(editButton);
        actionContainer.appendChild(deleteButton);
    }

// Enroll button functionality
const enrollButton = courseElement.querySelector('button');
enrollButton.addEventListener('click', () => {
    // Redirect to the payment page with the courseId as a query parameter
    const paymentPageUrl = `http://127.0.0.1:5500/frontend/Payment/payment.html?courseId=${course.id}`;
    window.location.href = paymentPageUrl; // Redirect to the payment page
});

    return courseElement;
}


// Function to initialize the course listing
async function initCourseListing() {
    const isUserAdmin = await isAdmin();

    const container = document.getElementById('courseContainer');
    container.innerHTML = ''; // Clear previous courses

    courses.forEach(course => {
        const courseCard = createCourseCard(course, isUserAdmin);
        container.appendChild(courseCard);
    });
}

// Fetch courses on page load
fetchCourses().then(() => {
    initCourseListing(); // Initialize course cards
});
