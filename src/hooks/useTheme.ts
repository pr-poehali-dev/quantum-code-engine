export type Theme = {
  bg: string
  inputBg: string
  inputBorder: string
  inputText: string
  inputPlaceholder: string
  cardBg: string
  cardBorder: string
  headingText: string
  subText: string
  labelText: string
  toggleBg: string
  toggleBorder: string
  resultNum: string
  spinnerNum: string
  timeBg: string
  timeBorder: string
  timeText: string
  timeSub: string
}

export function buildTheme(isDark: boolean): Theme {
  return {
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
    timeSub: isDark ? "text-gray-300" : "text-gray-600",
  }
}