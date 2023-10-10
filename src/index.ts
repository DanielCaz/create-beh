const copyTemplate = async (projectName: string) => {
  const process = Bun.spawnSync([
    "git",
    "clone",
    "https://github.com/DanielCaz/beh-template",
    projectName,
  ]);

  if (!process.success) {
    console.log("Error: ", process.stdout);
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

  console.log("Done");
};

console.log("Welcome to create BEH");
console.write("Project name: ");

let projectName = "beh-app";
for await (const line of console) {
  projectName = line;
  break;
}

copyTemplate(projectName);
