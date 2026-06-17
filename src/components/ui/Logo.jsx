import logo from '../../assets/logo/cvh-groep-logo.png'
import { company } from '../../data/site'

/**
 * Logo — het officiële CVH-merkbeeld. De vorm en opmaak van het
 * logo blijven ongewijzigd; enkel de schaal past zich aan.
 */
export default function Logo({ className = '', height = 'h-12' }) {
  return (
    <a
      href="#top"
      aria-label={`${company.name} — naar boven`}
      className={`inline-flex items-center ${className}`}
    >
      <img
        src={logo}
        alt={`${company.legalName} logo`}
        className={`${height} w-auto rounded-[3px] shadow-sm`}
        draggable="false"
      />
    </a>
  )
}
