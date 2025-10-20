#!/bin/bash

# Simple auto git push script
# Usage: ./gitpush.sh "your commit message"

# Exit if any command fails
set -e

# Check for commit message
if [ -z "$1" ]
then
  echo "❌ Please provide a commit message!"
  echo "Usage: ./gitpush.sh \"your message\""
  exit 1
fi

# Git commands
echo "📦 Adding changes..."
git add .

echo "📝 Committing changes..."
git commit -m "$1"

echo "🚀 Pushing to GitHub..."
git push

echo "✅ Successfully pushed to GitHub!"

