import { ENV_VARS } from "./env_vars";
import { writeFileSync } from "fs";

export function generate(env: string) {
  let frontendMainTemplate = `import "./env";
import "../frontend/main";
`;
  writeFileSync(`${env}/frontend_main.ts`, frontendMainTemplate);

  let backendMainTemplate = `import "./env";
import "../backend/main";
`;
  writeFileSync(`${env}/backend_main.ts`, backendMainTemplate);

  let webAppEntriesTemplate = `entries:
  - source: ${env}/frontend_main
    output: index
`;
  writeFileSync(`${env}/web_app_entries.yaml`, webAppEntriesTemplate);

  let cloudbuildTemplate = `steps:
- name: 'node:20.12.1'
  entrypoint: 'npm'
  args: ['ci']
- name: 'node:20.12.1'
  entrypoint: npx
  args: ['bundage', 'bwa', '-ec', '${env}/web_app_entries.yaml', '-o', 'bin']
- name: node:20.12.1
  entrypoint: npx
  args: ['bundage', 'bfn', '${env}/backend_main', 'main_bin', '-t', 'bin']
- name: 'gcr.io/cloud-builders/docker'
  args: ['build', '-t', 'gcr.io/${ENV_VARS.projectId}/${ENV_VARS.releaseServiceName}:latest', '-f', '${env}/Dockerfile', '.']
- name: "gcr.io/cloud-builders/docker"
  args: ['push', 'gcr.io/${ENV_VARS.projectId}/${ENV_VARS.releaseServiceName}:latest']
- name: 'gcr.io/cloud-builders/gcloud'
  args: ['compute', 'instances', 'stop', '${ENV_VARS.releaseServiceName}', '--zone', '${ENV_VARS.vmInstanceZone}']
- name: 'gcr.io/cloud-builders/gcloud'
  args: ['compute', 'instances', 'start', '${ENV_VARS.releaseServiceName}', '--zone', '${ENV_VARS.vmInstanceZone}']
options:
  logging: CLOUD_LOGGING_ONLY
`;
  writeFileSync(`${env}/cloudbuild.yaml`, cloudbuildTemplate);

  let dockerTemplate = `FROM node:20.12.1

WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY bin/ .
RUN npm ci --omit=dev

EXPOSE ${ENV_VARS.httpPort} ${ENV_VARS.httpsPort}
CMD ["node", "main_bin", "."]
`;
  writeFileSync(`${env}/Dockerfile`, dockerTemplate);

  let turnupTemplate = `#!/bin/bash
# GCP auth
gcloud auth application-default login
gcloud config set project ${ENV_VARS.projectId}

# Create the builder service account
gcloud iam service-accounts create ${ENV_VARS.builderAccount}

# Grant permissions to the builder service account
gcloud projects add-iam-policy-binding ${ENV_VARS.projectId} --member="serviceAccount:${ENV_VARS.builderAccount}@${ENV_VARS.projectId}.iam.gserviceaccount.com" --role='roles/cloudbuild.builds.builder' --condition=None
gcloud projects add-iam-policy-binding ${ENV_VARS.projectId} --member="serviceAccount:${ENV_VARS.builderAccount}@${ENV_VARS.projectId}.iam.gserviceaccount.com" --role='roles/container.developer' --condition=None
gcloud projects add-iam-policy-binding ${ENV_VARS.projectId} --member="serviceAccount:${ENV_VARS.builderAccount}@${ENV_VARS.projectId}.iam.gserviceaccount.com" --role='roles/compute.instanceAdmin.v1' --condition=None

# Create VM instance
gcloud compute instances create ${ENV_VARS.releaseServiceName} --project=${ENV_VARS.projectId} --zone=${ENV_VARS.vmInstanceZone} --machine-type=e2-micro --tags=http-server,https-server --image-family=cos-stable --image-project=cos-cloud --metadata-from-file=startup-script=${env}/vm_startup_script.sh
`;
  writeFileSync(`${env}/turnup.sh`, turnupTemplate);

  let startupScriptTemplate = `#!/bin/bash

# Enable all incoming and routed traffic
iptables -A INPUT -j ACCEPT
iptables -A FORWARD -j ACCEPT

# Set home directory to save docker credentials
export HOME=/home/appuser

# Configure docker with credentials for gcr.io and pkg.dev
docker-credential-gcr configure-docker

# A name for the container
CONTAINER_NAME="my-app-container"

# Stop and remove the container if it exists
docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true

# Pull the latest version of the container image
docker pull gcr.io/${ENV_VARS.projectId}/${ENV_VARS.releaseServiceName}:latest

# Run docker container from image in docker hub
docker run \
  --name=$CONTAINER_NAME \
  --privileged \
  --restart=always \
  --tty \
  --detach \
  --network="host" \
  --log-driver=gcplogs \
  gcr.io/${ENV_VARS.projectId}/${ENV_VARS.releaseServiceName}:latest
`;
  writeFileSync(`${env}/vm_startup_script.sh`, startupScriptTemplate);
}

import "./prod/env";
generate("prod");

import "./fan_prod/env";
generate("fan_prod");
