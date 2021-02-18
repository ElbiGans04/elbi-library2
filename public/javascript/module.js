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

export function getTime(waktu, day) {
  waktu = new Date(parseInt(waktu));
  console.log(waktu.getDate(), day)
  waktu.setDate(waktu.getDate() + parseInt(day))
  console.log(waktu.getDate())

  let waktuNow = Date.now();
  const distance = waktuNow - waktu.getTime();
  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
  if(days < 0) days = 0;
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
  let regex = /^[a-zA-Z0-9 ]*$/;
  return regex.test(text);
}

export function validateNumber(text) {
  let regex = /^[0-9]*$/;
  return regex.test(text);
}

export function validateDate(text) {
  let regex = /\d{4}-\d{2}-\d{2}/;
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

export function validasi (element, submit) {
  submit = submit || document.querySelector(`form button[type=submit]`);
  
  // Definisi Index
  let index = 0;

  // Melooping input element
  for (let el of element) {
    
    // Mengambil Data yang diperlukan
    let type = el.getAttribute('type');
    let name = el.getAttribute('name');
    let small = el.nextElementSibling;

    // Pastikan element input bukan type checkbox
    if (type !== 'checkbox' && type !== 'file') {
      
      // Jika Input Type Email maka gunakan validate type email
      let test;
      if(type == 'email') test = validateEmail(el.value);
      else if(type == 'date') test = validateDate(el.value)
      else if(type == 'number') test = validateNumber(el.value)
      else test = validate(el.value)
      
      // console.log(test, el.value)
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

export function ubahHurufPertama(word, mau) {
  // Ambil Bagian nomor depan
  let potongan = word.slice(0, 1);
  // Ubah Jadi Huruf besar
  potongan =
  mau === undefined ? potongan.toUpperCase() : potongan.toLowerCase();
  // Potong dari 0 sampai akhir
  word = word.slice(1);
  // Gabungkan
  potongan += word;
  // Kirim Potongannya
  return potongan;
}


export function gaTermasuk(dont, value) {
  let i = 0;
  if (dont.length > 0) {
    for (let a of dont) {
      // Jika Value sama dengan element didalam dont maka return false
      if (a === value) return false;
      // return true saat 'i' == dont length. Mengapa saya tidak mengecheck nilai yang sama lagi ? Kerena telah dicheck oleh 'if'  diatas
      if (i === dont.length - 1) return true;
      i++;
    }
  } else return true;
}

export function termasuk(withValue, i, el) {
  for (let j in withValue) {
    const kon = el === undefined ? withValue[j] : withValue[j][el];
    if (kon === i) {
      if (el != undefined) return { value: withValue[j]["as"], kondisi: true };
      else return true;
    }
  }
}

// Ambil Kelas
export function ambilKata(word, pemisah, option) {
  let word2 = word.split(pemisah);
  if(option.reverse) word2 = word2.reverse();

  let result = "";

  // Destructuring
  let { ambil, space, without, uppercase, ganti } = option;
  space = space == undefined ? true : space;
  uppercase = uppercase == undefined ? true : uppercase;
  ambil = ambil == undefined ? "all" : ambil;
  without = without == undefined ? [] : without;

  // Looping
  word2.forEach((e, i) => {
    e = uppercase == true ? ubahHurufPertama(e) : e;
    e = uppercase == false ? e.toLowerCase() : e;
    // Jika argument ambil sama dengan number
    if (typeof ambil == "number") {
      if (i == ambil) result += e;
    } else if (typeof ambil == "object") {
      if (termasuk(ambil, i) == true) result += `${e}`;
    } else if (typeof ambil == "string") {
      if (word2.length > without.length) {
        if (gaTermasuk(without, i) == true) result += `${e}`;
      } else result += `${e}`;
    }

    if (space && i !== word2.length - 1) result += " ";
  });

  if (ganti != undefined) result += ganti;

  result = result.trim();

  return result;
}