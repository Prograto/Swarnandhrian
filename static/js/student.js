document.addEventListener('DOMContentLoaded', () => {
    // Fetch images from the server
    const url = 'https://script.google.com/macros/s/AKfycbyn9TiZpaQJEIKH39e1BUi06FJyuA-d0r1d6cnrRx_kHxSxSkk6QY3iy9HgLmfS7t5F/exec'; 

    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateImages(data);
            initSlider(); // Initialize the slider only after images are loaded
        })
        .catch(error => console.error('Error fetching the sheet:', error));

    function updateImages(images) {
        const container = document.querySelector('.slider');
        container.innerHTML = ''; 
        images.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.classList.add('slide');
            if (index === 0) {
                slide.classList.add('active'); // Add 'active' to the first slide
            }

            const imgElement = document.createElement('img');
            imgElement.src = image.Img_Url;
            console.log(image.Img_Url);

            slide.appendChild(imgElement);
            container.appendChild(slide);
        });
    }

    function initSlider() {
        let currentIndex = 0;
        const slides = document.querySelectorAll('.slide');
        const totalSlides = slides.length;

        const showSlide = (index) => {
            // Ensure index is within bounds
            if (index >= totalSlides) {
                index = 0;
            } else if (index < 0) {
                index = totalSlides - 1;
            }

            // Update currentIndex
            currentIndex = index;

            // Hide all slides and then show the selected slide
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === currentIndex) {
                    slide.classList.add('active');
                }
            });
        };

        const nextSlide = () => {
            showSlide(currentIndex + 1);
        };

        const prevSlide = () => {
            showSlide(currentIndex - 1);
        };

        // Auto-slide every 3 seconds
        setInterval(nextSlide, 3000);

        // Add event listeners for manual navigation
        document.querySelector('.next').addEventListener('click', nextSlide);
        document.querySelector('.prev').addEventListener('click', prevSlide);

        // Show the first slide initially
        showSlide(currentIndex);
    }
});
document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    navToggle.addEventListener('click', function () {
        navMenu.classList.toggle('active');
    });
    navToggle.style.color = "black";
});


//Feteching data or creating upcoming Events
const upcoming_events_url = 'https://script.google.com/macros/s/AKfycbxAGAhoIOGti8wglsDw4l4oBk2S7UzaWACAmvm-Oyb-XZBC-7c04afZ83FFI6UhbMus8Q/exec'; 

fetch(upcoming_events_url)
    .then(response => response.json())
    .then(data => {
        updateEvents(data);
    })
    .catch(error => console.error('Error fetching the sheet:', error));

function updateEvents(events) {
    const container = document.querySelector('.events');
    container.innerHTML = ''; 
    events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'card';

        const eventName = document.createElement('h2');
        eventName.classList.add('sub-font');
        eventName.textContent = event.Event_Name;

        const eventDescription = document.createElement('p');
        eventDescription.classList.add('fan-font')
        eventDescription.style.color = 'white'
        eventDescription.textContent = event.Event_Description;

        const eventDate = document.createElement('button');
        eventDate.classList.add('sp-font')
        eventDate.textContent = event.Event_Date;
        eventDate.classList.add('btn')

        card.appendChild(eventName);
        card.appendChild(eventDescription);
        card.appendChild(eventDate);

        container.appendChild(card);
    });
    
}

//For Courses
const courses__url = 'https://script.google.com/macros/s/AKfycbxmEQIcacfk1leXiKQxGo0aytMwt2vu-NvxQ9l0GLY-jXc21WtnCMaJHD_LIKpOEBucKA/exec'; 

fetch(courses__url)
    .then(response => response.json())
    .then(data => {
        updateCourses(data);
        startAutoScroll();
    })
    .catch(error => console.error('Error fetching the sheet:', error));

function updateCourses(courses) {
    const container = document.querySelector('.courses');
    container.innerHTML = ''; 
    courses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'c-card';

        const courseName = document.createElement('h2');
        courseName.classList.add('sub-font');
        courseName.textContent = course.Course_Title;

        const Img = document.createElement('img');
        Img.classList.add('course-img')
        Img.src = course.Img_Url;

        const courseDescription = document.createElement('p');
        courseDescription.classList.add('fan-font');
        courseDescription.style.color = 'white';
        courseDescription.textContent = course.Description;

        const Dive = document.createElement('button');
        Dive.textContent = "Dive";
        Dive.addEventListener('click', () => {
            window.location.href = course.Source; 
        });
        Dive.classList.add('btn','sp-font');

        card.appendChild(courseName);
        card.appendChild(Img);
        card.appendChild(courseDescription);
        card.appendChild(Dive)

        container.appendChild(card);
    });
}

function startAutoScroll() {
    const slider = document.querySelector('.courses');
    const card = document.querySelector('.c-card');
    const cardWidth = card.clientWidth + 10; 
    let scrollAmount = 0;

    function autoScroll() {
        if (scrollAmount >= slider.scrollWidth - slider.clientWidth) {
            scrollAmount = 0; 
        } else {
            scrollAmount += cardWidth; 
        }
        slider.scrollTo({
            left: scrollAmount,
            behavior: 'smooth',
        });
    }

    setInterval(autoScroll, 3000); 

    // manual scroll functionality
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;

    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        startPos = e.pageX - slider.offsetLeft;
        slider.style.cursor = 'grabbing';
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const currentPosition = e.pageX - slider.offsetLeft;
        const diff = currentPosition - startPos;
        currentTranslate += diff;
        slider.scrollLeft -= diff;
    });

    slider.addEventListener('mouseup', () => {
        isDragging = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseleave', () => {
        isDragging = false;
        slider.style.cursor = 'grab';
    });
}