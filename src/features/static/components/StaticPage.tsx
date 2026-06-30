export interface StaticSection {
  heading: string;
  body: string | string[];
}

export function StaticPage({
  title,
  subtitle,
  sections,
  lastUpdated,
}: {
  title: string;
  subtitle?: string;
  sections: StaticSection[];
  lastUpdated?: string;
}) {
  return (
    <section className="section">
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          {subtitle && <p className="text-gray-500 text-base">{subtitle}</p>}
          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-3">Last updated: {lastUpdated}</p>
          )}
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.heading}>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">{s.heading}</h2>
              {Array.isArray(s.body) ? (
                <ul className="space-y-2 border-l-2 border-gray-100 pl-4">
                  {s.body.map((item, i) => (
                    <li key={i} className="text-sm text-gray-600 leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
