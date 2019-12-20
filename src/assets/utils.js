// These functions have been extracted out of Dashboard.js since
// they are the logical functions being tested.

export function jsonCopy(object) {
  return JSON.parse(JSON.stringify(object))
}

// All three functions take in a state and return a list object of videos
export function remove(index, state) {
  const videos = jsonCopy(state.videos)
  videos.splice(index, 1) // remove subject at index
  return videos
}

export function add(state) {
  const task = state.value
  const videos = jsonCopy(state.videos)
  videos.push([task, false])
  return videos
}

export function check(index, state) {
  const videos = jsonCopy(state.videos)
  videos[index][1] = !videos[index][1]
  return videos
}
