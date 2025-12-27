/**
 * Health check API for production monitoring
 * Verify detector is working correctly and get system status
 */

import type { OpenRedaction } from '../detector';

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    detector: HealthCheckStatus;
    patterns: HealthCheckStatus;
    performance: HealthCheckStatus;
    memory: HealthCheckStatus;
  };
  metrics: {
    totalPatterns: number;
    compiledPatterns: number;
    cacheSize?: number;
    cacheEnabled: boolean;
    uptime: number; // milliseconds since initialization
  };
  errors: string[];
  warnings: string[];
}

export interface HealthCheckStatus {
  status: 'pass' | 'warn' | 'fail';
  message: string;
  value?: any;
  threshold?: any;
}

export interface HealthCheckOptions {
  testDetection?: boolean; // Run a test detection
  checkPerformance?: boolean; // Run performance benchmark
  performanceThreshold?: number; // Max acceptable detection time (ms)
  memoryThreshold?: number; // Max acceptable memory usage (MB)
}

export class HealthChecker {
  private detector: OpenRedaction;
  private initTime: number;

  constructor(detector: OpenRedaction) {
    this.detector = detector;
    this.initTime = Date.now();
  }

  /**
   * Run complete health check
   */
  async check(options: HealthCheckOptions = {}): Promise<HealthCheckResult> {
    const result: HealthCheckResult = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        detector: { status: 'pass', message: 'Detector initialized' },
        patterns: { status: 'pass', message: 'Patterns loaded' },
        performance: { status: 'pass', message: 'Performance acceptable' },
        memory: { status: 'pass', message: 'Memory usage normal' }
      },
      metrics: {
        totalPatterns: 0,
        compiledPatterns: 0,
        cacheEnabled: false,
        uptime: Date.now() - this.initTime
      },
      errors: [],
      warnings: []
    };

    try {
      // Check 1: Detector status
      result.checks.detector = await this.checkDetector(options);

      // Check 2: Patterns status
      result.checks.patterns = await this.checkPatterns();

      // Check 3: Performance
      if (options.checkPerformance !== false) {
        result.checks.performance = await this.checkPerformance(
          options.performanceThreshold
        );
      }

      // Check 4: Memory
      result.checks.memory = await this.checkMemory(options.memoryThreshold);

      // Collect metrics
      result.metrics = this.collectMetrics();

      // Determine overall status
      result.status = this.determineOverallStatus(result.checks);

      // Collect errors and warnings
      for (const check of Object.values(result.checks)) {
        if (check.status === 'fail') {
          result.errors.push(check.message);
        } else if (check.status === 'warn') {
          result.warnings.push(check.message);
        }
      }
    } catch (error) {
      result.status = 'unhealthy';
      result.errors.push(`Health check failed: ${(error as Error).message}`);
    }

    return result;
  }

  /**
   * Check detector functionality
   */
  private async checkDetector(options: HealthCheckOptions): Promise<HealthCheckStatus> {
    try {
      // Run test detection if enabled
      if (options.testDetection !== false) {
        const testText = 'Test email: test@example.com';
        const result = await this.detector.detect(testText);

        if (!result || !result.detections) {
          return {
            status: 'fail',
            message: 'Detector returned invalid result'
          };
        }

        // Verify detection worked
        if (result.detections.length === 0) {
          return {
            status: 'warn',
            message: 'Test detection found no PII (expected at least 1)'
          };
        }
      }

      return {
        status: 'pass',
        message: 'Detector functioning correctly'
      };
    } catch (error) {
      return {
        status: 'fail',
        message: `Detector check failed: ${(error as Error).message}`
      };
    }
  }

  /**
   * Check patterns are loaded
   */
  private async checkPatterns(): Promise<HealthCheckStatus> {
    try {
      const patterns = this.detector.getPatterns();

      if (!patterns || patterns.length === 0) {
        return {
          status: 'fail',
          message: 'No patterns loaded',
          value: 0,
          threshold: 1
        };
      }

      if (patterns.length < 10) {
        return {
          status: 'warn',
          message: 'Very few patterns loaded (expected more)',
          value: patterns.length,
          threshold: 10
        };
      }

      return {
        status: 'pass',
        message: `${patterns.length} patterns loaded`,
        value: patterns.length
      };
    } catch (error) {
      return {
        status: 'fail',
        message: `Pattern check failed: ${(error as Error).message}`
      };
    }
  }

  /**
   * Check performance
   */
  private async checkPerformance(
    threshold: number = 100
  ): Promise<HealthCheckStatus> {
    try {
      const testText = 'Test: john@example.com, phone: 555-123-4567, IP: 192.168.1.1';
      const start = performance.now();
      await this.detector.detect(testText);
      const duration = performance.now() - start;

      if (duration > threshold * 2) {
        return {
          status: 'fail',
          message: `Performance degraded: ${duration.toFixed(2)}ms`,
          value: duration,
          threshold
        };
      }

      if (duration > threshold) {
        return {
          status: 'warn',
          message: `Performance slower than expected: ${duration.toFixed(2)}ms`,
          value: duration,
          threshold
        };
      }

      return {
        status: 'pass',
        message: `Performance good: ${duration.toFixed(2)}ms`,
        value: duration,
        threshold
      };
    } catch (error) {
      return {
        status: 'fail',
        message: `Performance check failed: ${(error as Error).message}`
      };
    }
  }

  /**
   * Check memory usage
   */
  private async checkMemory(threshold: number = 100): Promise<HealthCheckStatus> {
    try {
      if (typeof process === 'undefined' || !process.memoryUsage) {
        return {
          status: 'pass',
          message: 'Memory check skipped (not in Node.js)'
        };
      }

      const usage = process.memoryUsage();
      const heapUsedMB = usage.heapUsed / 1024 / 1024;

      if (heapUsedMB > threshold * 2) {
        return {
          status: 'fail',
          message: `High memory usage: ${heapUsedMB.toFixed(2)}MB`,
          value: heapUsedMB,
          threshold
        };
      }

      if (heapUsedMB > threshold) {
        return {
          status: 'warn',
          message: `Elevated memory usage: ${heapUsedMB.toFixed(2)}MB`,
          value: heapUsedMB,
          threshold
        };
      }

      return {
        status: 'pass',
        message: `Memory usage normal: ${heapUsedMB.toFixed(2)}MB`,
        value: heapUsedMB,
        threshold
      };
    } catch (error) {
      return {
        status: 'warn',
        message: `Memory check skipped: ${(error as Error).message}`
      };
    }
  }

  /**
   * Collect metrics
   */
  private collectMetrics() {
    const patterns = this.detector.getPatterns();
    const cacheStats = this.detector.getCacheStats();

    return {
      totalPatterns: patterns.length,
      compiledPatterns: patterns.length, // All patterns are pre-compiled
      cacheSize: cacheStats.size,
      cacheEnabled: cacheStats.enabled,
      uptime: Date.now() - this.initTime
    };
  }

  /**
   * Determine overall status
   */
  private determineOverallStatus(checks: HealthCheckResult['checks']): 'healthy' | 'degraded' | 'unhealthy' {
    const statuses = Object.values(checks).map(c => c.status);

    if (statuses.includes('fail')) {
      return 'unhealthy';
    }

    if (statuses.includes('warn')) {
      return 'degraded';
    }

    return 'healthy';
  }

  /**
   * Quick health check (minimal overhead)
   */
  async quickCheck(): Promise<{ status: 'healthy' | 'unhealthy'; message: string }> {
    try {
      // Just verify basic functionality
      const patterns = this.detector.getPatterns();
      if (patterns.length === 0) {
        return { status: 'unhealthy', message: 'No patterns loaded' };
      }

      return { status: 'healthy', message: 'OK' };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Error: ${(error as Error).message}`
      };
    }
  }

  /**
   * Get system info for debugging
   */
  getSystemInfo() {
    const patterns = this.detector.getPatterns();
    const cacheStats = this.detector.getCacheStats();

    return {
      version: '1.0.0', // Should come from package.json
      patterns: {
        total: patterns.length,
        types: [...new Set(patterns.map(p => p.type.split('_')[0]))].length
      },
      cache: {
        enabled: cacheStats.enabled,
        size: cacheStats.size,
        maxSize: cacheStats.maxSize
      },
      uptime: Date.now() - this.initTime,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Create health checker for a detector
 */
export function createHealthChecker(detector: OpenRedaction): HealthChecker {
  return new HealthChecker(detector);
}

/**
 * Express middleware for health check endpoint
 */
export function healthCheckMiddleware(detector: OpenRedaction) {
  const checker = new HealthChecker(detector);

  return async (_req: any, res: any) => {
    try {
      const result = await checker.check({
        testDetection: true,
        checkPerformance: true,
        performanceThreshold: 100,
        memoryThreshold: 100
      });

      const statusCode = result.status === 'healthy' ? 200 :
                         result.status === 'degraded' ? 200 : 503;

      res.status(statusCode).json(result);
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: (error as Error).message
      });
    }
  };
}
