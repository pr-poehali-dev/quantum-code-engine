import { motion, AnimatePresence } from "framer-motion"

interface QrBadgeProps {
  show: boolean
  results: number[]
  dateStr: string
  timeStr: string
  tzLabel: string
  onToggle: () => void
}

export function QrBadge({ show, results, dateStr, timeStr, tzLabel, onToggle }: QrBadgeProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: -20 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="fixed top-4 left-4 z-50 cursor-pointer"
          onClick={onToggle}
          title="QR для скачивания результата"
        >
          <div
            className="rounded-[18px] p-3 flex flex-col items-center gap-2"
            style={{
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(30px)",
              border: "1px solid rgba(255,255,255,0.7)",
              boxShadow: "0 8px 32px rgba(124,58,237,0.2), inset 0 1px 2px rgba(255,255,255,0.9)",
            }}
          >
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                `Результат розыгрыша: ${results.join(", ")}\nДата: ${dateStr} ${timeStr} ${tzLabel}`
              )}`}
              alt="QR результата"
              width={80}
              height={80}
              className="rounded-lg"
            />
            <span className="text-[10px] text-gray-500 font-medium">Результат</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
