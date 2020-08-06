/**
 * DKDK gathering functions here temporarily
 * Need to add export to be used in the other component
 */

//DKDK making a reusable function to remove a class
export function removeClassName(targetClass) {
    //DKDK much convenient to use jquery here but try not to use it
    let targetElement = document.getElementsByClassName(targetClass)[0]
    if(targetElement !== undefined) {
        targetElement.classList.remove(targetClass)
    }
}

