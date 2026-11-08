
/*
 * Amazing Tower - Legacy Service Worker Migration
 *
 * Previous version used cache-first strategy and could
 * serve outdated Unity WebGL build files.
 *
 * This replacement:
 * 1. Activates immediately.
 * 2. Removes old Amazing Tower caches.
 * 3. Unregisters itself.
 * 4. Allows future visitors to load directly from the server.
 */

self.addEventListener("install", event => {
    self.skipWaiting();
});

self.addEventListener("activate", event => {

    event.waitUntil((async () => {

        // Find existing browser caches.
        const cacheNames = await caches.keys();

        // Identify only Amazing Tower's old caches.
        const oldGameCaches = cacheNames.filter(name =>
            name.startsWith("DefaultCompany-Amazing Tower")
        );

        // Delete outdated game caches.
        await Promise.all(
            oldGameCaches.map(name => caches.delete(name))
        );

        // Unregister this migration service worker.
        await self.registration.unregister();

        // Complete transition for existing tabs.
        await self.clients.claim();

        console.log(
            "[Amazing Tower] Legacy cache cleanup completed."
        );

    })());

});
