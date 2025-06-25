











function appSetup() {
    
    console.log('Starting app setup.')
    
    var state = 'start'

    const start_button = document.querySelector('button.start');
    const instructions = document.querySelector('div.instructions');
    
    
    const title = document.querySelector('h1.title');
    const picture_div = document.querySelector('div.slice-canva');
    const bullet = document.querySelector('div.bullet');
    const action_button = document.querySelector('button.action');


    picture_div.addEventListener('click', function (event) {
        bullet.style.display = 'block';
        bullet.style.top = event.pageY + 'px';
        bullet.style.left = event.pageX + 'px';
    });

    start_button.addEventListener('click', function (event) {
        // hide button and instructions
        start_button.style.display = 'none';
        instructions.style.display = 'none';

        // show the other elements
        title.style.display = '';
        picture_div.style.display = '';
        bullet.style.display = 'none'; // keep bullet hidden until clicked
        action_button.style.display = '';

        state = 'right';
    });



    action_button.addEventListener('click', function (event) {
        if (bullet.style.display == 'none')
            return
        const left = parseInt(bullet.style.left, 10);
        const top = parseInt(bullet.style.top, 10);

        const rect = picture_div.getBoundingClientRect();
        const divLeft = rect.left + window.scrollX;
        const divTop = rect.top + window.scrollY;
        const divWidth = rect.width;
        const divHeight = rect.height;

        const relX = left - divLeft;
        const relY = top - divTop;

        const percentX = ((relX / divWidth) * 100).toFixed(3);
        const percentY = ((relY / divHeight) * 100).toFixed(3);

        switch (state) {
            case 'right':
                state = 'left';
                break;

            case 'left':
                state = 'finish';
                break;

            case 'finish':
                break;
        }

        console.log(`Saved click at: ${percentX}% X, ${percentY}% Y`);
    });

}


document.addEventListener('DOMContentLoaded', appSetup);