import { motion } from "framer-motion"
import { type LucideIcon } from "lucide-react"

interface SocialLink {
  icon: LucideIcon
  href: string
  label: string
}

interface SocialFooterProps {
  socials: SocialLink[]
  copyright: string
}

export function SocialFooter({ socials, copyright }: SocialFooterProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        {socials.map((social) => (
          <motion.a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-purple-300"
            style={{
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(124,58,237,0.3)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 600, damping: 20 }}
          >
            <social.icon className="h-4 w-4" strokeWidth={1.5} />
            <span className="text-xs font-medium">{social.label}</span>
          </motion.a>
        ))}
      </div>

      <p className="text-[11px] text-gray-600">{copyright}</p>
    </div>
  )
}