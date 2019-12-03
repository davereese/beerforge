export const parseStringValues = (string: string | undefined) => {
  if (typeof string !== 'string') { return ''};
  let newString = string.charAt(0).toUpperCase() + string.slice(1)
  return newString.replace(/([a-z])([A-Z])/g, '$1 $2')
}

export const transformNotes = (brew: any) => {
  if (brew.notes) {
    return {__html: brew.notes.replace(/\n/g, '<br>')};
  }
}