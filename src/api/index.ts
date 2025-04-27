// src/api/index.ts
const modules = import.meta.glob('./*.ts', { eager: true });

const api: Record<string, any> = {};

for (const path in modules) {
  const moduleName = path.match(/\.\/(.*)\.ts$/)?.[1];
  if (moduleName && moduleName !== 'index') {
    const mod = modules[path] as any;
    api[moduleName] = mod.default || mod;
  }
}

export default api;
