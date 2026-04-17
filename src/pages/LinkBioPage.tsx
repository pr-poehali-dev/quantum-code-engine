import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ProfileSection } from "@/components/ProfileSection"
import { SocialFooter } from "@/components/SocialFooter"
import { Send, MessageCircle, Mail } from "lucide-react"

const socials = [
  { icon: Send, href: "#", label: "Telegram" },
  { icon: MessageCircle, href: "#", label: "WhatsApp" },
  { icon: Mail, href: "#", label: "Email" },
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
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(20px)",
        boxShadow: "inset 0 2px 4px rgba(255,255,255,0.9), 0 0 0 2px rgba(255,255,255,0.6), 0 8px 32px rgba(120,119,198,0.15)",
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
                className="flex items-center justify-center font-bold text-gray-700"
                style={{ height: 28, fontSize: 18, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}
              >
                {d}
              </div>
            ))}
          </motion.div>
        </div>
      ))}

      {/* fade top/bottom */}
      <div className="absolute inset-x-0 top-0 h-8 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.9), transparent)" }} />
      <div className="absolute inset-x-0 bottom-0 h-8 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(255,255,255,0.9), transparent)" }} />
    </div>
  )
}

export function LinkBioPage() {
  const [min, setMin] = useState("")
  const [max, setMax] = useState("")
  const [count, setCount] = useState("1")
  const [noRepeat, setNoRepeat] = useState(false)
  const [excludeUsed, setExcludeUsed] = useState(false)
  const [usedNumbers, setUsedNumbers] = useState<Set<number>>(new Set())
  const [results, setResults] = useState<number[]>([])
  const [rolling, setRolling] = useState(false)
  const [error, setError] = useState("")
  const [showQr, setShowQr] = useState(false)
  const [isLastNumber, setIsLastNumber] = useState(false)

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

    if (noRepeat && countNum > pool.length) {
      setError(`Без повторов можно выбрать максимум ${pool.length} чисел из доступных`)
      return
    }
    if (excludeUsed && pool.length === 0) {
      setError("Все числа из диапазона уже были использованы")
      return
    }
    setError("")
    setRolling(true)
    setResults([])

    setTimeout(() => {
      let final: number[]
      if (noRepeat) {
        const shuffled = [...pool]
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        final = shuffled.slice(0, countNum)
      } else {
        final = Array.from({ length: countNum }, () => pool[Math.floor(Math.random() * pool.length)])
      }
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
    }, 600)
  }

  return (
    <main className="relative min-h-screen px-6 py-10 flex flex-col overflow-hidden">
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />

      {/* Animated gradient orbs */}
      <motion.div
        className="fixed z-0 w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(147, 51, 234, 0.25) 0%, transparent 70%)",
          filter: "blur(60px)",
          top: "-10%",
          left: "-10%",
        }}
        animate={{
          x: [0, 100, 50, 0],
          y: [0, 50, 100, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="fixed z-0 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)",
          filter: "blur(80px)",
          top: "30%",
          right: "-20%",
        }}
        animate={{
          x: [0, -80, -40, 0],
          y: [0, 80, -40, 0],
          scale: [1, 0.85, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="fixed z-0 w-[450px] h-[450px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
          filter: "blur(70px)",
          bottom: "-5%",
          left: "20%",
        }}
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -60, 30, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="fixed z-0 w-[350px] h-[350px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
          filter: "blur(50px)",
          top: "60%",
          left: "-5%",
        }}
        animate={{
          x: [0, 40, 80, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.2, 1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="fixed inset-0 z-0 pointer-events-none opacity-60"
        animate={{
          background: [
            "radial-gradient(ellipse 80% 60% at 20% 30%, rgba(255,255,255,0.6), transparent 50%), radial-gradient(ellipse 60% 80% at 80% 70%, rgba(255,255,255,0.4), transparent 50%)",
            "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(255,255,255,0.6), transparent 50%), radial-gradient(ellipse 60% 80% at 30% 80%, rgba(255,255,255,0.4), transparent 50%)",
            "radial-gradient(ellipse 80% 60% at 80% 40%, rgba(255,255,255,0.6), transparent 50%), radial-gradient(ellipse 60% 80% at 60% 60%, rgba(255,255,255,0.4), transparent 50%)",
            "radial-gradient(ellipse 80% 60% at 20% 30%, rgba(255,255,255,0.6), transparent 50%), radial-gradient(ellipse 60% 80% at 80% 70%, rgba(255,255,255,0.4), transparent 50%)",
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="fixed z-0 pointer-events-none"
        style={{
          width: "200%",
          height: "100px",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          transform: "rotate(-35deg)",
          top: "20%",
          left: "-50%",
        }}
        animate={{
          left: ["-50%", "100%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 4,
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.025,
        }}
      />

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
          <h1 className="mt-5 text-xl font-semibold tracking-tight text-gray-800">Розыгрыш призов</h1>
          <p className="mt-2 text-sm text-gray-500">Участвуй и выигрывай ценные призы от нашей компании 🎉</p>
        </motion.div>

        <motion.div className="py-8 space-y-4" variants={containerVariants}>
          {/* Диапазон */}
          <motion.div variants={itemVariants} className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1 pl-1">От</label>
              <input
                type="number"
                value={min}
                onChange={e => setMin(e.target.value)}
                placeholder="1"
                className="w-full rounded-[16px] px-4 py-3 text-center text-gray-800 font-semibold text-lg outline-none placeholder:text-gray-300"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(30px)",
                  border: "1px solid rgba(255,255,255,0.6)",
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.9), 0 4px 16px rgba(0,0,0,0.06)",
                }}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1 pl-1">До</label>
              <input
                type="number"
                value={max}
                onChange={e => setMax(e.target.value)}
                placeholder="100"
                className="w-full rounded-[16px] px-4 py-3 text-center text-gray-800 font-semibold text-lg outline-none placeholder:text-gray-300"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(30px)",
                  border: "1px solid rgba(255,255,255,0.6)",
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.9), 0 4px 16px rgba(0,0,0,0.06)",
                }}
              />
            </div>
            <div className="w-20">
              <label className="block text-xs text-gray-500 mb-1 pl-1">Кол-во</label>
              <input
                type="number"
                value={count}
                min={1}
                onChange={e => setCount(e.target.value)}
                placeholder="1"
                className="w-full rounded-[16px] px-2 py-3 text-center text-gray-800 font-semibold text-lg outline-none placeholder:text-gray-300"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(30px)",
                  border: "1px solid rgba(255,255,255,0.6)",
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.9), 0 4px 16px rgba(0,0,0,0.06)",
                }}
              />
            </div>
          </motion.div>

          {/* Без повторов */}
          <motion.div variants={itemVariants}>
            <label
              className="flex items-center gap-3 cursor-pointer rounded-[16px] px-4 py-3 select-none"
              style={{
                background: "rgba(255,255,255,0.45)",
                backdropFilter: "blur(30px)",
                border: "1px solid rgba(255,255,255,0.5)",
                boxShadow: "inset 0 1px 2px rgba(255,255,255,0.9), 0 4px 16px rgba(0,0,0,0.04)",
              }}
            >
              <div
                onClick={() => setNoRepeat(v => !v)}
                className="relative w-10 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
                style={{
                  background: noRepeat ? "linear-gradient(135deg, #7c3aed, #db2777)" : "rgba(0,0,0,0.1)",
                }}
              >
                <div
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                  style={{ left: noRepeat ? "calc(100% - 20px)" : "4px" }}
                />
              </div>
              <span className="text-sm text-gray-700 font-medium">Без повторов</span>
            </label>
          </motion.div>

          {/* До последнего числа */}
          <motion.div variants={itemVariants}>
            <label
              className="flex items-center gap-3 cursor-pointer rounded-[16px] px-4 py-3 select-none"
              style={{
                background: excludeUsed ? "rgba(124,58,237,0.06)" : "rgba(255,255,255,0.45)",
                backdropFilter: "blur(30px)",
                border: excludeUsed ? "1px solid rgba(124,58,237,0.25)" : "1px solid rgba(255,255,255,0.5)",
                boxShadow: "inset 0 1px 2px rgba(255,255,255,0.9), 0 4px 16px rgba(0,0,0,0.04)",
              }}
            >
              <div
                onClick={() => { setExcludeUsed(v => !v); setUsedNumbers(new Set()) }}
                className="relative w-10 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
                style={{
                  background: excludeUsed ? "linear-gradient(135deg, #7c3aed, #db2777)" : "rgba(0,0,0,0.1)",
                }}
              >
                <div
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                  style={{ left: excludeUsed ? "calc(100% - 20px)" : "4px" }}
                />
              </div>
              <div>
                <div className="text-sm text-gray-700 font-medium leading-tight">До последнего числа</div>
                {excludeUsed && usedNumbers.size > 0 && (
                  <div className="text-[11px] text-purple-500 mt-0.5">использовано: {usedNumbers.size}</div>
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
              background: "rgba(255,255,255,0.45)",
              backdropFilter: "blur(40px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.5)",
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.9), 0 8px 32px rgba(0,0,0,0.06)",
              minHeight: 120,
            }}
          >
            <AnimatePresence mode="wait">
              {results.length > 0 ? (
                results.map((num, i) => (
                  <motion.span
                    key={`${num}-${i}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="font-bold text-gray-800 tracking-tight"
                    style={{
                      fontSize: results.length === 1 ? "5rem" : results.length <= 4 ? "3rem" : "1.75rem",
                      fontVariantNumeric: "tabular-nums",
                      lineHeight: 1.1,
                    }}
                  >
                    {num}
                  </motion.span>
                ))
              ) : (
                <motion.span key="placeholder" className="text-3xl text-gray-300 font-light">
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
              background: "rgba(255,255,255,0.45)",
              backdropFilter: "blur(40px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.5)",
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.9), 0 4px 16px rgba(0,0,0,0.06)",
            }}
          >
            <div>
              <div className="text-[11px] text-gray-400 mb-0.5">{dateStr}</div>
              <div className="text-2xl font-bold text-gray-800 tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
                {timeStr}
              </div>
            </div>
            <div
              className="text-xs font-semibold px-3 py-1.5 rounded-full text-gray-600"
              style={{
                background: "rgba(124,58,237,0.08)",
                border: "1px solid rgba(124,58,237,0.15)",
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