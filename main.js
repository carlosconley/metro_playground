// will store the map element
var map;
var fpsCounter;
var fpsUpdate = 0;

const sub = (x, y) => x.map((e, i) => e - y[i])
const add = (x, y) => x.map((e, i) => e + y[i])
const div = (x, y) => x.map((e, i) => e / y[i])
const sc_div = (x, y) => x.map(e => e / y)
const clamp = (val, min, max) => Math.max(Math.min(val, max), min)
const clampVec = (x, clamps) => x.map((e, i) => clamp(e, ...clamps[i]))


function tick(ms) {
    let seconds = ms / 1000

    // browser only updates style changes when needed
    map.style.transform = `translate(${center[0] * 100}vw, ${center[1] * 100}vh)`

    if (fpsUpdate == 10) {
        let delta = (seconds - time) / 10
        // Update fps text
        fpsCounter.innerHTML = (1/delta).toFixed(1)
        time = seconds
        fpsUpdate = 0
        console.log(dims[1])
    }

    ++fpsUpdate
    requestAnimationFrame(tick)
}

function onResize() {
    const doc = document.documentElement;
    window.dims = [doc.clientWidth, doc.clientHeight]

}
// do things when the DOM loads
addEventListener('load', () => {
    map = document.getElementById('map');
    fpsCounter = document.getElementById('fps');
    
    // create random stations as an example
    for (let i = 0; i < 1000; ++i) {
        let station = document.createElement('div')
        station.className = 'station'
        let xpos = Math.random() * 99
        let ypos = Math.random() * 99
        station.style.transform = `translate(${xpos}vh, ${ypos}vh)`
        station.style.backgroundColor = "#" + Math.floor(Math.random()*16777215).toString(16);
        map.append(station);
    }
    const factor = 0.9;
    const invFactor = 1. / factor;

    window.clicked = null;
    window.center = [0, 0]
    window.last_center = center
    window.scale = 1.0
    let xBounds = [-2000, 2000]
    let yBounds = [-1000, 1000]

    const doc = document.documentElement;
    window.dims = [doc.clientWidth, doc.clientHeight]


    window.addEventListener('mousedown', (ev) => {
        clicked = div([ev.clientX, ev.clientY], dims)
    })

    window.addEventListener('mousemove', (ev) => {
        if (!clicked) {
            return;
        }
        
        let pos = div([ev.clientX, ev.clientY], dims)
        let diff = sub(pos, clicked)
    
        center = clampVec(add(last_center, diff), [xBounds, yBounds])
    })

    window.addEventListener('mouseup', (ev) => {

        window.clicked = null;
        window.last_center = center;
    })

    window.addEventListener('wheel', (ev) => {
        if (ev.deltaY > 0) {
            scale *= factor
        } else {
            scale *= invFactor
        }
    })

    window.addEventListener('resize', onResize)

    window.time = 0
    requestAnimationFrame(tick);

});
