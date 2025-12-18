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
      'bg-card/50 border-border backdrop-blur-sm shadow-lg',
      className
    )}>
      <Shield className="w-5 h-5 text-primary" />
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Security Score:</span>
        <span className={cn('text-lg font-bold', getScoreColor(score))}>
          {score}%
        </span>
        {getScoreIcon(score)}
      </div>
      <span className="text-xs text-foreground bg-secondary/50 px-2 py-1 rounded border border-border">
        {getScoreLabel(score)}
      </span>
    </div>
  )
}
