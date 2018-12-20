export function getInterval(str: string, interval = 16): number {
  if (/\D[\,]\s$/.test(str)) return interval * 20
  if (/[^\/]\n\n$/.test(str)) return interval * 40
  if (/[\.\?\!]\s$/.test(str)) return interval * 60
  return 0
}
