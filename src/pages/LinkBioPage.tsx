import { useState } from "react"
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

export function LinkBioPage() {
  const [min, setMin] = useState("")
  const [max, setMax] = useState("")
  const [result, setResult] = useState<number | null>(null)
  const [rolling, setRolling] = useState(false)
  const [error, setError] = useState("")

  function handleRoll() {
    const minNum = parseInt(min)
    const maxNum = parseInt(max)
    if (isNaN(minNum) || isNaN(maxNum)) {
      setError("Введи оба числа")
      return
    }
    if (minNum >= maxNum) {
      setError("Минимум должен быть меньше максимума")
      return
    }
    setError("")
    setRolling(true)
    setResult(null)

    let count = 0
    const interval = setInterval(() => {
      setResult(Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum)
      count++
      if (count >= 20) {
        clearInterval(interval)
        setRolling(false)
      }
    }, 60)
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

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 mx-auto max-w-[400px] w-full flex flex-col flex-1 justify-between"
      >
        <motion.div variants={itemVariants} className="pt-2">
          <ProfileSection
            name="Розыгрыш призов"
            bio="Участвуй и выигрывай ценные призы от нашей компании 🎉"
            imageUrl="/images/544291433-18043960274659947-5766591717842883293-n.jpg"
          />
        </motion.div>

        <motion.div className="py-8 space-y-4" variants={containerVariants}>
          {/* Inputs */}
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
          </motion.div>

          {/* Error */}
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm text-red-400">
              {error}
            </motion.p>
          )}

          {/* Result */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center rounded-[20px] py-8"
            style={{
              background: "rgba(255,255,255,0.45)",
              backdropFilter: "blur(40px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.5)",
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.9), 0 8px 32px rgba(0,0,0,0.06)",
              minHeight: 120,
            }}
          >
            <AnimatePresence mode="wait">
              {result !== null ? (
                <motion.span
                  key={result}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-7xl font-bold text-gray-800 tracking-tight"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {result}
                </motion.span>
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
        </motion.div>

        <motion.div variants={itemVariants} className="pb-2">
          <SocialFooter socials={socials} copyright="2025 Розыгрыш призов" />
        </motion.div>
      </motion.div>
    </main>
  )
}