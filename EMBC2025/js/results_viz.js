import { list_of_ids } from "./id_list.js";

/**
 * 
 * @param {String} regex_filter A regex to be applied to each saved instance 
 */
async function getSavedData(regex_filter = undefined) {
    try {
        const retrieveUrl = `https://shapire.altervista.org/EMBC2025/get_data.php`;
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

/**
     * Generates points for a circle.
     * @param {number} numPoints Number of vertices (>=3)
     * @param {number} radius Circle radius
     * @param {number} centerX X coordinate of center
     * @param {number} centerY Y coordinate of center
     * @returns {Array<{x: number, y: number}>}
     */
    function makeCircle(numPoints, radius, centerX = 0, centerY = 0) {
        const points = [];
        for (let i = 0; i < numPoints; i++) {
            const theta = (2 * Math.PI * i) / numPoints;
            points.push({
                x: centerX + radius * Math.cos(theta),
                y: centerY + radius * Math.sin(theta)
            });
        }
        // Close the circle
        points.push(points[0]);
        return points;
    }

async function appSetup() {
    
    console.log('Starting app setup.')

    // get all user's positions
    const saved_locations = await getSavedData();

    // get all ground truth positions and image dimensions
    const positions = {};
    for (const id of list_of_ids) {
        try {
            const response = await fetch(`./positions/${id}.json`);
            if (response.ok) {
                const posData = await response.json();
                positions[id] = posData;
            } else {
                console.warn(`Could not load positions for ${id}: ${response.statusText}`);
            }
        } catch (err) {
            console.error(`Error loading positions for ${id}:`, err);
        }
    }

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

    // translate into errors (saved_locations - ground truth positions)
    var errors_right = {};
    var errors_left = {};

    for (const id of Object.keys(_right)) {
        const gt = positions[id];
        if (!gt) continue;

        const image_width_mm = gt.image_width_mm;
        const image_height_mm = gt.image_height_mm;

        // Right ostium error
        const gt_right = gt['right (percentLeft, percentTop)'];
        if (gt_right) {
            errors_right[id] = _right[id].map(pt => {
                const dx = (pt.x - gt_right[0]) * image_width_mm / 100;
                const dy = (pt.y - gt_right[1]) * image_height_mm / 100;
                return { dx, dy, dist: Math.sqrt(dx * dx + dy * dy) };
            });
        }

        // Left ostium error
        const gt_left = gt['left (percentLeft, percentTop)'];
        if (gt_left) {
            errors_left[id] = _left[id].map(pt => {
                const dx = (pt.x - gt_left[0]) * image_width_mm / 100;
                const dy = (pt.y - gt_left[1]) * image_height_mm / 100;
                return { dx, dy, dist: Math.sqrt(dx * dx + dy * dy) };
            });
        }
    }

    // common options
    const opts_scales = {
        x: {
            min: -30,
            max: 30,
            title: {
                display: true,
                text: '[mm]'
            }
        },
        y: {
            min: -30,
            max: 30,
            title: {
                display: true,
                text: '[mm]'
            }
        }
    };

    // right chart
    const data_right = {
        datasets: []
    };
    for (const [id, value] of Object.entries(errors_right)) {
        // value is an array of {dx, dy, dist}, map to {x, y}
        const errorPoints = value.map(pt => ({ x: pt.dx, y: pt.dy }));
        data_right['datasets'].push(
            {
                type: 'scatter',
                label: id,
                data: errorPoints,
                backgroundColor: 'firebrick'
            }
        );
    }
    const config_right = {
        data: data_right,
        options: {
            scales: opts_scales,
            plugins: {
                title: {
                    display: true,
                    text: 'Right Coronary Ostium - Error (mm)'
                }
            },
            aspectRatio: 1,
        }
    };
    const right_canva = document.querySelector('div.right canvas');
    const right_chart = new Chart(right_canva, config_right);


    
    // left chart
    const data_left = {
        datasets: []
    };
    for (const [id, value] of Object.entries(errors_left)) {
        // value is an array of {dx, dy, dist}, map to {x, y}
        const errorPoints = value.map(pt => ({ x: pt.dx, y: pt.dy }));
        data_left['datasets'].push(
            {
                type: 'scatter',
                label: id,
                data: errorPoints,
                backgroundColor: 'steelblue'
            }
        );
    }
    const config_left = {
        data: data_left,
        options: {
            scales: opts_scales,
            plugins: {
                title: {
                    display: true,
                    text: 'Left Coronary Ostium - Error (mm)'
                }
            },
            aspectRatio: 1,
        }
    };
    const left_canva = document.querySelector('div.left canvas');
    const left_chart = new Chart(left_canva, config_left);

    ////////////////////////////////////////////////////////////
    // now show the IQR and Median - values from EMBC2025 paper
    ////////////////////////////////////////////////////////////
    const right_iqr = [3.48 , 5.03]
    const right_median = 4.16
    const left_iqr = [5.69 , 16.34]
    const left_median = 7.79

    // Add dashed circle overlays for medians
    const circlePoints = makeCircle(32, right_median, 0, 0);
    data_right.datasets.push({
        type: 'line',
        label: 'Median Error',
        data: circlePoints,
        borderColor: 'firebrick',
        borderDash: [8, 6],
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
        order: 0,
        showLine: true
    });

    const circlePointsLeft = makeCircle(32, left_median, 0, 0);
    data_left.datasets.push({
        type: 'line',
        label: 'Median Error',
        data: circlePointsLeft,
        borderColor: 'steelblue',
        borderDash: [8, 6],
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
        order: 0,
        showLine: true
    });

    // add circle overlays (filled, dark gray, semi-transparent) for iqr min and iqr max

    // Right IQR min
    const right_iqr_min_points = makeCircle(32, right_iqr[0], 0, 0);
    data_right.datasets.push({
        type: 'line',
        label: 'IQR Min',
        data: right_iqr_min_points,
        borderColor: 'rgba(50,50,50,0.7)',
        backgroundColor: 'rgba(50,50,50,0.2)',
        pointRadius: 0,
        borderWidth: 1,
        order: -2,
        showLine: true
    });

    // Right IQR max
    const right_iqr_max_points = makeCircle(32, right_iqr[1], 0, 0);
    data_right.datasets.push({
        type: 'line',
        label: 'IQR Max',
        data: right_iqr_max_points,
        borderColor: 'rgba(50,50,50,0.7)',
        backgroundColor: 'rgba(50,50,50,0.2)',
        pointRadius: 0,
        borderWidth: 1,
        order: -1,
        showLine: true
    });

    // Left IQR min
    const left_iqr_min_points = makeCircle(48, left_iqr[0], 0, 0);
    data_left.datasets.push({
        type: 'line',
        label: 'IQR Min',
        data: left_iqr_min_points,
        borderColor: 'rgba(50,50,50,0.7)',
        backgroundColor: 'rgba(50,50,50,0.2)',
        pointRadius: 0,
        borderWidth: 1,
        order: -2,
        showLine: true
    });

    // Left IQR max
    const left_iqr_max_points = makeCircle(64, left_iqr[1], 0, 0);
    data_left.datasets.push({
        type: 'line',
        label: 'IQR Max',
        data: left_iqr_max_points,
        borderColor: 'rgba(50,50,50,0.7)',
        backgroundColor: 'rgba(50,50,50,0.2)',
        pointRadius: 0,
        borderWidth: 1,
        order: -1,
        showLine: true
    });

    // Update charts to show new datasets
    right_chart.update();
    left_chart.update();
}


document.addEventListener('DOMContentLoaded', appSetup);
