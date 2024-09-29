# https://github.com/shkim04/find-your-wc/blob/main/Dockerfile
# Some interesting stuffs

FROM node:lts-alpine AS base
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
ENV NODE_ENV=development
RUN pnpm deploy --filter=back --prod /prod/back
WORKDIR /prod/back
RUN pnpm install
RUN pnpm exec prisma generate
EXPOSE 5432
EXPOSE 5000
CMD [ "pnpm", "dev" ]

FROM base AS prod
COPY --from=build /prod/back /prod/back
WORKDIR /prod/back
EXPOSE 5000
CMD [ "pnpm", "start" ]
