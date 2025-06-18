import { useState } from "react"
import { Button } from "mui-material-custom"
import { t } from "i18next"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next";

export default function Landing() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const { t } = useTranslation();
  
  return (
    <main className="flex flex-col items-center w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[80vh]">
        <picture>
          {/* <source media="(min-width: 768px)" srcSet="../assets/images/health/ModernHealthcare-1580x840-large.jpg" /> */}
          <source media="(min-width: 768px)" srcSet="../assets/images/apple-touch-icon.png" />
          <img
            src="../assets/images/apple-touch-icon.png"
            alt={t("Doctor and patient in a calm clinical setting")}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </picture>
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white max-w-md"
          >
            <h1 className="text-2xl md:text-4xl font-bold mb-4">
              {t("Easily request medicine prescriptions online")}
            </h1>
            <p className="text-sm md:text-base mb-6">
              {t("Designed for patients and caregivers. Currently free during the launch period.")}
            </p>
            <Button size="lg" onClick={() => setShowOnboarding(true)}>
              {t("Register and start now")}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Mid Content / Parallax Section */}
      <section className="relative w-full py-16 px-4 md:px-8 bg-white text-center">
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-xl md:text-3xl font-semibold mb-4">
            {t("Simple, fast and privacy-respecting")}
          </h2>
          <p className="text-gray-700 text-sm md:text-base">
            {t("Fill in the medicines you need once, and request refills effortlessly. You stay in control—data stays on your device.")}
          </p>
        </div>

        <div className="absolute top-0 left-0 w-full h-full z-0 opacity-20 overflow-hidden pointer-events-none">
          <picture>
            <source media="(min-width: 768px)" srcSet="/images/parallax-bg-large.jpg" />
            <img
              src="/images/parallax-bg-small.jpg"
              alt={t("Soft medical background")}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </picture>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="w-full bg-gray-50 px-4 py-10 text-center text-sm md:text-base">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold mb-2">{t("Privacy first")}</h3>
          <p className="text-gray-600">
            {t("We strictly follow European privacy standards (GDPR). Your data never leaves your browser and is never stored on our servers. No external tracking, no compromise.")}
          </p>
        </div>
      </section>

      {/* Optional Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg"
          >
            <h2 className="text-xl font-bold mb-4">{t("Let’s get started")}</h2>
            <p className="text-gray-700 mb-4">{t("Create your first medicine list. We’ll never store anything remotely.")}</p>
            <Button className="w-full mb-2">{t("Create account")}</Button>
            <Button variant="ghost" className="w-full text-gray-500" onClick={() => setShowOnboarding(false)}>
              {t("Maybe later")}
            </Button>
          </motion.div>
        </div>
      )}
    </main>
  )
}
