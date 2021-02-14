export function navActive () {  
  // // // Memberi class active pada navbar \\ \\ \\ 
  const navList = document.querySelectorAll('#accordionSidebar > li');

  navList.forEach(function(element, index){
    const children = element.children;
    
    // Escape url
    let url = escapeUrl(window.location.pathname);
  
    // Jika mempunyai 2 element anak berarti nav collaps
    if( children.length > 1 ) {
      const anak = children[children.length - 1];
  
      // Jika mempunyai class
      if(anak.matches('.collapse')) {
        const cicit = anak.children[0].children;
        
        // Lakukan Pengulangan
        for ( let el of cicit ) {
          let newUrl = el.getAttribute('href');

          if(newUrl) {
            let elUrl = escapeUrl(newUrl);
            if( elUrl ==  url ) {
              anak.classList.add('show')
              el.classList.add('active')
            }
          }
        }
      }
  
    } else {
      const anak = element.children[0];
      if(anak.getAttribute('href') == url) element.classList.add('active');
    }
  });
}

export function escapeUrl (url) {
  let result = url.split('/');
  // Jika 2 slash
  if(result.length >= 2) {
    let newresult = `/${result[result.length - 1]}`;
    // Jika huruf belakangnya /
    if(newresult == '/') newresult = `/${result[result.length - 2]}`;

    result = newresult;
  } else {
    // Ambil result lagi
    result = window.location.pathname;
  };
  
  return result
} 

export function check(result) {
  if (!result.ok) {
    alert(result.statusText);
    return false;
  } else {
    return result.json();
  }
}

export function getTime(waktu) {
  const waktuNow = new Date().getTime();
  const distance = waktuNow - waktu;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

export function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function validate(text) {
  let regex = /^[a-zA-Z0-9]*$/;
  return regex.test(text);
}

export function getRows(all) {
  let thead = document.querySelectorAll('#tableUtama thead > tr > th');
  let tbody = document.querySelectorAll('#tableUtama tbody tr[data-id]');
  let result = [];
  
  tbody.forEach(function(el, idx) {
    let cell = Array.from(el.children);
    let newResult = {};
    
    thead.forEach(function(ell, idxx){
      if(ell.getAttribute('name') && cell[idxx].children.length == 0) {
        newResult[ell.textContent] = cell[idxx].textContent
      }
    });
    
    result.push(newResult);
  })
  
  return result
}

export function getIndex (el) {
  let tbody = document.querySelectorAll('#tableUtama tbody tr[data-id]');
  let i = 0;
  for(let e of tbody) {
    if(e == el) return i
    i++
  }
}

export function validasi (element) {

  // Definisi Index
  let index = 0;

  // Melooping input element
  for (let el of element) {

    // Mengambil Data yang diperlukan
    let type = el.getAttribute('type');
    let name = el.getAttribute('name');
    let small = el.nextElementSibling;

    // Pastikan element input bukan type checkbox
    if (type !== 'checkbox') {

      // Jika Input Type Email maka gunakan validate type email
      let test = type == 'email' ? validateEmail(el.value) : validate(el.value);

      // Jika ada input yang tidak diisi atau yang tidak lolos regex maka return false, 
      // tampilkan element small, dan setel button submit ke false
      if(el.value.length <= 0 || !test) {
        small.classList.remove('d-none');
        small.textContent = `${name} is invalid`;
        submit.setAttribute('disabled', '')

        // Kembalikan Index sebagai penanda input ke berapa yang tidak valid
        return index
      
      // Jika ada element yang lolos maka hilangkan pesan kesalahan errornya
      } else {
        small.classList.add('d-none')
      }
    
    }


    // Tambahkan Index setiap looping
    index++

  }

  // Jika sudah sampai sini maka berarti semua input telah lolos test dan return true
  return true

}