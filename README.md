# World Notify Action

WorldにコメントするGitHub Actions

## Usage:

```yaml
name: Release Notify

on:
  push:
    branches:
      - master

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - uses: SonicGarden/world-notify-action@v1
        with:
          worldToken: ${{ secrets.WORLD_TOKEN }}
          participationId: xxx
          content: |
            @here xxx リリース
```
