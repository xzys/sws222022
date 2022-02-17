import CryptoJS from 'crypto-js'
import lightGallery from 'lightgallery';
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'


const question = 'Where were Sachin and Sravya both born?'
const checkTextEnc = 'U2FsdGVkX18dAXy+nIfkCkWuZdD3eXPeiKL6gW4nFW8='
const checkTextB64 = 'Y29ycmVjdHBhc3N3b3Jk'

// cache password
let password = localStorage.getItem('photo_password') || ''

// ask for password until correct
while (btoa(CryptoJS.AES.decrypt(checkTextEnc, password).toString(CryptoJS.enc.Utf8)) != checkTextB64) {
  password = (window.prompt(question) || '').toLowerCase()
}

// get encrypted html chunk
fetch('/photos.html.enc')
  .then(resp => {
    if (resp.ok) {
      return resp.text()
    } else {
      throw `${resp.status}: ${resp.statusText}`
    }
  })
  .then(encData => {
    const data = CryptoJS.AES.decrypt(encData, password).toString(CryptoJS.enc.Utf8)

    localStorage.setItem('photo_password', password)
    document.getElementById('content').innerHTML = data;
    document.getElementById('content').className = '';
    document.getElementById('prompt').className = 'hidden';
  })
