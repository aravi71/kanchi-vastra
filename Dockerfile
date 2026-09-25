# syntax=docker/dockerfile:1.7
#
# Kanchi Vastra storefront image.
#
# Three stages so the final image carries only what `node server.js` needs:
# no dev dependencies, no source, no build cache, and no secrets. The app's
# settings file is mounted as a BuildKit secret during `next build` only
# (NEXT_PUBLIC_* values are baked into the browser bundle at build time) and
# is never written into a layer. At run time the same settings arrive from
# compose's env_file.
#
#   docker build --secret id=appenv,src=/srv/kanchi-vastra/shared/app.env -t kanchi-vastra:dev .

ARG NODE_IMAGE=node:24-bookworm-slim

# --- 1. dependencies -------------------------------------------------------
FROM ${NODE_IMAGE} AS deps
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma
# postinstall runs `prisma generate`, which loads prisma.config.ts and so
# needs DIRECT_URL to be set. Generating never connects, so a placeholder is
# enough and keeps real credentials out of this stage.
RUN --mount=type=cache,target=/root/.npm \
    DIRECT_URL=postgresql://build:build@localhost:5432/build \
    npm ci --no-audit --no-fund

# --- 2. build --------------------------------------------------------------
FROM ${NODE_IMAGE} AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN --mount=type=secret,id=appenv,target=/app/.env.local,required=true \
    npm run build

# --- 3. runtime ------------------------------------------------------------
FROM ${NODE_IMAGE} AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

# `output: 'standalone'` traces exactly the files the server imports.
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public

USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
