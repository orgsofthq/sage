export default async function (srcPath: string, action: () => void) {
  const watcher = Deno.watchFs(srcPath);

  await action();

  for await (const _event of watcher) {
    await action();
  }
}
