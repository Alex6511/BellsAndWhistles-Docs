import { readFile } from 'node:fs/promises';
const audit = JSON.parse(await readFile('public/maintenance.json', 'utf8'));
const reviewed = Date.parse(audit.reviewedOn + 'T00:00:00Z');
const age = (Date.now() - reviewed) / 86400000;
if (audit.schemaVersion !== 1 || !Number.isFinite(age) || age < -1 ||
    !Number.isInteger(audit.maxAgeDays) || audit.maxAgeDays < 1 || audit.maxAgeDays > 30 ||
    !audit.reviewType || !audit.scope?.length || !audit.runtimeStatus) {
  throw new Error('Missing or invalid documentation audit record.');
}
if (age > audit.maxAgeDays + 1) throw new Error('Documentation review is overdue (' + Math.floor(age) + ' days). Review the docs and record evidence in public/maintenance.json.');
console.log('Documentation review is ' + Math.max(0, Math.floor(age)) + ' days old; next review is due within ' + audit.maxAgeDays + ' days.');
