# Patches

CI workflow changes are delivered as patches because the branch that
introduced them could not push files under `.github/workflows/`.

Apply them from the repository root:

```sh
git am .patches/*.patch
```

`0001-ci-build-workflow.patch` adds `.github/workflows/build.yml`: Node
24.x and 22.x on `ubuntu-latest`, with Redis 8.10 as a GitHub Actions
service container on host port 16382 (health check `redis-cli ping`),
the same port that `docker-compose.yml` and the tests use.
