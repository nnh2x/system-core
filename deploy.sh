#!/bin/bash
set -e

DOCKERHUB_USER="huy9983123203"
TAG=${1:-latest}   # dùng argument đầu tiên làm tag, mặc định là "latest"

echo "🔨 Building images with tag: $TAG"
docker build -t $DOCKERHUB_USER/system-core-backend:$TAG ./backend
docker build -t $DOCKERHUB_USER/system-core-frontend:$TAG ./frontend

# Also tag as latest if a specific version was given
if [ "$TAG" != "latest" ]; then
  docker tag $DOCKERHUB_USER/system-core-backend:$TAG $DOCKERHUB_USER/system-core-backend:latest
  docker tag $DOCKERHUB_USER/system-core-frontend:$TAG $DOCKERHUB_USER/system-core-frontend:latest
fi

echo "🚀 Pushing to Docker Hub..."
docker push $DOCKERHUB_USER/system-core-backend:$TAG
docker push $DOCKERHUB_USER/system-core-frontend:$TAG

if [ "$TAG" != "latest" ]; then
  docker push $DOCKERHUB_USER/system-core-backend:latest
  docker push $DOCKERHUB_USER/system-core-frontend:latest
fi

echo "✅ Done! Images pushed:"
echo "   - $DOCKERHUB_USER/system-core-backend:$TAG"
echo "   - $DOCKERHUB_USER/system-core-frontend:$TAG"
