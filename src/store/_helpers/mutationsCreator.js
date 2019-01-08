export default function mutationsCreator(moduleName, key = 'list') {
  moduleName = moduleName.toUpperCase()
  const requestAction = `${moduleName}_REQUEST`
  const successAction = `${moduleName}_SUCCESS`
  const failedAction = `${moduleName}_FAILED`
  const notFoundAction = `${moduleName}_NOT_FOUND`

  return {
    [requestAction] (state) {
      state[key].success = false
      state[key].loading = true
      state[key].message = ''
      state[key].error = null
    },
    [successAction] (state, mutation) {
      state[key].success = true
      state[key].loading = false
      state[key].message = mutation.payload.message
      state[key].data = mutation.payload.data
    },
    [failedAction] (state, mutation) {
      state[key].success = false
      state[key].loading = false
      state[key].error = mutation.payload.error
      state[key].message = mutation.payload.message
      console.error(`Error in ${moduleName}: ${mutation.payload.error}`)
    },
    [notFoundAction] (state, mutation) {
      console.log(mutation)
      state[key].success = false
      state[key].loading = false
      state[key].error = mutation.payload.error
      console.error(`Error in ${moduleName}: ${mutation.payload.error}`)
    }
  }
}
