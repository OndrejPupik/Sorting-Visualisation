let meritko = document.getElementById('meritko');
let tlacitko = document.getElementById('tlacitko');
let heap = document.getElementById('heap');
let bubble = document.getElementById('bubble');
let quick = document.getElementById('quick');
let meritko_hodnota = document.getElementById(`meritko_hodnota`);
let pocet, aktivni = -1;
let finalni_list = [];
let stoper = false;

async function sleep(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds));
}

function vytvorHodnoty() {
    let pomocny_list = [];
    for (let i = 0; i < pocet; i++) {
        pomocny_list.push(i);
    }
    finalni_list = [];
    let nahoda;
    for (let i = 0; i < pocet; i++) {
        nahoda = Math.floor(Math.random() * pomocny_list.length);
        finalni_list.push(pomocny_list[nahoda]);
        pomocny_list.splice(nahoda, 1);
    }
    nakresliHodnoty(finalni_list);
}

function aktualizujHodnoty() {
    meritko_hodnota.textContent = meritko.value;
    pocet = meritko.value;
    vytvorHodnoty();
}

function nakresliHodnoty(puvodni_list) {
    document.getElementById('orientace').innerHTML = '';
    for (let i = 0; i < pocet; i++) {
        let obj = document.createElement('div');
        if (puvodni_list[i] != finalni_list[i]) {
            obj.style.cssText = `height:${100 + Math.floor(Math.min((900 / pocet), 100) * finalni_list[i])}px;background-color:red;justify-content:center;color:white;font-weight:bolder`;
        }
        else {
            obj.style.cssText = `height:${100 + Math.floor(Math.min((900 / pocet), 100) * finalni_list[i])}px;background-color:green;justify-content:center;color:white;font-weight:bolder`;
        }
        let velikost = document.createTextNode(finalni_list[i] + 1);
        obj.appendChild(velikost);
        document.getElementById("orientace").appendChild(obj);

    }
}

function prohozeniHodnot(a, b) {
    let pomocny_list = finalni_list.slice();
    let docas = finalni_list[a];
    finalni_list[a] = finalni_list[b];
    finalni_list[b] = docas;
    nakresliHodnoty(pomocny_list);
}
async function bubble_sort() {
    let cas = Math.max(Math.floor(1000 - pocet * 50), 30);
    let neroztrideno = true;
    while (neroztrideno) {
        neroztrideno = false;
        for (let i = 0; i < pocet - 1; i++) {
            if (stoper) return;
            if (finalni_list[i] > finalni_list[i + 1]) {
                neroztrideno = true;
                prohozeniHodnot(i, i + 1);
                await sleep(cas);
            }
        }
    }
}
async function heap_sort() {
    let pomocny_list;
    let otec;
    let syn, dcera;
    let cas = Math.max(Math.floor(1000 - pocet * 30), 80);
    let aktualni_prv;
    for (let i = 0; i < pocet; i++) {
        aktualni_prv = i;
        while (aktualni_prv != 0) {
            if (stoper) return;
            otec = Math.floor((aktualni_prv - 1) / 2);
            if (finalni_list[aktualni_prv] > finalni_list[otec]) {
                prohozeniHodnot(aktualni_prv, otec);
                await sleep(cas);
            }
            aktualni_prv = otec;
        }
    }
    for (let i = pocet - 1; i > 0; i--) {
        prohozeniHodnot(0, i);
        await sleep(cas);
        aktualni_prv = 0;
        while (true) {
            syn = -1; dcera = -1;
            if (stoper) return;
            if (2 * aktualni_prv + 1 < i) {
                if (finalni_list[aktualni_prv] < finalni_list[2 * aktualni_prv + 1]) {
                    syn = finalni_list[aktualni_prv * 2 + 1];
                }
            }
            if (2 * aktualni_prv + 2 < i) {
                if (finalni_list[aktualni_prv] < finalni_list[2 * aktualni_prv + 2]) {
                    dcera = finalni_list[aktualni_prv * 2 + 2];
                }
            }
            if (syn == -1 && dcera == -1) {
                break;
            }
            else if (syn > dcera) {
                if (stoper) return;
                prohozeniHodnot(aktualni_prv, 2 * aktualni_prv + 1);
                await sleep(cas);
                aktualni_prv = 2 * aktualni_prv + 1;
            }
            else {
                if (stoper) return;
                prohozeniHodnot(aktualni_prv, 2 * aktualni_prv + 2);
                await sleep(cas);
                aktualni_prv = 2 * aktualni_prv + 2;
            }
        }
    }
}
async function quick_sort() {
    const zasobnik = []
    let zac, kon;
    let cas = Math.max(Math.floor(1000 - pocet * 30), 80);
    zasobnik.push([0, pocet - 1]);
    while (zasobnik.length != 0) {
        zac = zasobnik[zasobnik.length - 1][0];
        kon = zasobnik[zasobnik.length - 1][1];
        zasobnik.pop();
        let k = zac;
        for (let i = zac; i <= kon; i++) {
            if (finalni_list[i] <= finalni_list[kon]) {
                if (stoper) return;
                if (i != k) {
                    prohozeniHodnot(i, k);
                    await sleep(cas);
                }
                k++;
            }
        }
        if (kon > k) {
            zasobnik.push([k, kon]);
        }
        if (k - 2 > zac) {
            zasobnik.push([zac, k - 2]);
        }
    }
}
function odaktivovat() {
    stred = document.getElementById('stred');
    for (let child of stred.children) {
        child.style.cssText = '';
    }
}
function aktivovat(jaky, poradi) {
    odaktivovat();
    jaky.style.cssText = `background-color:white;color:rgb(0, 153, 255);`
    aktivni = poradi;
}
async function jakyAlg() {
    if (tlacitko.innerHTML == `stop`) {
        stoper = true;
    }
    else if (aktivni != -1) {
        meritko.disabled = true;
        tlacitko.innerHTML = `stop`;
        if (aktivni == 0) {
            await bubble_sort();
        }
        else if (aktivni == 1) {
            await heap_sort();
        }
        else if (aktivni == 2) {
            await quick_sort();
        }
        stoper = false;
        tlacitko.innerHTML = `start`;
        meritko.disabled = false;
    }
}


aktualizujHodnoty();

document.addEventListener('DOMContentLoaded', () => {
    meritko.addEventListener('input', aktualizujHodnoty);
    tlacitko.addEventListener('click', jakyAlg);
    bubble.addEventListener('click', function () { aktivovat(bubble, 0) });
    heap.addEventListener('click', function () { aktivovat(heap, 1) });
    quick.addEventListener('click', function () { aktivovat(quick, 2) });
});