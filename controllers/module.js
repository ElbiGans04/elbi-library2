const crypto = require('crypto');
// untuk menambil kata ke-berapa dari string
module.exports = class {
  // Ubah Huruf
  ubahHurufPertama(word, mau) {
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
  
  
  gaTermasuk(dont, value) {
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
  
  termasuk(withValue, i, el) {
    for (let j in withValue) {
      const kon = el === undefined ? withValue[j] : withValue[j][el];
      if (kon === i) {
        if (el != undefined) return { value: withValue[j]["as"], kondisi: true };
        else return true;
      }
    }
  }
  
  // Ambil Kelas
  ambilKata(word, pemisah, option) {
    let word2 = word.split(pemisah);
  
    let result = "";
  
    // Destructuring
    let { ambil, space, without, uppercase, ganti } = option;
    space = space == undefined ? true : space;
    uppercase = uppercase == undefined ? true : uppercase;
    ambil = ambil == undefined ? "all" : ambil;
    without = without == undefined ? [] : without;
  
    // Looping
    word2.forEach((e, i) => {
      e = uppercase == true ? this.ubahHurufPertama(e) : e;
      e = uppercase == false ? e.toLowerCase() : e;
      // Jika argument ambil sama dengan number
      if (typeof ambil == "number") {
        if (i == ambil) result += e;
      } else if (typeof ambil == "object") {
        if (this.termasuk(ambil, i) == true) result += `${e}`;
      } else if (typeof ambil == "string") {
        if (word2.length > without.length) {
          if (this.gaTermasuk(without, i) == true) result += `${e}`;
        } else result += `${e}`;
      }
  
      if (space && i !== word2.length - 1) result += " ";
    });
  
    if (ganti != undefined) result += ganti;
  
    result = result.trim();
  
    return result;
  }
  randomString(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }


  as(data) {
    let result = {};
    result.target = data.target || "";
    result.as = data.as || "";
    result.type = data.type || "input";
    result.value = data.value || null;
    result.defaultValue = data.default || "on";
    result.showName =
      data.showName ||
      this.ambilKata(data.target, "_", { space: true, without: data.without });
    
    // Return 
    return result
  }
  
  getTime(waktu) {
    const waktuNow = new Date().getTime();
    const distance = waktuNow - waktu;
  
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




  pesanError  (err) {
    let newErr = err.message.split("\n");
    let resultNewErr = ``;
    newErr.forEach((e, i) =>  {
      let newErr2 = e.split("on");
      newErr2 = newErr2[3].split(" ")[1];
      resultNewErr += this.ambilKata(newErr2, "_", { without: [0], ganti: "," });
    });

    err.message = resultNewErr += " is invalid";
    return err.message
  } 

  
  jajal(without, value) {
    for (let index in without) {
      const target = without[index]["target"].toLowerCase();
      const as = without[index]["as"];
      value = value.toLowerCase();
  
      if (target == value) {
        return without[index];
      }
    }
  
    return false;
  }

  hashing (text) {
    // Hash password
    let hash = crypto.createHash('SHA256');
    hash.write(text, 'base64');
    return hash.digest('base64');
  }

  decryp (text) {
    return crypto.privateDecrypt(process.env.APP_PRIVATE_KEY, text);
  }

  encryp (text) {
    return crypto.publicEncrypt(process.env.APP_PUBLIC_KEY, Buffer.from(text));
  }
}


