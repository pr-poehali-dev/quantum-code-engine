import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sun, Moon, MessageSquare, Info } from "lucide-react"
import { SocialFooter } from "@/components/SocialFooter"
import { SpinningNumbers } from "@/components/SpinningNumbers"
import { QrBadge } from "@/components/QrBadge"
import { RaffleForm } from "@/components/RaffleForm"
import { buildTheme } from "@/hooks/useTheme"

const socials = [
  { icon: MessageSquare, href: "#", label: "Обратная связь" },
  { icon: Info, href: "#", label: "О нас" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 350, damping: 25 },
  },
}

export function LinkBioPage() {
  const [isDark, setIsDark] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
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

  function handleCreate() {
    setIsCreating(true)
    setTimeout(() => {
      setIsCreating(false)
      setIsReady(true)
    }, 5000)
  }

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

  const theme = buildTheme(isDark)

  return (
    <main className="relative min-h-screen px-6 py-10 flex flex-col overflow-hidden">
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

      <QrBadge
        show={showQr}
        results={results}
        dateStr={dateStr}
        timeStr={timeStr}
        tzLabel={tzLabel}
        onToggle={() => setShowQr(v => !v)}
      />

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

        <RaffleForm
          theme={theme}
          isDark={isDark}
          isReady={isReady}
          isCreating={isCreating}
          min={min}
          max={max}
          count={count}
          excludeUsed={excludeUsed}
          usedNumbers={usedNumbers}
          displayNumbers={displayNumbers}
          rolling={rolling}
          error={error}
          dateStr={dateStr}
          timeStr={timeStr}
          tzLabel={tzLabel}
          onMinChange={setMin}
          onMaxChange={setMax}
          onCountChange={setCount}
          onToggleExclude={() => { setExcludeUsed(v => !v); setUsedNumbers(new Set()) }}
          onCreate={handleCreate}
          onRoll={handleRoll}
        />

        <motion.div variants={itemVariants} className="pb-2">
          <SocialFooter socials={socials} copyright="2025 Розыгрыш призов" />
        </motion.div>
      </motion.div>
    </main>
  )
}
