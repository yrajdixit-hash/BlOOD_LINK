export default function PulseLine() {
  return (
    <svg viewBox="0 0 240 40" width="100%" height="40" aria-hidden="true" className="pulse-line">
      <polyline
        points="0,20 40,20 50,5 60,35 70,20 100,20 110,12 120,28 130,20 240,20"
        fill="none"
        stroke="var(--color-urgent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
