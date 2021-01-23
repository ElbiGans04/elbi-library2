export function check(result) {
    if(!result.ok) {
        alert(result.statusText)
        return false
    } else {
        return result.json()
    }
}