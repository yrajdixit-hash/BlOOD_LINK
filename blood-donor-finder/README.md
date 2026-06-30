# BloodLink — starter scaffold

A minimal, working scaffold for a nearby blood donor finder. No backend server
to run — Firebase handles auth, data, and real-time updates directly from the
browser. Built for a 24–48hr hackathon: matching happens client-side (no
Cloud Functions needed for the demo), and donors/requesters get an anonymous
identity instantly, with no login screen.

## What's already built

- **Home** — choose "request blood" or "become a donor"
- **Donor signup** — name, phone, blood type, location → saved to Firestore
- **Request form** — blood type needed, hospital, urgency, location → posts a live request
- **Donor feed** — live list of nearby active requests matching your blood type, with accept/decline
- **Requester dashboard** — live list of donors who accepted, with a tap-to-call button

## 1. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project**.
2. In your new project, go to **Build → Firestore Database → Create database** (start in test mode for the hackathon, or paste `firestore.rules` in later).
3. Go to **Build → Authentication → Sign-in method** and enable **Anonymous**.
4. Go to **Project settings → General → Your apps → Add app → Web**, and copy the config values it gives you.

## 2. Configure the app

```bash
cp .env.example .env
```

Paste the values from the Firebase console into `.env`:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## 3. Run it

```bash
npm install
npm run dev
```

Open the printed local URL. To demo the full loop, open it in two browser
tabs (or two phones): sign up as a donor in one, post a request in the other,
accept on the donor tab, and watch the requester tab update live.

## How matching works (no Cloud Functions)

`DonorFeed.jsx` runs a live Firestore query for active requests matching the
signed-in donor's blood type, then filters by distance client-side using a
Haversine calculation (`src/utils/distance.js`) — no Google Maps API key
needed for the MVP. This is fast to build and demo, but doesn't scale past a
few hundred donors; if you have time left, move the matching into a Cloud
Function triggered on request creation instead.

## Stretch features to build next, in order of effort

1. **Full blood-type compatibility** — swap the exact-match query in
   `DonorFeed.jsx` for the `COMPATIBLE_DONORS` map already in
   `src/utils/bloodTypes.js` (e.g. an O- donor should see AB+ requests too).
2. **Push notifications** — add Firebase Cloud Messaging so donors get
   notified even with the app closed, instead of only seeing requests when
   they open the feed.
3. **Donor reliability score** — track accepted/completed donations on the
   user doc and surface it in the requester dashboard.
4. **Share outside the app** — a "share this request" link/WhatsApp button
   on the requester dashboard to widen the net beyond registered donors.

## Security rules

`firestore.rules` has a starting set of rules (donors can only write their
own profile, requesters can only create requests under their own id, etc.).
Deploy them with the Firebase CLI when you're ready to leave test mode:

```bash
firebase deploy --only firestore:rules
```

## Going mobile

This is a responsive web app (works fine on phones in the browser, capped at
a 480px-wide column so it always looks like a mobile screen). If you want an
installable mobile app without rewriting anything, wrap it with
[Capacitor](https://capacitorjs.com/) once the web version works.
