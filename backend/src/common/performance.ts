/**
 * 性能监控工具
 */

export class PerformanceMonitor {
  private static timers = new Map<string, number>()
  private static metrics = new Map<string, number[]>()

  /**
   * 开始计时
   */
  static startTimer(label: string): void {
    this.timers.set(label, Date.now())
  }

  /**
   * 结束计时并记录
   */
  static endTimer(label: string): number {
    const startTime = this.timers.get(label)
    if (!startTime) {
      console.warn(`Timer '${label}' was not started`)
      return 0
    }

    const duration = Date.now() - startTime
    this.timers.delete(label)

    // 记录到指标中
    if (!this.metrics.has(label)) {
      this.metrics.set(label, [])
    }
    this.metrics.get(label)!.push(duration)

    console.log(`⏱️  ${label}: ${duration}ms`)
    return duration
  }

  /**
   * 获取性能统计
   */
  static getStats(
    label: string
  ): { avg: number; min: number; max: number; count: number } | null {
    const values = this.metrics.get(label)
    if (!values || values.length === 0) {
      return null
    }

    return {
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length
    }
  }

  /**
   * 清理指标
   */
  static clearMetrics(label?: string): void {
    if (label) {
      this.metrics.delete(label)
    } else {
      this.metrics.clear()
    }
  }

  /**
   * 获取所有指标
   */
  static getAllStats(): Record<string, any> {
    const stats: Record<string, any> = {}
    for (const [label] of this.metrics) {
      stats[label] = this.getStats(label)
    }
    return stats
  }
}

/**
 * 装饰器：自动监控方法执行时间
 */
export function Monitor(label?: string) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value
    const monitorLabel = label || `${target.constructor.name}.${propertyName}`

    descriptor.value = async function (...args: any[]) {
      PerformanceMonitor.startTimer(monitorLabel)
      try {
        const result = await method.apply(this, args)
        return result
      } finally {
        PerformanceMonitor.endTimer(monitorLabel)
      }
    }
  }
}

/**
 * 内存使用监控
 */
export class MemoryMonitor {
  static logMemoryUsage(label: string): void {
    const usage = process.memoryUsage()
    console.log(`🧠 Memory Usage [${label}]:`, {
      rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(usage.external / 1024 / 1024)}MB`
    })
  }
}
