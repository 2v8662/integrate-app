<template>
  <div class="psw-convertor">
    <label for="primaryPassword">
      <input id="primaryPassword" type="password" v-model="primaryPassword" :placeholder="primaryPlaceholder"
        @focus="clearPlaceholder('primaryPassword')" @blur="restorePlaceholder('primaryPassword')">
      <span>{{ checkSum }}</span>
    </label>
    <br />
    <label for="websiteInput">
      <input id="websiteInput" type="text" v-model="website" :placeholder="websitePlaceholder"
        @focus="clearPlaceholder('websiteInput')" @blur="restorePlaceholder('websiteInput')">
    </label>
    <p>密碼長度&nbsp;:&nbsp;
      <select v-model="passwordLength">
        <option value="" disabled selected hidden>請選擇</option>
        <option v-for="length in passwordLengthOptions" :key="length">{{ length }}</option>
      </select>
    </p>
    <p>密碼形式&nbsp;:&nbsp;
      <select v-model="passwordType">
        <option value="" disabled selected hidden>請選擇</option>
        <option value="char1">數字&nbsp;+&nbsp;字母</option>
        <option value="char2">數字&nbsp;+&nbsp;字母&nbsp;+&nbsp;符號</option>
      </select>
    </p>
    <button @click="createPassword()">
      創建密碼
    </button>
  </div>
  <div class="copiedPsw">{{ copiedPsw }}</div>
  <button @click="copyPassword()">
    複製密碼
  </button>
  <GoToHomePage />
</template>

<script setup>
import { ref } from 'vue';
import GoToHomePage from '../components/GoToHomePage.vue'

const primaryPassword = ref('');
const website = ref('');
const passwordLength = ref('');
const passwordType = ref('');
const checkSum = ref('');
const passwordLengthOptions = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const copiedPsw = ref('');

function clearPlaceholder(id) {
  const input = document.getElementById(id);
  if (input) {
    input.removeAttribute('placeholder');
  }
}

function restorePlaceholder(id) {
  const input = document.getElementById(id);
  const placeholder = id === 'primaryPassword' ? '輸入主要密碼' : '輸入使用的網站';
  if (input && !input.value) {
    input.setAttribute('placeholder', placeholder);
  }
}

async function createPassword() {
  const passwordBytes = (new TextEncoder).encode(primaryPassword.value);
  const messageBytes = (new TextEncoder).encode(website.value);
  if (passwordBytes.byteLength === 0) {
    alert('主要密碼不能為空');
  } else if (messageBytes.byteLength === 0) {
    alert('請輸入網頁');
  } else if (!passwordLength.value) {
    alert('請選擇密碼長度');
  } else if (!passwordType.value) {
    alert('請選擇密碼形式');
    return;
  }
  try {
    const importedKey = await crypto.subtle.importKey('raw', passwordBytes, { name: 'HMAC', hash: 'SHA-512' }, false, ['sign']);
    const signature = await crypto.subtle.sign('HMAC', importedKey, messageBytes);
    const password = convertBase(
      signature,
      passwordCharset[passwordType.value],
      parseInt(passwordLength.value.toString(), 10)
    );
    copiedPsw.value = password;
    // console.log(website.value);
    // console.log(password);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

function convertBase(srcBuffer, destCharset, length) {
  let bufferArray = new Uint8Array(srcBuffer);
  let bufferIndex = bufferArray.byteLength - 1;
  let charsetLength = destCharset.length;
  let password = '';
  while (bufferIndex >= 0 && --length >= 0) {
    let remainder = 0;
    for (let j = bufferIndex; j >= 0; --j) {
      let temp = remainder * 256 + bufferArray[j];
      remainder = temp % charsetLength;
      if ((bufferArray[j] = (temp - remainder) / charsetLength) === 0 && j === bufferIndex) {
        --bufferIndex;
      }
    }
    password += destCharset[remainder];
  }
  return password;
}

function copyPassword() {
  navigator.clipboard.writeText(copiedPsw.value)
    .then(() => {
      alert('密碼已成功複製！');
    })
    .catch(err => {
      console.error('無法複製密碼：', err);
    });
}


const passwordCharset = {
  char1: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  char2: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`!@#$%^&*()_-+={[}\\]|:;\"\'<>,.?/'
};

const primaryPlaceholder = primaryPassword.value ? '' : '輸入主要密碼';
const websitePlaceholder = website.value ? '' : '輸入使用的網站';
</script>

<style>
.psw-convertor {
  font-family: Arial, sans-serif;
  max-width: 400px;
  margin: 0 auto;
}

label {
  display: block;
  margin-bottom: 10px;
}

input,
select,
button,
.copiedPsw {
  padding: 8px;
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
}

input:hover,
select:hover,
button:hover {
  border-color: #646cffaa;
  transition: border-color 0.3s ease;
}

.copiedPsw {
  background-color: #111111;
  border-radius: 7px;
  height: 40px;
  user-select: none;
}
</style>