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

        console.log(result);

    } catch (error) {
        console.error('Network error or problem with request:', error);
    }


}



function appSetup() {
    
    console.log('Starting app setup.')
    
    var state = 'start'

    const start_button = document.querySelector('button.start');
    const instructions = document.querySelector('div.instructions');
    
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

    /// START PAGE ///
    
    start_button.addEventListener('click', function (event) {
        // hide button and instructions
        landing.classList.add('hidden');
        start_button.classList.add('hidden');
        instructions.classList.add('hidden');

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

        // set save button to inactive
        action_button.disabled = true;

        // advance state
        state = 'right';
    });

    /// BULLET SELECTION and SAVE ///
    
    
    picture_div.addEventListener('click', function (event) {
        bullet.classList.remove('hidden');
        bullet.style.top = event.pageY + 'px';
        bullet.style.left = event.pageX + 'px';

        // set save button to active since  apoint was placed
        action_button.disabled = false;
    });


    action_button.addEventListener('click', function (event) {
        
        const left = parseInt(bullet.style.left, 10);
        const top = parseInt(bullet.style.top, 10);

        const rect = picture_div.getBoundingClientRect();
        const divLeft = rect.left + window.scrollX;
        const divTop = rect.top + window.scrollY;
        const divWidth = rect.width;
        const divHeight = rect.height;

        const relX = left - divLeft;
        const relY = top - divTop;

        const percentLeft = ((relX / divWidth) * 100).toFixed(3);
        const percentTop = ((relY / divHeight) * 100).toFixed(3);

        switch (state) {
            case 'right':
                // save right ostium position
                save_data['right (percentLeft, percentTop)'] = [percentLeft, percentTop]
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
                // hide image div
                picture_div.classList.add('hidden');
                // hide bullet
                bullet.classList.add('hidden');
                // change title
                title.innerHTML = 'Click the button below to submit your answer<br>If you\'re not happy with your choice, reload the page';
                // change action button
                action_button.innerHTML = 'SUBMIT';
                // change state
                state = 'save';
                break;

            case 'save':
                // store answer
                saveData(save_data);

                // show thank you
                title.innerHTML = 'Great job!';
                action_button.classList.add('hidden');
                ty_image.classList.remove('hidden');

                // reload page after 5 seconds
                window.setTimeout(
                    function () {
                        window.location.replace('./');
                    },
                    2000
                )
                break;
        }

    });

}


document.addEventListener('DOMContentLoaded', appSetup);
