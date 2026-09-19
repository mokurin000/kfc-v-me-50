#!/usr/bin/env bash

set -euo pipefail

command -v curl >/dev/null || {
    echo "Error: curl is required"
    exit 1
}

command -v jq >/dev/null || {
    echo "Error: jq is required"
    exit 1
}

command -v npx >/dev/null || {
    echo "Error: npx is required"
    exit 1
}

read -rsp "Telegram Bot Token: " BOT_TOKEN
echo

if [[ -z "$BOT_TOKEN" ]]; then
    echo "Error: Bot Token cannot be empty"
    exit 1
fi

echo "Checking Telegram bot..."

ME_RESPONSE="$(
    curl -fsS \
        "https://api.telegram.org/bot${BOT_TOKEN}/getMe"
)"

if [[ "$(jq -r '.ok' <<< "$ME_RESPONSE")" != "true" ]]; then
    echo "Error: invalid bot token"
    exit 1
fi

BOT_USERNAME="$(
    jq -r '.result.username // empty' <<< "$ME_RESPONSE"
)"

if [[ -z "$BOT_USERNAME" ]]; then
    echo "Error: failed to get bot username"
    exit 1
fi

echo "Bot: @${BOT_USERNAME}"

echo "Deploying Worker..."

DEPLOY_OUTPUT="$(
    npx wrangler deploy 2>&1
)"

printf '%s\n' "$DEPLOY_OUTPUT"

WORKER_URL="$(
    printf '%s\n' "$DEPLOY_OUTPUT" |
        grep -Eo 'https://[^[:space:]]+\.workers\.dev/?' |
        head -n 1
)"

if [[ -z "$WORKER_URL" ]]; then
    echo "Error: failed to determine Worker URL"
    exit 1
fi

WORKER_URL="${WORKER_URL%/}"

echo
echo "Putting BOT_TOKEN secret..."

printf '%s' "$BOT_TOKEN" |
    npx wrangler secret put BOT_TOKEN

echo
echo "Worker URL: $WORKER_URL"
echo "Setting Telegram webhook..."

WEBHOOK_RESPONSE="$(
    curl -fsS \
        -X POST \
        --data-urlencode "url=${WORKER_URL}" \
        "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook"
)"

if [[ "$(jq -r '.ok' <<< "$WEBHOOK_RESPONSE")" != "true" ]]; then
    echo "Error: failed to set Telegram webhook"
    jq . <<< "$WEBHOOK_RESPONSE" >&2
    exit 1
fi

echo
echo "Done."
echo "Bot:     @${BOT_USERNAME}"
echo "Webhook: ${WORKER_URL}"
