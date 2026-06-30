export const BLOOD_TYPES = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']

// Who can donate TO each recipient type (recipient -> compatible donor types).
// MVP uses an exact match in DonorFeed.jsx for simplicity/speed. Swap the
// `where('bloodType', '==', donor.bloodType)` query for a client-side filter
// against this map (`COMPATIBLE_DONORS[request.bloodType].includes(donor.bloodType)`)
// once you want full compatibility matching as a stretch feature.
export const COMPATIBLE_DONORS = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
}
