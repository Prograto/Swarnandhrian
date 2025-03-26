document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    const loginLink = document.getElementById('login-link');
    const loginCard = document.getElementById('login-card');
    const studentLogin = document.getElementById('student-login');
    const staffLogin = document.getElementById('staff-login');
    const userTypeInput = document.getElementById('user-type');

    toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
    });

    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginCard.style.display = 'block';
    });

    studentLogin.addEventListener('click', () => {
        studentLogin.classList.add('active');
        staffLogin.classList.remove('active');
        userTypeInput.value = 'student';
    });

    staffLogin.addEventListener('click', () => {
        staffLogin.classList.add('active');
        studentLogin.classList.remove('active');
        userTypeInput.value = 'staff';
    });
});
