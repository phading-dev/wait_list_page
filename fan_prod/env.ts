import "@phading/cluster/fan_prod/env";
import "../env_const";
import { ENV_VARS } from "../env_vars";

ENV_VARS.flavor = "fandazy";
ENV_VARS.replicas = 2;
ENV_VARS.cpu = "150m";
ENV_VARS.memory = "256Mi";
