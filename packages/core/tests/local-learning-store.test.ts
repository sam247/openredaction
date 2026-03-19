import { describe, it, expect, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { LocalLearningStore } from '../src/learning/LocalLearningStore';

describe('LocalLearningStore', () => {
  const tmpFiles: string[] = [];

  afterEach(() => {
    for (const f of tmpFiles) {
      try {
        if (fs.existsSync(f)) fs.unlinkSync(f);
      } catch {
        /* ignore */
      }
    }
    tmpFiles.length = 0;
  });

  it('recordFalsePositive records whitelist metadata in memory', () => {
    const tmp = path.join(os.tmpdir(), `or-learn-${Date.now()}.json`);
    tmpFiles.push(tmp);
    const store = new LocalLearningStore(tmp, { autoSave: false });
    store.recordFalsePositive('noise-token', 'EMAIL', 'surrounding context');
    const entries = store.getWhitelistEntries();
    expect(entries.some(e => e.pattern === 'noise-token')).toBe(true);
    expect(entries.find(e => e.pattern === 'noise-token')?.contexts).toContain('surrounding context');
  });

  it('flush persists data to disk', () => {
    const tmp = path.join(os.tmpdir(), `or-learn-flush-${Date.now()}.json`);
    tmpFiles.push(tmp);
    const store = new LocalLearningStore(tmp, { autoSave: false });
    store.addToWhitelist('persist-me', 0.95);
    store.flush();
    expect(fs.existsSync(tmp)).toBe(true);
    const raw = JSON.parse(fs.readFileSync(tmp, 'utf-8'));
    expect(raw.whitelist.some((e: { pattern: string }) => e.pattern === 'persist-me')).toBe(true);
  });

  it('import merges exported learning data', () => {
    const tmpA = path.join(os.tmpdir(), `or-learn-a-${Date.now()}.json`);
    const tmpB = path.join(os.tmpdir(), `or-learn-b-${Date.now()}.json`);
    tmpFiles.push(tmpA, tmpB);
    const a = new LocalLearningStore(tmpA, { autoSave: false });
    a.addToWhitelist('shared-pattern', 0.95);
    const exported = a.export({ minConfidence: 0.5 });
    const b = new LocalLearningStore(tmpB, { autoSave: false });
    b.import(exported, true);
    expect(b.getWhitelist()).toContain('shared-pattern');
  });
});
