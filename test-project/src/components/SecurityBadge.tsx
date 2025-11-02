import { Shield, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { cn } from '../lib/utils'

interface SecurityBadgeProps {
  score?: number
  className?: string
}

export function SecurityBadge({ score = 95, className }: SecurityBadgeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500'
    if (score >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="w-5 h-5 text-green-500" />
    if (score >= 70) return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    return <XCircle className="w-5 h-5 text-red-500" />
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent'
    if (score >= 70) return 'Good'
    return 'Needs Attention'
  }

  return (
    <div className={cn(
      'inline-flex items-center gap-3 px-4 py-2 rounded-lg border',
      'bg-slate-900/50 border-slate-700 backdrop-blur-sm',
      className
    )}>
      <Shield className="w-5 h-5 text-blue-400" />
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-300">Security Score:</span>
        <span className={cn('text-lg font-bold', getScoreColor(score))}>
          {score}%
        </span>
        {getScoreIcon(score)}
      </div>
      <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
        {getScoreLabel(score)}
      </span>
    </div>
  )
}
