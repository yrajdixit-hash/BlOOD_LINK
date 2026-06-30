BloodLink — starter scaffold
A simple operational prototype for a blood donor finder for a nearby location. No backend server to run — Firebase pushes auth, data and real time updates directly from the browser. The architecture is designed for a 24-48 hour hackathon: matching is done on the client (so no Cloud Functions required for the demo), and the donors/requesters receive an anonymous identity immediately without having to log in.

What's already built
The procedure is to click on 'Home — request blood' or 'Become a donor'.The process is 'Home — request blood' or 'Become a donor'.
In Firestore, columns of data are stored in documents, which are in turn grouped into collections.Data is stored in Firestore as collections of documents containing columns of data.
Request form — blood type; hospital; urgency; location → posts the request live
Donor feed — live list of active requests around you that match your blood type, accept/decline
Requester dashboard - real-time list of donors who accepted, with a tap-to-call button
Start by creating a new Firebase project.Begin by creating a new Firebase project.
Go to console.firebase.google.com → Add project.
For the new project, navigate to Build → Firestore Database → Create database (or paste firestore.rules later in the hackathon).
Click Build → Authentication → Sign-in method, and set Anonymous to Yes.
Click on Project settings → General → Your apps → Add app → Web and copy the config values it shows.
2. Configure the app
cp .env.example .env
Paste the values from the Firebase console into .env:

VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
3. Run it
npm install
npm run dev
Click on the local URL link that is printed out. To see the full loop, sign up as a donor in one browser window (or phone) and post a request in the second browser window (or phone) then accept on the donor's window and watch the requester's window update in real time.

How this works without Cloud Functions (no matching)
DonorFeed.jsx sends a live query to firestore to get the list of requests currently active, filters based on the distance with a Haversine calculation (src/utils/distance.js) — doesn't require any Google Maps API key for the MVP. It's quick to build and demo, but will not scale larger than a few hundred donors, after which the matching should be placed in a Cloud Function that is triggered when a new request is created.

Stretch features to add on, from effortful to easy:
Full blood-type compatibility: replace the exact-match query in DonorFeed.jsx in src with the COMPATIBLE_DONORS map, which is already in src/utils/bloodTypes.js (e.g. an O- donor should be able to see request AB+).
Push notifications – add Firebase Cloud Messaging to make sure donors don't miss out on notifications even when they aren't using the app, just when they open the feed.
Track accepted/completed donations from the user doc and display it in the requester's dashboard.Track accepted/completed donations on user doc and surface on the requester's dashboard.
Widening the net beyond registered donors with a "share this request" link on the requester dashboard or a WhatsApp button.
Security rules
There are some default rules that come with firestore.rules (for example, a donor can only add their profile, a requester can only make a request for the profile that has the same id as the requester). Once you've prepared for leaving test mode, deploy them using the Firebase CLI:

To deploy only the Cloud Firestore rules, run the following command:
Going mobile
This is a responsive web app (It is OK on phones in browser, but the max width is 480px, meaning it will always be displayed as a mobile screen). When the web version is working, you can simply wrap it with Capacitor without writing anything else if you want an installable mobile app without making any changes to the code.
## Going mobile

This is a responsive web app (works fine on phones in the browser, capped at
a 480px-wide column so it always looks like a mobile screen). If you want an
installable mobile app without rewriting anything, wrap it with
[Capacitor](https://capacitorjs.com/) once the web version works.
