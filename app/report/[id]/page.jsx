"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

export default function ReportPage() {
  const router = useRouter()
  const params = useParams()
  const reportId = params.id

  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1]

    if (!token) {
      router.push("/login")
      return
    }

    fetchReport(token)
  }, [router, reportId])

  const fetchReport = async (token) => {
    try {
      const res = await fetch(`/api/reports/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        setReport(await res.json())
      }
    } catch (err) {
      console.error("Error fetching report:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-muted p-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/dashboard" className="text-primary hover:underline mb-6 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="bg-background rounded-lg shadow-lg p-8 text-center">
            <p className="text-muted-foreground">Report not found</p>
          </div>
        </div>
      </div>
    )
  }

  const analysis = report.analysis

  return (
    <div className="min-h-screen bg-muted p-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="text-primary hover:underline mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="bg-background rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">{report.fileName}</h1>
              <p className="text-muted-foreground">Type: {report.reportType}</p>
              <p className="text-sm text-muted-foreground">{new Date(report.uploadDate).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage("en")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  language === "en" ? "bg-primary text-black" : "bg-muted text-foreground hover:bg-border"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("urdu")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  language === "urdu" ? "bg-primary text-black" : "bg-muted text-foreground hover:bg-border"
                }`}
              >
                اردو
              </button>
            </div>
          </div>

          {analysis ? (
            <div className="space-y-8">
              <div className="bg-muted p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-3">{language === "en" ? "Summary" : "خلاصہ"}</h2>
                <p className="text-foreground leading-relaxed">
                  {language === "en" ? analysis.summary_en : analysis.summary_urdu}
                </p>
              </div>

              {analysis.abnormal_values && analysis.abnormal_values.length > 0 && (
                <div className="bg-destructive/10 p-6 rounded-lg border border-destructive/20">
                  <h2 className="text-xl font-bold mb-3 text-destructive">
                    {language === "en" ? "Abnormal Values" : "غیر معمولی اقدار"}
                  </h2>
                  <ul className="space-y-2">
                    {analysis.abnormal_values.map((value, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-destructive font-bold">•</span>
                        <span>{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.doctor_questions && analysis.doctor_questions.length > 0 && (
                <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
                  <h2 className="text-xl font-bold mb-3 text-primary">
                    {language === "en" ? "Questions for Your Doctor" : "ڈاکٹر سے سوالات"}
                  </h2>
                  <ul className="space-y-2">
                    {analysis.doctor_questions.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary font-bold">{idx + 1}.</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analysis.foods_to_avoid && analysis.foods_to_avoid.length > 0 && (
                  <div className="bg-accent/10 p-6 rounded-lg border border-accent/20">
                    <h3 className="font-bold mb-3 text-accent">
                      {language === "en" ? "Foods to Avoid" : "بچنے والی غذائیں"}
                    </h3>
                    <ul className="space-y-2">
                      {analysis.foods_to_avoid.map((food, idx) => (
                        <li key={idx} className="text-sm">
                          • {food}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.recommended_foods && analysis.recommended_foods.length > 0 && (
                  <div className="bg-accent/10 p-6 rounded-lg border border-accent/20">
                    <h3 className="font-bold mb-3 text-accent">
                      {language === "en" ? "Recommended Foods" : "تجویز کردہ غذائیں"}
                    </h3>
                    <ul className="space-y-2">
                      {analysis.recommended_foods.map((food, idx) => (
                        <li key={idx} className="text-sm">
                          • {food}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {analysis.home_remedies && analysis.home_remedies.length > 0 && (
                <div className="bg-secondary/10 p-6 rounded-lg border border-secondary/20">
                  <h3 className="font-bold mb-3 text-secondary">
                    {language === "en" ? "Home Remedies" : "گھریلو علاج"}
                  </h3>
                  <ul className="space-y-2">
                    {analysis.home_remedies.map((remedy, idx) => (
                      <li key={idx} className="text-sm">
                        • {remedy}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-yellow-50 dark:bg-yellow-950 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-900 dark:text-yellow-100">
                  <strong>Disclaimer:</strong> {analysis.disclaimer}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-muted p-6 rounded-lg text-center">
              <p className="text-muted-foreground">AI analysis is being processed. Please check back soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
