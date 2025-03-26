document.addEventListener('DOMContentLoaded', function() {
    // Fetch the navbar content from the external text file
    fetch(window.navbarUrl)
        .then(response => response.text())
        .then(data => {
            data = data.replace(/{{ student_id }}/g, window.studentId);  
            document.body.insertAdjacentHTML('afterbegin', data);
            window.addEventListener('scroll', handleScroll);
        })
        .catch(error => console.error('Error loading the navbar:', error));

    function handleScroll() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {  
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
    }
    
});

function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}
function navigateToCompetitorPage() {
    const studentId = window.studentId;
    if (studentId) {
        window.location.href = `/competitor`;
    } else {
        console.error('Student ID is missing');
    }
}

function navigateToLogicalCompetitorPage() {
    const studentId = window.studentId;
    if (studentId) {
        window.location.href = `/logical_competitor`;
    } else {
        console.error('Student ID is missing');
    }
}

function navigateToCourseCompetitorPage() {
    const studentId = window.studentId;
    if (studentId) {
        window.location.href = `/course_competitor/`;
    } else {
        console.error('Student ID is missing');
    }
}

function navToHome() {
    const studentId = window.studentId;
    if (studentId) {
        window.location.href = `/student`;
    } else {
        console.error('Student ID is missing');
    }
}

function navToProfile() {
    const studentId = window.studentId;
    if (studentId) {
        window.location.href = `/profile`;
    } else {
        console.error('Student ID is missing');
    }
}

function navToPortfolio(student_id) {
    if (!student_id) {
        alert("Student ID is required.");
        return;
    }
    window.location.href = `/portfolio/${student_id}`;
}

function logOut() {
    const studentId = window.studentId;
    if (studentId) {
        window.location.href = `/logout`;
    } else {
        console.error('Student ID is missing');
    }
}