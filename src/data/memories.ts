const memoryPhotoModules = import.meta.glob<string>('../../assets/memories/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
  query: '?url',
})

export type MemoryDefinition = {
  id: string
  filename: string
  order: number
  photoUrl: string
}

function filenameToId(filename: string): string {
  return filename.replace(/\.(jpg|jpeg|png|webp)$/i, '')
}

function buildMemoryDefinitions(): MemoryDefinition[] {
  return Object.entries(memoryPhotoModules)
    .map(([path, photoUrl]) => {
      const filename = path.split('/').at(-1) ?? path

      return {
        id: filenameToId(filename),
        filename,
        photoUrl,
        order: 0,
      }
    })
    .sort((left, right) =>
      left.filename.localeCompare(right.filename, undefined, {
        numeric: true,
        sensitivity: 'base',
      }),
    )
    .map((definition, index) => ({
      ...definition,
      order: index + 1,
    }))
}

export const MEMORY_DEFINITIONS = buildMemoryDefinitions()

export const MEMORY_COUNT = MEMORY_DEFINITIONS.length

export type MemoryId = string
