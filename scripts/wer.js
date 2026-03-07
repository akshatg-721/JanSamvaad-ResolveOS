const fs = require('fs');
const path = require('path');

function tokenize(text) {
  return text
    .toLowerCase()
    .trim()
    .split(/\s+/g)
    .filter(Boolean);
}

function computeWer(referenceWords, hypothesisWords) {
  const n = referenceWords.length;
  const m = hypothesisWords.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  const ops = Array.from({ length: n + 1 }, () => Array(m + 1).fill(null));

  for (let i = 0; i <= n; i += 1) {
    dp[i][0] = i;
    if (i > 0) {
      ops[i][0] = 'D';
    }
  }

  for (let j = 0; j <= m; j += 1) {
    dp[0][j] = j;
    if (j > 0) {
      ops[0][j] = 'I';
    }
  }

  for (let i = 1; i <= n; i += 1) {
    for (let j = 1; j <= m; j += 1) {
      if (referenceWords[i - 1] === hypothesisWords[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
        ops[i][j] = 'E';
      } else {
        const substitution = dp[i - 1][j - 1] + 1;
        const deletion = dp[i - 1][j] + 1;
        const insertion = dp[i][j - 1] + 1;
        const best = Math.min(substitution, deletion, insertion);
        dp[i][j] = best;

        if (best === substitution) {
          ops[i][j] = 'S';
        } else if (best === deletion) {
          ops[i][j] = 'D';
        } else {
          ops[i][j] = 'I';
        }
      }
    }
  }

  let i = n;
  let j = m;
  let substitutions = 0;
  let deletions = 0;
  let insertions = 0;

  while (i > 0 || j > 0) {
    const op = ops[i][j];
    if (op === 'E') {
      i -= 1;
      j -= 1;
    } else if (op === 'S') {
      substitutions += 1;
      i -= 1;
      j -= 1;
    } else if (op === 'D') {
      deletions += 1;
      i -= 1;
    } else {
      insertions += 1;
      j -= 1;
    }
  }

  return {
    substitutions,
    deletions,
    insertions,
    referenceCount: n,
    wer: n === 0 ? 0 : (substitutions + deletions + insertions) / n
  };
}

function main() {
  const [referencePath, hypothesisPath] = process.argv.slice(2);

  if (!referencePath || !hypothesisPath) {
    console.error('Usage: node scripts/wer.js reference_file.txt hypothesis_file.txt');
    process.exit(1);
  }

  const reference = fs.readFileSync(referencePath, 'utf8');
  const hypothesis = fs.readFileSync(hypothesisPath, 'utf8');
  const result = computeWer(tokenize(reference), tokenize(hypothesis));
  const percentage = (result.wer * 100).toFixed(2);

  const report = `# WER Report

- Reference file: ${referencePath}
- Hypothesis file: ${hypothesisPath}
- Substitutions (S): ${result.substitutions}
- Deletions (D): ${result.deletions}
- Insertions (I): ${result.insertions}
- Reference words (N): ${result.referenceCount}
- WER: ${percentage}%
`;

  const outputPath = path.resolve(process.cwd(), 'docs/wer_report.md');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, report, 'utf8');

  console.log(`WER: ${percentage}%`);
  console.log(`Report saved to ${outputPath}`);
}

main();
