const respon2 = require('./respon2');
const jwt = require('jsonwebtoken');
const model = require('../models/model-index');

// untuk menambil kata ke-berapa dari string
function ambilKata(word, pemisah, option) {
    let word2 = word.split(pemisah);
  
    let result = "";
  
    // Destructuring
    let { ambil, space, without, uppercase, ganti } = option;
    space = space == undefined ? true : space;
    uppercase = uppercase == undefined ? true : uppercase;
    ambil = ambil == undefined ? "all" : ambil;
    without = without == undefined ? [] : without;
  
    // Looping
    word2.forEach(function (e, i) {
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
      if (space && ganti === undefined) result += " ";
      else if (ganti != undefined && i != word2.length - 1) result += ganti;
    });
  
    result = result.trim();
  
    return result;
  }
  
  function ubahHurufPertama(word, mau) {
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
  
  function gaTermasuk(dont, value) {
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
  
  function termasuk(withValue, i, el) {
    for (let j in withValue) {
      const kon = el === undefined ? withValue[j] : withValue[j][el];
      if (kon === i) {
        if (el != undefined) return { value: withValue[j]["as"], kondisi: true };
        else return true;
      }
    }
  }
  
  async function auth(req, who) {
    // Verify TOken
    let token = req.cookies.token;
    if(!token) throw new respon2({message: `token not found`, code: 403})

    let tokenVerify = jwt.verify(token, process.env.APP_PUBLIC_KEY, {
        algorithms: 'RS256'
    });

    const {id} = tokenVerify;
    let {book} = await model();
    
    let checkUser = await book.findAll({where: id});
    if(checkUser.length <= 0) throw new respon2({message: 'unregistered user', code: 403})

    if(who == 'admin') if(!tokenVerify.isAdmin) throw new respon2({message: 'only for admin', code: 403});

    return true
  }
  
  module.exports = {ubahHurufPertama, ambilKata, gaTermasuk, termasuk, auth}