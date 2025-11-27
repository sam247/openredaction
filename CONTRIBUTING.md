# Contributing to OpenRedaction

Thank you for helping improve OpenRedaction! This project is open to contributions of all kinds: bug reports, docs, tests, features, and performance improvements.

## Development workflow

1. **Fork** the repository and create your own clone.
2. **Create a branch** for your change: `git checkout -b feature/my-improvement`.
3. **Install dependencies** from the repo root:
   ```bash
   npm install
   ```
4. **Make your changes** in small, focused commits.
5. **Run tests and checks** locally (see below).
6. **Open a Pull Request** against `main` with a clear description of the change and any context reviewers should know.

## Testing and quality checks

From the repository root:

```bash
npm test    # Run the test suite (uses Turbo + Vitest in workspaces)
npm run lint
```

If you are working only inside `packages/core`, you can also run the workspace commands directly:

```bash
cd packages/core
npm run test
npm run lint
```

## Coding standards

- The project is written in **TypeScript**; keep types up to date and prefer explicit types for public APIs.
- Follow the existing code style and naming conventions; run `npm run lint` before opening a PR.
- Write focused, readable commits with meaningful messages.
- Add tests or documentation when you add behavior or change public APIs.

## Reporting issues and requesting features

- Use GitHub Issues to report bugs or request features. Please include reproduction steps, expected vs. actual behavior, and your environment details.
- Issues labeled **good first issue** are suitable for new contributors.
- Documentation fixes and clarifications are always welcome.

## Pull Requests

- Keep PRs scoped and easy to review; prefer several small PRs over a single large one.
- Describe the motivation, approach, and testing you performed in the PR description.
- Ensure the CI checks are green before requesting review.

Thank you for contributing to OpenRedaction!
