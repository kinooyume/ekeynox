FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack install --global pnpm@9.11.0
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

FROM base AS build
COPY . /usr/app
WORKDIR /usr/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -filter=back build
RUN pnpm deploy --filter=back --prod /prod/back

FROM base AS dev
COPY . /usr/app
WORKDIR /usr/app
COPY --from=build /prod/back /prod/back
ENV NODE_ENV=development
WORKDIR /prod/back
RUN pnpm install -g nodemon tsx
EXPOSE 5000
CMD [ "pnpm", "dev" ]

FROM base AS prod
COPY --from=build /prod/back /prod/back
WORKDIR /prod/back
EXPOSE 5000
CMD [ "pnpm", "start" ]
