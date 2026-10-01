/**
 * Logger utility for the company dashboard
 * Controls logging based on DEBUG_LOGS and LOG_LEVEL environment variables
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Default to 'info' if LOG_LEVEL is not set
const currentLogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
const debugLogsEnabled = process.env.DEBUG_LOGS === 'true';

// Colorized log output
const colors = {
  debug: '\x1b[36m', // Cyan
  info: '\x1b[32m',  // Green
  warn: '\x1b[33m',  // Yellow
  error: '\x1b[31m', // Red
  reset: '\x1b[0m',  // Reset
};

/**
 * Format log message with timestamp, level, and module
 */
function formatMessage(level: LogLevel, module: string, message: string): string {
  const timestamp = new Date().toISOString();
  return `${timestamp} [${level.toUpperCase()}] [${module}]: ${message}`;
}

/**
 * Check if the given log level should be displayed
 */
function shouldLog(level: LogLevel): boolean {
  // If debug logs are disabled, don't log anything
  if (!debugLogsEnabled) return false;
  
  // Otherwise, check the log level
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLogLevel];
}

/**
 * Creates a logger for a specific module
 */
export function createLogger(module: string) {
  return {
    debug: (message: string, data?: any) => {
      if (shouldLog('debug')) {
        console.debug(
          colors.debug + 
          formatMessage('debug', module, message) + 
          (data ? '\n' + JSON.stringify(data, null, 2) : '') + 
          colors.reset
        );
      }
    },
    
    info: (message: string, data?: any) => {
      if (shouldLog('info')) {
        console.info(
          colors.info + 
          formatMessage('info', module, message) + 
          (data ? '\n' + JSON.stringify(data, null, 2) : '') + 
          colors.reset
        );
      }
    },
    
    warn: (message: string, data?: any) => {
      if (shouldLog('warn')) {
        console.warn(
          colors.warn + 
          formatMessage('warn', module, message) + 
          (data ? '\n' + JSON.stringify(data, null, 2) : '') + 
          colors.reset
        );
      }
    },
    
    error: (message: string, error?: any) => {
      if (shouldLog('error')) {
        console.error(
          colors.error + 
          formatMessage('error', module, message) + 
          colors.reset
        );
        
        if (error) {
          if (error instanceof Error) {
            console.error(colors.error + error.stack + colors.reset);
          } else {
            console.error(colors.error + JSON.stringify(error, null, 2) + colors.reset);
          }
        }
      }
    },
    
    // To log performance metrics
    time: (label: string) => {
      if (shouldLog('debug')) {
        console.time(`[${module}] ${label}`);
      }
    },
    
    timeEnd: (label: string) => {
      if (shouldLog('debug')) {
        console.timeEnd(`[${module}] ${label}`);
      }
    },
  };
}

// Default logger
export const logger = createLogger('app');

// Export utility types
export type Logger = ReturnType<typeof createLogger>;

// Simple log function for use in components
export function log(message: string, data?: any) {
  logger.info(message, data);
} 