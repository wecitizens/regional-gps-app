import syncActionCreator from './syncActionCreator'

export default async function promiseActionCreator ({commit}, promiseToExecute, moduleName, fieldName) {
  moduleName = moduleName.toUpperCase()
  const requestAction = syncActionCreator(`${moduleName}_REQUEST`, 'payload')
  const successAction = syncActionCreator(`${moduleName}_SUCCESS`, 'payload')
  const failedAction = syncActionCreator(`${moduleName}_FAILED`, 'payload')

  fieldName ? commit(requestAction({field: fieldName})) : commit(requestAction())

  try {
    const response = await promiseToExecute
    if (response.data.success) {
      commit(successAction(response.data))
    } else {
      commit(failedAction({error: response.message}))
    }
  } catch (error) {
    commit(failedAction({error: error.message}))
  }
}
