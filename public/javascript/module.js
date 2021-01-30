export function check(result) {
    if(!result.ok) {
        alert(result.statusText)
        return false
    } else {
        return result.json()
    }
}

export function getTime(waktu) {
    const waktuNow = new Date().getTime();
    const distance = waktuNow - waktu;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    return {
      days, hours, minutes, seconds
    }
  }