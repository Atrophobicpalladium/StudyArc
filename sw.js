// ==========================================
// StudyArc Service Worker
// ==========================================

const CACHE_NAME = "studyarc-v2";

const FILES_TO_CACHE = [

"./",

"index.html",
"splash.html",
"login.html",
"onboarding.html",
"home.html",
"focus.html",
"todo.html",
"stats.html",
"profile.html",
"settings.html",
"notifications.html",
"calendar.html",
"rooms.html",
"achievement.html",
"xp.html",

"css/style.css",

"js/app.js",

"manifest.json",

"images/icon-192.png",

"images/icon-512.png"

];

// Install
self.addEventListener("install", event => {

    self.skipWaiting();

    event.waitUntil(

        caches.open(CACHE_NAME)

        .then(cache => {

            // Cache files individually so one missing file (e.g. an
            // icon that hasn't been added yet) can't block every other
            // file from being cached and stop the update from applying.
            return Promise.all(

                FILES_TO_CACHE.map(url =>

                    cache.add(url).catch(err => {

                        console.log("⚠️ Skipped caching (not found):", url);

                    })

                )

            );

        })

    );

});

// Activate
self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys.map(key => {

                    if(key !== CACHE_NAME){

                        return caches.delete(key);

                    }

                })

            );

        }).then(() => self.clients.claim())

    );

});

// Fetch
self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)

        .then(response => {

            return response || fetch(event.request);

        })

    );

});