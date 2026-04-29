# Contribution Guidelines

## Branching

We use the following branches:

- `main`: stable production-ready branch.
- `develop`: main development branch.
- Feature/task branches should be created from `develop`.

Branch naming examples:

- `feature/incident-form`
- `feature/dashboard`
- `fix/login-error`
- `docs/update-readme`
- `setup/initial-repo-structure`

## Commits

Use clear and descriptive commit messages.

Recommended format:

```bash
type: short description
```

Examples:

```bash
feat: add incident report form
fix: correct dashboard status filter
docs: update project documentation
setup: create initial repository structure
```

Common types:

- `feat`: new feature
- `fix`: bug fix
- `docs`: documentation changes
- `style`: visual or formatting changes
- `refactor`: code improvement without changing behavior
- `setup`: setup, configuration or maintenance tasks

## Pull Requests

Before opening a Pull Request:

1. Make sure your branch is updated with `develop`.
2. Check that the project runs correctly.
3. Write a clear PR title and description.
4. Request review from the team.

Pull Requests should target `develop`.

## General Rules

- Do not push directly to `main`.
- Avoid large unrelated changes in the same Pull Request.
- Keep code readable and organized.
- Communicate major changes with the team.