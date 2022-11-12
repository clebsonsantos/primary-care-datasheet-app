
export const generateFilter = (data: any[], fieldName: string, value: string): object => {
  const result = data.find(item => item[fieldName] === value)
  return result
}
