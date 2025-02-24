// DOM elements
const characterDiv = document.getElementById('character-div');
const character = document.getElementById('character');
const characterText = document.getElementById('character-text');
const navButtons = document.getElementsByClassName('nav-btn');
const progressIndicator = document.getElementById('progress-indicator');
const timeIndicator = document.getElementById('time-indicator');
const timeOverlay = document.getElementById('time-overlay');
const animals = document.querySelectorAll('.animal');

// Character stories based on scroll position with conservation themes
const stories = [
    'Hello! Let\'s explore this forest and learn about conservation!',
    'Did you know forests are the lungs of our planet?',
    'Every species in this forest plays a vital role in the ecosystem.',
    'We need to protect habitats for all the animals that live here.',
    'Deforestation threatens thousands of species with extinction.',
    'Small actions like recycling paper help protect forests like this one.',
    'Indigenous peoples are often the best forest guardians.',
    'Reforestation can help combat climate change.',
    'Nature has so much to teach us if we take time to listen.',
    'We all share responsibility for protecting these natural treasures.'
];

// Time of day based on scroll position
const timeOfDay = [
    'Morning',
    'Late Morning',
    'Noon',
    'Afternoon',
    'Evening'
];

// State variables
let lastScrollPos = 0;
let currentStoryIndex = 0;
let currentTimeIndex = 0;
let celestialBody = null;
let stars = [];

// Initialize on page load
window.addEventListener('load', function() {
    // Set initial position
    updateScrollPosition();
    
    // Create celestial body (sun/moon)
    createCelestialBody();
    
    // Create weather effects
    changeWeather();
});

// Add scroll event listener
window.addEventListener('scroll', function() {
    updateScrollPosition();
});

// Update character position based on scroll
function updateScrollPosition() {
    // Get current scroll position
    const scrollPos = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.scrollHeight;
    
    // Calculate progress
    const scrollPercentage = scrollPos / (documentHeight - windowHeight);
    
    // Update character position (simple linear movement from left to right)
    const maxLeftPos = 80; // Max percentage across the screen
    const currentLeftPos = 10 + (scrollPercentage * maxLeftPos);
    characterDiv.style.left = currentLeftPos + '%';
    
    // Determine character direction based on scroll direction
    if (scrollPos > lastScrollPos) {
        // Scrolling down, face right
        character.style.transform = 'scaleX(1)';
    } else if (scrollPos < lastScrollPos) {
        // Scrolling up, face left
        character.style.transform = 'scaleX(-1)';
    }
    
    // Update story text based on scroll percentage
    const storyIndex = Math.min(Math.floor(scrollPercentage * stories.length), stories.length - 1);
    if (storyIndex !== currentStoryIndex) {
        characterText.innerHTML = stories[storyIndex];
        currentStoryIndex = storyIndex;
    }
    
    // Update progress indicator
    progressIndicator.style.height = (scrollPercentage * 100) + '%';
    
    // Check for animals nearby
    checkAnimalProximity();
    
    // Update time of day
    updateTimeOfDay(scrollPercentage);
    
    // Store last scroll position
    lastScrollPos = scrollPos;
}

// Check for nearby animals
function checkAnimalProximity() {
    // Get character position
    const characterRect = characterDiv.getBoundingClientRect();
    const characterCenterX = characterRect.left + (characterRect.width / 2);
    const characterTopY = characterRect.top;
    
    // Check each animal
    animals.forEach(animal => {
        const animalRect = animal.getBoundingClientRect();
        const animalCenterX = animalRect.left + (animalRect.width / 2);
        const animalCenterY = animalRect.top + (animalRect.height / 2);
        
        // Calculate distance
        const dx = characterCenterX - animalCenterX;
        const dy = characterTopY - animalCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If close enough (within 200px)
        if (distance < 200) {
            // Show message if not already shown
            if (!animal.classList.contains('animal-active')) {
                animal.classList.add('animal-active');
                
                // Create and show message
                const message = document.createElement('div');
                message.className = 'animal-message';
                message.innerText = animal.getAttribute('data-message');
                message.style.opacity = '0';
                animal.parentNode.insertBefore(message, animal.nextSibling);
                
                // Fade it in
                setTimeout(() => {
                    message.style.opacity = '1';
                }, 10);
            }
        } else {
            // Hide message if shown
            if (animal.classList.contains('animal-active')) {
                animal.classList.remove('animal-active');
                
                // Find message element
                const message = animal.nextElementSibling;
                if (message && message.classList.contains('animal-message')) {
                    // Fade it out
                    message.style.opacity = '0';
                    
                    // Remove after fade
                    setTimeout(() => {
                        message.remove();
                    }, 500);
                }
            }
        }
    });
}

