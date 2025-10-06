#!/bin/bash
# GCP auth
gcloud auth application-default login
gcloud config set project phading-fan-prod

# Create the builder service account
gcloud iam service-accounts create wait-list-ui-builder

# Grant permissions to the builder service account
gcloud projects add-iam-policy-binding phading-fan-prod --member="serviceAccount:wait-list-ui-builder@phading-fan-prod.iam.gserviceaccount.com" --role='roles/cloudbuild.builds.builder' --condition=None
gcloud projects add-iam-policy-binding phading-fan-prod --member="serviceAccount:wait-list-ui-builder@phading-fan-prod.iam.gserviceaccount.com" --role='roles/container.developer' --condition=None
gcloud projects add-iam-policy-binding phading-fan-prod --member="serviceAccount:wait-list-ui-builder@phading-fan-prod.iam.gserviceaccount.com" --role='roles/compute.instanceAdmin.v1' --condition=None

# Create VM instance
gcloud compute instances create wait-list-ui --project=phading-fan-prod --zone=us-central1-c --machine-type=e2-micro --tags=http-server,https-server --image-family=cos-stable --image-project=cos-cloud --metadata-from-file=startup-script=fan_prod/vm_startup_script.sh
