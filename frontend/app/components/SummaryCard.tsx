type SummaryCardProps = {
  title: string
  value: number
  subtitle: string
}

export default function SummaryCard({
  title,
  value,
  subtitle,
}: SummaryCardProps) {
  return (
    <article className='ui-card w-full p-5 md:w-65'>
      <h3 className='text-xs font-semibold uppercase tracking-wider text-slate-500'>
        {title}
      </h3>
      <div className='mt-3 text-3xl font-semibold tracking-tight text-slate-900'>
        {value}
      </div>
      <p className='mt-2 text-sm text-slate-600'>{subtitle}</p>
    </article>
  )
}
