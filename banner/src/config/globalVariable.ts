export let globalMatrix: DOMMatrix;
  
  export function setGlobalMatrix(matrix: DOMMatrix) {
    globalMatrix = matrix;
  }
  
  export function getGlobalMatrix() {
    return globalMatrix;
  }
