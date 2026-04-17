import { motion, AnimatePresence } from "framer-motion"
import { Theme } from "@/hooks/useTheme"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 350, damping: 25 },
  },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
}

interface RaffleFormProps {
  theme: Theme
  isDark: boolean
  isReady: boolean
  min: string
  max: string
  count: string
  excludeUsed: boolean
  usedNumbers: Set<number>
  displayNumbers: number[]
  rolling: boolean
  error: string
  dateStr: string
  timeStr: string
  tzLabel: string
  onMinChange: (v: string) => void
  onMaxChange: (v: string) => void
  onCountChange: (v: string) => void
  onToggleExclude: () => void
  onRoll: () => void
}

export function RaffleForm({
  theme,
  isDark,
  isReady,
  min,
  max,
  count,
  excludeUsed,
  usedNumbers,
  displayNumbers,
  rolling,
  error,
  dateStr,
  timeStr,
  tzLabel,
  onMinChange,
  onMaxChange,
  onCountChange,
  onToggleExclude,
  onRoll,
}: RaffleFormProps) {
  return (
    <motion.div
      className="py-8 space-y-4"
      variants={containerVariants}
      style={{ pointerEvents: isReady ? "auto" : "none", opacity: isReady ? 1 : 0.35, transition: "opacity 0.5s" }}
    >
      {/* Диапазон */}
      <motion.div variants={itemVariants} className="flex gap-3">
        <div className="flex-1">
          <label className={`block text-xs ${theme.labelText} mb-1 pl-1`}>От</label>
          <input
            type="number"
            value={min}
            onChange={e => onMinChange(e.target.value)}
            placeholder="1"
            className={`w-full rounded-[16px] px-4 py-3 text-center ${theme.inputText} font-semibold text-lg outline-none ${theme.inputPlaceholder}`}
            style={{
              background: theme.inputBg,
              backdropFilter: "blur(30px)",
              border: `1px solid ${theme.inputBorder}`,
              boxShadow: "inset 0 1px 2px rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.1)",
            }}
          />
        </div>
        <div className="flex-1">
          <label className={`block text-xs ${theme.labelText} mb-1 pl-1`}>До</label>
          <input
            type="number"
            value={max}
            onChange={e => onMaxChange(e.target.value)}
            placeholder="100"
            className={`w-full rounded-[16px] px-4 py-3 text-center ${theme.inputText} font-semibold text-lg outline-none ${theme.inputPlaceholder}`}
            style={{
              background: theme.inputBg,
              backdropFilter: "blur(30px)",
              border: `1px solid ${theme.inputBorder}`,
              boxShadow: "inset 0 1px 2px rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.1)",
            }}
          />
        </div>
        <div className="w-20">
          <label className={`block text-xs ${theme.labelText} mb-1 pl-1`}>Кол-во</label>
          <input
            type="number"
            value={count}
            min={1}
            onChange={e => onCountChange(e.target.value)}
            placeholder="1"
            className={`w-full rounded-[16px] px-2 py-3 text-center ${theme.inputText} font-semibold text-lg outline-none ${theme.inputPlaceholder}`}
            style={{
              background: theme.inputBg,
              backdropFilter: "blur(30px)",
              border: `1px solid ${theme.inputBorder}`,
              boxShadow: "inset 0 1px 2px rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      </motion.div>

      {/* Без повторов */}
      <motion.div variants={itemVariants}>
        <label
          className="flex items-center gap-3 cursor-pointer rounded-[16px] px-4 py-3 select-none"
          style={{
            background: excludeUsed ? "rgba(124,58,237,0.18)" : theme.cardBg,
            backdropFilter: "blur(30px)",
            border: excludeUsed ? "1px solid rgba(124,58,237,0.4)" : `1px solid ${theme.cardBorder}`,
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          }}
        >
          <div
            onClick={onToggleExclude}
            className="relative w-10 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
            style={{
              background: excludeUsed ? "linear-gradient(135deg, #7c3aed, #db2777)" : isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.75)",
            }}
          >
            <div
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
              style={{ left: excludeUsed ? "calc(100% - 20px)" : "4px" }}
            />
          </div>
          <div>
            <div className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"} font-medium leading-tight`}>Без повторов, до последнего числа</div>
            {excludeUsed && usedNumbers.size > 0 && (
              <div className="text-[11px] text-purple-400 mt-0.5">использовано: {usedNumbers.size}</div>
            )}
          </div>
        </label>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm text-red-400">
          {error}
        </motion.p>
      )}

      {/* Results */}
      <motion.div
        variants={itemVariants}
        className="flex flex-wrap items-center justify-center gap-3 rounded-[20px] py-6 px-4"
        style={{
          background: theme.cardBg,
          backdropFilter: "blur(40px) saturate(180%)",
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          minHeight: 120,
        }}
      >
        <AnimatePresence mode="wait">
          {displayNumbers.length > 0 ? (
            <motion.div
              key={displayNumbers.join(",")}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              {displayNumbers.map((num, i) => (
                <span
                  key={i}
                  className="font-bold tracking-tight"
                  style={{
                    fontSize: displayNumbers.length === 1 ? "5rem" : displayNumbers.length <= 4 ? "3rem" : "1.75rem",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: 1.1,
                    color: theme.resultNum,
                  }}
                >
                  {num}
                </span>
              ))}
            </motion.div>
          ) : (
            <motion.span
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-3xl text-gray-600 font-light"
            >
              ?
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Разыграть */}
      <motion.div variants={itemVariants}>
        <motion.button
          onClick={onRoll}
          disabled={rolling}
          className="w-full rounded-[20px] py-4 text-white font-semibold text-[15px] tracking-tight disabled:opacity-70"
          style={{
            background: rolling
              ? "linear-gradient(135deg, #a855f7, #ec4899)"
              : "linear-gradient(135deg, #7c3aed, #db2777)",
            boxShadow: "0 8px 24px rgba(124,58,237,0.35), inset 0 1px 1px rgba(255,255,255,0.2)",
          }}
          whileHover={!rolling ? { scale: 1.02, y: -2 } : {}}
          whileTap={!rolling ? { scale: 0.98, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {rolling ? "Выбираем..." : "🎲 Разыграть"}
        </motion.button>
      </motion.div>

      {/* Время проведения */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between rounded-[20px] px-5 py-4"
        style={{
          background: theme.timeBg,
          backdropFilter: "blur(40px) saturate(180%)",
          border: `1px solid ${theme.timeBorder}`,
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        }}
      >
        <div>
          <div className={`text-[11px] ${theme.timeSub} mb-0.5`}>{dateStr}</div>
          <div className={`text-2xl font-bold ${theme.timeText} tracking-tight`} style={{ fontVariantNumeric: "tabular-nums" }}>
            {timeStr}
          </div>
        </div>
        <div
          className="text-xs font-semibold px-3 py-1.5 rounded-full text-purple-500"
          style={{
            background: "rgba(124,58,237,0.15)",
            border: "1px solid rgba(124,58,237,0.35)",
          }}
        >
          {tzLabel}
        </div>
      </motion.div>
    </motion.div>
  )
}