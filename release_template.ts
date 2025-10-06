import { ENV_VARS } from "./env_vars";
import { writeFileSync } from "fs";

export function generate(env: string) {
  let turnupTemplate = `#!/bin/bash
# GCP auth
gcloud auth application-default login
gcloud config set project ${ENV_VARS.projectId}

# Create the builder service account
gcloud iam service-accounts create ${ENV_VARS.builderAccount}

# Grant permissions to the builder service account
gcloud projects add-iam-policy-binding ${ENV_VARS.projectId} --member="serviceAccount:${ENV_VARS.builderAccount}@${ENV_VARS.projectId}.iam.gserviceaccount.com" --role='roles/cloudbuild.builds.builder' --condition=None
gcloud projects add-iam-policy-binding ${ENV_VARS.projectId} --member="serviceAccount:${ENV_VARS.builderAccount}@${ENV_VARS.projectId}.iam.gserviceaccount.com" --role='roles/container.developer' --condition=None
`;
  writeFileSync(`${env}/turnup.sh`, turnupTemplate);

  let frontendMainTemplate = `import "./env";
import "../frontend/main";
`;
  writeFileSync(`${env}/frontend_main.ts`, frontendMainTemplate);

  let backendMainTemplate = `import "./env";
import "../backend/main";
`;
  writeFileSync(`${env}/backend_main.ts`, backendMainTemplate);

  let webAppEntriesTemplate = `entries:
  - source: ./frontend_main
    output: ./index
`;
  writeFileSync(`${env}/web_app_entries.yaml`, webAppEntriesTemplate);

  // TODO: Add steps to deploy to GCE
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

EXPOSE ${ENV_VARS.port}
CMD ["node", "main_bin", "."]
`;
  writeFileSync(`${env}/Dockerfile`, dockerTemplate);
}

import "./prod/env";
generate("prod");

import "./fan_prod/env";
generate("fan_prod");
