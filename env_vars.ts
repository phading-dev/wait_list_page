import { CLUSTER_ENV_VARS, ClusterEnvVars } from '@phading/cluster/env_vars';

export interface EnvVars extends ClusterEnvVars {
  flavor?: "secount" | "fandazy";
  sslPrivateKeyFile?: string;
  sslCertificateFile?: string;
  creatorContactEmail?: string;
  fanContactEmail?: string;
  adminEmails?: string[];
  releaseServiceName?: string;
  httpPort?: number;
  httpsPort?: number;
  builderAccount?: string;
  serviceAccount?: string;
  vmInstanceZone?: string;
  ipAddressName?: string;
}

export let ENV_VARS: EnvVars = CLUSTER_ENV_VARS;
