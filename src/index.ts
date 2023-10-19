#! /usr/bin/env bun

const copyTemplate = async (projectName: string, useTW: boolean) => {
  const process = Bun.spawnSync([
    "git",
    "clone",
    "-b",
    useTW ? "with-tailwindcss" : "main",
    `https://github.com/DanielCaz/beh-template`,
    projectName,
  ]);

  if (!process.success) {
    console.log("Error: ", process.stderr.toLocaleString());
    return;
  }

  const packageJson = Bun.file(`${projectName}/package.json`);
  if (!packageJson.exists()) {
    console.log("Error: package.json not found");
    return;
  }

  const packageJsonContent = await packageJson.text();

  await Bun.write(
    `${projectName}/package.json`,
    packageJsonContent.replace("beh-template", projectName)
  );

  Bun.spawnSync(["rm", "-rf", ".git"], { cwd: projectName });
  Bun.spawnSync(["git", "init"], { cwd: projectName });
  Bun.spawnSync(["bun", "i"], { cwd: projectName });

  console.log("Done");
};

console.log("Welcome to create BEH");
console.write("Project name (beh-app): ");

let projectName = "beh-app";
for await (const line of console) {
  if (line) projectName = line;
  break;
}

console.write("Use TailwindCSS (y/N): ");

let useTW = false;
for await (const line of console) {
  useTW = line === "Y" || line === "y";
  break;
}

copyTemplate(projectName, useTW);
