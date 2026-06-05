// ── PWA INSTALL ──────────────────────────────────────────────
let deferredPrompt=null;
const banner=document.getElementById('installBanner');
window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault(); deferredPrompt=e;
  setTimeout(()=>{ if(!localStorage.getItem('pwaInstallDismissed')) banner.classList.add('visible'); },4000);
});
document.getElementById('installBtn').addEventListener('click',async()=>{
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  const{outcome}=await deferredPrompt.userChoice;
  if(outcome==='accepted'){ banner.classList.remove('visible'); showToast('✅ App installed!'); }
  deferredPrompt=null;
});
window.addEventListener('appinstalled',()=>{ banner.classList.remove('visible'); deferredPrompt=null; });
function dismissInstall(){ banner.classList.remove('visible'); localStorage.setItem('pwaInstallDismissed','1'); }
const isIos=/iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone=window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone;
if(isIos&&!isStandalone&&!localStorage.getItem('pwaInstallDismissed')){
  setTimeout(()=>{
    banner.innerHTML=`<div class="install-banner-text"><strong>📲 Add to Home Screen</strong><span>Tap Share ⎙ then "Add to Home Screen"</span></div><button class="install-dismiss" onclick="dismissInstall()">×</button>`;
    banner.classList.add('visible');
  },4000);
}
