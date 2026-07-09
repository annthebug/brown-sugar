export type MemoryDefinition = {
  id: string
  filename: string
  order: number
}

export const MEMORY_DEFINITIONS = [
  { id: 'M_IMG_0373', filename: 'M_IMG_0373.jpeg', order: 1 },
  { id: 'M_IMG_0418', filename: 'M_IMG_0418.jpeg', order: 2 },
  { id: 'M_IMG_0510', filename: 'M_IMG_0510.jpeg', order: 3 },
  { id: 'M_IMG_0978', filename: 'M_IMG_0978.jpeg', order: 4 },
  { id: 'M_IMG_1248', filename: 'M_IMG_1248.jpeg', order: 5 },
  { id: 'M_IMG_1282', filename: 'M_IMG_1282.jpeg', order: 6 },
  { id: 'M_IMG_1469', filename: 'M_IMG_1469.jpeg', order: 7 },
  { id: 'M_IMG_1526', filename: 'M_IMG_1526.jpeg', order: 8 },
  { id: 'M_IMG_1988', filename: 'M_IMG_1988.jpeg', order: 9 },
  { id: 'M_IMG_1996', filename: 'M_IMG_1996.jpeg', order: 10 },
  { id: 'M_IMG_2620', filename: 'M_IMG_2620.jpeg', order: 11 },
  { id: 'M_IMG_2621', filename: 'M_IMG_2621.jpeg', order: 12 },
  { id: 'M_IMG_2914', filename: 'M_IMG_2914.jpeg', order: 13 },
  { id: 'M_IMG_2944', filename: 'M_IMG_2944.jpeg', order: 14 },
  { id: 'M_IMG_6194', filename: 'M_IMG_6194.jpeg', order: 15 },
  { id: 'M_IMG_6848', filename: 'M_IMG_6848.jpeg', order: 16 },
  { id: 'M_IMG_7295', filename: 'M_IMG_7295.jpeg', order: 17 },
  { id: 'M_IMG_7604', filename: 'M_IMG_7604.jpeg', order: 18 },
  { id: 'M_IMG_7767', filename: 'M_IMG_7767.jpeg', order: 19 },
  { id: 'M_IMG_8239', filename: 'M_IMG_8239.jpeg', order: 20 },
  { id: 'M_IMG_8244', filename: 'M_IMG_8244.jpeg', order: 21 },
  { id: 'M_IMG_8462', filename: 'M_IMG_8462.jpeg', order: 22 },
  { id: 'M_IMG_8536', filename: 'M_IMG_8536.jpeg', order: 23 },
  { id: 'M_IMG_8716', filename: 'M_IMG_8716.jpeg', order: 24 },
  { id: 'M_IMG_8908', filename: 'M_IMG_8908.jpeg', order: 25 },
] as const satisfies readonly MemoryDefinition[]

export const MEMORY_COUNT = MEMORY_DEFINITIONS.length

export type MemoryId = (typeof MEMORY_DEFINITIONS)[number]['id']
