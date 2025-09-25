// FIXME this is not a real UUID, it is a fake UUID
export const generateUUID = () => {
  return String(Math.random().toString(36).substring(2, 15)) + String(Math.random().toString(36).substring(2, 15))
}
