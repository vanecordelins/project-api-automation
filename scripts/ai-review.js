import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const featuresDir = path.join(__dirname, "..", "features");

/** Match Gherkin step lines: optional space, keyword (Given|When|Then|And), then step text */
const STEP_REGEX = /^\s*(Given|When|Then|And)\s+(.+)$/gm;

/**
 * Extracts all step texts from a feature file (keyword + text, normalized).
 * Returns an array of objects { keyword, text, normalized } where normalized
 * is the step text trimmed for comparison (so "Given X" and "And X" count as same step).
 */
function extractSteps(content) {
  const steps = [];
  let m;
  STEP_REGEX.lastIndex = 0;
  while ((m = STEP_REGEX.exec(content)) !== null) {
    const keyword = m[1];
    const text = m[2].trim();
    steps.push({ keyword, text, normalized: text });
  }
  return steps;
}

/**
 * Returns relative path from project root (features dir parent) for shorter logs.
 */
function relativePath(fullPath) {
  const root = path.join(featuresDir, "..");
  return path.relative(root, fullPath);
}

function analyzeFeature(filePath, stepToFiles) {
  const content = fs.readFileSync(filePath, "utf8");
  const relPath = relativePath(filePath);

  const scenarioCount = (content.match(/Scenario:/g) || []).length;
  const steps = extractSteps(content);
  const stepCount = steps.length;

  steps.forEach(({ keyword, normalized }) => {
    const key = normalized;
    if (!stepToFiles.has(key)) {
      stepToFiles.set(key, { keyword, files: new Set() });
    }
    stepToFiles.get(key).files.add(relPath);
  });

  console.log(`\n📄 Reviewing: ${relPath}`);
  console.log(`- Scenarios found: ${scenarioCount}`);
  console.log(`- Total steps: ${stepCount}`);

  if (stepCount > 20) {
    console.log("⚠️ Warning: Scenario might be too long. Consider splitting.");
  }

  if (scenarioCount === 0) {
    console.log("⚠️ Warning: No scenarios found.");
  }
}

function reportDuplicatedSteps(stepToFiles) {
  const duplicated = [...stepToFiles.entries()]
    .filter(([, data]) => data.files.size > 1)
    .sort((a, b) => b[1].files.size - a[1].files.size);

  if (duplicated.length === 0) {
    console.log("\n📋 No duplicated steps across feature files.");
    return;
  }

  console.log("\n📋 Duplicated steps across feature files:");
  console.log("   (Same step text appears in more than one .feature file)\n");

  duplicated.forEach(([stepText, { keyword, files }]) => {
    const fileList = [...files].sort();
    console.log(`  "${keyword} ${stepText}"`);
    console.log(`    → ${fileList.length} file(s): ${fileList.join(", ")}`);
    console.log("");
  });
}

function walk(dir, stepToFiles) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath, stepToFiles);
    } else if (file.endsWith(".feature")) {
      analyzeFeature(fullPath, stepToFiles);
    }
  });
}

const stepToFiles = new Map();

console.log("🤖 AI Assisted Review Simulation Started...");
walk(featuresDir, stepToFiles);
reportDuplicatedSteps(stepToFiles);
console.log("✅ Review finished.");