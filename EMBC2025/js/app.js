import { list_of_ids } from "./id_list.js";


async function saveData(save_data) {
    const password = 'sw4567890plkj';
    const server_url = 'https://shapire.altervista.org/EMBC2025/save_data.php';
    // This code is on my shapire server

    try {
        const response = await fetch(server_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: save_data,
                password: password
            })
        });

        const result = await response.json(); // Assuming PHP returns JSON

        if (! response.ok)
            console.error('Error saving data');

    } catch (error) {
        console.error('Network error or problem with request:', error);
    }


}

function scrollToTopDelayed(delayMs = 100) {
    setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, delayMs);
}


function appSetup() {
    
    console.log('Starting app setup.')
    
    var state = 'start'

    const start_button = document.querySelector('button.start');
    const instructions = document.querySelector('div.instructions');
    const example = document.querySelector('div.example');
    const example_live = document.querySelector('div.example-live');
    
    const landing = document.querySelector('div.landing-title');
    const title = document.querySelector('h1.title');
    const picture_div = document.querySelector('div.slice-canva');
    const bullet = document.querySelector('div.bullet');
    const action_button = document.querySelector('button.action');
    const ty_image = document.querySelector('img.ty');

    var save_data = {
        'image_id': '',
        'right (percentLeft, percentTop)': [],
        'left (percentLeft, percentTop)': [],
    }

    scrollToTopDelayed(10);

    /// START PAGE ///
    
    start_button.addEventListener('click', function (event) {
        switch (start_button.innerHTML.trim()) {
            case 'Go to Example':
                // hide button and instructions
                landing.classList.add('hidden');
                instructions.classList.add('hidden');
                // show example
                example.classList.remove('hidden');
                start_button.innerHTML = 'Let\'s Start!';
                scrollToTopDelayed();
                break;
            case 'Let\'s Start!':
                // Hide current elements
                example.classList.add('hidden');
                start_button.classList.add('hidden');

                // randomly choose an image id
                const randomIndex = Math.floor(Math.random() * list_of_ids.length);
                const imageId = list_of_ids[randomIndex];
                save_data['image_id'] = imageId;

                // set the first picture (right ostium)
                const img = picture_div.querySelector('img');
                if (img) {
                    img.src = `./images/${imageId}-right.png`;
                } else {
                    console.log('error: image not found')
                }
                
                // show the other elements
                title.classList.remove('hidden');
                picture_div.classList.remove('hidden');
                bullet.classList.add('hidden');
                action_button.classList.remove('hidden');

                // show example
                example_live.classList.remove('hidden');
                example_live.children[0].classList.remove('hidden');
                example_live.children[1].classList.remove('hidden');

                // scroll to top
                scrollToTopDelayed();

                // set save button to inactive
                action_button.disabled = true;

                // advance state
                state = 'right';
                break;
            default:
                console.error('Start button is stuck!')
                break;
        }
        

        
    });

    /// BULLET SELECTION and SAVE ///
    
    
    picture_div.addEventListener('click', function (event) {
        bullet.classList.remove('hidden');
       
        // Get the bounding rectangle of the picture_div relative to the document
        const rect = picture_div.getBoundingClientRect();
        const docLeft = rect.left + window.scrollX;
        const docTop = rect.top + window.scrollY;

        // Calculate the position relative to the picture_div, accounting for scroll
        const left = event.pageX - docLeft;
        const top = event.pageY - docTop;
        bullet.style.left = left + 'px';
        bullet.style.top = top + 'px';

        // Store the relative position so the bullet
        bullet.dataset.relLeft = left;
        bullet.dataset.relTop = top;

        // set save button to active since  apoint was placed
        action_button.disabled = false;
    });


    action_button.addEventListener('click', function (event) {
        
        const left = parseFloat(bullet.style.left);
        const top = parseFloat(bullet.style.top);
        const rect = picture_div.getBoundingClientRect();
        const divWidth = rect.width;
        const divHeight = rect.height;

        // left and top are already relative to picture_div
        const percentLeft = ((left / divWidth) * 100).toFixed(3);
        const percentTop = ((top / divHeight) * 100).toFixed(3);

        // scroll to top
        scrollToTopDelayed();

        switch (state) {
            case 'right':
                // save right ostium position
                save_data['right (percentLeft, percentTop)'] = [percentLeft, percentTop]
                
                // Change example
                example_live.children[0].classList.add('hidden');
                example_live.children[1].classList.add('hidden');
                example_live.children[2].classList.remove('hidden');
                example_live.children[3].classList.remove('hidden');

                // Change title
                title.innerHTML = 'Please select the left coronary ostium';
                // load next image
                const imageId = save_data['image_id'];
                const img = picture_div.querySelector('img');
                if (img) {
                    img.src = `./images/${imageId}-left.png`;
                } else {
                    console.log('error: image not found')
                }

                // hide bullet and change color to blue
                bullet.classList.add('hidden');
                bullet.classList.add('left');

                // change save button to inactive and change text
                action_button.disabled = true;
                action_button.innerHTML = 'Save Left Ostium Position';
                // advance with state
                state = 'left';
                break;

            case 'left':
                // save left ostium position
                save_data['left (percentLeft, percentTop)'] = [percentLeft, percentTop]
                // hide example
                example_live.classList.add('hidden');
                // hide image div
                picture_div.classList.add('hidden');
                // hide bullet
                bullet.classList.add('hidden');
                // change title
                title.innerHTML = 'Click the button below to submit your answer<br>You can still try again without submitting by reloading the page';
                // change action button
                action_button.innerHTML = 'SUBMIT';
                // change state
                state = 'save';
                break;

            case 'save':
                // store answer
                saveData(save_data);

                // show thank you
                title.innerHTML = 'Great job!<br><br>Try again soon';
                action_button.classList.add('hidden');
                ty_image.classList.remove('hidden');

                // reload page after 5 seconds
                window.setTimeout(
                    function () {
                        window.location.replace('./');
                    },
                    3141
                )
                break;
        }

    });

}


document.addEventListener('DOMContentLoaded', appSetup);