// Update time of day based on scroll progress
function updateTimeOfDay(scrollProgress) {
    // Determine time of day based on scroll progress
    const timeIndex = Math.min(Math.floor(scrollProgress * timeOfDay.length), timeOfDay.length - 1);
    
    // Update only if changed
    if (timeIndex !== currentTimeIndex) {
        // Update time indicator text
        timeIndicator.textContent = timeOfDay[timeIndex];
        
        // Change background color based on time of day
        const alpha = 0.3 + (timeIndex / timeOfDay.length) * 0.7;
        timeIndicator.style.backgroundColor = `rgba(0, 0, 0, ${alpha})`;
        
        // Update time overlay
        updateTimeOverlay(timeIndex);
        
        // Update celestial body
        updateCelestialBody(timeIndex);
        
        // Save current index
        currentTimeIndex = timeIndex;
    }
}

// Update time overlay
function updateTimeOverlay(timeIndex) {
    // Remove all time classes
    timeOverlay.className = '';
    
    // Add appropriate time class
    switch (timeIndex) {
        case 0:
            timeOverlay.classList.add('time-morning');
            break;
        case 1:
            timeOverlay.classList.add('time-late-morning');
            break;
        case 2:
            timeOverlay.classList.add('time-noon');
            break;
        case 3:
            timeOverlay.classList.add('time-afternoon');
            break;
        case 4:
            timeOverlay.classList.add('time-evening');
            createStars();
            break;
        default:
            break;
    }
}

// Create celestial body (sun/moon)
function createCelestialBody() {
    // Create element if it doesn't exist
    if (!celestialBody) {
        celestialBody = document.createElement('div');
        celestialBody.id = 'celestial-body';
        document.body.appendChild(celestialBody);
    }
    
    // Set initial state
    updateCelestialBody(0);
}

// Update celestial body position and appearance
function updateCelestialBody(timeIndex) {
    // Remove all classes
    celestialBody.className = '';
    
    // Set appropriate class based on time
    switch (timeIndex) {
        case 0: // Morning
            celestialBody.classList.add('sun');
            celestialBody.style.top = '60px';
            celestialBody.style.right = '80px';
            break;
        case 1: // Late Morning
            celestialBody.classList.add('sun');
            celestialBody.style.top = '40px';
            celestialBody.style.right = '120px';
            break;
        case 2: // Noon
            celestialBody.classList.add('sun');
            celestialBody.style.top = '30px';
            celestialBody.style.right = '50%';
            break;
        case 3: // Afternoon
            celestialBody.classList.add('sunset');
            celestialBody.style.top = '120px';
            celestialBody.style.right = '150px';
            break;
        case 4: // Evening
            celestialBody.classList.add('moon');
            celestialBody.style.top = '60px';
            celestialBody.style.right = '100px';
            break;
    }
}

// Create stars for evening
function createStars() {
    // Clear existing stars
    stars.forEach(star => star.remove());
    stars = [];
    
    // Add new stars
    for (let i = 0; i < 50; i++) {
        // Create star element
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 30 + '%';
        
        // Random size
        const size = Math.random() * 3 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        
        // Random twinkle animation
        star.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite`;
        star.style.animationDelay = Math.random() * 5 + 's';
        
        // Add to document
        document.body.appendChild(star);
        
        // Save reference
        stars.push(star);
    }
}

// Weather types
const weatherTypes = ['clear', 'rain', 'leaves'];
let currentWeather = 'clear';

// Change weather randomly
function changeWeather() {
    const weatherContainer = document.getElementById('weather-effects');
    weatherContainer.innerHTML = '';
    
    // Choose a random weather
    const newWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    
    if (newWeather === 'rain') {
        createRain();
    } else if (newWeather === 'leaves') {
        createFallingLeaves();
    }
    
    currentWeather = newWeather;
    
    // Schedule next weather change
    setTimeout(changeWeather, 15000 + Math.random() * 15000);
}

// Create rain effect
function createRain() {
    const weatherContainer = document.getElementById('weather-effects');
    
    for (let i = 0; i < 100; i++) {
        const raindrop = document.createElement('div');
        raindrop.className = 'raindrop';
        raindrop.style.left = `${Math.random() * 100}%`;
        raindrop.style.top = `${Math.random() * 100}%`;
        raindrop.style.animationDelay = `${Math.random()}s`;
        
        // Add falling animation
        raindrop.style.animation = 'falling 1s linear infinite';
        
        weatherContainer.appendChild(raindrop);
    }
}

// Create falling leaves effect
function createFallingLeaves() {
    const weatherContainer = document.getElementById('weather-effects');
    
    for (let i = 0; i < 30; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.style.left = `${Math.random() * 100}%`;
        leaf.style.top = `${Math.random() * 100}%`;
        
        // Random fall speed and swing
        leaf.style.animation = `falling ${3 + Math.random() * 4}s linear infinite, swinging ${2 + Math.random() * 3}s ease-in-out infinite alternate`;
        
        // Random leaf color
        const colors = ['#8BC34A', '#4CAF50', '#FFA000', '#FF5722'];
        leaf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        weatherContainer.appendChild(leaf);
    }
}
