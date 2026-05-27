import type { RawFeedItem, WorkflowConfig } from "@omo/shared-types";

export interface FetchOptions {
  limit?: number;
  mock?: boolean;
  connectorConfig?: Record<string, unknown>;
}

export interface FeedConnector {
  readonly id: string;
  fetch(options: FetchOptions): Promise<RawFeedItem[]>;
}

export type ConnectorFactory = (
  config?: Record<string, unknown>,
) => FeedConnector;

export function resolveConnectorsFromWorkflow(
  workflow: WorkflowConfig,
): Array<{ id: string; config?: Record<string, unknown> }> {
  return workflow.feed.connectors;
}
