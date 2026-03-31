let db = {};
let mazoActivo = null;
let cartasSesion = [];
let actual = 0;

// 1. Cargar el archivo JSON al iniciar la página
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        db = data;
        console.log("Base de datos cargada correctamente");
    })
    .catch(error => {
        console.error("Error al cargar data.json:", error);
        alert("Hubo un error al cargar las cartas. Revisa tu archivo data.json.");
    });

// 2. Lógica del botón Modo Claro / Oscuro
const btnTheme = document.getElementById('theme-toggle');
btnTheme.onclick = () => {
    const theme = document.documentElement.getAttribute('data-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    btnTheme.innerText = newTheme === 'dark' ? 'Modo Claro' : 'Modo Oscuro';
};

// 3. Selección y Juego
function seleccionarMazo(id) {
    if (Object.keys(db).length === 0) {
        alert("Los datos aún se están cargando o hubo un error.");
        return;
    }
    
    mazoActivo = db[id];
    document.getElementById('main-header').classList.add('hidden');
    document.getElementById('selection-area').classList.add('hidden');
    document.getElementById('play-area').classList.remove('hidden');
    prepararCartas();
}

function prepararCartas() {
    const s = shuffle(mazoActivo.soft).slice(0, 4).map(t => ({t, l: 'Nivel I - Soft'}));
    const m = shuffle(mazoActivo.medium).slice(0, 3).map(t => ({t, l: 'Nivel II - Medio'}));
    const f = shuffle(mazoActivo.strong).slice(0, 1).map(t => ({t, l: 'Nivel III - Fuerte'}));
    
    cartasSesion = [...s, ...m, ...f];
    actual = 0;
    renderCarta();
}

function renderCarta() {
    const container = document.getElementById('deck-container');
    container.innerHTML = '';

    if (actual < cartasSesion.length) {
        document.getElementById('current-count').innerText = actual + 1;
        const data = cartasSesion[actual];
        const el = document.createElement('div');
        el.className = 'card';
        
        el.innerHTML = `
            <div class="card-level">${data.l}</div>
            <div class="card-order">"${data.t}"</div>
            <div class="card-hint">Click para confirmar</div>
        `;

        el.onclick = () => {
            el.classList.add('exit');
            actual++;
            setTimeout(renderCarta, 400);
        };
        container.appendChild(el);
    } else {
        volverAlInicio();
    }
}

function volverAlInicio() {
    document.getElementById('play-area').classList.add('hidden');
    document.getElementById('main-header').classList.remove('hidden');
    document.getElementById('selection-area').classList.remove('hidden');
    mazoActivo = null;
    cartasSesion = [];
    actual = 0;
}

function shuffle(a) { return a.sort(() => 0.5 - Math.random()); }