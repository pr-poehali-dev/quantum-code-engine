import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SocialFooter } from "@/components/SocialFooter"
import { MessageSquare, Info, Sun, Moon } from "lucide-react"

const socials = [
  { icon: MessageSquare, href: "#", label: "Обратная связь" },
  { icon: Info, href: "#", label: "О нас" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 25,
    },
  },
}

function SpinningNumbers({ isDark, numColor }: { isDark: boolean; numColor: string }) {
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

      {/* fade top/bottom */}
      <div className="absolute inset-x-0 top-0 h-8 pointer-events-none" style={{ background: `linear-gradient(to bottom, ${fadeColor}, transparent)` }} />
      <div className="absolute inset-x-0 bottom-0 h-8 pointer-events-none" style={{ background: `linear-gradient(to top, ${fadeColor}, transparent)` }} />
    </div>
  )
}

export function LinkBioPage() {
  const [isDark, setIsDark] = useState(true)
  const [min, setMin] = useState("")
  const [max, setMax] = useState("")
  const [count, setCount] = useState("1")

  const [excludeUsed, setExcludeUsed] = useState(false)
  const [usedNumbers, setUsedNumbers] = useState<Set<number>>(new Set())
  const [results, setResults] = useState<number[]>([])
  const [rolling, setRolling] = useState(false)
  const [error, setError] = useState("")
  const [showQr, setShowQr] = useState(false)
  const [isLastNumber, setIsLastNumber] = useState(false)
  const [displayNumbers, setDisplayNumbers] = useState<number[]>([])

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  const timeStr = now.toLocaleTimeString("ru-RU", { timeZone: userTimezone, hour: "2-digit", minute: "2-digit", second: "2-digit" })
  const dateStr = now.toLocaleDateString("ru-RU", { timeZone: userTimezone, day: "numeric", month: "long", year: "numeric" })
  const tzOffset = -now.getTimezoneOffset() / 60
  const tzLabel = `UTC${tzOffset >= 0 ? "+" : ""}${tzOffset}`

  function handleRoll() {
    const minNum = parseInt(min)
    const maxNum = parseInt(max)
    const countNum = parseInt(count) || 1
    if (isNaN(minNum) || isNaN(maxNum)) {
      setError("Введи оба числа диапазона")
      return
    }
    if (minNum >= maxNum) {
      setError("Минимум должен быть меньше максимума")
      return
    }
    const rangeSize = maxNum - minNum + 1
    const pool = Array.from({ length: rangeSize }, (_, i) => minNum + i)
      .filter(n => !excludeUsed || !usedNumbers.has(n))


    if (excludeUsed && pool.length === 0) {
      setError("Все числа из диапазона уже были использованы")
      return
    }
    setError("")
    setRolling(true)
    setResults([])
    setDisplayNumbers([])

    let final: number[]
    if (excludeUsed) {
      const shuffled = [...pool]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      final = shuffled.slice(0, Math.min(countNum, shuffled.length))
    } else {
      final = Array.from({ length: countNum }, () => pool[Math.floor(Math.random() * pool.length)])
    }


    setDisplayNumbers(final)
    setResults(final)
    setShowQr(false)
    if (excludeUsed) {
      const newUsed = new Set([...usedNumbers, ...final])
      setUsedNumbers(newUsed)
      const rangeTotal = maxNum - minNum + 1
      if (newUsed.size >= rangeTotal) {
        setIsLastNumber(true)
        setShowQr(true)
      } else {
        setIsLastNumber(false)
      }
    }
    setRolling(false)
  }

  const theme = {
    bg: isDark
      ? "from-[#0d0d1a] via-[#11101f] to-[#0a0a14]"
      : "from-[#f0eeff] via-[#f5f0ff] to-[#eae4ff]",
    inputBg: isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.7)",
    inputBorder: isDark ? "rgba(255,255,255,0.12)" : "rgba(124,58,237,0.2)",
    inputText: isDark ? "text-white" : "text-gray-800",
    inputPlaceholder: isDark ? "placeholder:text-gray-600" : "placeholder:text-gray-400",
    cardBg: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.65)",
    cardBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(124,58,237,0.18)",
    headingText: isDark ? "text-white" : "text-gray-900",
    subText: isDark ? "text-gray-400" : "text-gray-500",
    labelText: isDark ? "text-gray-400" : "text-gray-500",
    toggleBg: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.7)",
    toggleBorder: isDark ? "rgba(255,255,255,0.15)" : "rgba(124,58,237,0.25)",
    resultNum: isDark ? "#ffffff" : "#111111",
    spinnerNum: isDark ? "#ffffff" : "#111111",
    timeBg: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.65)",
    timeBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(124,58,237,0.18)",
    timeText: isDark ? "text-white" : "text-gray-900",
    timeSub: isDark ? "text-gray-500" : "text-gray-400",
  }

  return (
    <main className={`relative min-h-screen px-6 py-10 flex flex-col overflow-hidden`}>
      <div className={`fixed inset-0 z-0 bg-gradient-to-br ${theme.bg} transition-colors duration-500`} />

      {/* Theme toggle */}
      <button
        onClick={() => setIsDark(v => !v)}
        className="fixed top-4 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300"
        style={{
          background: theme.toggleBg,
          backdropFilter: "blur(20px)",
          border: `1px solid ${theme.toggleBorder}`,
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        }}
        title={isDark ? "Светлая тема" : "Тёмная тема"}
      >
        {isDark
          ? <Sun size={18} className="text-yellow-300" />
          : <Moon size={18} className="text-purple-600" />
        }
      </button>



      {/* QR badge */}
      <AnimatePresence>
        {showQr && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="fixed top-4 left-4 z-50 cursor-pointer"
            onClick={() => setShowQr(v => !v)}
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

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 mx-auto max-w-[400px] w-full flex flex-col flex-1 justify-between"
      >
        <motion.div variants={itemVariants} className="pt-2 flex flex-col items-center text-center">
          <SpinningNumbers isDark={isDark} numColor={theme.spinnerNum} />
          <h1 className={`mt-5 text-xl font-semibold tracking-tight ${theme.headingText}`}>Генератор случайных чисел</h1>
          <p className={`mt-2 text-sm ${theme.subText}`}>Честный и прозрачный розыгрыш за секунды 🎲</p>
        </motion.div>

        <motion.div className="py-8 space-y-4" variants={containerVariants}>
          {/* Диапазон */}
          <motion.div variants={itemVariants} className="flex gap-3">
            <div className="flex-1">
              <label className={`block text-xs ${theme.labelText} mb-1 pl-1`}>От</label>
              <input
                type="number"
                value={min}
                onChange={e => setMin(e.target.value)}
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
                onChange={e => setMax(e.target.value)}
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
                onChange={e => setCount(e.target.value)}
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

          {/* Без повторов / до последнего числа */}
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
                onClick={() => { setExcludeUsed(v => !v); setUsedNumbers(new Set()) }}
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

          {/* Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              onClick={handleRoll}
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

        <motion.div variants={itemVariants} className="pb-2">
          <SocialFooter socials={socials} copyright="2025 Розыгрыш призов" />
        </motion.div>
      </motion.div>
    </main>
  )
}