import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { init } from 'license-checker-rseidelsohn'

const root = fileURLToPath(new URL('..', import.meta.url))

init(
  {
    start: root,
    production: true,
    json: true,
  },
  (err, packages) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    const rows = Object.entries(packages)
      .filter(([name]) => name !== 'mahamok@0.1.0')
      .sort(([a], [b]) => a.localeCompare(b))

    const header = `# Third-Party Notices

This project bundles the following open-source dependencies.
Their license texts are included below, as required by their respective licenses.

Generated with \`npm run licenses\`.

`

    const body = rows
      .map(([name, info]) => {
        const licenses = Array.isArray(info.licenses) ? info.licenses.join(', ') : info.licenses
        const text = info.licenseFile ? readFileSync(info.licenseFile, 'utf8').trim() : `(license text not found for ${licenses})`
        return `## ${name}

- **License:** ${licenses}
${info.repository ? `- **Repository:** ${info.repository}\n` : ''}
\`\`\`text
${text}
\`\`\`
`
      })
      .join('\n')

    writeFileSync(`${root}THIRD-PARTY-NOTICES.md`, header + body)
    console.log(`Wrote THIRD-PARTY-NOTICES.md (${rows.length} packages)`)
  },
)
