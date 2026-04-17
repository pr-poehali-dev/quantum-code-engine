import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ProfileSection } from "@/components/ProfileSection"
import { SocialFooter } from "@/components/SocialFooter"
import { MessageSquare, Info } from "lucide-react"

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

function SpinningNumbers() {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const cols = [
    { duration: 1.4, delay: 0 },
    { duration: 1.8, delay: 0.15 },
    { duration: 1.2, delay: 0.3 },
  ]

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
                className="flex items-center justify-center font-bold text-purple-300"
                style={{ height: 28, fontSize: 18, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}
              >
                {d}
              </div>
            ))}
          </motion.div>
        </div>
      ))}

      {/* fade top/bottom */}
      <div className="absolute inset-x-0 top-0 h-8 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(13,13,26,0.85), transparent)" }} />
      <div className="absolute inset-x-0 bottom-0 h-8 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(13,13,26,0.85), transparent)" }} />
    </div>
  )
}

export function LinkBioPage() {
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

    const final: number[] = Array.from({ length: countNum }, () => pool[Math.floor(Math.random() * pool.length)])


    const totalDuration = 1800
    const intervalMs = 80
    const steps = Math.floor(totalDuration / intervalMs)
    let step = 0
    const ticker = setInterval(() => {
      setDisplayNumbers(final.map(() => pool[Math.floor(Math.random() * pool.length)]))
      step++
      if (step >= steps) {
        clearInterval(ticker)
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
    }, intervalMs)
  }

  return (
    <main className="relative min-h-screen px-6 py-10 flex flex-col overflow-hidden">
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#0d0d1a] via-[#11101f] to-[#0a0a14]" />



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
          <SpinningNumbers />
          <h1 className="mt-5 text-xl font-semibold tracking-tight text-white">Генератор случайных чисел</h1>
          <p className="mt-2 text-sm text-gray-400">Честный и прозрачный розыгрыш за секунды 🎲</p>
        </motion.div>

        <motion.div className="py-8 space-y-4" variants={containerVariants}>
          {/* Диапазон */}
          <motion.div variants={itemVariants} className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-400 mb-1 pl-1">От</label>
              <input
                type="number"
                value={min}
                onChange={e => setMin(e.target.value)}
                placeholder="1"
                className="w-full rounded-[16px] px-4 py-3 text-center text-white font-semibold text-lg outline-none placeholder:text-gray-600"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(30px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.2)",
                }}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-400 mb-1 pl-1">До</label>
              <input
                type="number"
                value={max}
                onChange={e => setMax(e.target.value)}
                placeholder="100"
                className="w-full rounded-[16px] px-4 py-3 text-center text-white font-semibold text-lg outline-none placeholder:text-gray-600"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(30px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.2)",
                }}
              />
            </div>
            <div className="w-20">
              <label className="block text-xs text-gray-400 mb-1 pl-1">Кол-во</label>
              <input
                type="number"
                value={count}
                min={1}
                onChange={e => setCount(e.target.value)}
                placeholder="1"
                className="w-full rounded-[16px] px-2 py-3 text-center text-white font-semibold text-lg outline-none placeholder:text-gray-600"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(30px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.2)",
                }}
              />
            </div>
          </motion.div>

          {/* Без повторов / до последнего числа */}
          <motion.div variants={itemVariants}>
            <label
              className="flex items-center gap-3 cursor-pointer rounded-[16px] px-4 py-3 select-none"
              style={{
                background: excludeUsed ? "rgba(124,58,237,0.18)" : "rgba(255,255,255,0.06)",
                backdropFilter: "blur(30px)",
                border: excludeUsed ? "1px solid rgba(124,58,237,0.4)" : "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              }}
            >
              <div
                onClick={() => { setExcludeUsed(v => !v); setUsedNumbers(new Set()) }}
                className="relative w-10 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
                style={{
                  background: excludeUsed ? "linear-gradient(135deg, #7c3aed, #db2777)" : "rgba(255,255,255,0.12)",
                }}
              >
                <div
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                  style={{ left: excludeUsed ? "calc(100% - 20px)" : "4px" }}
                />
              </div>
              <div>
                <div className="text-sm text-gray-200 font-medium leading-tight">Без повторов, до последнего числа</div>
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
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(40px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              minHeight: 120,
            }}
          >
            {displayNumbers.length > 0 ? (
              displayNumbers.map((num, i) => (
                <motion.span
                  key={rolling ? `roll-${i}-${num}` : `final-${i}`}
                  initial={rolling ? { opacity: 0, y: -10 } : { opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={rolling ? { duration: 0.05 } : { type: "spring", stiffness: 400, damping: 20 }}
                  className="font-bold tracking-tight"
                  style={{
                    fontSize: displayNumbers.length === 1 ? "5rem" : displayNumbers.length <= 4 ? "3rem" : "1.75rem",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: 1.1,
                    color: rolling ? "rgba(167,139,250,0.6)" : "#a78bfa",
                  }}
                >
                  {num}
                </motion.span>
              ))
            ) : (
              <span className="text-3xl text-gray-600 font-light">?</span>
            )}
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
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(40px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            }}
          >
            <div>
              <div className="text-[11px] text-gray-500 mb-0.5">{dateStr}</div>
              <div className="text-2xl font-bold text-white tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
                {timeStr}
              </div>
            </div>
            <div
              className="text-xs font-semibold px-3 py-1.5 rounded-full text-purple-300"
              style={{
                background: "rgba(124,58,237,0.2)",
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