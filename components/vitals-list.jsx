"use client"

export default function VitalsList({ vitals }) {
  if (vitals.length === 0) {
    return (
      <div className="bg-background rounded-lg shadow p-6 text-center text-muted-foreground">
        <p>No vitals recorded yet</p>
      </div>
    )
  }

  console.log(vitals,'vitals')

  return (
    <div className="space-y-4">
      {vitals.slice(0, 5).map((vital) => (
        <div key={vital?._id} className="bg-background rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold capitalize">{vital?.type}</h3>
              <p className="text-2xl font-bold text-primary">{vital?.value}</p>
              <p className="text-xs text-muted-foreground">{new Date(vital?.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-3xl">
              {vital?.type === "bp" && "🩺"}
              {vital?.type === "sugar" && "🩸"}
              {vital?.type === "weight" && "⚖️"}
              {vital?.type === "heart-rate" && "💓"}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
