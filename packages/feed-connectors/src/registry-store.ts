import type { ConnectorFactory } from "./connector.js";
import { indeedConnector } from "./connectors/indeed.js";
import { careerPageConnector } from "./connectors/career-page.js";
import { linkedinJobsConnector } from "./connectors/linkedin-jobs.js";

const registry = new Map<string, ConnectorFactory>();

registerConnector("indeed", indeedConnector);
registerConnector("career_page", careerPageConnector);
registerConnector("linkedin_jobs", linkedinJobsConnector);

export function registerConnector(id: string, factory: ConnectorFactory): void {
  registry.set(id, factory);
}

export function getConnector(id: string, config?: Record<string, unknown>) {
  const factory = registry.get(id);
  return factory ? factory(config) : undefined;
}

export function listConnectors(): string[] {
  return [...registry.keys()];
}
