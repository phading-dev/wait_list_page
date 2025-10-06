import { CLUSTER_ENV_VARS, ClusterEnvVars } from '@phading/cluster/env_vars';

export interface EnvVars extends ClusterEnvVars {
  flavor?: "secount" | "fandazy";
  releaseServiceName?: string;
  port?: number;
  builderAccount?: string;
  serviceAccount?: string;
  vmInstanceZone?: string;
}

export let ENV_VARS: EnvVars = CLUSTER_ENV_VARS;
