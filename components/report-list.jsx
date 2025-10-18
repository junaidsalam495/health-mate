"use client"

import Link from "next/link"

export default function ReportList({ reports }) {
  if (reports.length === 0) {
    return (
      <div className="bg-background rounded-lg shadow p-6 text-center text-muted-foreground">
        <p>No reports uploaded yet</p>
        <Link href="/upload-report" className="text-primary hover:underline mt-2 inline-block">
          Upload your first report
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <div key={report._id} className="bg-background rounded-lg shadow p-4 hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-lg">{report.fileName}</h3>
              <p className="text-sm text-muted-foreground">Type: {report.reportType}</p>
              <p className="text-xs text-muted-foreground">{new Date(report.uploadDate).toLocaleDateString()}</p>
              {report.summary && <p className="text-sm mt-2 line-clamp-2">{report.summary}</p>}
            </div>
            <Link
              href={`/report/${report._id}`}
              className="text-primary hover:underline font-medium whitespace-nowrap ml-4"
            >
              View
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
