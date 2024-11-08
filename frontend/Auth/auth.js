// Tab switching between Sign In and Sign Up
document.getElementById('signInTab').addEventListener('click', () => {
    document.getElementById('signInForm').style.display = 'block';
    document.getElementById('signUpForm').style.display = 'none';
    document.getElementById('signInTab').classList.add('text-blue-600', 'font-semibold');
    document.getElementById('signUpTab').classList.remove('text-blue-600', 'font-semibold');
});

document.getElementById('signUpTab').addEventListener('click', () => {
    document.getElementById('signInForm').style.display = 'none';
    document.getElementById('signUpForm').style.display = 'block';
    document.getElementById('signUpTab').classList.add('text-blue-600', 'font-semibold');
    document.getElementById('signInTab').classList.remove('text-blue-600', 'font-semibold');
});

// Sign In function
async function handleSignIn() {
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;

    try {
        const response = await fetch('http://127.0.0.1:3000/app/v1/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (response.ok) {
            console.log("token", data);
            localStorage.setItem('token', data.jwt); // Save token to localStorage
            alert('Sign in successful!');
            // Redirect or perform further actions
        } else {
            alert(data.message || 'Sign in failed.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during sign in.');
    }
}

// Sign Up function
async function handleSignUp() {
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    const role = document.getElementById('signUpRole').value;

    try {
        const response = await fetch('http://127.0.0.1:3000/app/v1/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, role })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Sign up successful! You can now sign in.');
            // Switch to the Sign In form
            localStorage.setItem("token", data.jwt);
            document.getElementById('signInForm').style.display = 'block';
            document.getElementById('signUpForm').style.display = 'none';
        } else {
            alert(data.message || 'Sign up failed.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during sign up.');
    }
}
