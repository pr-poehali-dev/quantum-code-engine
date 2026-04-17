import { motion } from "framer-motion"

interface SpinningNumbersProps {
  isDark: boolean
  numColor: string
}

export function SpinningNumbers({ isDark, numColor }: SpinningNumbersProps) {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const cols = [
    { duration: 1.4, delay: 0 },
    { duration: 1.8, delay: 0.15 },
    { duration: 1.2, delay: 0.3 },
  ]
  const fadeColor = isDark ? "rgba(13,13,26,0.85)" : "rgba(240,238,255,0.85)"

  return (
    <div
      className="relative flex items-center justify-center gap-2 rounded-full overflow-hidden"
      style={{
        width: 96,
        height: 96,
        background: "rgba(124,58,237,0.15)",
        backdropFilter: "blur(20px)",
        boxShadow: "inset 0 1px 2px rgba(124,58,237,0.2), 0 0 0 1.5px rgba(124,58,237,0.4), 0 8px 32px rgba(124,58,237,0.2)",
      }}
    >
      {cols.map((col, ci) => (
        <div key={ci} className="overflow-hidden" style={{ height: 28 }}>
          <motion.div
            animate={{ y: [0, -28 * digits.length] }}
            transition={{ duration: col.duration, delay: col.delay, repeat: Infinity, ease: "linear" }}
            style={{ willChange: "transform" }}
          >
            {[...digits, ...digits].map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-center font-bold"
                style={{ height: 28, fontSize: 18, lineHeight: 1, fontVariantNumeric: "tabular-nums", color: numColor }}
              >
                {d}
              </div>
            ))}
          </motion.div>
        </div>
      ))}

      <div className="absolute inset-x-0 top-0 h-8 pointer-events-none" style={{ background: `linear-gradient(to bottom, ${fadeColor}, transparent)` }} />
      <div className="absolute inset-x-0 bottom-0 h-8 pointer-events-none" style={{ background: `linear-gradient(to top, ${fadeColor}, transparent)` }} />
    </div>
  )
}
