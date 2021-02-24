import {check, check2, disableEnter, navActive, ambilKata} from '/assets/javascript/module.js';
const transaksi = document.querySelector('#idTransaction');
const modalCustom = document.querySelector('.modal-custom');
const information = document.querySelector('#information');


// Buat agar aktif
navActive()

// Event
transaksi.addEventListener('keypress', function(event){ 
    // Matikan Nilai Default
    const code = event.keyCode;
    if ( code === 13 ) {
        event.preventDefault();
        modalCustom.style.display = 'flex';
        // Jika ada nilainya
        if(this.value.length > 0) {
            fetch(`${window.location.pathname}/${this.value}`)
                .finally(res => modalCustom.style.display = 'none')
                .then(check)
                .then(result => {
                    check2(result);
                    if(result.type === true) {
                        let table = information.children[1];
                        table.innerHTML = ''
                        // console.log(result.data)
                        for(let el in result.data) {
                            let entitas = result.data[el];
                            let tr = document.createElement('tr');
                            let td = document.createElement('td')
                            let textTd = document.createTextNode(`${ambilKata(el, '_', {without: [0]})} :`);
                            let td2 = document.createElement('td');
                            let textT2 = document.createTextNode(entitas);

                            td.appendChild(textTd);
                            td2.appendChild(textT2);
                            tr.appendChild(td);
                            tr.appendChild(td2);
                            table.appendChild(tr);
                            
                        };
                        
                        information.classList.remove('d-none');
                    }
                })
        }
    };

});


const action = document.getElementById('action');
action.addEventListener('click', function(event){
    if(!information.classList.contains('d-none')) {
        fetch(`${window.location.pathname}/${transaksi.value}`, {method: 'post'})
            .then(check)
            .then(check2)
    }
})