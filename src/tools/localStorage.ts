export function localSet<T>(name: string, arg: T) {
  const argoman: T = arg as T
  localStorage.setItem(name, JSON.stringify(arg))
}
export function localGet(key: string) {
  const item = localStorage.getItem(key)
  if (item === null) {
    return item
  } else {
    return JSON.parse(item)
  }
}

export function initialize<T>(key: string, atFirst: T): T {
  const init = localStorage.getItem(key)
  if (init === null) {
    localStorage.setItem(key, JSON.stringify(atFirst))
    return atFirst
  }
  return JSON.parse(init) as T
}
