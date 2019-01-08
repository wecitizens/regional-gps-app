
/*
  If there is a translation error, the backend sends a message that contains the name of the untranslated field that is in the last position.
  We get this field to display this error in the right node of the store.

  example: {msg: 'no translation for description'}, in this case this function allows us to retrieve the name of the field which is "description" .

  then we display the error message in the field retrieved by this function, in this case the node description
*/

export default function (msg) {
  return msg.split(' ').pop()
}
