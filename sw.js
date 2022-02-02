if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(function(reg) {
        // registration worked
        console.log('Yes ! Enregsistrement réussi !. Scope is ' + reg.scope);
    }).catch(function(error) {
        // registration failed
        console.log('Aie Aie erreur ' + error);
      });
    };


// Initialise la variable pour l'utiliser plus tard afin d'afficher une invitation a installer la PWA


let deferredPrompt;
 
window.addEventListener('beforeinstallprompt', (e) => {
  // Empêcher la mini-barre d'information d'apparaître sur mobile si deja installée
  e.preventDefault();
  // Réserve l'événement pour qu'il puisse être déclenché plus tard
  deferredPrompt = e;
  // Informe l'utilisateur qu'il peut installer la PWA avec une fenêtre
  installApp();
  
  console.log(`'beforeinstallprompt' a été déclenché !`);

  // Fonction qui renvoie a l'installation de l'application quand le boutton "Installer" est cliqué !
    appButton.addEventListener('click', function() {
      deferredPrompt.prompt();
    })

});

// Fonction qui affiche une fenêtre a l'ouverture de la page pour informer l'utilisateur de la possibilité d'installer cette PWA
// Possible de faire autrement, mais le toast de bootstrap est assez simple a utiliser


function installApp() {
  console.log('hey');
  const fenetre = document.getElementById('message')
  const toast = new bootstrap.Toast(fenetre, {delay: 6000}) //reste affichée 6 secondes seulement
  toast.show();
};  
const filesToCache = [
  '/',
  'style.css',
  'banner.jpeg',
  'index.html',
  'pages/offline.html',
  'pages/404.html'
];

const staticCacheName = 'pages-cache-v1';

self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open('mysite-dynamic').then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});