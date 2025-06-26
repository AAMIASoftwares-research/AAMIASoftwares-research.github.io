/**
 * 
 * @param {String} regex_filter A regex to be applied to each saved instance 
 */
async function getSavedData(regex_filter = undefined) {
    try {
        const retrieveUrl = `http://shapire.altervista.org/EMBC2025/get_data.php`;
        const response = await fetch(
            retrieveUrl, 
            {
                method: 'GET',
            }
        );

        // Parse the JSON response
        const data = await response.json();

        if (response.ok) {
            if (regex_filter) {
                var filtered_object = {};
                for (const timestamp in data) {
                    regex = new RegExp(regex_filter);
                    if (regex.test(timestamp))
                        filtered_object[timestamp] = data[timestamp];
                }
                return filtered_object;
            }
            return data
        } else {
            console.error('Error retrieving data:', data.message || 'Unknown error');
        }

    } catch (error) {
        console.error('Network error or problem with request:', error);
    }

}

async function appSetup() {
    
    console.log('Starting app setup.')

    // get all user's positions
    const saved_locations = await getSavedData();

    console.log('saved_locations', saved_locations);

    // format data all together
    var _right = {};
    var _left = {};
    for (const [timestamp, value] of Object.entries(saved_locations)) {
        if (!_right[value['image_id']]){
            _right[value['image_id']] = [];
            _left[value['image_id']] = [];
        }
        // fill 
        _right[value['image_id']].push(
            {
                x: value['right (percentLeft, percentTop)'][0],
                y: value['right (percentLeft, percentTop)'][1]
            }
        );
        _left[value['image_id']].push(
            {
                x: value['left (percentLeft, percentTop)'][0],
                y: value['left (percentLeft, percentTop)'][1]
            }
        );
        
    }

    // common options
    const opts_scales = {
        x: {
            min: 0,
            max: 100
        },
        y: {
            min: 0,
            max: 100
        }
    }

    // right chart
    const data_right = {
        datasets: []
    }
    for (const [id, value] of Object.entries(_right)) {
        data_right['datasets'].push(
            {
                label: id,
                data: value,
                backgroundColor: 'firebrick'
            }
        );
    }
    const config_right = {
        type: 'scatter',
        data: data_right,
        options: {
            scales: opts_scales,
            plugins: {
                title: {
                    display: true,
                    text: 'Right Coronary Ostium'
                }
            },
        }
    };
    const right_canva = document.querySelector('div.right canvas');
    new Chart(right_canva, config_right);


    
    // left chart
    const data_left = {
        datasets: []
    };
    for (const [id, value] of Object.entries(_left)) {
        data_left['datasets'].push(
            {
                label: id,
                data: value,
                backgroundColor: 'steelblue'
            }
        );
    }
    const config_left = {
        type: 'scatter',
        data: data_left,
        options: {
            scales: opts_scales,
            plugins: {
                title: {
                    display: true,
                    text: 'Left Coronary Ostium'
                }
            },
        }
    };
    const left_canva = document.querySelector('div.left canvas');
    new Chart(left_canva, config_left);

    console.log(_left)
    

}


document.addEventListener('DOMContentLoaded', appSetup);
