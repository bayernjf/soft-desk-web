# Branch Protection Rules

## Required: Configure in GitHub Settings

### main branch protection
GitHub Repo → Settings → Branches → Add rule for `main`:

- [x] Require a pull request before merging
  - Required approvals: 1 (or more)
- [x] Require status checks to pass before merging
  - Required: `Lint & Type Check`, `Build`
- [x] Require branches to be up to date before merging
- [x] Do not allow bypassing the above settings
- [x] Restrict who can push to matching branches (none, only via PR)

### dev branch protection (optional but recommended)
GitHub Repo → Settings → Branches → Add rule for `dev`:

- [x] Require a pull request before merging
  - Required approvals: 1
- [x] Require status checks to pass before merging
  - Required: `Lint & Type Check`, `Build`

## Environment Protection (GitHub Environments)
GitHub Repo → Settings → Environments:

### production environment
- Required reviewers: Add yourself (or team)
- Deployment branches: `Selected branches` → `main`

### staging environment
- Deployment branches: `Selected branches` → `dev`
