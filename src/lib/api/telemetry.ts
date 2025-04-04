/**
 * Telemetry helper for tracking API usage metrics
 * This will be expanded to integrate with Grafana in the future
 */

// Declare global types for telemetry storage
declare global {
  var apiTelemetry: any[];
  var llmUsage: any[];
}

// Initialize global storage if needed
if (typeof global.apiTelemetry === 'undefined') {
  global.apiTelemetry = [];
}

if (typeof global.llmUsage === 'undefined') {
  global.llmUsage = [];
}

/**
 * Record LLM usage for monitoring and cost tracking
 */
export function recordLLMUsage(path: string, model: string, promptTokens: number, completionTokens: number, cost: number) {
  // Create LLM usage record
  const llmUsage = {
    timestamp: new Date().toISOString(),
    path,
    model,
    promptTokens,
    completionTokens,
    totalTokens: promptTokens + completionTokens,
    cost,
  };
  
  // TODO: In future implementation, send to Grafana or other monitoring system
  if (process.env.NODE_ENV === 'development') {
    console.log('[LLM Usage]', JSON.stringify(llmUsage));
  }
  
  // Store in memory temporarily
  global.llmUsage.push(llmUsage);
}

/**
 * Get all LLM usage records (for development/debugging)
 */
export function getLLMUsage() {
  return global.llmUsage || [];
}

/**
 * Get all API telemetry records (for development/debugging)
 */
export function getAPITelemetry() {
  return global.apiTelemetry || [];
}

/**
 * Clear telemetry data (for testing/development)
 */
export function clearTelemetry() {
  global.apiTelemetry = [];
  global.llmUsage = [];
  return { success: true };
}

/**
 * Get summary metrics for Grafana integration
 */
export function getTelemetrySummary() {
  // Calculate API request metrics
  const apiRequests = global.apiTelemetry || [];
  const totalRequests = apiRequests.length;
  
  // Group by path
  const pathCounts: Record<string, number> = {};
  const statusCounts: Record<string, number> = {};
  
  apiRequests.forEach((req: any) => {
    const path = req.path;
    const status = req.responseStatus;
    
    pathCounts[path] = (pathCounts[path] || 0) + 1;
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  
  // Calculate LLM usage metrics
  const llmRecords = global.llmUsage || [];
  const totalLLMRequests = llmRecords.length;
  let totalPromptTokens = 0;
  let totalCompletionTokens = 0;
  let totalCost = 0;
  
  // Group by model
  const modelCounts: Record<string, number> = {};
  const modelTokens: Record<string, number> = {};
  const modelCosts: Record<string, number> = {};
  
  llmRecords.forEach((usage: any) => {
    const model = usage.model;
    const promptTokens = usage.promptTokens || 0;
    const completionTokens = usage.completionTokens || 0;
    const cost = usage.cost || 0;
    
    totalPromptTokens += promptTokens;
    totalCompletionTokens += completionTokens;
    totalCost += cost;
    
    modelCounts[model] = (modelCounts[model] || 0) + 1;
    modelTokens[model] = (modelTokens[model] || 0) + promptTokens + completionTokens;
    modelCosts[model] = (modelCosts[model] || 0) + cost;
  });
  
  return {
    api: {
      totalRequests,
      pathCounts,
      statusCounts,
    },
    llm: {
      totalRequests: totalLLMRequests,
      totalPromptTokens,
      totalCompletionTokens,
      totalTokens: totalPromptTokens + totalCompletionTokens,
      totalCost,
      modelCounts,
      modelTokens,
      modelCosts,
    },
    generatedAt: new Date().toISOString(),
  };
} 